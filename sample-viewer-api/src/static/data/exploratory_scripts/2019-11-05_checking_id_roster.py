# 2019-11-01: Emily sent a new, complete list of the idss with their public idss.
# Double checking that this agrees with the previous list of random idss she sent me,
# pulling those idss for patients we know of but weren't previously in the list.
# If it looks good, the additional_idsdict will be deprecated.
#
# While I'm here, checking that all source_olds of IDs match...
# 1) Master G-id list
# 2) Extra ID list
# 3) Acute Lassa ID list
# 4) Acute Lassa metadata

import pandas as pd
import os
os.chdir("/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/compile_cvisb_data/")
import helpers

# [Import "master" list]  ----------------------------------------------------------------------------------------------------
ids = pd.read_excel("/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/input_data/patient_rosters/complete_acuteid_roster_v1_2019-11-01.xlsx", dtype={"G No.": str})
return_cols = ['patientID', 'gID', 'infectionYear']

ids['issue'] = None

# --- fish out ids ---
ids['gID'] = ids["G No."].apply(lambda x: f"G-{x}")
ids['patientID'] = ids["Study Specific #"].apply(lambda x: f"G-{x}")

 # --- grab the infection year ---
ids['presentationYear'] = ids['Study Specific #'].apply(lambda x: int("20" + x[0:2]))
ids['infectionYear'] = ids.Year

# --- add in country; all patients from Sierra Leone ---
ids['countryName'] = "Sierra Leone"
ids[return_cols]

ids.loc[ids['presentationYear'] != ids['infectionYear'], ['Year', "Study Specific #", "G No."]].to_csv("/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/output_data/inconsistencies/2019-11-06_acute_id_year_issues.csv", index = False)
ids.head()

ids[ids['G No.'] != ids['G No.']]
ids[ids['Study Specific #'] != ids['Study Specific #']]
sum(ids.duplicated(subset="G No."))
sum(ids.duplicated(subset="Study Specific #"))

ids.Year.value_counts(sort=False)




ids.head()

# [2: extra ID list]  ----------------------------------------------------------------------------------------------------
df = pd.read_csv("/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/input_data/patient_rosters/additional_iddict_v3_2019-10-23.csv")
df.head()

merged2 = pd.merge(df, ids, how="left", on="gID", indicator=True)

# Good.  Everything merges.
merged2._merge.value_counts()

# checking if study specific numbers match...
merged2['match'] = merged2.apply(lambda row: row["Study Specific #_x"] == row["Study Specific #_y"], axis=1)

merged2.match.value_counts()

err2= merged2.loc[~ merged2.match, ['gID', 'Year', 'Study Specific #_x', 'Study Specific #_y']]
err2['source_old'] = "Additional ID dictionary 2019-09-13"
err2.rename(columns={'Study Specific #_y': 'publicID_AcuteRoster', 'Study Specific #_x': 'publicID_old'}, inplace = True)
# [3: Acute Lassa ID list]  ----------------------------------------------------------------------------------------------------
lassa_ids = pd.read_excel("/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/input_data/patient_rosters/acuteLassa_IDdict_v2_2019-03-27_PRIVATE.xlsx")

lassa_ids['gID_arr'] = lassa_ids["Original G No."].apply(helpers.splitGID) # Removes timepoint
lassa_ids['gID'] = lassa_ids.gID_arr.apply(lambda x: x[0])

merged3 = pd.merge(lassa_ids, ids, how="left", on="gID", indicator=True)

# all merge
merged3._merge.value_counts()

merged3.head()

# checking if study specific numbers match...
merged3['match'] = merged3.apply(lambda row: row["Study Specific #_x"] == row["Study Specific #_y"], axis=1)

merged3.match.value_counts()
err3 = merged3.loc[~ merged3.match, ['gID', "Year", 'Study Specific #_x', 'Study Specific #_y']]
err3['source_old'] = "Acute Lassa ID Roster 2019-03-27"
err3.rename(columns={'Study Specific #_y': 'publicID_AcuteRoster', 'Study Specific #_x': 'publicID_old'}, inplace = True)

# [4: Acute Lassa metadata]  ----------------------------------------------------------------------------------------------------
lassa = pd.read_csv("/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/input_data/patient_rosters/acuteLassa_patientdata_v2_2019-06-12_PRIVATE.csv")

lassa['gID'] = lassa.gid.apply(helpers.interpretID)

merged4 = pd.merge(lassa, ids, how="left", on="gID", indicator=True)

 # all merge....
merged4._merge.value_counts()

# checking if study specific numbers match...

merged4['match'] = merged4.apply(lambda row: row["Study Specific #"] == row["studyid_en"], axis=1)

with_publicid = merged4[merged4['studyid_en'] == merged4['studyid_en']]
with_publicid.match.value_counts()
df.shape
(262+55)/(3347+2690)
(55)/(3347+2690)
err4 = with_publicid.loc[~ with_publicid.match, ['gID', 'Year', 'Study Specific #', 'studyid_en']]
err4['source_old'] = "Acute Lassa Patient Data 2019-06-12"
err4.rename(columns={'Study Specific #': 'publicID_AcuteRoster', 'studyid_en': 'publicID_old'}, inplace = True)

def getsource_old(row):
    if(row.source_old_x == row.source_old_x):
        if(row.source_old_y == row.source_old_y):
            return(f"{row.source_old_x}; {row.source_old_y}")
        else:
            return(row.source_old_x)
    else:
        return(row.source_old_y)
errs = pd.merge(err3, err4, how="outer", indicator=True, on=["publicID_old", "publicID_AcuteRoster", "gID", "Year"])

errs['source_old'] = errs.apply(getsource_old, axis = 1)
errs.groupby("source_old")._merge.value_counts()
errs = pd.concat([err2, errs])
errs.sample(4)

errs.sort_values("gID", inplace=True)
errs[['gID', 'Year', "publicID_AcuteRoster", "publicID_old", "source_old"]].to_csv("/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/output_data/patients/inconsistencies/2019-11-05_publicID_discrepancies.csv", index=False)
ids.shape
errs.sample(4)
