import pandas as pd
import numpy as np
import re
from . import checkIDstructure, getPrivateContactGroup
from .logging import addError, updateError

def getUnique(arr, field):
    unique_values = []
    for idx, row in arr.iterrows():
        if((row[field] == row[field]) & (row[field] is not None)):
            if(type(row[field]) == list):
                for value in row[field]:
                    if(value not in unique_values):
                        unique_values.append(value)
            else:
                if(row[field] not in unique_values):
                    unique_values.append(row[field])
    if(len(unique_values) > 0):
        return(unique_values)

# --- ids ---
# Make sure the GID follows a known pattern. Useful to detect off by one row copy errors, etc.
def checkIDs(df, verbose, logCols, idVar = "gID", errorCol = "issue", errorMsg = "Unrecognized GID format"):
    df['idFlag'] = df[idVar].apply(checkIDstructure)
    df = addError(df, df.idFlag == True, errorMsg, verbose, logCols, errorCol)

    return(df)

# Make sure public survivor IDs are as expected.
def checkPublicSurvivorIDs(ids, errorCol, verbose, idCol = "publicPatientID", expectedLen = 9, errorMsg = None):
    if errorMsg is None:
        errorMsg = f"Study Specific number isn't {expectedLen} characters long, as expected"
    # Check if the survivor ID is exactly 7 digits long + S- or C-.
    ids = addError(ids, ids[idCol].apply(lambda x: len(str(x))) != expectedLen, errorMsg, verbose, [idCol], errorCol)

    # Check IDs are unique
    return(ids)

def checkBadFormat(pattern, id):
    """
    Returns False if the format looks okay, True if it's not a match
    """
    if (id == id):
        if re.match(pattern, id):
            return(False)
        else:
            return(True)

def checkPublicAcuteIDs(ids, errorCol, verbose, idCol = "Study Specific #", expectedformat = "^\d\d\-\d\d\d\d\d\d$", errorMsg = None):
    """
    Make sure the raw input for study specific number is in the correct format.
    """
    if errorMsg is None:
        errorMsg = f"Study Specific number isn't in the expected format: {expectedformat}"


    ids = addError(ids, ids[idCol].apply(lambda x: checkBadFormat(expectedformat, x)), errorMsg, verbose, [idCol], errorCol)

    return(ids)

# --- duplicate IDs ---
def idDupeRow(df, df_raw, verbose, logCols, errorMsg = "Duplicate row", errorCol = "issue"):
    if(len(df) != len(df_raw)):
        raise ValueError("Some rows have been removed. Identified duplicate rows will not be correct.")

    dupe_idx = df_raw[df_raw.duplicated(keep=False)].index

    df = addError(df, dupe_idx, errorMsg, verbose, logCols, errorCol)
    return(df)

def idDupes(df, verbose, idCol = "sID", errorMsg = "Duplicate patient ID", errorCol = "issue", ignoreNA=True):
    if any(df[idCol].apply(lambda x: isinstance(x, list))):
        return(idDupesInArr(df, verbose, idCol, errorMsg, errorCol))
    elif(ignoreNA):
        dupe_idx = df[(df.duplicated(subset=[idCol], keep=False)) & (pd.notnull(df[idCol]))].index

    else:
        dupe_idx = df[df.duplicated(subset=[idCol], keep=False)].index

    if(errorCol):
        df = addError(df, dupe_idx, errorMsg, verbose, [idCol], errorCol)
    return(df)

# Checks for duplicate G-ids within an array of G-ids
def idDupesInArr(df, verbose, idCol = "gID", errorMsg = "Duplicate G-Number", errorCol = "issue"):
    gids = []
    dupe_ids = []
    for idx, row in df.iterrows():
        if (row[idCol] == row[idCol]):
            if (set(gids) & set(row[idCol])):
                if(isinstance(row[idCol], list)):
                    dupe_ids.extend(row[idCol])
                else:
                    dupe_ids.append(row[idCol])
            else:
                gids.extend(row[idCol])
    # Return if there's an intersection of the values-- to identify all the duplicate locations, not just second iteration
    df = addError(df, df[idCol].apply(lambda x: idDupesArrRowwise(x, dupe_ids)), errorMsg, verbose, [idCol], errorCol)
    return(df)

def idDupesArrRowwise(x, dupe_ids):
    """
    Returns binary if the contents of the list within the cell in the dataframe have any overlap with dupe_ids

    Used in combination with idDupesInArr; main function identifies the IDs that are duplicates
    This function identifies all rows with those ids, not just the subsequent values.
    """
    if(x == x):
        return(any(set(x) & set(dupe_ids)))
    else:
        return(False)

def filterDupes(df, idCols = ["gid"], errorMsg = "Duplicate patient ID"):
    dupe_idx = df[df.duplicated(subset=idCols, keep=False)].index

    dupes = df.loc[dupe_idx]
    dupes['issue'] = errorMsg

    df = df.drop(dupe_idx)
    return(df, dupes)

def checkContactGroupIDs(df, errorCol, verbose, logCols, publicID_col = "contactGroupIdentifier", privateID_col = "sID", errorMsg = "Private and Public IDs have different contactGroupIdentifiers"):
    df['contactGroupID_private'] = df[privateID_col].apply(getPrivateContactGroup)
    check_hhGroups = df.groupby("contactGroupID_private")[[publicID_col]].agg(lambda x: len(set(x)) == 1)
    weird_hhIDs = check_hhGroups[check_hhGroups[publicID_col] == False].index
    df = addError(df, df.contactGroupID_private.isin(weird_hhIDs), errorMsg, verbose, logCols, errorCol)
    return(df)

# --- age weirdness ---
def getAgeFlag(row):
    if(row.Agey == row.Agey):
        try:
            years = int(row.Agey)
            if((years > 100) | years < 0):
                return(True)
        except:
            return(True)
    if(row.Agem == row.Agem):
        try:
            months = int(row.Agem)
            # Okay if person is 0 y, 18 mo. old.
            if((months < 1 | months > 12) & (years != 0)):
                return(True)
        except:
            return(True)
    if(row.Aged == row.Aged):
        try:
            days = int(row.Aged)
            if((days < 1) | days > 31):
                return(True)
        except:
            return(True)

    return(False)


def checkAges(df, verbose, logCols, minAge = 0, maxAge = 100):
    df = addError(df, (df.age < minAge) | (df.age > maxAge), f"age is < {minAge} or > {maxAge}", verbose, logCols)

    try:
        df['ageFlag'] = df.apply(getAgeFlag, axis = 1)
        df = addError(df, df.ageFlag == True, "Agey, Agem, or Aged has a weird value", verbose, logCols)
    # Survivor data lacks any info beyond Agey-- so don't bother to check months/days
    except:
        pass

    # return(df.drop(['ageFlag'], axis = 1, inplace = True))
    return(df)


# --- dates ---
def checkDatesRowwise(row, errorCol="issue", infectionEvalGap = 60, infectionDischargeGap = 74):
    msg = None
    if(row.daysOnset > infectionEvalGap):
        msg = updateError(msg, f"daysOnset seems too big (> {infectionEvalGap} days)")
    if(row.daysOnset2Discharge > infectionDischargeGap):
        msg = updateError(msg, f"Span between illness onset and discharge seems too big (> {infectionDischargeGap} days)")
    if(row.converted_onsetDate > row.converted_evalDate):
        msg = updateError(msg, "IllnessOnset is later than EvalDate")
    if(row.converted_evalDate > row.converted_dischargeDate):
        msg = updateError(msg, "EvalDate is later than DischargeDate")
    if(row.converted_onsetDate > row.converted_dischargeDate):
        msg = updateError(msg, "IllnessOnset is later than DischargeDate")

    # Previous checks should take care of if evalDate/dischargeDate/infectionDate are weird
    # Now: compare to the year pulled out from the Study Specific ID (publicID, first two digits should be year of evaluation)
    # ignore anything missing a study specific id; already have an error for that.
    # Also filtering out anything where the dates are clearly split over a december infection and a january presentation
    if(row.presentationYear == row.presentationYear):
        # If onsetYear is not NA, check if it disagrees with the presentation year
        if((row.onsetYear == row.onsetYear) & (row.presentationYear != row.onsetYear)):
            # if so, make sure the date isn't spread out over the calendar shift
            if((row.presentationYear - row.onsetYear) == 1):
                # they differ by one year; probably a December (infection) to January (evaluation) change.
                # If it's not Decmber, throw an error
                if((row.converted_onsetDate.month != 12)):
                    msg = updateError(msg, "Year from Study Specific Number disagrees with year from IllnessOnset")
            else:
                msg = updateError(msg, "Year from Study Specific Number disagrees with year from IllnessOnset")
            # if((row.converted_onsetDate.month != 12) | ((row.evalYear != row.presentationYear) & (row.evalYear == row.evalYear)) ):

        if((row.evalYear == row.evalYear) & (row.presentationYear != row.evalYear)):
            msg = updateError(msg, "Year from Study Specific Number disagrees with year from evalDate")

        if((row.dischargeYear == row.dischargeYear) & (row.presentationYear != row.dischargeYear)):
            if((row.dischargeYear - row.presentationYear) == 1):
                # they differ by one year; probably a December (eval) to January (discharge) change.
                # If discharge isn't January, throw an error
                if((row.converted_dischargeDate.month != 1)):
                    msg = updateError(msg, "Year from Study Specific Number disagrees with year from DischargeDate")
            else:
                msg = updateError(msg, "Year from Study Specific Number disagrees with year from DischargeDate")


    if(pd.notnull(msg)):
        return(updateError(row[errorCol], msg))
    else:
        return(row[errorCol])

def checkDates(df, errorCol="issue"):
    df[errorCol] = df.apply(lambda x: checkDatesRowwise(x, errorCol), axis = 1)
    return(df)


# --- General, final functions ---
def removeIssues(df, patientLabel, issueCol = 'issue', verbose = True):
    """
    Removes rows with issues in the column
    """
    df2export = df[df[issueCol] != df[issueCol]]
    if(verbose):
        total_num = len(df)
        num_removed = total_num - len(df2export)

        print("\n---------------------------------------------------------------")
        print(f"{len(df2export)} {patientLabel} saved for upload")

        print("{0:.0f}%".format((num_removed / total_num)*100) + f" of patients ({num_removed}) removed for some reason:")
        print("---------------------------------------------------------------")
        print(df[issueCol].value_counts())

        print(f"\nSUMMARY OF {patientLabel.upper()} ISSUES:")
        print(summarizeChecks(df))

        try:
            num_missing = sum(df.hasPatientData == False)
            pct_missing = (num_missing / total_num)*100
            print("\n! {0} patients ({1:.0f}%) have public ids but no other data !".format(num_missing, pct_missing))
        except:
            pass
        try:
            num_surv_missing = sum(df.hasSurvivorData == False)
            pct_surv_missing = (num_surv_missing / total_num)*100
            print("\n! {0} survivors ({1:.0f}%) have public ids but no other data !".format(num_surv_missing, pct_surv_missing))
        except:
            pass
    return(df2export)


def splitIssue(str, delim):
    """
    Converts issue string (separated by delimiter) into issue array
    """
    if((str == str) & (str is not None)):
        return(str.split(f"{delim} "))
    else:
        return([])

def listify(val):
    """
    Checks that val is a list. If not, returns it as a list containing one value
    """
    if (pd.isnull(val)):
        return(np.nan)
    if (isinstance(val, list)):
        return(val)
    return([val])

def summarizeChecks(df, errorCol = "issue", delim=";"):

    issue_array = df[errorCol].apply(lambda x: splitIssue(x, delim))

    return(issue_array.apply(lambda x: pd.Series([i for i in x])).melt().value.value_counts())
