import pandas as pd

import os
os.chdir("/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/clean_patients")

import helpers

df = pd.read_excel("/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/input_data/patient_rosters/unnamed originals/CViSB samples_systemsserology.xlsx")

df.shape
df.head()

# Convert IDs to standardized format
df['privatePatientID'] = df["sampleID"].apply(helpers.interpretID)

# Manually fix weird IDs:
# S434A is actually S434, and B is S435
df.loc[df['privatePatientID'] == 'S-434-A', 'privatePatientID'] = "S-434"
df.loc[df['privatePatientID'] == 'S-434-B', 'privatePatientID'] = "S-435"


# id dictionary
ids = pd.read_json("/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/output_data/patients/patients_2019-09-13_PRIVATE_dict.json")
ids.reset_index(inplace=True)
ids.head()
merged = pd.merge(df, ids, how="left", left_on="privatePatientID", right_on="index", indicator=True)

merged._merge.value_counts()
df[merged._merge == 'left_only']

# Remove extra cols
merged.drop(['_merge', 'index', 'privatePatientID', 'alternateIdentifier', 'issue'], axis=1, inplace=True)

merged[['sampleID', 'patientID']].to_csv("/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/clean_patients/exploratory_scripts/2019-10-10_CViSB_samples_systemsserology_ids.csv", index=False)
merged.to_csv("/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/clean_patients/exploratory_scripts/2019-10-10_CViSB_samples_systemsserology_patientData.csv", index=False)
