# Quick function to prioritize files for Briney's initial data collection
# Goals: 3xEBV, 3xLSV w/ multiple RNA samples extracted from frozenPBMCs
# sub-goal: anything w/ G/S match


import pandas as pd


filename = "/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/output_data/patients/patients_2019-05-06_PRIVATE.json"

df_raw = pd.read_json(filename)

ids = ["S-126", "S-021", "S-013", "S-036", "S-022", "S-001", "S-031", "S-010", "S-004", "S-034", "S-011", "S-025", "S-024", "S-020", "S-023", "S-053", "S-038", "S-117", "S-111", "S-039", "S-145", "S-041", "S-191", "S-192", "S-116", "S-188", "S-104", "S-005", "S-432", "S-447", "S-140", "S-105"]

df = df_raw[df_raw.sID.isin(ids)].copy()

df['s_g_match'] = df.gID.apply(lambda x: x != None)

df['gstring'] = df.gID.apply(lambda x: x[0].replace("-", ""))


df.groupby('cohort').s_g_match.value_counts(dropna = False)


# Remove those w/o matches, cohort is Unknown
df = df[(df.s_g_match == True) & (df.cohort != 'Unknown')]

lsv = df[df.cohort == 'Lassa']
ebv = df[df.cohort == 'Ebola']

# LSV: filtering by hasPatientData && ELISAs have a value.
lsv.hasPatientData.value_counts()

lsv['numElisas'] = lsv.elisa.apply(lambda x: (x != None) & (x != []))


lsv[lsv.numElisas].gID


# EBV: looking for who has viral seq data. 2 do.
# Everyone has ELISA data.
ebv.hasSurvivorData.value_counts()
viral = pd.read_csv("/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/input_data/expt_summary_data/viral_seq/survival_database_ebov_02152019.csv")



merged = pd.merge(ebv, viral, left_on="gstring", right_on="sample_id")


merged.gstring

ebv.sort_values('gstring').gstring

ebv.to_csv('ebv.csv')

hla = pd.read_csv("/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/input_data/expt_summary_data/HLA/HLA_genotypeCalls_v1_2019-01-09_PRIVATE.csv")

hla.head()

ids2save = ["G-6755", "G-6846", "G-7046", "G-4325", "G-4527"]
ids_stripped = [item.replace("-", "") for item in ids2save]

sids = list(df[df.gstring.isin(ids_stripped)].sID)

ids_stripped

hla_merge = pd.merge(df, hla, left_on="gstring", right_on="ID")
hla_merge2 = pd.merge(df, hla, left_on="sID", right_on="ID")

hla_merge2.shape

hla_merge[hla_merge.cohort == "Ebola"]

# No overlap b/w HLA and the IDs to save.
set(hla_merge2.ID) & set(sids)

df[df.gstring.isin(ids_stripped)].to_csv("/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/output_data/samples/2019-05-06_patientmetadata_Brineyseq.csv", index=False)

loc = pd.read_json('[{"sampleID":"mpS-034-3_frozenPBMC-RNA2018-06-27","privatePatientID":"S-034","visitCode":"3","freezerBox":"CVISB BOX 7","freezerBoxCell":"E2","freezerID":"RMC 8-10","freezerRack":"Rack 5A"},{"sampleID":"mpS-117-4_frozenPBMC-RNA2018-06-27","privatePatientID":"S-117","visitCode":"4","freezerBox":"CVISB BOX 7","freezerBoxCell":"F2","freezerID":"RMC 8-10","freezerRack":"Rack 5A"},{"sampleID":"mpS-111-2_frozenPBMC-RNA2018-06-27","privatePatientID":"S-111","visitCode":"2","freezerBox":"CVISB BOX 7","freezerBoxCell":"F3","freezerID":"RMC 8-10","freezerRack":"Rack 5A"},{"sampleID":"mpS4-111_frozenPBMC-RNA2019-01-27","privatePatientID":"S-111","visitCode":"4","freezerBox":"CVISB BOX 10","freezerBoxCell":"A9","freezerID":"RMC 8-10","freezerRack":"Rack 5A"},{"sampleID":"mpS4-005_frozenPBMC-RNA2019-01-26","privatePatientID":"S-005","visitCode":"4","freezerBox":"CVISB BOX 10","freezerBoxCell":"C7","freezerID":"RMC 8-10","freezerRack":"Rack 5A"},{"sampleID":"mpS6-117_frozenPBMC-RNA2019-01-27","privatePatientID":"S-117","visitCode":"6","freezerBox":"CVISB BOX 10","freezerBoxCell":"E1","freezerID":"RMC 8-10","freezerRack":"Rack 5A"},{"sampleID":"mpS3-447_frozenPBMC-RNA2019-01-27","privatePatientID":"S-447","visitCode":"3","freezerBox":"CVISB BOX 10","freezerBoxCell":"F8","freezerID":"RMC 8-10","freezerRack":"Rack 5A"},{"sampleID":"mpS5-034_frozenPBMC-RNA2019-01-28","privatePatientID":"S-034","visitCode":"5","freezerBox":"CVISB BOX 10","freezerBoxCell":"H7","freezerID":"RMC 8-10","freezerRack":"Rack 5A"},{"sampleID":"mpS-447_frozenPBMC-RNA2018-06-30","privatePatientID":"S-447","visitCode":"","freezerBox":"CVISB BOX 11","freezerBoxCell":"A6","freezerID":"RMC 8-10","freezerRack":"Rack 5A"},{"sampleID":"mpS-005-2_frozenPBMC-RNA2018-06-28","privatePatientID":"S-005","visitCode":"2","freezerBox":"CVISB BOX 11","freezerBoxCell":"C6","freezerID":"RMC 8-10","freezerRack":"Rack 5A"}]')


loc.to_csv("/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/output_data/samples/2019-05-06_sampleloc_Brineyseq.csv", index=False)
