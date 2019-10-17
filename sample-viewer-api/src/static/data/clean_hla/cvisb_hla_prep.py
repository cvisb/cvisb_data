# Script to take .csv from Karthik containing HLA calls and morph it into the correct format for use in HLA summary graphs.
# Mainly: standardize variable names, classifications
# And convert to a long dataset from wide
import pandas as pd
import os
os.chdir("/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/clean_patients")
import helpers
import re
from datetime import datetime

# [Static vars] -----------------------------------------------------------------------------------------
dateModified = "2019-09-06"
updatedBy = "Kathik Gangavarapu"
source = "HLA_KG"
today = datetime.today().strftime('%Y-%m-%d')

import_path = "/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/input_data/expt_summary_data/HLA/HLA Genotype_calls_v4_2019-09-06.csv"
# import_path = "/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/input_data/expt_summary_data/HLA/2019-08-05_HLA Genotype calls Run1-18 n362 complete.csv"
# import_path = "/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/input_data/expt_summary_data/HLA/HLA_Genotype_calls_v2_2019-06-04_PRIVATE.csv"
# import_path = "/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/input_data/expt_summary_data/HLA/HLA_genotypeCalls_v1_2019-01-09_PRIVATE.csv"
# import_path = "/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/2019-01-29_Genotype_calls.csv"
export_path = "/Users/laurahughes/GitHub/cvisb_data/sample-viewer/src/assets/data/hla_data.json"
output_dir = f"/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/output_data"
expt_dir = f"{output_dir}/experiments/"
patients_path = f"{output_dir}/patients/HLA_patients_{today}.json"
expt_path = f"{expt_dir}experiments_HLA_{today}.json"
dupes_path = f"/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/output_data/experiments/inconsistencies/experiments_HLA_duplicates_{today}.csv"

exptCols = ['privatePatientID', 'experimentID', 'sampleID',
            'measurementTechnique', 'publisher', 'data',
            'updatedBy', 'dateModified']
# for non-KGH patients
patientCols = ["patientID", "alternateIdentifier", "hasPatientData", "hasSurvivorData",
               "dateModified", "updatedBy", "cohort", "outcome", "country", "infectionYear", "species"]

# For all experiments, to relate sample <--> experiment
sampleCols = ["creatorInitials", "sampleLabel", "sampleType", "species", "sampleID"]

hla_cols = ["A", "A.1", "B", "B.1", "C", "C.1", "DPA1", "DRB4", "DRB4.1", "DRB5","DRB5.1", "DPA1.1", "DPB1", "DPB1.1", "DQA1", "DQA1.1", "DQB1", "DQB1.1", "DRB1", "DRB1.1", "DRB3", "DRB3.1"]

hla_code = {
    "dateModified": "2019-06-03",
    "version": "https://github.com/andersen-lab/lassa-ebola-hla/commit/ea4f9e10fd569c9a21b06d0ab310a7157f1eedd0",
    "codeRepository": "https://github.com/andersen-lab/lassa-ebola-hla",
    "license": "https://opensource.org/licenses/MIT",
    "author": {
        "@type": "Organization",
        "url": "https://andersen-lab.com/",
        "name": "Kristian Andersen laboratory",
        "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "technical support",
            "url": "https://andersen-lab.com/",
            "email": "data@andersen-lab.com"
        }
    }
}

# [helper functions]  ----------------------------------------------------------------------------------------------------
# # Clean up loci, undefined calls, and novel status
def findNovel(allele):
    loc = str(allele).find("@")
    return(loc > 0)


def cleanLoci(locus):
    return(locus.replace(".1", ""))


# [Import HLA dataset] ----------------------------------------------------------------------------------
df = pd.read_csv(import_path)

# [Check for duplicates] --------------------------------------------------------------------------------


# Multiple IDs have exactly the same HLA call...
dupes = df.copy()
# Replace - with NA
for col in hla_cols:
    dupes[col].replace(r'\-', pd.np.nan, regex=True, inplace=True)

exact_dupes = dupes[dupes.duplicated(keep=False, subset=hla_cols)]

exact_dupes
df.shape

# Less conservative estimation of duplication:
# Only looking at first four digits of call, plus sorting
def simplifyAllele(row, hla_cols):
    allele = []
    for col in hla_cols:
        if(row[col] == row[col]):
            call = re.match("([A-z]+\d*\*)(\d\d\d\d)(\d*)", row[col])
            if(call):
                allele.append(call[1] + call[2])
    allele.sort()
    return("_".join(allele))

dupes["genotype"] = dupes.apply(lambda x: simplifyAllele(x, hla_cols), axis = 1)

dupes = dupes[dupes.duplicated(keep=False, subset=["genotype"])]

dupes.to_csv(dupes_path, index=False)

# [Clean IDs, add generic properties] -------------------------------------------------------------------
# rename columns
df.rename(columns={'Alternative ID': 'alternateIdentifier'}, inplace=True)

df['privatePatientID'] = df.ID.apply(helpers.interpretID)
df['patientID'] = df.privatePatientID # with new data, HLA data has already been joined w/ public IDs
df['dateModified'] = dateModified
df['updatedBy'] = updatedBy
df['analysisCode'] = df.apply(lambda x: hla_code, axis = 1)
df['measurementTechnique'] = "HLA sequencing"
df['publisher'] = df["Typing Institution"].apply(helpers.getPublisher)
df['KGH_id'] = df.ID.apply(helpers.checkIDstructure).apply(lambda x: not x)

# standardize categories
df['outcome'] = df['Outcome'].apply(lambda x: helpers.cleanOutcome(x))
df['cohort'] = df['Status '].apply(lambda x: helpers.cleanCohort(x))
df['country'] = df['Location'].apply(lambda x: helpers.getCountry(x))

# Remove unnecessary columns
# df.drop(['Location', 'Outcome', 'Status ', 'Unnamed: 0',
#          'Typing Institution', 'ID'], axis=1, inplace=True)

# Check for duplicates
dupe_cols =  ["privatePatientID", "ID", "gID", "sID", "cohort", "outcome", "Typing Institution"]
dupe_cols.extend(hla_cols)

dupes = df.loc[df.duplicated(subset = ["privatePatientID"], keep=False), dupe_cols].sort_values("privatePatientID")
dupes.duplicated(subset=hla_cols)

# [Add in public IDs]  ----------------------------------------------------------------------------------------------------
# id_dict = "/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/output_data/patients/patients_2019-08-09_PRIVATE_dict.json"
#
# def checkAgree(row, variable):
#     if((row[f"{variable}_x"] == row[f"{variable}_x"]) & (row[f"{variable}_y"] == row[f"{variable}_y"])):
#         if(row[f"{variable}_x"] == row[f"{variable}_y"]):
#             return(True)
#         else:
#             return(False)
#     else:
#         return(True)
#
# ids = pd.read_json(id_dict)
# ids.reset_index(inplace = True)
# ids.rename(columns = {'index': 'privatePatientID'}, inplace = True)

# ids['gid'] = ids.privatePatientID.apply(lambda x: (x[0] == "G") & (len(x) == 6))
# len(ids.privatePatientID[0])
# ids.gid.value_counts()
# ids.head()

# Merge on ID
# df_merged = pd.merge(df, ids, how="left", indicator=True, on="privatePatientID")
# df_merged.columns
# merged_cols = ["patientID", "gID", "sID", "ID", "Location", "Typing Institution", "Outcome", "outcome_y", "outcome_agree", "Status ", "cohort_y", "cohort_agree"]
# merged_cols.extend(hla_cols)
# # Check if the IDs are consistent
# dupe_people = df_merged.loc[df_merged.duplicated(keep=False, subset=["patientID"]) & (df_merged.patientID == df_merged.patientID), merged_cols]
#
# # only two exactly match!
# dupe_people = dupe_people[~dupe_people.duplicated(keep=False, subset=hla_cols)]
# dupe_people.sort_values(["patientID"], inplace=True)
# dupe_people.to_csv("/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/output_data/experiments/inconsistencies/2019-08-13_HLA-same_people_disagreements.csv", index=False)
#
# df_merged.head()
#
# df_merged['outcome_agree'] = df_merged.apply(lambda x: checkAgree(x, "outcome"), axis = 1)
# df_merged['cohort_agree'] = df_merged.apply(lambda x: checkAgree(x, "cohort"), axis = 1)
#
# df_merged.loc[~df_merged.cohort_agree, ['privatePatientID', 'Status ', 'cohort_x', 'cohort_y', 'elisa']].iloc[0]['elisa']
#
# karthik = df_merged.loc[(~df_merged.cohort_agree) | (~df_merged.outcome_agree), ['privatePatientID', 'cohort_agree', 'Status ', 'cohort_x', 'cohort_y', "outcome_agree", "Outcome", 'outcome_x', "outcome_y"]]
# karthik.rename(columns={'cohort_x': 'cohort_HLA', 'outcome_x': 'outcome_HLA', 'cohort_y': 'cohort_tulane', 'outcome_y':'outcome_tulane'}, inplace=True)
# karthik.to_csv("/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/output_data/patients/inconsistencies/2019-07-01_HLA-Tulane_disagreements.csv", index=False)


# [Get public IDs for Karthik]  ----------------------------------------------------------------------------------------------------
# """
# Function to grab the correct public ID.  Should be merged from the ID dictionary
# of KGH IDs; however, for non-KGH ids, they should be the original ID.
#
# Fills in the ID for all patients which aren't merged properly.
# """
# def getPublicID(row):
#     if ((row.patientID != row.patientID) | (row.patientID is None)):
#         if(row.KGH_id):
#             if(row['Study Specific #']):
#                 # All G-ids...
#                 return("G" + row['Study Specific #'])
#             else:
#                 print(f"can't find public ID for patient {row.privatePatientID}")
#                 return(pd.np.nan)
#         else:
#             return(row.privatePatientID)
#     else:
#         return(row.patientID)
#
#
# # Double check that Emily's list of extra study specific numbers don't
# def checkSSN(row):
#     if((row['Study Specific #'] == row['Study Specific #'])):
#         if((row['patientID'] == row['patientID']) & (row.patientID is not None)):
#             return(row['Study Specific #'] != row['patientID'])
#         else:
#             return(False)

# Sadly, there are some KGH IDs missing from the original files... so need to merge/check
# extra_ids = pd.read_csv("/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/input_data/patient_rosters/unnamed originals/StudySpecificNumbersforLaura_20Jun19_EE.csv")
#
# extra_ids.head()
#
# extra_ids.drop(['cohort', 'outcome', 'hasPatientData'], axis = 1, inplace = True)
# pub_ids = df_merged[['ID', 'privatePatientID','patientID', 'KGH_id']]
#
# pub_ids = pd.merge(pub_ids, extra_ids, how="left", left_on="privatePatientID", right_on="gID", indicator=True)
#
# pub_ids._merge.value_counts()
#
# pub_ids.head()
#
# # YAY!  All merge
# pub_ids['studyNumDisagree'] = pub_ids.apply(checkSSN, axis = 1)
#
# pub_ids.studyNumDisagree.value_counts()


# pub_ids[pub_ids.KGH_id & (pub_ids.patientID != pub_ids.patientID)][['ID', 'privatePatientID', 'patientID', "Study Specific #", 'studyNumDisagree']]
#
#
# pub_ids.head()
#
#
# pub_ids['publicID'] = pub_ids.apply(getPublicID, axis = 1)
# pub_ids.publicID.value_counts(dropna=False)
#
#
# pub_ids[['ID', 'publicID']].to_csv(f"{expt_dir}HLA_publicIDs_{today}.csv", index=False)





# [Conversion for database upload]  ----------------------------------------------------------------------------------------------------
df.iloc[3]

# sample-specific properties
df['sampleLabel'] = df.experimentID
df['sampleType'] = "PBMC"
df['creatorInitials'] = f"{(updatedBy.split(' ')[0][0] + updatedBy.split(' ')[1][0]).lower()}"
df['sampleID'] = df.apply(lambda x: f"{x.creatorInitials}-{x.sampleLabel}_{x.sampleType}", axis = 1)

# experiment-specific properties
df['experimentID'] = df.apply(lambda x: f"HLA_{x.experimentID}", axis=1)

# [Convert wide --> long dataset]  ----------------------------------------------------------------------------------------------------
"""
For the /experiment endpoint, convert the wide dataset into a nested object array.
Expected format:
{
data: {
A: [{"A*300101",	"A*300201"}],
B: [{"B*420101",	"B*530101"}],
...
}
}
Original form:
{"patientID":"id12","outcome":"control","cohort":"control","country":"Sierra Leone","locus":"A","allele":"A*020101","novel":false},
"""
longCols = hla_cols.copy()
longCols.extend(["patientID", "cohort", "outcome"])

df_long = pd.melt(df[longCols], id_vars=['patientID', "cohort", "outcome"], var_name="locus", value_name="allele")

df_long['novel'] = df_long.allele.apply(findNovel)
df_long['locus'] = df_long.locus.apply(cleanLoci)

# Check all NANs are really nan
df_long.allele.replace(r'\-', pd.np.nan, regex=True, inplace=True)
# From 2019-01-09 calls: 1095 '-' + 213 NaNs.
# Double check no other '-', etc.
df_long.allele.value_counts(dropna=False)

import json
# Sure there's a less kludgey way to do this, but it gets the job done.
df_agg = df_long.groupby("patientID").apply(lambda x: x.to_json(orient="records"))
df_agg = df_agg.reset_index()
df_agg.rename(columns = {0: 'data'}, inplace = True)
df_agg['data'] = df_agg.data.apply(lambda x: json.loads(x))
# Merge allele calls back into the df object.
df_merged = pd.merge(df, df_agg, how="outer", on="patientID", indicator = True)
df_merged._merge.value_counts()

df_merged['sourceFiles'] = source
# Export
# Expected output: [{"outcome":"control","Status":"Control","ID":"testpatient","loci":"A","allele":"A*340201","novel":false}]
# df_long.to_json(export_path, orient='records')

# [Export patient data]  ----------------------------------------------------------------------------------------------------
# Any patient that isn't a KGH patient needs to be added to /patient with any assoicated data.


# [Patient-specific properties]  ----------------------------------------------------------------------------------------------------
df_merged['species'] = helpers.convertSpecies("human")

# Fix / rename ids
df_merged['alternateIdentifier'] = df_merged.patientID.apply(lambda x: [x])
# Note: not technically true; if a KGH patient, could have patient / survivor data.
# But-- since only uploading the non-KGH patient data, should be fine.
df_merged['hasPatientData'] = False
df_merged['hasSurvivorData'] = False

patients = df_merged.loc[~df_merged.KGH_id, patientCols]


# [Export data]  ----------------------------------------------------------------------------------------------------
# experiments
df_merged[exptCols].to_json(expt_path, orient="records")
# patients
patients.to_json(patients_path, orient="records")
# samples
df_merged[sampleCols].to_json(f"{output_dir}/samples/viral_seq_samples_{today}.json", orient="records")
# data downloads
df_merged.experimentID.to_json(f"{output_dir}/datadownloads/HLA_exptIDs{today}.json", orient="records")
