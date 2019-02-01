# Script to take .csv from Karthik containing HLA calls and morph it into the correct format for use in HLA summary graphs.
# Mainly: standardize variable names, classifications
# And convert to a long dataset from wide
import pandas as pd
import os
os.chdir("/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data")
from getHLApatients import cleanCohort, cleanOutcome, cleanCountry, getAltIDs

import_path = "/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/2019-01-29_Genotype_calls.csv"
export_path = "/Users/laurahughes/GitHub/cvisb_data/sample-viewer/src/assets/data/hla_data.json"

# Import HLA dataset
df = pd.read_csv(import_path)

df.head()


# rename columns
df.drop(['Unnamed: 0', 'Typing Institution'], axis=1, inplace=True)
df.rename(columns={'ID': 'patientID',
                   'Alternative ID': 'alternateIdentifier'}, inplace=True)


# standardize categories
df['alternateIdentifier'] = df['alternateIdentifier'].apply(lambda x: getAltIDs(x))
df['outcome'] = df['Outcome'].apply(lambda x: cleanOutcome(x))
df['cohort'] = df['Status '].apply(lambda x: cleanCohort(x))
df['country'] = df['Location']
df.drop(['Location', 'Outcome', 'Status '], axis=1, inplace=True)
# lengthen dataset
df_long = pd.melt(df, id_vars=['patientID', 'alternateIdentifier', 'outcome', 'cohort', 'country'], var_name="locus", value_name="allele")
df_long.sample(4)


# Clean up loci, undefined calls, and novel status
def findNovel(allele):
    loc = str(allele).find("@")
    return(loc > 0)

def cleanLoci(locus):
    return(locus.replace(".1", ""))


df_long['novel'] = df_long.allele.apply(findNovel)
df_long['locus'] = df_long.locus.apply(cleanLoci)

df_long.allele.replace(r'\-', pd.np.nan, regex=True, inplace= True)
# From 2019-01-09 calls: 1095 '-' + 213 NaNs.
df_long.allele.value_counts(dropna=False)

# Export
# Expected output: [{"outcome":"control","Status":"Control","ID":"testpatient","loci":"A","allele":"A*340201","novel":false}]
df_long.to_json(export_path, orient='records')
