# <<< compile_patient_roster.py >>>
# @name:        compile_patient_roster
# @summary:     Compiles list of CViSB patients along w/ associated patient data
# @description: Outermost function to compile together a list of cleaned patient metadata to be uploaded to Angular app.
#               Compiles together and standardizes all patient data from KGH, including acute Lassa data, survivor Lassa/Ebola data,
#               and associated additional IDs for whom we have some additional experimental data but no actual patient data.
#               Additionally, within the modules, runs checks to ensure that the data are internally consistent; for instance,
#               if the patient has records in both acute and survivor datasets, do they agree with each other?
#
#               Additional patient records are created from HLA and viral sequencing datasets, where non-KGH patients are added.
#
# @inputs:      file names, as specified in config.py
#
# @requires:    acute_patients: module to clean up the acute Lassa patient data
#               survivors: module to clean up survivor data
#               helpers: re-usable functions to standardize data to fit within cvisb schema: http://data.cvisb.org/schema
#               extra_ids: in other scripts, all the patients known to CViSB for one reason or another were merged.
#               Some of them were not in the current KGH-universe, so additional public IDs were created.
#
# @outputs:     (1) .json containing patients without any inconsistencies detected
#               (2) various .csv files noting inconsistencies to be verified
#               (3) dictionary containing crosswalk of the IDs.
# @usage:       1. update config.py to supply path locations
#               2. `python compile_patient_roster.py`
# @author:      Laura Hughes, lhughes@scripps.edu
# @dateModified: 24 September 2019

import pandas as pd
from datetime import datetime

import config
import acute_patients as acute
import survivors
import extra_ids
from ...helpers import *

# Main function to stitch together the patients.
def compile_patients(output_patients, input_extra_ids, output_extraIDs_weirdos, input_survivor_ids, output_allSurvivors, output_survivorRoster, output_survivorRosterWeirdos,
                     input_ebolaSurvivor, output_ebolaSurvivor, output_ebolaSurvivorWeirdos,
                     input_lassaAcute, input_lassaAcute_ids,
                     output_lassaAcute, output_lassaAcute_ids, output_lassaAcuteWeirdos, output_lassaAcuteWeirdos_ids,
                     export_cols, dict_cols, dateModified=datetime.today().strftime('%Y-%m-%d')):
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

    # --- leftover IDs ---
    # (4) call additional ids -- extra ones that don't appear in other places.
    extra = extra_ids.clean_extra_ids(input_extra_ids, output_extraIDs_weirdos)

    # --- concat together all data and assign primary patient ids ---
    merged = merge_patients(acuteLassa, acuteEbola,
                            survivorsAll, extra, dateModified)

    merged.to_csv(output_patients + "_ALL.csv", index=False)
    merged.to_json(output_patients + "_ALL.json", orient="records")

    # --- export data ---
    # remove any patient IDs that are NA-- no identifier to use!
    # Also removing any row that has an issue that needs to be resolved by Tulane.
    # df2export = helpers.removeIssues(merged, "patients")
    # 2019-09-13: less conservatively: just removing anything which has a duplicated or NA patientID
    df2export = merged[(~merged.duplicated(subset="patientID", keep=False)) & (
        ~merged.patientID.isnull())]
    df2export = df2export[df2export.patientID == df2export.patientID]

    # Export just the transformed values to be uploaded to ES -- handled in the main function.
    # df2export = df2export.iloc[0:5]
    df2export[export_cols].to_json(output_patients + ".json", orient="records")
    df2export[export_cols].sample(25).to_json(
        output_patients + "_randomsample.json", orient="records")
    df2export[export_cols].to_csv(output_patients + "_clean.csv", index=False)
    # df2export[export_cols].to_csv(output_patients + ".csv", index = False)

    df_dict, _ = helpers.createDict(
        merged, "alternateIdentifier", dict_cols, True)
    df_dict[dict_cols].to_csv(output_patients + "_dict.csv")
    df_dict[dict_cols].to_json(output_patients + "_dict.json")

    return(merged)


def merge_patients(acuteLassa, acuteEbola, survivorsAll, extra, dateModified):
    """
    Merges together all the disparate data sources and assigns their primary IDs.

    1. concat together acute patients: Lassa + Ebola. These should have no overlap (in theory)
    Double-check there are no duplicates within them.
    2. Join and check acute and survivors.  Check for overlaps, etc.
    3. Merge in extra IDs. Check for disagreements.
    4. Do a bit of tidying up
    """
    acute = pd.concat([acuteLassa, acuteEbola], ignore_index=True)

    # Checks to ensure there's no overlap b/w
    acute = helpers.idDupes(
        acute, idCol="gID", errorMsg="(ACUTE MERGE): Duplicate gID")
    acute = helpers.idDupes(acute, idCol="publicGID",
                            errorMsg="(ACUTE MERGE): Duplicate public gID")

    merged = merge_function(acute, survivorsAll)

    merged['patientID'] = merged.apply(assign_publicID, axis=1)

    # Merge in extra IDs
    merged2 = mergeExtraIDs(merged, extra)
    merged2 = helpers.idDupes(merged2, idCol="patientID",
                              errorMsg="((ACUTE-SURVIVOR MERGE)): Duplicate patientID")
    merged2 = cleanup_merged(merged2, dateModified)

    return(merged2)


def mergeExtraIDs(merged, extra, varsInCommon=['cohort', 'outcome', 'patientID', 'countryName']):
    print("\nBeginning merge together of extra ids.")
    print(f"\n{len(merged)} patients initially")

    merged['gID_string'] = merged.gID.apply(getGString)
    extra.rename(columns={'gID': 'gID_string'}, inplace=True)
    merged.drop(["cohort_x", "cohort_y", "outcome_x", "outcome_y",
                 'countryName_x', 'countryName_y'], axis=1, inplace=True)
    merged2 = pd.merge(merged, extra, on='gID_string', how="outer")

    # Combine together gIDs
    merged2['gID'] = merged2.apply(lambda x: helpers.combineIDs(
        x, columns=["gID", "gID_string"]), axis=1)
    # unnest GiDs
    # merged2['gID'] = merged2.gID.apply(unnestGIDs)
    merged2.drop(["gID_string"], axis=1, inplace=True)

    merged2.fillna(value=pd.np.nan, inplace=True)
    merged2['mergeIssue'] = ""

    combined = helpers.checkMerge2(merged2,
                                   mergeCols2Check=varsInCommon,
                                   df1_label="acute patient data", df2_label="survivor data ((ACUTE-SURVIVOR MERGE))",
                                   mergeCol="additional IDs", dropMerge=False,
                                   errorCol="mergeIssue", leftErrorMsg="", rightErrorMsg="")
    print(f"\n{len(combined)} patients after merge w/ extra IDs")

    # necessary to initialize, b/c there's an uneven number of IDs for each patient returned
    combined['alternateIdentifier'] = None
    combined['alternateIdentifier'] = combined.apply(lambda x: helpers.combineIDs(
        x, columns=["gID", "sID", "publicGID", "publicSID", "patientID"]), axis=1)
    return(combined)


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

    return(merged)


def combineIssues(row, issueCol="issue", mergeIssueCol="mergeIssue"):
    return(helpers.updateError(row[issueCol], row[mergeIssueCol]))


# Hack for now; assumes first entry in homeLocation is the district (since other geo info temporarily ignored)
def getAdmin2(location):
    try:
        return(location[0])
    except:
        return(pd.np.nan)


if __name__ == '__main__':
    compile_patients(config.output_patients, config.input_extra_ids, config.output_extraIDs_weirdos, config.input_survivor_ids, config.output_allSurvivors, config.output_survivorRoster, config.output_survivorRosterWeirdos,
                     config.input_ebolaSurvivor, config.output_ebolaSurvivor,
                     config.output_ebolaSurvivorWeirdos,
                     config.input_lassaAcute, config.input_lassaAcute_ids,
                     config.output_lassaAcute, config.output_lassaAcute_ids,
                     config.output_lassaAcuteWeirdos, config.output_lassaAcuteWeirdos_ids, config.export_cols, config.dict_cols)
