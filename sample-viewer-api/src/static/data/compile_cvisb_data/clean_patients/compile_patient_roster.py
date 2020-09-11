"""
Main function to assemble together the patient dictionary.
Contains: all gIDs, all sIDs, all public G/S-ids for KGH patients
as well as their cohort and outcome.

Merges together the two base ID rosters (acute patients, survivor patients).
Then adds in the patient data files (acute Lassa, survivor Lassa, survivor Ebola)
to pull in the cohort (Ebola/Lassa) and outcome (dead/survived/contact/unknown)
"""

<<<<<<< Updated upstream
def getGString(gids):
    try:
        return(gids[0])
    except:
        return(pd.np.nan)


def combineGIDs(row):
    res = []
    if(type(row.gID) == "list"):
        res = row.gID.copy()
    res.append(row.gID_string)
    res = pd.np.unique(res)
    return([res])


def unnestGIDs(arr):
    if(type(arr) == "list"):
        lambda l: [item for sublist in l for item in sublist]


def cleanup_merged(df, dateModified):
    """
    Minor cleanup / merging of various IDs used
    """
    # --- dateModified ---
    df['dateModified'] = dateModified

    # indicate the source of the patient data
    df['sourceFiles'] = "Tulane_JS"
    df['publisher'] = helpers.patientSource
    df['correction'] = ""
    df['species'] = helpers.convertSpecies("human")  # Everyone is human!

    # Set the primary public ID
    # df['patientID'] = df.apply(assign_publicID, axis=1)
    # Pull out the country name from the country object
    df['country'] = df.countryName.apply(helpers.getCountry)

    # hack for now... admin2 isn't merging properly.
    df['admin2'] = df.exposureLocation.apply(getAdmin2)
    # Double check the gIDs are saved as an array, since they need to be an array for ES
    # df['gID'] = df.gID.apply(helpers.listify)

    # Double check that all Genders exist; it's required to be either Male, Female, or Unknown
    # For patients with IDs but no metadata/data, this info is missing... so subsitute w/ Unknown
    df['gender'] = df.gender.apply(helpers.convertGender)
    df['cohort'] = df.cohort.apply(helpers.cleanCohort)
    df['outcome'] = df.outcome.apply(helpers.cleanOutcome)

    # Fix dates to date ranges
    df['infectionDate'] = df.infectionDate.apply(helpers.date2Range)
    # df['infectionYear'] = df.infectionYear.apply(helpers.year2Range)

    return(df)


def assign_publicID(row):
    """
    # From the public IDs, choose one to use as the primary identifier.
    # Only used in the cases where there's both a G- and an S- number-- meaning there's two public IDs
    # G-id used preferentially over S-id.
    """
    if(row.publicGID == row.publicGID):
        return(row.publicGID)
    return(row.publicSID)


def merge_function(acute, survivors, keyVar="gID", newKey="publicSID", varsInCommon=["cohort", "outcome", "age", "gender", "hasSurvivorData", "hasPatientData", "countryName", "issue",  "elisa", "gID", "admin2", "exposureLocation"]):
    """
    Workhorse to combine together acute and survivor datasets.

    A bit weird because a patient could, in theory, have multiple GIDs.
    So can't do a straight gID:gID merge.

    Instead:
    0. (remove previous reconcillation variables)
    1. Create a dictionary of gIDs:publicSIDs from survivors (only those w/ a GID)
    2. Match GIDs in acute to the gID:publicSID dict
    3. Perform the actual merge, based on publicSIDs
    4. Reconcile the varsInCommon
    """
    # --- (0): drop previous merge cols ---
    acute = helpers.drop_mergeVars(acute, varsInCommon)
    survivors = helpers.drop_mergeVars(survivors, varsInCommon)

    # --- (1) create survivor G --> publicS dictionary ---
    _, g_dict = helpers.createDict(
        survivors[survivors[keyVar] == survivors[keyVar]], keyVar, [newKey])

    # --- (2) match acute G --> publicS ---
    acute[newKey] = acute.apply(lambda x: helpers.matchByDict(
        x, g_dict, keyVar, newKey), axis=1)

    acute["mergeIssue"] = None

    # --- (3) merge and reconcile ---
    merged = pd.merge(acute, survivors, on=[
                      newKey], how="outer", indicator=True)

    # cols2check = ["gID", "cohort", "elisa"]
    # cols2check = ["cohort", "outcome", "age", "dateModified", "gender", "hasSurvivorData", "hasPatientData", "countryName", "issue",  "elisa", "gID"]
    # printable = cols2check.copy()
    printable = ['elisa_x', "elisa_y", "elisa"]

    # --- (4) reconcile discrepancies ---
    # Make sure first that GIDs are lists...
    merged['gID_x'] = merged.gID_x.apply(helpers.listify)
    merged['gID_y'] = merged.gID_y.apply(helpers.listify)

    merged = helpers.checkMerge2(merged,
                                 mergeCols2Check=varsInCommon,
                                 df1_label="acute patient data", df2_label="survivor data ((ACUTE-SURVIVOR MERGE))",
                                 mergeCol=newKey, dropMerge=False,
                                 errorCol="mergeIssue", leftErrorMsg="", rightErrorMsg="")

    # Merge together error messages.
    # Needs to happen after merge, b/c need to combine issue_x with issue_y --> issue.
    merged['issue'] = merged.apply(combineIssues, axis=1)

    # print(merged.sample(10)[printable])
=======
import helpers
import pandas as pd
from .public_ids import clean_acute_ids, clean_survivor_ids
>>>>>>> Stashed changes


def compile_patient_roster(acute_id_file, acute_lassa_file, survivor_id_file, survivor_ebola_file,
                           dict_cols, dateModified, updatedBy, version, verbose):
    helpers.log_msg("Starting cleanup of PATIENT roster / IDs...", verbose)

    # acute = clean_acute_ids(acute_id_file, verbose)

    # print(acute.issue.value_counts())
    # print(acute[acute.issue == "Study Specific number isn't in the expected format: ^\d\d\-\d\d\d\d\d\d$"])
    # print(acute.iloc[444])
    #
    helpers.log_msg("Starting cleanup of SURVIVOR roster / IDs...", verbose)
    survivors = clean_survivor_ids(survivor_id_file, verbose)

<<<<<<< Updated upstream
# Hack for now; assumes first entry in homeLocation is the district (since other geo info temporarily ignored)
def getAdmin2(location):
    try:
        return(location[0])
    except:
        return(pd.np.nan)
=======
>>>>>>> Stashed changes

    roster=survivors
    survivors['patientID'] = survivors['publicSID']

    return({"patient": roster, "sample": pd.DataFrame(), "dataset": pd.DataFrame(), "datadownload": pd.DataFrame(), "experiment": pd.DataFrame()})
