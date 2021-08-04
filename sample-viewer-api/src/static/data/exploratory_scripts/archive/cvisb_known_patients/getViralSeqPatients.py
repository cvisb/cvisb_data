import pandas as pd

import os
os.chdir("/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/")
# Helper functions for cleanup...
import helpers

viral_ebola = "/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/input_data/expt_summary_data/viral_seq/survival_dataset_ebov_02262019.csv"
viral_lassa = "/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/input_data/expt_summary_data/viral_seq/survival_dataset_lasv_04112019.csv"

ebv = pd.read_csv(viral_ebola)
lsv = pd.read_csv(viral_lassa)


cols2save = ['patientID', 'cohort', 'outcome', 'country', 'source']




# [clean ebola]  ----------------------------------------------------------------------------------------------------
ebv['cohort'] = "Ebola"
ebv['source'] = "ViralSeq_Raphaelle_EBV02262019"
ebv['outcome_input'] = ebv.outcome
ebv['outcome'] = ebv.outcome_input.apply(helpers.cleanOutcome)
ebv['country'] = ebv.country.apply(helpers.getCountryName)
ebv['patientID'] = ebv.sample_id.apply(helpers.interpretID)


ebv = ebv[cols2save]
ebv['kgh']= ebv.patientID.apply(helpers.checkIDstructure).apply(lambda x: not x)

ebv.kgh.value_counts()


# [clean lassa]  ----------------------------------------------------------------------------------------------------
lsv['cohort'] = "Lassa"
lsv['source'] = "ViralSeq_Raphaelle_LSV04112019"

lsv['outcome_input'] = lsv.outcome
lsv['outcome'] = lsv.outcome_input.apply(helpers.cleanOutcome)
lsv['country'] = lsv.country.apply(helpers.getCountryName)
lsv['patientID'] = lsv.sample_id.apply(helpers.interpretID)


lsv = lsv[cols2save]

# [concat!]  ----------------------------------------------------------------------------------------------------

viralseq = pd.concat([lsv, ebv])

viralseq.sample(10)
