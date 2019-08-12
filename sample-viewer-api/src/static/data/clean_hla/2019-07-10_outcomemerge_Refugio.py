# Script to pull outcome data for most recent HLA data from Refugio
import pandas as pd
import os
os.chdir("/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/clean_patients")
# from getHLApatients import cleanCohort, cleanOutcome, cleanCountry, getAltIDs
import helpers

import_path = "/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/input_data/expt_summary_data/HLA/2019-07-10_CVISB HLA 1_2 Genotype calls.xlsx"

# [Import HLA dataset] ----------------------------------------------------------------------------------
df = pd.read_excel(import_path, skiprows=140)
df.columns
df.head()

# [Clean IDs, add generic properties] -------------------------------------------------------------------
df['privatePatientID'] = df["Sample "].apply(helpers.interpretID)


# [Add in public IDs]  ----------------------------------------------------------------------------------------------------
id_dict = "/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/output_data/patients/patients_2019-06-19_PRIVATE_dict.json"

ids = pd.read_json(id_dict)
ids.reset_index(inplace = True)
ids.rename(columns = {'index': 'privatePatientID'}, inplace = True)

# Merge on ID
df_merged = pd.merge(df, ids, how="left", indicator=True, on="privatePatientID")

df_merged._merge.value_counts()

df_merged.cohort.value_counts(dropna=False)
df_merged.outcome.value_counts(dropna=False)

df_merged[df_merged._merge == "left_only"].sort_values("privatePatientID")['privatePatientID']
df_merged.columns
df_merged.drop(["_merge", "issue", "Outcome ", "Status ", "sID", "gender", "age", "gID", "age", "alternateIdentifier", "elisa", "countryName"], axis=1).to_csv("/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/input_data/expt_summary_data/HLA/2019-07-10_CVISB HLA 1_2 Genotype calls_withOutcomes.csv", index=False)
