# <<< check_roster_coverage.py >>>
# @name:        check_roster_coverage.py
# @summary:     Quick function to create crosstabs of CViSB patient universe and holes
# @description:
# @inputs:
# @outputs:
#

import pandas as pd
import os
os.chdir("/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/clean_patients/")
# Helper functions for cleanup...
import helpers


cvisb_file = "/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/input_data/cvisb_random_rosters/CViSB_knownpatients_cleaned_20190510_PRIVATE.json"
# cvisb_file = "/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/input_data/cvisb_random_rosters/CViSB_knownpatients_cleaned_PRIVATE.json"


# [ID rosters] ------------------------------------------------------------------------------------------
id_dict = "/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/output_data/patients/patients_2019-05-10_PRIVATE_dict.json"

ids = pd.read_json(id_dict)

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


# [merge]  ----------------------------------------------------------------------------------------------------

merged = pd.merge(cvisb, ids, how="left", indicator=True, on="ID")

merged._merge.value_counts()

merged[merged.KGH_id]._merge.value_counts(dropna=False)
merged[(merged._merge == "left_only") & merged.KGH_id].cohort_x.value_counts(dropna=False)


merged[(merged._merge == "left_only") & merged.KGH_id].sort_values(["cohort_x", "ID"]).to_csv('/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/output_data/patients/inconsistencies/2019-05-10_CViSBknownpatients_noPublicID.csv', index=False)
