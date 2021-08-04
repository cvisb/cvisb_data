import pandas as pd
import os
os.chdir("/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/clean_patients/")

import cvisb_known_patients.getHLApatients as hla

sample_dir = "/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/input_data/cvisb_random_rosters/"

# Import sample list, June/July 2018  ----------------------------------------------------------------------------------------------------
sample_file = sample_dir + "Final - master sample list Jun-Jul-18x_Matthias_PRIVATE.xlsx"
samples1 = pd.read_excel(sample_file, skiprows=0)

samples1.head()

samples1.rename(columns={'number': 'patientID'}, inplace=True)

samples1.dropna(how='all', inplace=True)
samples1['cohort'], samples1['outcome'] = samples1['patient type'].str.split(' ', 1).str

# clean and standardize values.
samples1.cohort = samples1.cohort.apply(lambda x: hla.cleanCohort(x))
samples1.outcome = samples1.outcome.apply(lambda x: hla.cleanOutcome(x))
# Hard coding; samples1 from this date all from SLE.
samples1['country'] = "Sierra Leone"

samples1.outcome.value_counts()

samples1 = samples1[['patientID', 'cohort', 'outcome', 'country']]

samples1['source'] = 'samples_July2018'

# Import sample list, January 2019  ----------------------------------------------------------------------------------------------------
# Long version, in a format that I specified.
sample2_file = sample_dir + "January2019samples_forlaura_rk1_mp_Matthias_PRIVATE.xlsx"
samples2 = pd.read_excel(sample2_file, skiprows=0)

samples2.head()
samples2.shape
samples2.dropna(subset=['patientID'], inplace=True)

samples2 = samples2[['patientID', 'alternateIdentifier', 'cohort', 'outcome', 'country', 'sampleLabel']]

samples2 = samples2.groupby(['patientID']).agg({'sampleLabel':lambda x: list(x)}).reset_index()
samples2
samples2['source'] = 'samples_January2019'

# Wide version, requiring cleanup.
sample3_file = sample_dir + "PBMC collection list Jan 2019_Matthias_PRIVATE.xlsx"
samples3 = pd.read_excel(sample3_file, skiprows=2)
samples3['source'] = 'samples_January2019'
samples3

samples3['Status'], samples3['Outcome'] = samples3['patient type'].str.split(' ', 1).str
samples3.Status = samples3.Status.apply(lambda x: str(x))
samples3['cohort'] = samples3.Status.apply(lambda x: hla.cleanCohort(x))


def findOutcome(x):
    if x == "contact":
        return("contact")
    else:
        return("survivor")

samples3['outcome'] = samples3.Outcome.apply(lambda x: findOutcome(x))
samples3.outcome.value_counts()
samples3.rename(columns={'number': 'patientID'}, inplace = True)
samples3 = samples3[['patientID', 'cohort', 'outcome', 'source']]
samples3.head()

# Merge together the two versions of the sample list from January 2019.
samples4 = pd.merge(samples2, samples3, how='outer', indicator=True)
samples4.head()

# Looks like nothing merges!
samples4['_merge'].value_counts()

samples4.drop('_merge', axis=1, inplace=True)

# Merge together
samples = pd.concat([samples1, samples4])

samples
