# <<< check_roster_coverage.py >>>
# @name:        check_roster_coverage.py
# @summary:     Quick function to create crosstabs of CViSB patient universe and holes
# @description:
# @inputs:
# @outputs:
#

import pandas as pd
import os
os.chdir("/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/")
# Helper functions for cleanup...
import helpers


cvisb_file = "/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/input_data/cvisb_random_rosters/CViSB_knownpatients_cleaned_20190619_PRIVATE.json"
# cvisb_file = "/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/input_data/cvisb_random_rosters/CViSB_knownpatients_cleaned_20190510_PRIVATE.json"
# cvisb_file = "/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/input_data/cvisb_random_rosters/CViSB_knownpatients_cleaned_PRIVATE.json"


# [ID rosters] ------------------------------------------------------------------------------------------
id_dict = "/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/output_data/patients/patients_2019-06-19_PRIVATE_dict.json"

ids = pd.read_json(id_dict)
ids.head()
ids.reset_index(inplace = True)
ids.rename(columns = {'index': 'ID'}, inplace = True)

# [Merge with what we think we know]  ----------------------------------------------------------------------------------------------------
cvisb = pd.read_json(cvisb_file)
cvisb['ID'] = cvisb.ID.apply(helpers.interpretID)
cvisb['KGH_id'] = cvisb.ID.apply(helpers.checkIDstructure).apply(lambda x: not x)
cvisb.shape
cvisb.KGH_id.value_counts()
cvisb.head()

ids.head()

# [Broad's list of acute Ebola patients]  ----------------------------------------------------------------------------------------------------
# ebv_file = "/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/input_data/patient_rosters/EbolaEra_AcuteMetadata_Merged_20190509.tsv"
#
# ebv = pd.read_table(ebv_file)
#
# # Fix one ID
# ebv['ID_orig'] = ebv.ID
# ebv['ID'] = ebv.ID_orig.apply(helpers.interpretID)
# ebv['KGH_id'] = ebv.ID.apply(helpers.checkIDstructure).apply(lambda x: not x)
# ebv['acuteEbola'] = True
#
# ebv[]
# ebv.KGH_id.value_counts(dropna=False)

# ids = pd.merge(ids, ebv[['ID', 'acuteEbola']], how='outer', indicator=True, on="ID")

# ids._merge.value_counts()

# ids.drop(['_merge'], axis = 1, inplace=True)

# [merge IDs to patient list]  ----------------------------------------------------------------------------------------------------

merged = pd.merge(cvisb, ids, how="left", indicator=True, on="ID")

merged._merge.value_counts()


merged[merged.KGH_id]._merge.value_counts(dropna=False)
# merged[(merged._merge == "left_only") & merged.KGH_id].cohort_x.value_counts(dropna=False)


# Count by source...
merged['source2'] = merged.source.apply(helpers.listify)


merged[(merged._merge == "left_only") & merged.KGH_id].source2.apply(lambda x: pd.Series([i for i in x])).melt().value.value_counts()


# [Import in the full patient IDs]  ----------------------------------------------------------------------------------------------------
cols2save = ['ID', 'allIDs', 'cohort_x', 'outcome_x', 'source']
merged_copy = merged.loc[(merged._merge == "left_only") & merged.KGH_id, cols2save].copy()



# all gIDs -- rename
merged_copy.rename(columns={"ID": "gID", "cohort_x": "cohort", "outcome_x": "outcome"}, inplace = True)
patient_file = "/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/output_data/patients/patients_2019-06-19_PRIVATE_ALL.json"

patients = pd.read_json(patient_file, dtype={'hasPatientData': bool})

# Merge back *all* the patients, to account for the patients in John's data who lack study specific IDs.
patients.patientID.value_counts(dropna = False)

# all gIDS; don't save sIDs
patients_missing = patients.loc[patients.patientID != patients.patientID, ['gID', 'cohort', 'outcome', 'hasPatientData', 'source']]
# luckily, all singles, so convert list to string
# patients['gIDlength'] = patients.gID.apply(lambda x: len(x))
patients_missing['gID'] = patients_missing.gID.apply(lambda x: x[0])
patients_missing[patients_missing.duplicated(subset="gID")].gID


merged_copy.cohort.apply(lambda x: len(x)).value_counts()

patients_missing.head()
# all unique; can just concat
testmerge = pd.merge(patients_missing, merged_copy, on=["gID"], how="outer", indicator=True)

merged2save = pd.concat([patients_missing, merged_copy])
merged2save.head()


merged2save[["gID", "cohort", "outcome", "hasPatientData", "source"]].sort_values(["hasPatientData", "gID"]).to_csv('/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/output_data/patients/inconsistencies/2019-06-19_allknownpatients_noPublicID.csv', index=False)


x = pd.read_excel("../input_data/patient_rosters/survivor_IDdict_v2_2019-03-06_PRIVATE.xlsx", usecols=list(range(0,15)), converters={'Study Specific #': str, 'ID Number': str})
x.head()
ids = x.iloc[1772:1776]
ids.head()

ids['gID'] = ids["G-NUM"].apply(helpers.splitGID)



# List from Emily, 20 June 2019
em = pd.read_csv("/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/input_data/patient_rosters/unnamed originals/StudySpecificNumbersforLaura_20Jun19_EE.csv")
# remove any blank rows
em.dropna(subset=["gID"], axis=0, inplace=True)
em.head()

# remove anything which are straight duplicates-- my fault, since the patients list from John included duplicate IDs.
em.drop_duplicates(subset=["gID", "Study Specific #"], inplace=True)
# Export contradictory IDs.
em[em.duplicated(subset=["Study Specific #"], keep=False)].sort_values("Study Specific #").to_csv('/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/output_data/patients/inconsistencies/2019-06-29_StudySpecificNumbers_duplicates.csv', index=False)

# testing whether all ids are unique, comparing w/ previous list of IDs.
p = patients.loc[patients.patientID == patients.patientID, ['patientID', 'sID', 'gID']]

p['ID'] = p.patientID.apply(lambda x: x[1:])

e = em.drop_duplicates(subset="Study Specific #")


em_id_check = pd.merge(e, p, how="outer", indicator=True, left_on="Study Specific #", right_on="ID")

em_id_check.sample(6)

em_id_check._merge.value_counts()
