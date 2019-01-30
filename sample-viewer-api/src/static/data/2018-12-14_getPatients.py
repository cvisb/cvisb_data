import pandas as pd
import os as os
os.getcwd()
os.chdir("/Users/laurahughes/GitHub/sample_viewer_web/sample-viewer-api/src/static/data")
import getHLApatients as hla

from getHLApatients import hla_df

output_file = "/Users/laurahughes/GitHub/sample_viewer_web/sample-viewer/src/assets/data/patients.json"

# Import sample list, June/July 2018  ----------------------------------------------------------------------------------------------------
sample_file = "/Users/laurahughes/GitHub/sample_viewer_web/sample-viewer-api/src/static/data/2018-12-18- master sample list Jun-Jul-18.xlsx"
samples = pd.read_excel(sample_file, skiprows=0)

samples.head()

samples.rename(columns={'number': 'patientID'}, inplace=True)

samples.dropna(how='all', inplace=True)
samples['cohort'], samples['outcome'] = samples['patient type'].str.split(' ', 1).str

# clean and standardize values.
samples.cohort = samples.cohort.apply(lambda x: hla.cleanCohort(x))
samples.outcome = samples.outcome.apply(lambda x: hla.cleanOutcome(x))
# Hard coding; samples from this date all from SLE.
samples['country'] = "Sierra Leone"

samples.outcome.value_counts()

samples = samples[['patientID', 'cohort', 'outcome', 'country']]
# Import serology data  ----------------------------------------------------------------------------------------------------
serology_file = "/Users/laurahughes/GitHub/sample_viewer_web/sample-viewer-api/src/static/data/2018-04-12_systemsSerology.xlsx"

sero = pd.read_excel(serology_file)
sero.rename(columns={'ID ': 'alternateIdentifier'}, inplace=True)
sero.columns
def getID(row):
    if (pd.isnull(row['Sample ID'])):
        print(row.alternateIdentifier)
        return(row.alternateIdentifier)
    else:
        print(row['Sample ID'])
        return(row['Sample ID'])

sero.patientID
sero['patientID'] = sero.apply(lambda row: getID(row), axis=1)
sero.dropna(subset=['patientID'], inplace=True) # Remove standards
sero.iloc[0]
sero.head()
sero.Group.value_counts()


def getSeroGroup(x):
    if(x == "Ebola and Lassa Negative"):
        return("control")
    elif(x == "Ebola Survivor"):
        return("Ebola")
    elif(x == "Lassa Survivor, Ebola negative"):
        return("Lassa")
    elif(x == "Household Contact"):
        return("Ebola")
    else:
        return()

def getSeroOutcome(x):
    if(x == "Ebola and Lassa Negative"):
        return("control")
    elif(x == "Ebola Survivor"):
        return("Survivor")
    elif(x == "Lassa Survivor, Ebola negative"):
        return("Survivor")
    elif(x == "Household Contact"):
        return("contact")
    else:
        return()

sero.cohort = sero.Group.apply(lambda x: getSeroGroup(x))
sero.outcome = sero.Group.apply(lambda x: getSeroOutcome(x))

sero.cohort.value_counts()
sero.outcome.value_counts()

sero.head()
# Collapse down to the patient level; add timepoints and serology data
# TODO: add dates if I can
#


# Merge together all the patients, and export  ----------------------------------------------------------------------------------------------------
df = pd.merge(hla_df, samples, how="outer", on=["patientID", "cohort", "outcome", "country"], indicator=True)
df.country = df.country.apply(lambda x: hla.cleanCountry(x))

df.cohort.value_counts()
# Good: nothing merged, as expected
df['_merge'].value_counts()

df.patientID.sort_values()
df[df['_merge']=="both"]

hla_df[hla_df.patientID == "SMS7020"]
# hla_df.to_json(output_file, orient='records')
df.drop('_merge', axis=1).to_json(output_file, orient='records')

# Try to match contacts w/ their mates  ----------------------------------------------------------------------------------------------------
