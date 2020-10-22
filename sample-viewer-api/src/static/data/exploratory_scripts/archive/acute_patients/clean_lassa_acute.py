# Generic function to clean up, check, and verify the inputted acute patient data
# Based on the exploratory code: lassaacute20190327.py
# Variables added:
# •	issue: description of something weird that merits checking out (non-unique ID, strange age, etc.)
# •	gID: standardized form of GID, in case there’s any timepoints added to gid (in this case, duplicate of gid)
# •	outcome: Modification of outcome_lba2; converted all to lower case, died  dead, discharged  survivor; not admitted/transferred/NA/?/other  unknown (for now)
# •	gender: Modification of Sex_CN; Changed N/A, Unspecified to Unknown
# •	age: merged Agey, Agem, Aged into a decimal age
# •	country, elisa: restructuring the data for the web
# •	converted_evalDate: YYYY-MM-DD form of evaldate_lba1
# •	converted_dischargeDate: YYYY-MM-DD form of DateofDischarge
# •	converted_onsetDate: Converted IllnessOnset into a date format (looks like Excel exported ordinal numbers rather than date strings, I think because some of the IllnessOnsets were single digits rather than dates). For these single numbers – e.g. “7” – infectionDate is blank, because there’s no evalDate.
# •	evalYear: year from converted_evalDate
# •	dischargeYear: year from converted_dischargeDate
# •	onsetYear: Year from infectionDate
# •	daysOnset: calculated as evaldate_lba1 – infectionDate. If IllnessOnset was < 60, it’s assumed daysOnset = IllnessOnset
# •	daysInHospital: converted_dischargeDate – converted_evalDate
# •	daysOnset2Discharge: converted_dischargeDate – infectionDate
# •	Original G Number: merged G Number from Emily’s roster
# •	Study Specific #: merged Study specific ID from Emily’s roster
# •	publicGID: “G-“ + Study Specific #
# •	dateModified: date I cleaned the data
# •	cohort: Lassa
# •	presentationDate: First two digits from Study Specific # (and converted to YYYY)
# •	infectionYear: year of infectionDate; if no infectionDate, it’ll be either presentationDate, evalDate, or dischargeDate (in that order, depending on availability)
# •	hasPatientData: True/False if there’s patient date available
# •	idFlag: True/False if the gid isn’t in the format G-xxx or G-xxxx
# •	ageFlag: True/False if something about the age looks weird.



import pandas as pd
import re
from datetime import datetime, timedelta
# import os
# os.chdir("/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/clean_patients")
import helpers # Helpers module, for common cleanup functions

from .clean_lassa_acute_ids import prep_id_data

def clean_lassa_acute(filename, id_filename, export_filename, export_id_filename,
export_weirdos, export_id_weirdos):
    print('\n cleaning lassa')

    # --- Load acute patient data, clean it up ---
    df = cleanAcute(filename)


    # --- Add Public PatientIDs ---
    df_merged = mergePublicIDs(df, id_filename)

    # --- Export all values ---
    id_cols = ["gID", "gid", "Original G No.", "Study Specific #", "infectionYear", "hasPatientData", "issue"]

    # --- Export weird values ---
    weirdos = df_merged.loc[df_merged.issue == df_merged.issue, id_cols]
    weirdos.sort_values(by=id_cols).to_csv(export_id_weirdos + ".csv", index=False)

    # --- Export the ID dictionary -- all values ---
    df_merged[id_cols].sort_values(by=["Original G No.", "Study Specific #"]).to_csv(
        export_id_filename + ".csv", index=False)


    # --- Run series of checks to make sure the values are as expected ---
    # Reset the issue column, to focus on issues with the patient data and not the roster.
    df_merged = runChecks(df_merged)

    # --- Export all data ---
    df_merged[df_merged.issue == df_merged.issue].to_csv(export_weirdos + ".csv", index = False)

    # Export everything-- including original, unmodified data
    # df_merged.sort_values(by=["gID", "Original G No.", "Study Specific #"]).to_csv(
    df_merged.to_csv(export_filename + ".csv", index=False)
    # df_merged.to_json(export_filename + ".json", orient="records")


    df2export = helpers.removeIssues(df_merged, "acute Lassa patients")
    # df2export = df_merged[df_merged.issue != df_merged.issue]
    # print(str(len(df2export)) + f" acute Lassa patients saved for upload")
    # num_removed = len(df_merged) - len(df2export)
    # print("{0:.0f}%".format((num_removed / len(df_merged))*100) + f" of patients ({num_removed}) removed for some reason:")
    # print(df_merged.issue.value_counts())
    #
    # print("\nSUMMARY OF ACUTE LASSA ISSUES:")
    # print(helpers.summarizeChecks(df_merged))
    # # df2export[cols].to_json(export_filename + ".json", orient="records")


    return(df_merged)



# Function to read the data.
def read_data(filename):
    df = pd.read_csv(filename)

    print("\t" + str(len(df)) + " acute lassa patients imported")
    return(df)

#
def mergeMetadata(df, ids):
    """
    Merge together public/private IDs to check that all patient data has a publicID associated with it.
    """
    # Convert the array of gIDs to a string to merge on them.
    df['gID_string'] = df.gID.apply(helpers.arr2str)
    ids['gID_string'] = ids.gID.apply(helpers.arr2str)


    df_merged = pd.merge(df, ids, how="outer", on="gID_string", indicator=True)
    print(df_merged.issue.value_counts())


    # -- outcome --
    # collapse to [survivor, dead, contact, control, unknown]
    # Happens AFTER merge, so we can add in patient who have an ID but no data/metadata.
    df_merged['outcome'] = df_merged.outcome_lba2.apply(helpers.cleanOutcome)

    # --- cohort ---
    # All Lassa
    df_merged['cohort'] = "Lassa"

    # --- infection year ---
    df_merged['infectionYear'] = df_merged.apply(helpers.getInfectionYear, axis = 1)

    # Add in checks
    df_merged['hasPatientData'] = df_merged._merge.apply(lambda x: x != "right_only")
    # df_merged = helpers.addError(
        # df_merged, df_merged._merge == "left_only", "Missing Study Specific ID")

    # Merge together gID arrays, since they can't be auto combined

    df_merged = helpers.checkMerge(df_merged, ["gID"], df1_label="patient data", df2_label="id roster", mergeCol="gID", errorCol="issue", leftErrorMsg="Missing Study Specific ID", rightErrorMsg="")

    return(df_merged)


def mergePublicIDs(df, id_filename):
    """
    Import and clean ID dictionary of public/private ID crosswalk
    """
    ids = prep_id_data(id_filename)

    # Read in the metadata for the patients and merge
    df_merged = mergeMetadata(df, ids)
    return(df_merged)

def cleanAcute(filename):
    df = read_data(filename)

    # --- Make sure GIDs are standardized ---
    df['gID'] = df['gid'].apply(helpers.splitGID)


    # # -- more static info --
    # df['contactGroupIdentifier'] = ""

    # # --- cohort ---
    # # All Lassa
    # df['cohort'] = "Lassa"

    # -- outcome --
    # collapse to [survivor, dead, contact, control, unknown]
    df['outcome'] = df.outcome_lba2.apply(helpers.cleanOutcome)

    # --- sex ---
    # sex: "Unspecified" --> unknown
    df['gender'] = df.Sex_CN.apply(helpers.convertGender)

    # --- age ---
    # 2019-07-22: previous versions of the data included age broken down by year/month/day-- current version seems to be just year.
    # df['age'] = df.apply(helpers.getAge, axis = 1)

    # --- occupation ---
    df['occupation'] = df.Occupation.apply(helpers.convertLower)

    # --- pregnant ---
    df['pregnant'] = df.pregnant.apply(helpers.convertBoolean)


    # -- elisas --
    df['elisa'] = df.apply(helpers.nestELISAs, axis = 1)

    # --- admin2 ---
    df['admin2'] = df.District.apply(helpers.cleanDistrict)
    df['exposureLocation'] = df.admin2.apply(helpers.listify)

    # -- admit status --
    # Waiting from John to hear what the differences are between these two vars.
    # # fix cases
    # # admittted --> admitted
    # # collapse med ward/maternity to hospitalized?
    # # collapse admitted --> hospitalized?
    # df.AdmitStatus.apply(lambda x: str(x).lower()).value_counts(dropna=False)
    #
    # df['admitStatus'] = df.AdmitStatus.apply(lambda x: str(x).lower())
    #
    # # -- admit --
    # # convert to boolean
    # df.admit.value_counts(dropna=False)
    #
    # # `AdmitStatus` and `admit` don't agree
    # df.groupby("admitStatus").admit.value_counts(normalize=True)
    # df.admitStatus.value_counts()

    # --- time variables: convert all to python objects and then standardized YYYY-MM-DD dates ---
    df['converted_evalDate'] = df.evaldate_lba1.apply(helpers.convertExcelDate)
    df['converted_admitDate'] = df.DOAdm.apply(helpers.convertExcelDate)
    df['converted_dischargeDate'] = df.DateofDischarge.apply(helpers.convertExcelDate)

    df['evalDate'] = df.converted_evalDate.apply(helpers.dates2String)
    df['dischargeDate'] = df.converted_dischargeDate.apply(helpers.dates2String)

    df['evalYear'] = df.converted_evalDate.apply(helpers.getYearfromDate)
    df['dischargeYear'] = df.converted_dischargeDate.apply(helpers.getYearfromDate)
    df['daysOnset'] = df.duration # 2019-06-12 data has as separate column
    # df['daysOnset'] = df.apply(helpers.calcOnset, axis=1) # outdated as of 2019-06-12

    df['converted_onsetDate'] = df.apply(helpers.calcOnsetDate, axis = 1) # missing from 2019-06-12 data
    df['onsetYear'] = df.converted_onsetDate.apply(helpers.getYearfromDate)
    df['infectionDate'] = df.converted_onsetDate.apply(helpers.dates2String)

    df['daysInHospital'] = df.apply(helpers.calcHospitalStay, axis=1)
    df['daysOnset2Discharge'] = df.apply(helpers.calcOnsetDischargeGap, axis=1)


    return(df)

df.sample(1).iloc[0]
# Function to run a series of automated checks on the data.
def runChecks(df):

    # --- duplicates / unique IDs ---
    # df = helpers.idDupeRow(df, df_raw)

    # --- duplicates / unique IDs ---
    df = helpers.idDupes(df, idCol="gID")
    # Study numbers are unique as of March 2019 batch
    df = helpers.idDupes(df, idCol="publicGID", errorMsg="Duplicate study specific number")

    # --- ID structure ---
    df = helpers.checkIDs(df)


    # --- date check ---
    df = helpers.checkDates(df)


    # --- ages ---
    df = helpers.checkAges(df)


    return(df)
