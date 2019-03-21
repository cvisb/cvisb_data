# Script to take .csv from Karthik containing HLA calls and morph it into the correct format for use in HLA summary graphs.
# Mainly: standardize variable names, classifications
# And convert to a long dataset from wide
import pandas as pd
import os
os.chdir("/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data")
from getHLApatients import cleanCohort, cleanOutcome, cleanCountry, getAltIDs
import re

import_path = "/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/2019-01-09_Genotype_calls_PRIVATE.csv"
# import_path = "/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/2019-01-29_Genotype_calls.csv"
export_path = "/Users/laurahughes/GitHub/cvisb_data/sample-viewer/src/assets/data/hla_data.json"

# Import HLA dataset
df = pd.read_csv(import_path)

df.head()


# rename columns
df.drop(['Typing Institution'], axis=1, inplace=True)
# df.drop(['Unnamed: 0', 'Typing Institution'], axis=1, inplace=True)
df.rename(columns={
                   'Alternative ID': 'alternateIdentifier'}, inplace=True)
# df.rename(columns={'ID': 'patientID',
#                    'Alternative ID': 'alternateIdentifier'}, inplace=True)


# standardize categories
df['alternateIdentifier'] = df['alternateIdentifier'].apply(lambda x: getAltIDs(x))
df['outcome'] = df['Outcome'].apply(lambda x: cleanOutcome(x))
df['cohort'] = df['Status '].apply(lambda x: cleanCohort(x))
df['country'] = df['Location']
df.drop(['Location', 'Outcome', 'Status '], axis=1, inplace=True)
# lengthen dataset
df_long = pd.melt(df, id_vars=['ID', 'alternateIdentifier', 'outcome', 'cohort', 'country'], var_name="locus", value_name="allele")
df_long.sample(14)


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


# Merge and remove private IDs
# Add in hyphens to G-ids, fix weird C-ids.
def interpretID(id):
    id = str(id)
    # Interpret ID based on regex patterns
    # Assuming C1-496-2 == C[visit number]-[id number]-[household number]
    # Therefore deleting the visit code
    weirdC = re.match("^(C)([0-9])(\-[0-9][0-9][0-9]\-[0-9])$", id)
    if weirdC:
        return(weirdC[1] + weirdC[3])
    weirderC = re.match("^(C)([0-9])(\-[0-9][0-9][0-9])$", id)
    if weirderC:
        return(weirderC[1] + weirderC[3] + "-" + weirderC[2])
    gID = re.match("^(G)([0-9][0-9][0-9][0-9])$", id)
    if gID:
        return(gID[1] + "-" + gID[2])
    goodS = re.match("^(S)\-([0-9][0-9][0-9])$", id)
    if goodS:
        return(goodS[1] + "-" + goodS[2])
    goodC = re.match("^(C)\-([0-9][0-9][0-9])$", id)
    if goodC:
        return(goodC[1] + "-" + goodC[2])
    nohyphen = re.match("^(S)([0-9][0-9][0-9])$", id)
    if nohyphen:
        return(nohyphen[1] + "-" + nohyphen[2])

    return(pd.np.nan)

df_long['privateID'] = df_long.ID.apply(interpretID)
2684/22
df_long.privateID.value_counts(dropna = False)
df_long[df_long.privateID != df_long.privateID].ID.value_counts()

# Export
# Expected output: [{"outcome":"control","Status":"Control","ID":"testpatient","loci":"A","allele":"A*340201","novel":false}]
df_long.to_json(export_path, orient='records')
