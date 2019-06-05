# Goal: get ebola/Lassa for Bonnie's plasma samples.
# Simple clean and merge

import pandas as pd

import os
os.chdir("/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/clean_patients")

import helpers

df = pd.read_excel("/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/input_data/sample_rosters/one_offs/CViSB Plasma Samples_Bonnie_2019-06-03.xlsx")

df.shape


df['privatePatientID'] = df["Sample ID"].apply(helpers.interpretID)

# id dictionary
ids = pd.read_json("/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/output_data/patients/patients_2019-06-03_PRIVATE_dict.json")
ids.reset_index(inplace=True)
ids.head()
merged = pd.merge(df, ids, how="left", left_on="privatePatientID", right_on="index", indicator=True)

merged._merge.value_counts()

merged[merged._merge == "left_only"]
merged = merged[['Sample ID', "Date of collection", "Sample type", "cohort", "elisa", "sID", "gID", "patientID"]]
merged.to_csv("/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/input_data/sample_rosters/one_offs/2019-06-03_CViSBplasma_Bonnie.csv", index = False)
