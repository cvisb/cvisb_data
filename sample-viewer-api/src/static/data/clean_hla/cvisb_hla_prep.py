# Script to take .csv from Karthik containing HLA calls and morph it into the correct format for use in HLA summary graphs.
# Mainly: standardize variable names, classifications
# And convert to a long dataset from wide
import pandas as pd
import os
os.chdir("/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/clean_patients/cvisb_patient_roster")
from getHLApatients import cleanCohort, cleanOutcome, cleanCountry, getAltIDs
import re

import_path = "/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/input_data/expt_summary_data/HLA/HLA_genotypeCalls_v1_2019-01-09_PRIVATE.csv"
# import_path = "/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/2019-01-29_Genotype_calls.csv"
export_path = "/Users/laurahughes/GitHub/cvisb_data/sample-viewer/src/assets/data/hla_data.json"

# Import HLA dataset
df = pd.read_csv(import_path)

# df.head()


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
    # Verified with Karthik that 1951 is G-1951 (1 April 2019)
    g1951 = re.match("^(1951)$", id)
    if g1951:
        return("G-" + g1951[1])
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

df['privateID'] = df.ID.apply(interpretID)
# df_long.privateID.value_counts(dropna = False)
# df_long[df_long.privateID != df_long.privateID].ID.value_counts()


# get the lookup values
os.chdir("/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/")
from EbolaPatientmetadataclean20190307 import id_dict
df.columns
# Randomize order.
df.sort_values(by=["A"], inplace = True)

counter = 0

def getPublicID(id):
    global counter
    try:
        return(id_dict[id]['patientID'])
    except:
        counter += 1
        return("id" + str(counter))
df['patientID'] = df.privateID.apply(getPublicID)

df[['ID', 'alternateIdentifier', 'privateID', 'patientID']]
df[(df.cohort == "Ebola") & (df.outcome == 'survivor')][['ID', 'alternateIdentifier', 'privateID', 'patientID']]

df.patientID.value_counts()

# Two IDs have exactly the same HLA call...
df[df.duplicated(keep=False,subset=["A", "A.1", "B", "B.1", "C", "C.1", "DPA1","DRB4","DRB4.1", "DRB5", "DRB5.1", "DPA1.1", "DPB1", "DPB1.1", "DQA1", "DQA1.1", "DQB1", "DQB1.1", "DRB1", "DRB1.1", "DRB3", "DRB3.1"])]



columns

df.drop(['ID', 'alternateIdentifier', 'privateID'], axis=1, inplace=True)


# lengthen dataset
df_long = pd.melt(df, id_vars=['patientID', 'outcome', 'cohort', 'country'], var_name="locus", value_name="allele")
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

df[~df.patientID.str.contains("^id")].patientID.to_csv("hla_publicids.csv", index=False)
# Export
# Expected output: [{"outcome":"control","Status":"Control","ID":"testpatient","loci":"A","allele":"A*340201","novel":false}]
df_long.to_json(export_path, orient='records')
