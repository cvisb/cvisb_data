import pandas as pd
import re
import helpers
from datetime import datetime

# Function for testing to make sure that structure, etc. of data hasn't changed.

def import_ebola_survivors(filename):
    print("\ncleaning ebola survivors")

    df_raw = pd.read_excel(filename, converters={'study specific number': str})
    print("\t" + str(len(df_raw)) + " ebola survivors imported")
    return(df_raw)

def clean_ebola_survivors(ids, filename, export_filename, export_weirdos, errorCol="issue"):
    df_raw = import_ebola_survivors(filename)

    df = df_raw.copy()


    df = cleanESurvivors(df)

    # --- merge in public IDs ---
    # Left join IDs (all survivors) to df (just the Ebola ones)
    df_merged = helpers.mergeByPublicIDs(df, ids, on=["publicSID"], mergeCols2Check=["gID", "sID", "alternateIdentifier", "outcome", "cohort", "gender"])

    # --- Checks to identify strange values ---
    df_merged = runChecks(df_merged, df_raw)

    # --- Export ---
    # Export weird values-- anything w/ issue != NA
    df_merged[df_merged.issue == df_merged.issue].to_csv(export_weirdos + ".csv", index=False)

    # Export everything-- including original, unmodified data
    df_merged.to_csv(export_filename + ".csv", index=False)

    return(df_merged)




def runChecks(df, df_raw, errorCol="issue"):

    # --- duplicates / unique IDs ---
    # df = helpers.idDupeRow(df, df_raw)

    df = helpers.idDupes(df, idCol="sID", errorMsg="Duplicate private patientID (S- or C-number)", errorCol=errorCol)
    df = helpers.idDupes(df, idCol="publicSID", errorMsg="Duplicate study specific number", errorCol=errorCol)
    df = helpers.idDupes(df, idCol = "gID", errorMsg = "Duplicate G-Number", errorCol = errorCol)


    # --- missing IDs ---
    # Missing S ID or Study Specific Number
    df = helpers.addError(
        df, df['ID number'] != df['ID number'], "Missing ID number (S- or C-number)", errorCol=errorCol)
    df = helpers.addError(
        df, df['study specific number'] != df['study specific number'], "Missing Study Specific Number", errorCol=errorCol)

    # --- ID structure ---
    df = helpers.checkIDs(df, idVar="ID number",
                          errorMsg="Unrecognized ID format", errorCol=errorCol)
    df = helpers.checkPublicSurvivorIDs(df, errorCol = errorCol, idCol = "publicSID")

    # --- ages ---
    df = helpers.checkAges(df)

    return(df)


def cleanESurvivors(df):
    df['hasSurvivorData'] = True


    # --- age ---
    df['age'] = df['age at diagnosis']

    # --- gender ---
    df['gender'] = df.gender.apply(helpers.convertGender)

    # --- cohort ---
    df['cohort'] = "Ebola"
    # outcome assumed to be survivor if S-number; contact if C-number
    df['outcome'] = df["ID number"].apply(helpers.assignOutcome)

    # --- patient IDs ---
    df['publicSID'] = df.apply(lambda x: helpers.makePublicPatientID(
        x, "study specific number"), axis=1)
    # sID, gID
    df['sID'] = df["ID number"].apply(helpers.cleanPrivateID)
    df['gID'] = df["G number"].apply(helpers.splitGID)

    # --- nest the IgG measurements ---
    df['elisa'] = df.apply(helpers.nestELISAs, axis=1)

    # --- nest the symptoms and convert to binaries ---
    df['symptoms'] = df.apply(helpers.nestSymptoms, axis=1)

    # --- rename the contact exposure / connection ---
    def getRel(relationship):
        if (relationship == relationship):
            return(relationship)
        else:
            return("unknown")

    df["exposureType"] = df["level/type of exposure"]

    df["contactSurvivorRelationship"] = df["rel between survivor anc contacts"].apply(
        getRel)

    # --- location ---
    df['exposureLocation'] = df.district.apply(helpers.cleanDistrict)
    return(df)

# # (4) gender all M/F
# df.gender.value_counts(dropna = False)
# # (5) IgG either +/-/?
# df["ebola IgG"].value_counts(dropna = False)
# df["lassa IgG"].value_counts(dropna = False)
# # (6) contact type seems to be all over the place...
# df["rel between survivor anc contacts"].value_counts()
# df["level/type of exposure"].value_counts()
