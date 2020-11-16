# <<< clean_lassa_acute_ids.py >>>
# @name:        clean_lassa_acute_ids
# @summary:     Loads, cleans, and verifies list of acute Lassa patients matched to their public patientID
# @description: Loads, cleans, and verifies list of acute Lassa patients matched to their public patientID for downstream use.
# @inputs:      filename of ID file
# @outputs:

import pandas as pd
import helpers
import datetime


# Import public IDs  ----------------------------------------------------------------------------------------------------
def read_lassa_iddata(filename):
    df = pd.read_excel(filename)
    print("\t" + str(len(df)) + " patient ids imported")
    return(df)

# Main function to clean the roster ----------------------------------------------------------------------------------------------------
def prep_id_data(filename):
    ids = read_lassa_iddata(filename)
    ids['issue'] = None

    # --- rename columns ---
    ids['publicGID'] = ids["Study Specific #"].apply(
        lambda x: "G" + x)

    # --- fish out the gid ---
    # G-ids in the metadata are G-xxx or G-xxxx. For some reason, there are timepoints (?) appended to some of the IDs.
    # structure: dd, ddd, dddd, G-dddd-d, G-dddd-d\s
    ids['gID'] = ids['Original G No.'].apply(helpers.splitGID)

    # --- add in country; all patients from Sierra Leone ---
    ids['countryName'] = "Sierra Leone"

    # --- pull out the year the patient presented in the hospital ---
    # first two digits of study specific number are year
    ids['presentationYear'] = ids['Study Specific #'].apply(
        lambda x: int("20" + x[0:2]))

    # --- run through automated checks to flag problems ---
    ids = runIDChecks(ids)

    # --- Create dictionary ---
    # acute_lassa_dict = helpers.createDict(ids, "gID")

    return(ids)

# Run a series of checks to make sure the years are within the proper range
def runIDChecks(ids, expectedYearRange = [2008, datetime.datetime.now().year], errorCol="issue"):
    # --- missing IDs ---
    # Missing G ID or Study Specific Number
    ids = helpers.addError(
        ids, ids['Original G No.'] != ids['Original G No.'], "[id roster] Missing GID", errorCol=errorCol)
    ids = helpers.addError(
        ids, ids['Study Specific #'] != ids['Study Specific #'], "[id roster] Missing Study Specific Number", errorCol=errorCol)

    # --- unique check ---
    # Check IDs are unique.
    # One ID has two different Study numbers from March batch
    ids = helpers.idDupes(ids, idCol="gID", errorCol=errorCol, errorMsg = "[id roster] Duplicate GID")

    # Study numbers are unique as of March 2019 batch
    ids = helpers.idDupes(ids, idCol=
        "Study Specific #", errorMsg="[id roster] Duplicate study specific number", errorCol=errorCol)
    # Check study specific number format.
    ids = helpers.checkPublicAcuteIDs(ids, errorCol= errorCol)

    # --- Check infectionYear makes sense ---
    ids = helpers.addError(ids, (ids.presentationYear < expectedYearRange[0]) | (
        ids.presentationYear > expectedYearRange[1]), "[id roster] year of presentation (first two digits of ID) outside expected range", errorCol=errorCol)
    return(ids)
