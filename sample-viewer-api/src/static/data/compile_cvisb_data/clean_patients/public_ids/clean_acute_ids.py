import pandas as pd
import datetime
import helpers

def clean_acute_ids(id_file, verbose):
    return_cols = ['patientID', 'gID', 'presentationYear', 'countryName', 'issue']

    ids = pd.read_excel(id_file)
    helpers.log_msg("\t" + str(len(ids)) + " acute patient ids imported", verbose)

    ids['issue'] = None

    # --- fish out ids ---
    ids['gID_raw'] = ids["G No."].apply(lambda x: f"G-{x}")
    ids['gID'] = ids.gID_raw.apply(helpers.interpretID)
    ids['patientID'] = ids["Study Specific #"].apply(lambda x: f"G{x}")

     # --- grab the infection year ---
    ids['presentationYear'] = ids['Study Specific #'].apply(lambda x: int("20" + x[0:2]))
    ids['infectionYear'] = ids.Year

    # --- add in country; all patients from Sierra Leone ---
    ids['countryName'] = "Sierra Leone"

    runIDChecks(ids, verbose)

    return(ids[return_cols])


# Run a series of checks to make sure the years are within the proper range
def runIDChecks(ids, verbose, expectedYearRange = [2006, datetime.datetime.now().year], errorCol="issue"):
    # --- missing IDs ---
    # Missing G ID or Study Specific Number
    ids = helpers.addError(ids, ids['G No.'] != ids['G No.'], "[id roster] Missing GID", verbose, logCols=["Study Specific #"], errorCol=errorCol)
    ids = helpers.addError(ids, ids['Study Specific #'] != ids['Study Specific #'], "[id roster] Missing Study Specific Number", verbose, logCols=["G No."], errorCol=errorCol)

    # --- unique check ---
    # Check IDs are unique.
    # One ID has two different Study numbers from March batch
    ids = helpers.idDupes(ids, verbose, idCol="gID", errorCol=errorCol, errorMsg = "[id roster] Duplicate GID")

    # Study numbers are unique as of March 2019 batch
    ids = helpers.idDupes(ids, verbose, idCol=
        "Study Specific #", errorMsg="[id roster] Duplicate study specific number", errorCol=errorCol)
    # Check study specific number format.
    ids = helpers.checkPublicAcuteIDs(ids, errorCol, verbose)

    # --- check year matches ---
    ids = helpers.addError(ids, ids['presentationYear'] != ids['infectionYear'], "[id roster] 'year' disagrees with year in Study Specific ID", verbose, logCols=["patientID", "infectionYear"], errorCol=errorCol)

    # --- Check infectionYear makes sense ---
    ids = helpers.addError(ids, (ids.presentationYear < expectedYearRange[0]) | (
        ids.presentationYear > expectedYearRange[1]), "[id roster] year of presentation (first two digits of ID) outside expected range", verbose, logCols=["patientID"], errorCol=errorCol)
    return(ids)
