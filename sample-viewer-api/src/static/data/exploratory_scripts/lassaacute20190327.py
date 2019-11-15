import pandas as pd
import re

filename = "/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/input_data/patient_rosters/acuteLassa_metadata_v1_2019-03-27_PRIVATE.csv"
id_filename = "/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/input_data/patient_rosters/acuteLassa_IDdict_v1_2019-03-27_PRIVATE.xlsx"

export_file = "/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/uploads/lassapatients.json"

df = pd.read_csv(filename)
# 2204 total
df.shape
df.head()


# Glance at distributions to check where there are weird values
#  -- ids --
#  Are they unique?
#  ... (sigh). Some are straight duplicates; others are duplicates w/ contradictory info w.r.t. dates and outcomes.
#  Till these are resolved, removing them.
# 25 entries removed.
# Also drop weird rows
df.drop([784], inplace=True)

dupe_idx = df[df.duplicated(subset=["gid"], keep=False)].index
df.drop(dupe_idx, inplace=True)

# -- sex --
# sex: "Unspecified" --> unknown
df.Sex_CN.value_counts(dropna=False)

# -- outcome --
# outcome --> lower;
# not admitted --> ?
# discharged --> survivor
# transferred --> unknown?
# other --> unknown
# ? --> unknown
df.outcome_lba2.value_counts(dropna=False)


# -- admit status --
# fix cases
# admittted --> admitted
# collapse med ward/maternity to hospitalized?
# collapse admitted --> hospitalized?
df.AdmitStatus.apply(lambda x: str(x).lower()).value_counts(dropna=False)

df['admitStatus'] = df.AdmitStatus.apply(lambda x: str(x).lower())

# -- admit --
# convert to boolean
df.admit.value_counts(dropna=False)

# `AdmitStatus` and `admit` don't agree
df.groupby("admit").admitStatus.value_counts()


# Dates
# Onset ==> some are days since onset (?)
# calc days onset
# check date of discharge == discharged.

# -- ELISAs --
# --> lower
# check combo fields all align; all seem to be categories from concats

df.agvresultcc1.value_counts(dropna = False)
df.igmvresultcc1.value_counts(dropna = False)

df.iggvresultcc1.value_counts(dropna = False)

# Just for internal purposes; make sure their combined values agree w/ the concat of the ELISAs.
def combine2Elisas(row):
    return(str(row.agvresultcc1) + str(row.igmvresultcc1))

def combine3Elisas(row):
    return(str(row.agvresultcc1) + str(row.igmvresultcc1) + str(row.iggvresultcc1))

df['elisa2'] = df.apply(combine2Elisas, axis = 1)
df['elisa3'] = df.apply(combine3Elisas, axis = 1)

df.groupby("elisa2").groupcc1.value_counts(dropna=False, normalize=True)
df.groupby("elisa3").group2cc1.value_counts(dropna=False)
# What is groupcc2??
df.groupby("elisa2").groupcc2.value_counts(dropna=False)

# Aha. groupcc2 is Ag+ and and IgM value. so it should be a binary for Ag+ for Ag+/IgM+-, then Ag- broken into IgM result.
df[df.groupcc2 == "1Ag+/IgM+-"].elisa2.value_counts()
df[df.groupcc2 == "1Ag+/IgM+-"].agvresultcc1.value_counts()

df.groupby("agvresultcc1").groupcc2.value_counts()

# Cleanup  ----------------------------------------------------------------------------------------------------
def getAltID(id):
    return([id])

df["alternateIdentifier"] = df.gid.apply(getAltID)
df.columns
# temp; need to verify, maybe add in months, etc.
def getAge(age):
    if(age == age):
        return(int(age))

df['age'] = df.Agey.apply(getAge)
int("34")
# -- gender ---
def getSex(sex):
    if ((sex != sex) | (sex == "Unspecified")):
        return("Unknown")
    return(sex.title())

df['gender'] = df.Sex_CN.apply(getSex)

df.gender.value_counts(dropna=False)
"cohort", "outcome", "elisa"

# --- add in country; all patients from Sierra Leone ---
def getCountry(countryID):
    return({
    "@type": "Country",
    "name": "Sierra Leone",
    "identifier": "SL",
    "url": "https://www.iso.org/obp/ui/#iso:code:3166:SL"
    })

df['country'] = df.gid.apply(getCountry)

# -- more static info --
df['dateModified'] = "2019-03-28"
df['contactGroupIdentifier'] = ""

# --- cohort ---
# All Lassa
df['cohort'] = "Lassa"

# -- outcome --
# collapse to [survivor, dead, contact, control, unknown]
def cleanOutcome(input):
    # Value is NA; collapse to unknown
    if(input != input):
        return('unknown')
    outcome = input.lower()
    if(outcome == 'discharged'):
        return('survivor')
    if(outcome == 'died'):
        return('dead')
    if((outcome == '?') | (outcome == "other") | (outcome == "transferred") | (outcome == "not admitted")):
        return('unknown')
    return(outcome)

df['outcome'] = df.outcome_lba2.apply(cleanOutcome)

df.groupby("outcome").outcome_lba2.value_counts(dropna=False)

x =[]
x.append({'fsd':1})
x
# -- elisas --
def nestELISAs(row):
    elisas = []
    if((row['agvresultcc1'] == row['agvresultcc1'])):
        elisas.append(
            {
                "virus": "Lassa",
                "assayType": "Ag",
                "ELISAresult": row['agvresultcc1'].lower()
            })
    if((row['iggvresultcc1'] == row['iggvresultcc1'])):
        elisas.append(
            {
                "virus": "Lassa",
                "assayType": "IgG",
                "ELISAresult": row['iggvresultcc1'].lower()
            })
    if((row['igmvresultcc1'] == row['igmvresultcc1'])):
        elisas.append(
            {
                "virus": "Lassa",
                "assayType": "IgM",
                "ELISAresult": row['igmvresultcc1'].lower()
            })
    return(elisas)

df['elisa'] = df.apply(nestELISAs, axis = 1)

# --- dates  ---
from datetime import datetime, timedelta
def convertExcelDateNum(row):
    """
    Converts from an Excel formatted date like 12-Jun-19
    to a pythonic date object.
    Try/catch catches any NaNs or strings in a different (presumably non-date) format

    Also catches any numbers <= 60 -- presumably these are daysOnset (days b/w onset of symptons and admission to hospitalization)
    For those cases, the difference b/w the evalDate and IllnessOnset are calculated.
    """
    if(row.IllnessOnset == row.IllnessOnset):
        try:
            ordinal = int(row.IllnessOnset)
            # All of our dates should be >>> 1900.
            # However... some seem to be daysOnset, rather than a date. Filter those suckers out.
            if ordinal > 60:
                if ordinal > 59:
                    ordinal -= 1  # Excel leap year bug, 1900 is not a leap year!
                return (datetime(1899, 12, 31) + timedelta(days=ordinal))
            else:
                # likely to be daysOnset, not IllnessOnset
                # Calculate IllnessOnset as days difference from the evalDate
                return(row.converted_evalDate - timedelta(days = ordinal))
        except:
            return(pd.np.datetime64('NaT'))

def convertExcelDate(x):
    """
    Converts from an Excel formatted date like 12-Jun-19
    to a pythonic date object.
    Try/catch catches any NaNs or strings in a different (presumably non-date) format
    """
    try:
        return(datetime.strptime(x, "%d-%b-%y"))
    except:
        return(pd.np.datetime64('NaT'))

def getYearfromDate(pythondate):
    """
    Assuming the input is a python date... return just the year.

    If not a python date, empty return.
    """
    try:
        return(pythondate.year)
    except:
        return()

def calcOnset(row):
    """
    calculate daysOnset-- the difference b/w presentation of symptoms and presentation in the hospital.
    Should be run after evaldate and infectionDate convert their respective variables to python dates
    """
    if((row.converted_evalDate == row.converted_evalDate) & (row.infectionDate == row.infectionDate)):
        return((row.converted_evalDate - row.infectionDate).days)
    elif((row.IllnessOnset == row.IllnessOnset)):
        # Some of the IllnessOnset seem to be b/w 0-60-- presumably these are already daysOnset (?)
        # For these observations, infectionDate is None
        try:
            ordinal = int(row.IllnessOnset)
            if(ordinal < 61):
                return(ordinal)
        except:
            return(None)

df['converted_evalDate'] = df.evaldate_lba1.apply(convertExcelDate)
df['converted_dischargeDate'] = df.DateofDischarge.apply(convertExcelDate)
df['infectionDate'] = df.apply(convertExcelDateNum, axis = 1)
df['infectionYear'] = df.infectionDate.apply(getYearfromDate)
df['daysOnset'] = df.apply(calcOnset, axis=1)


# Checks to make sure things look more or less normal
df[['converted_dischargeDate', 'DateofDischarge','converted_evalDate', 'evaldate_lba1', 'infectionDate', 'IllnessOnset', 'daysOnset']].sample(10)

df.infectionYear.value_counts(dropna=False)


def checkDates(row):
    msg = ""
    if(row.daysOnset > 60):
        msg = msg + "daysOnset seems too big (> 60 days)"
    if(row.infectionDate > row.converted_evalDate):
        msg = msg + "IllnessOnset is later than EvalDate, "
    if(row.converted_evalDate > row.converted_dischargeDate):
        msg = msg + "EvalDate is later than DischargeDate, "
    if(row.infectionDate > row.converted_dischargeDate):
        msg = msg + "IllnessOnset is later than DischargeDate, "
    return(msg)

df['date_check'] = df.apply(checkDates, axis=1)

df.date_check.value_counts()
issue_array = df.date_check.apply(lambda x: x.split(", "))

issue_array.apply(lambda x: pd.Series([i for i in x])).melt().value.value_counts()
import numpy as np
np.array(issue_array).flatten()
df.daysOnset.value_counts()

# Import public IDs  ----------------------------------------------------------------------------------------------------
ids = pd.read_excel(id_filename)
# 3347 IDs
ids.shape
ids.sample(10)

# --- unique check ---
# Check IDs are unique.
# One ID has two different Study numbers
ids[ids.duplicated(subset=['Original G No.'], keep=False)]

# Study numbers are unique.
ids[ids.duplicated(subset=['Study Specific #'], keep=False)]

# --- rename columns ---
ids['patientID'] = ids["Study Specific #"].apply(lambda x: "G" + x)

# --- fish out the gid ---
# G-ids in the metadata are G-xxx or G-xxxx. For some reason, there are timepoints (?) appended to some of the IDs.
# structure: dd, ddd, dddd, G-dddd-d, G-dddd-d\s
def getTimepoint(x):
    if(len(str(x)) > 4):
        return(str(x)[-1])

ids['g_length'] = ids['Original G No.'].apply(lambda x: len(str(x)))
ids['g_timepoint'] = ids['Original G No.'].apply(getTimepoint)

ids.g_timepoint.value_counts(dropna = False)

def getGID(id):
    timepoint = re.match("^(G\-)(\d\d\d\d)\-(\d)$", str(id).strip())
    if(timepoint):
        return(timepoint[1]+timepoint[2])
    underscore = re.match("^(G\_)(\d\d\d\d)\-(\d)$", str(id).strip())
    if(underscore):
        return(underscore[1]+underscore[2])
    fourdigit = re.match("^(\d\d\d\d)$", str(id).strip())
    if(fourdigit):
        return("G-" + fourdigit[1])
    threedigit = re.match("^(\d\d\d)$", str(id).strip())
    if(threedigit):
        return("G-" + threedigit[1])
    twodigit = re.match("^(\d\d)$", str(id).strip())
    if(twodigit):
        return("G-" + twodigit[1])

ids['gid'] = ids['Original G No.'].apply(getGID)
ids[ids.gid != ids.gid]
ids[ids.duplicated(subset=["gid"], keep=False)]

# For now: drop duplicates.
iddupe_idx = ids[ids.duplicated(subset=["gid"], keep=False)].index
ids.drop(iddupe_idx, inplace=True)
# Remove NA for original ID
ids.dropna(subset=['gid'], inplace=True)

#13 dropped
# 3347 - 3335
ids.shape

# --- pull out the infection year ---
# first two digits of study specific number are year
ids['infectionYear'] = ids['Study Specific #'].apply(lambda x: "20" + x[0:2])

ids.infectionYear.value_counts(dropna=False)

# Merge public IDs with patient metadata; check that years are correct
df_merged = pd.merge(df, ids, how="left", on="gid", indicator=True)
df.shape
df_merged._merge.value_counts()

df_merged[df_merged._merge=='left_only']['gid']


df_merged.head()
# Merge with list of survivors, to see if we're double id-ing anyone.

# Export  ----------------------------------------------------------------------------------------------------
# Can't include infectionYear b/c requires backend to translate to date range.
sel_cols = ["patientID", "alternateIdentifier", "cohort", "outcome", "age", "gender", "elisa", "country", "dateModified", "contactGroupIdentifier"]
subset = df_merged[df_merged.patientID == df_merged.patientID]

subset = subset[(subset["age"] == subset["age"])]

subset.shape
# subset = subset.iloc[0:100]
# subset = subset.iloc[100:]
subset[sel_cols].to_json(export_file, orient="records")
