# Function to compile the base roster for all patients known to CViSB, plus additional patients from Tulane's rosters
# Expected output:
# | --------- | --------- | ---------- | --------- | ---------- | -------------- | ------------------- | ------ | ------- | -------------- | ------------ | ------------ | ------------- | ------------ | --------------------- | ---------------------- |
# | patientID | publicGID | privateGID | publicSID | privateSID | privateOtherID | alternateIdentifier | cohort | outcome | hasPatientData | cvisb_sample | cvisb_cohort | cvisb_outcome | cvisb_source | cvisb_cohort_disagree | cvisb_outcome_disagree |
# | --------- | --------- | ---------- | --------- | ---------- | -------------- | ------------------- | ------ | ------- | -------------- | ------------ | ------------ | ------------- | ------------ | --------------------- | ---------------------- |
# | canonical ID | public G-ID | internal G-id | public S- or C-id | internal S- or C-id | id of unknown origin | array of all IDs | cohort (Ebola, Lassa, Unknown, control) from Tulane | outcome (dead, survivor, control, contact, unknown) from Tulane | has patient data/metadata from Tulane | in CViSB internal inventories | internal cvisb record of cohort | which CViSB record/data source has that sample | internal cvisb record of outcome | Tulane/CViSB cohort agree? | Tulane/CViSB outcome agree? |
# | --------- | --------- | ---------- | --------- | ---------- | -------------- | ------------------- | ------ | ------- | -------------- | ------------ | ------------ | ------------- | ------------ | --------------------- | ---------------------- |

# <<< compile_patient_roster.py >>>
# @name:        compile_patient_roster
# @summary:     Compiles list of CViSB patients along w/ associated patient data
# @description: Outermost function to compile together a list of cleaned patient metadata to be uploaded to Angular app.
# @inputs:      file names specified
# @requires:    acute_patients
#               survivor
#               helpers
# @outputs:     (1) .json containing patients without any inconsistencies detected
#               (2) various .csv files noting inconsistencies to be verified
#               (3) dictionary containing crosswalk of the IDs.
# @usage:       1. update config.py to supply path locations
#               2. `python compile_patient_roster.py`

import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

import config
import acute_patients as acute
import survivors
import helpers


# Main function to stitch together the patients.
def compile_patients(output_patients, input_survivor_ids, output_allSurvivors, output_survivorRoster, output_survivorRosterWeirdos,
                     input_ebolaSurvivor, output_ebolaSurvivor, output_ebolaSurvivorWeirdos,
                     input_lassaAcute, input_lassaAcute_ids,
                     output_lassaAcute, output_lassaAcute_ids, output_lassaAcuteWeirdos, output_lassaAcuteWeirdos_ids,
                     export_cols, dict_cols):
    print('Compiling CViSB patients...')

    # --- acute Lassa ---
    # (1) call acute_patients to get the acute IDs
    acuteLassa = acute.clean_lassa_acute(input_lassaAcute, input_lassaAcute_ids,
                                         output_lassaAcute, output_lassaAcute_ids,
                                         output_lassaAcuteWeirdos, output_lassaAcuteWeirdos_ids)

    # --- acute Ebola ---
    # (2) Get acute Ebola data
    acuteEbola = pd.DataFrame()

    # --- survivors / contacts for Ebola & Lassa ---
    # (3) call survivors to get all survivors.
    survivorsAll = survivors.clean_survivors(
        input_survivor_ids, input_ebolaSurvivor, output_allSurvivors,
        output_survivorRoster, output_survivorRosterWeirdos, output_ebolaSurvivor, output_ebolaSurvivorWeirdos)

    # --- concat together all data and assign primary patient ids ---
    merged = merge_patients(acuteLassa, acuteEbola, survivorsAll)

    # --- export data ---
    # remove any patient IDs that are NA-- no identifier to use!
    # Aslo removing any row that has an issue that needs to be resolved by Tulane.
    df2export = helpers.removeIssues(merged, "patients")
    df2export = df2export[df2export.patientID == df2export.patientID]

    # Export just the transformed values to be uploaded to ES -- handled in the main function.
    # df2export = df2export.iloc[0:5]
    df2export[export_cols].to_json(output_patients + ".json", orient="records")

    df_dict, _ = helpers.createDict(
        df2export, "alternateIdentifier", dict_cols)
    df_dict[dict_cols].to_csv(output_patients + "_dict.csv")

    return(merged)


def merge_patients(acuteLassa, acuteEbola, survivorsAll):
    """
    Merges together all the disparate data sources and assigns their primary IDs.

    First: concat together acute patients: Lassa + Ebola. These should have no overlap (in theory)
    Double-check there are no duplicates within them.
    Find primary ID, then join.
    Joining rather than concatenating, since need to combine acute and survivor data.
    """
    acute = pd.concat([acuteLassa, acuteEbola], ignore_index=True)

    # Checks to ensure there's no overlap b/w
    acute = helpers.idDupes(
        acute, idCol="gID", errorMsg="(ACUTE MERGE): Duplicate gID")
    acute = helpers.idDupes(acute, idCol="publicGID",
                            errorMsg="(ACUTE MERGE): Duplicate public gID")

    merged = merge_function(acute, survivorsAll)

    merged = cleanup_IDs(merged)

    return(merged)


def cleanup_IDs(df):
    """
    Minor cleanup / merging of various IDs used
    """
    # Set the primary public ID
    df['patientID'] = df.apply(assign_publicID, axis=1)
    # Pull out the country name from the country object
    df['country'] = df.countryName.apply(helpers.getCountry)
    # Double check the gIDs are saved as an array, since they need to be an array for ES
    df['gID'] = df.gID.apply(helpers.listify)

    df['alternateIdentifier'] = None # necessary to initialize, b/c there's an uneven number of IDs for each patient returned
    df['alternateIdentifier'] = df.apply(
        lambda x: helpers.combineIDs(x), axis=1)
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


def merge_function(acute, survivors, keyVar="gID", newKey="publicSID", varsInCommon=["age", "gender", "cohort", "elisas", "outcome", "country", "gID", "sID"]):
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
    merged = pd.merge(acute, survivors, on=[newKey], how="outer", indicator=True)

    cols2check = ["cohort"]
    cols2check = ["cohort", "outcome", "age", "dateModified", "gender", "hasSurvivorData", "hasPatientData", "countryName", "issue"]
    printable = cols2check.copy()
    printable.extend(["gID_x", "gID_y", "publicSID", "publicGID", "sID"])

    # --- (4) reconcile discrepancies ---
    # Make sure first that GIDs are lists...
    merged['gID_x'] = merged.gID_x.apply(helpers.listify)
    merged['gID_y'] = merged.gID_y.apply(helpers.listify)


    merged = helpers.checkMerge(merged,
                                mergeCols2Check= cols2check,
                                df1_label="acute patient data", df2_label="survivor data",
                                mergeCol=newKey, dropMerge=False,
                                errorCol="mergeIssue", leftErrorMsg="", rightErrorMsg="")
    print("\n\n************************************************")
    print(merged.mergeIssue.value_counts(dropna = False))
    print("\n************************************************")
    # print(merged.issue.value_counts())

    # print(merged.loc[merged.mergeIssue == merged.mergeIssue, printable])
    print(merged.loc[merged._merge == "both", ["gID", "gID_x", "gID_y", "cohort_x", "cohort_y", "cohort"]])
    # print(merged.loc[merged._merge == "both", printable])

    # merged = helpers.idDupes(merged, idCol="patientID",
    # errorMsg="((ACUTE-SURVIVOR MERGE)): Duplicate patientID")
    return(merged)


def check_coverage():
    return()


if __name__ == '__main__':
    compile_patients(config.output_patients, config.input_survivor_ids, config.output_allSurvivors, config.output_survivorRoster, config.output_survivorRosterWeirdos,
                     config.input_ebolaSurvivor, config.output_ebolaSurvivor,
                     config.output_ebolaSurvivorWeirdos,
                     config.input_lassaAcute, config.input_lassaAcute_ids,
                     config.output_lassaAcute, config.output_lassaAcute_ids,
                     config.output_lassaAcuteWeirdos, config.output_lassaAcuteWeirdos_ids, config.export_cols, config.dict_cols)
