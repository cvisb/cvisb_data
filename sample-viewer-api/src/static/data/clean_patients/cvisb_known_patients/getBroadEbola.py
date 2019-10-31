import pandas as pd
import os
os.chdir("/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/")
# Helper functions for cleanup...
import helpers

# [Broad's list of acute Ebola patients]  ----------------------------------------------------------------------------------------------------
ebv_file = "/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/input_data/patient_rosters/EbolaEra_AcuteMetadata_Merged_20190509.tsv"

ebv = pd.read_table(ebv_file)

# Fix one ID
ebv['ID_orig'] = ebv.ID
ebv['patientID'] = ebv.ID_orig.apply(helpers.interpretID)
ebv['KGH_id'] = ebv.ID.apply(helpers.checkIDstructure).apply(lambda x: not x)
ebv['acuteEbola'] = True
ebv['source'] = "Broad_Ebola"
ebv['outcome'] = ebv.Outcome.apply(helpers.cleanOutcome)
ebv['cohort'] = "Ebola"
