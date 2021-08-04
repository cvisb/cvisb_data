import pandas as pd
import helpers


def import_survivor_ids(filename):
    print('\n\ncleaning survivor IDs')
    ids_raw = pd.read_excel(filename, usecols=list(range(0, 15)), converters={
                            'Study Specific #': str, 'ID Number': str})
    print("\t" + str(len(ids_raw)) + "  survivors imported")
    return(ids_raw)


def clean_survivor_ids(filename):
    ids_raw = import_survivor_ids(filename)

    # Rename to agree w/ previous code
    ids_raw.rename(columns={'G-NUM': "G-Number", "ID Number": "ID", "Subject Type": "Type",
                            "Unnamed: 5": "age_months", "Unnamed: 6": "age_days"}, inplace=True)
    # Drop rows for future patients
    ids_raw.dropna(subset=["ID"], inplace=True)

    # Assign outcome, publicSID
    ids = ids_raw.copy()

    ids['sID'] = ids.apply(lambda x: x.Type.upper() + x.ID.zfill(3), axis=1)
    ids['cohort'] = ids['Case Type'].apply(helpers.cleanCohort)

    ids['outcome'] = ids.sID.apply(helpers.assignOutcome)
    ids['publicSID'] = ids.apply(
        lambda x: helpers.makePublicPatientID(x, "Study Specific #"), axis=1)

    # Extract useful info from the ID number
    ids['contactGroupIdentifier'] = ids['Study Specific #'].apply(
        lambda x: str(x[:-1]))
    ids['contactGroupNumber'] = ids['Study Specific #'].apply(lambda x: x[-1])

    # Split and convert G-ids
    ids['gID'] = ids["G-Number"].apply(helpers.splitGID)

    # --- Group by household IDs to generate relatedTo ---
    ids["relatedTo"] = ids.publicSID  # create a copy that will be collapsed.
    # group by contact group, create a list, and remove the ID from that row (remove self)
    ids['relatedTo'] = ids.groupby("contactGroupIdentifier")[
        'relatedTo'].transform(listicle)
    ids['relatedTo'] = ids.apply(removeSelfID, axis=1)

    # Private form of the ID.
    ids["relatedToPrivate"] = ids.sID  # create a copy that will be collapsed.
    # group by contact group, create a list, and remove the ID from that row (remove self)
    ids['relatedToPrivate'] = ids.groupby("contactGroupIdentifier")[
        'relatedToPrivate'].transform(listicle)
    ids['relatedToPrivate'] = ids.apply(
        lambda x: removeSelfID(x, 'relatedToPrivate', 'sID'), axis=1)

    # Grab the dates
    ids['survivorEnrollmentDate'] = ids['Date of Enrollment '].apply(
        helpers.dates2String)
    ids['survivorEvalDates'] = ids['Date of 1st Visit'].apply(
        helpers.dates2String)
    ids['survivorEvalDates'] = ids['survivorEvalDates'].apply(helpers.listify)

    # --- gender ---
    ids['gender'] = ids.Gender.apply(helpers.convertGender)

    # --- age ---
    # Age seems to be age at *survivor* presentation, not age at diagnosis.
    # Throwing away for now.
    # ids['age'] = ids.Age

    # --- admin2 ---
    ids['admin2'] = ids.District.apply(helpers.cleanDistrict)
    ids['exposureLocation'] = ids.admin2.apply(helpers.listify)

    # --- Check data is as expected ---
    ids = runIDChecks(ids, ids_raw)
    print(ids.issue.value_counts())

    # --- Export ---
    # Export weird values-- anything w/ issue != NA
    # ids[ids.issue == ids.issue].to_csv(export_weirdos + ".csv", index=False)

    # Export everything-- including original, unmodified data
    # ids.to_csv(export_filename + ".csv", index=False)

    return(ids)

# Transform function to return a grouped list of patient IDs


def listicle(group):
    return([(list(group))])


def removeSelfID(row, relatedVar="relatedTo", idVar="publicSID"):
    if(isinstance(row[relatedVar], list)):
        if(len(row[relatedVar]) > 0):
            ids = row[relatedVar].copy()
            ids.remove(row[idVar])
        return(ids)


def runIDChecks(ids, ids_raw, errorCol="issue"):
    ids[errorCol] = None

    # --- missing IDs ---
    # Missing S/C ID or Study Specific Number
    ids = helpers.addError(
        ids, ids['ID'] != ids['ID'], "[id roster] Missing S- or C- ID", errorCol=errorCol)
    ids = helpers.addError(
        ids, ids['Study Specific #'] != ids['Study Specific #'], "Missing Study Specific Number", errorCol=errorCol)

    # --- unique check ---
    ids = helpers.idDupeRow(ids, ids_raw, errorCol=errorCol,
                            errorMsg="[id roster] Duplicate row")
    ids = helpers.checkPublicSurvivorIDs(ids, errorCol=errorCol, idCol="publicSID",
                                         errorMsg="[id roster] Private and Public IDs have different contactGroupIdentifiers")
    ids = helpers.idDupes(
        ids, idCol="sID", errorMsg="[id roster] Duplicate private patient ID", errorCol=errorCol)
    ids = helpers.idDupes(
        ids, idCol="gID", errorMsg="[id roster] Duplicate G-Number", errorCol=errorCol)
    ids = helpers.idDupes(ids, idCol="publicSID",
                          errorMsg="[id roster] Duplicate public patient ID", errorCol=errorCol)

    # --- check contact groups have the same identifier ---
    ids = helpers.checkContactGroupIDs(ids, errorCol=errorCol, publicID_col="contactGroupIdentifier",
                                       privateID_col="sID", errorMsg="[id roster] Private and Public IDs have different contactGroupIdentifiers")

    return(ids)
