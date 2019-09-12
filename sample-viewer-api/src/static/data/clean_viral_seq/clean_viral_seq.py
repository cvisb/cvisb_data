# Imports and cleans viral sequencing data, to throw into Angular app.
# Does a bunch of things:
# 1) standardizes all inputs to conform with schema
# 2) creates a series of Experiment objects to store the experimental data with experiment IDs
# 3) creates a series of Patient objects for patients who are not in the KGH roster.
# 4) creates a series of Samples for all the experiments.

import pandas as pd
from Bio import SeqIO
# from Bio import Phylo
import os
import re
from datetime import datetime

# [File locations]  ----------------------------------------------------------------------------------------------------
# inputs
lassaS_AAfile = "/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/input_data/expt_summary_data/viral_seq/LASV_curated_aln_2019.09.11_duplicates_public.translated.fasta"
lassaS_Alignedfile = "/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/input_data/expt_summary_data/viral_seq/LASV_curated_aln_2019.09.11_duplicates_public.fasta"
lassaS_Rawfile = "/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/input_data/expt_summary_data/viral_seq/LASV_curated_aln_2019.09.11_duplicates_public.fasta"
# lassaS_AAfile = "/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/input_data/expt_summary_data/viral_seq/LASV_S_curated_aln_2019.09.04_public.translated.fasta"
# lassaS_Alignedfile = "/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/input_data/expt_summary_data/viral_seq/LASV_S_curated_aln_2019.09.04_public.fasta"
# lassaS_Rawfile = "/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/input_data/expt_summary_data/viral_seq/LASV_S_aln_all_seq_2019.09.02_public.fasta"
lassa_MDfile = "/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/input_data/expt_summary_data/viral_seq/LASV_dataset.2019.09.06.csv"
id_dict = "/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/output_data/patients/patients_2019-05-15_PRIVATE_dict.json"
# id_dict = "/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/output_data/patients/patients_2019-09_12_PRIVATE_dict.json"

# Outputs
output_dir = "/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/output_data"
log_dir = f"{output_dir}/log"


exptCols = ['privatePatientID', 'experimentID', 'genbankID', 'sampleID',
            'measurementTechnique', 'publisher', 'citation', 'data', 'inAlignment',
            'updatedBy', 'dateModified', 'cvisb_data']
# for non-KGH patients
patientCols = ["patientID", "alternateIdentifier", "hasPatientData", "hasSurvivorData",
               "dateModified", "updatedBy", "cohort", "outcome", "country", "infectionYear", "species"]

# For all experiments, to relate sample <--> experiment
sampleCols = ["creatorInitials", "sampleLabel", "sampleType", "species", "sampleID", "samplingDate"]

# For all experiments with accession numbers, generate data downloads
downloadCols = ["name", "includedInDataset", "identifier", "contentUrl", "additionalType", "measurementTechnique", "dateModified", "experimentIDs", "contentUrlRepository", "contentUrlIdentifier", "citation", "updatedBy"]

# keep as np.nan if want to use today's date
dateModified = "2019-09-04"
updatedBy = "Raphaelle Klitting"
source = "ViralSeq_RK"

# [Import helper functions]  ----------------------------------------------------------------------------------------------------
os.chdir("/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/clean_patients/")
# Helper functions for cleanup...
import helpers

# [Commonalities]  ----------------------------------------------------------------------------------------------------
today = datetime.today().strftime('%Y-%m-%d')

if(dateModified != dateModified):
    dateModified = today


def getPublisher(row, varName="cvisb_data"):
    # Check binary if CVISB_data
    if(row[varName]):
        return([{
            "@type": "Organization",
            "url": "https://cvisb.org/",
            "name": "Center for Viral Systems Biology",
            "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "technical support",
                "url": "https://cvisb.org/",
                "email": "info@cvisb.org"
            }
        }])


def getDNAseq(all_seq, df, df_id, virus, seq_type="DNAsequence", segment=pd.np.nan):
    for seq in all_seq:
        id = seq.id.split("|")[0]
        if(sum(df[df_id] == id) == 0):
            log_notes.append(f"no patient found in sequence metadata file for sequence {seq.id}")
        seq_obj = [{seq_type: str(seq.seq).upper(), "virus": virus, "segment": segment}]
        df.at[df[df_id] == id, 'data'] = seq_obj
    return(df)

def getAltIDs(row):
    ids = list(set([row.patientID, row.privatePatientID]))
    return(ids)

def getPublicID(row):
    if(row.patientID == row.patientID):
        return(row.patientID)
    # If it looks like a KGH ID but doesn't have a public study specific number in the ID roster, return null --> error
    elif(row.KGH_id):
        return(pd.np.nan)
    else:
        return(row.privatePatientID)

# Need to parse the ID into the patient component-- everything except the last two _ segments
# HOWEVER-- while this is required for KGH ids to get back to a patient id--
# it doesn't work for other places, since they repeat the same patient stub for different patients.
# so sticking with the original (verbose) id
def getPrivateID(row):
    if(row.KGH_id):
        return(helpers.interpretID(row.rawID))
    else:
        dupe_id = re.search("(.+)(\.\d)(.+)",row.id)
        # Assuming "id.2" is the same person as "id"
        if(dupe_id):
            return(dupe_id[1] + dupe_id[3])
        return(row.id)

# Experiment IDs should be unique... so adding back in .2 if it's a longitudinal sample.
def getExptID(row, expt_stub = "LASV_seq_"):
    dupe_id = re.search("(.+)(\.\d)(.+)",row.id)
    # Assuming "id.2" is the same person as "id"
    if(dupe_id):
        return(expt_stub + row.patientID + dupe_id[2])
    return(expt_stub + row.patientID)

# initialize log file
global log_notes
log_notes = []

# [IDs from KGH]  ----------------------------------------------------------------------------------------------------
ids = pd.read_json(id_dict)

ids.reset_index(inplace=True)
ids.rename(columns={'index': 'ID'}, inplace=True)

# Import and clean data  ----------------------------------------------------------------------------------------------------
# [Lassa]  ----------------------------------------------------------------------------------------------------
# Lassa data stored in 4 files:
# metadata file: contains any patient information known about them.  includes both S and L alignments.
log_notes.append("Starting cleaning of Lassa viral sequences")
lsv = pd.read_csv(lassa_MDfile)
lsv.head()
lsv["rawID"] = lsv.id.apply(lambda x: "_".join(x.split("_")[0:-2]))
lsv['KGH_id'] = lsv.rawID.apply(helpers.checkIDstructure).apply(lambda x: not x)
lsv['privatePatientID'] = lsv.apply(getPrivateID, axis = 1)


# Check for duplicates
num_dupes = sum(lsv.duplicated(subset="privatePatientID", keep=False))
if(num_dupes > 0):
    log_notes.append(f"{num_dupes} duplicate privatePatientIDs found in viral sequences:")
    log_notes.append(lsv.loc[lsv.duplicated(subset="privatePatientID", keep=False), ['id', 'privatePatientID']].sort_values("privatePatientID"))
    log_notes.append("*"*100)
num_dupes = sum(lsv.duplicated(subset="id", keep=False))
if(num_dupes > 0):
    log_notes.append(f"{num_dupes} duplicate ids found in viral sequences:")
    log_notes.append(lsv.loc[lsv.duplicated(subset="id", keep=False), ['id', 'privatePatientID']].sort_values("privatePatientID"))
    log_notes.append("*"*100)

lsv['outcome_copy'] = lsv.outcome
lsv['outcome'] = lsv.outcome.apply(helpers.cleanOutcome)
lsv.groupby("outcome_copy").outcome.value_counts(dropna=False)

lsv['cohort'] = "Lassa"

# [Merge in ids]  ----------------------------------------------------------------------------------------------------
# Merge in the known set of ids...
lsv = pd.merge(lsv, ids[["ID", "patientID"]], how="left", indicator=True,
# lsv = pd.merge(lsv, ids[["ID", "patientID", "outcome", "cohort", "countryName"]], how="left", indicator=True,
                 right_on="ID", left_on="privatePatientID")

lsv.groupby('KGH_id')._merge.value_counts()

num_missing_pubIDs = sum((lsv.KGH_id) & (lsv._merge == "left_only"))
if(num_missing_pubIDs > 0):
    log_notes.append(f"{num_missing_pubIDs} KGH-esque IDs are missing public IDs in the master KGH roster:")
    log_notes.append(lsv[(lsv.KGH_id) & (lsv._merge == "left_only")][['privatePatientID', 'id']])
    log_notes.append("*"*100)
    log_notes.append("\n")

lsv['patientID'] = lsv.apply(getPublicID, axis = 1)
# Sequence ID in the files is publicID_countryiso3_year
def getSeqID(row):
    if(row.KGH_id):
        return(f"{row.patientID}_{row.country_iso3}_{row.year}")
    else:
        return(row.id)

lsv['seqID'] = lsv.apply(getSeqID, axis = 1)

lsv['alternateIdentifier'] = lsv.apply(getAltIDs, axis = 1)

# lsv['mergeIssue'] = None
# lsv = helpers.checkMerge2(lsv,
#                             mergeCols2Check=['outcome', 'cohort'],
#                             df1_label="Ebola Viral Seq Data", df2_label="Tulane metadata",
#                             mergeCol="ID", dropMerge=False,
#                             errorCol="mergeIssue", leftErrorMsg="", rightErrorMsg="")
# merge issue wrong
# lsv.mergeIssue.value_counts()

# lsv.loc[lsv.KGH_id, ['ID', 'privatePatientID', 'patientID', 'outcome_x', 'outcome_y']]
# sum((lsv_data.countryName_x != lsv_data.countryName_y) &
#     (lsv_data.countryName_y == lsv_data.countryName_y))



lsv['inAlignment'] = lsv.curated
lsv['cvisb_data'] = lsv.CViSB_data
lsv['country'] = lsv.country_iso3.apply(helpers.getCountry)

lsv['countryName'] = lsv.country.apply(helpers.pullCountryName)
lsv.groupby("country_iso3").countryName.value_counts(dropna=False)

lsv['infectionYear'] = lsv.year
lsv['samplingDate'] = lsv.year.apply(helpers.year2Range)

lsv['species'] = lsv.host.apply(helpers.convertSpecies)
lsv.groupby("host").species.value_counts(dropna=False)


# [S-sequence related info]  ----------------------------------------------------------------------------------------------------
lsv_data_seq = list(SeqIO.parse(lassaS_Rawfile, "fasta"))
lsv_data = lsv.copy(deep=True)
lsv_data['data'] = None
lsv_data = getDNAseq(lsv_data_seq, lsv_data, 'seqID', "Lassa", "DNAsequence", "S")

# Remove anything without any seq data
lsv_data = lsv_data[lsv_data.data.apply(lambda x: x is not None)]

lsv_data['experimentID'] = lsv_data.apply(getExptID, axis=1)

num_dupes_expt = sum(lsv_data.duplicated(subset="experimentID", keep=False))
if(num_dupes_expt > 0):
    log_notes.append(f"{num_dupes_expt} duplicate experimentIDs found in viral sequences:")
    log_notes.append(lsv_data.loc[lsv_data.duplicated(subset="experimentID", keep=False), ['id', 'privatePatientID', "experimentID"]].sort_values("privatePatientID"))
    log_notes.append("*"*100)

lsv_data['sampleLabel'] = lsv_data.patientID
lsv_data['genbankID'] = lsv_data.accession_S
lsv_data['seqType'] = "LASV"
# Import AA sequences
# lsv_data_aaseq = list(SeqIO.parse("/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/input_data/expt_summary_data/viral_seq/Sseg_lasv_04102019_aa_aln.fasta", "fasta"))
# lsv_data['data'] = None
# lsv_data = getDNAseq(lsv_data_aaseq, lsv_data, 'sample_id', "Lassa", "AAsequence")
# lsv_data[exptCols].iloc[9].to_json()
# sum(lsv_data.data.apply(lambda x: x is None))
# lsv_data.columns
# lsv_data[['countryName', 'year', 'outcome', 'data', 'privatePatientID']].to_json("/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/output_data/experiments/viral_seq/Sseg_lasv_aa_test.json", orient="records")


# [Ebola]  ----------------------------------------------------------------------------------------------------
# ebv = pd.read_csv(ebv_file)
#
# ebv.head()
# # Ebola: check IDs if they're from KGH. Most are not.
# ebv['privatePatientID'] = ebv.sample_id.apply(helpers.interpretID)
# ebv['KGH_id'] = ebv.sample_id.apply(
#     helpers.checkIDstructure).apply(lambda x: not x)
#
# ebv['outcome'] = ebv.outcome.apply(helpers.cleanOutcome)
# ebv['cohort'] = "Ebola"
# ebv['experimentID'] = ebv.apply(
#     lambda x: "EBV_seq" + str(x.name).zfill(3), axis=1)
# ebv['genbankID'] = ebv.ncbi_accession
# ebv['measurementTechnique'] = "viral sequencing"
# ebv['dateModified'] = today
# ebv['cvisb_data'] = False
# ebv['publisher'] = ebv.apply(getPublisher, axis=1)
# ebv['citation'] = ebv.publisher.apply(helpers.getCitation)
#
# # Read in Ebola sequence data
# ebv_seq = list(SeqIO.parse(
#     "/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/input_data/expt_summary_data/viral_seq/ebola_wg_ntseq_names_02152019_orfs.fasta", "fasta"))
# ebv['data'] = None
# ebv = getDNAseq(ebv_seq, ebv, 'sample_id', "Ebola")
# sum(ebv.data.apply(lambda x: x is None))
#
# ebv[ebv.data.apply(lambda x: x is None)]
# ebv = pd.merge(ebv, ids, how="left", indicator=True,
#                right_on="ID", left_on="privatePatientID")
# ebv.columns
# ebv['mergeIssue'] = None
# ebv = helpers.checkMerge2(ebv,
#                           mergeCols2Check=['outcome', 'cohort'],
#                           df1_label="Ebola Viral Seq Data", df2_label="Tulane metadata",
#                           mergeCol="ID", dropMerge=False,
#                           errorCol="mergeIssue", leftErrorMsg="", rightErrorMsg="")
#
# ebv.mergeIssue.value_counts()
#
# ebv.loc[ebv.mergeIssue == ebv.mergeIssue, ['sample_id', 'ncbi_accession',
#                                            'outcome', 'outcome_x', 'outcome_y', 'cohort', 'cohort_x', 'cohort_y']]
# ebv.groupby('KGH_id')._merge.value_counts()


# [Merge and export: experimental data]  ----------------------------------------------------------------------------------------------------
# expts = pd.concat([ebv, lsv])
expts = lsv_data

# combined, common properties
expts['measurementTechnique'] = "viral sequencing"
expts['dateModified'] = dateModified
expts['updatedBy'] = updatedBy
expts['publisher'] = expts.apply(getPublisher, axis=1)
expts['citation'] = expts.source_PMID.apply(helpers.getCitation)
# patient-specific properties
# Note: not technically true; if a KGH patient, could have patient / survivor data.
# But-- since only uploading the non-KGH patient data, should be fine.
expts['hasPatientData'] = False
expts['hasSurvivorData'] = False

# sample-specific properties
expts['sampleType'] = "viralRNA"
expts['creatorInitials'] = f"{(updatedBy.split(' ')[0][0] + updatedBy.split(' ')[1][0]).lower()}"
expts['sampleID'] = expts.apply(lambda x: f"{x.creatorInitials}-{x.sampleLabel}_{x.sampleType}", axis = 1)

# Make sure arrays are arrays
expts['data'] = expts.data.apply(helpers.listify)
expts['citation'] = expts.citation.apply(helpers.listify)
expts['_source'] = source

# datadownload-specific properties
idVars = list(set(expts.columns) - set(["accession_L", "accession_S"]))
dwnlds = pd.melt(expts, id_vars=idVars, value_vars=["accession_L", "accession_S"], value_name="accession")
dwnlds.dropna(subset=["accession"], axis=0, inplace=True)

dwnlds['name'] = dwnlds.apply(lambda x: x.patientID + "_" + x.accession, axis=1)
dwnlds['identifier'] = dwnlds.apply(lambda x: x.patientID + "_" + x.accession, axis=1)
dwnlds['contentUrl'] = dwnlds.apply(lambda x: "https://www.ncbi.nlm.nih.gov/nuccore/" + x.accession, axis=1)
dwnlds['includedInDataset'] = 'viralseq'
dwnlds['additionalType'] = 'raw data'
dwnlds['experimentIDs'] = dwnlds.experimentID.apply(lambda x: [x])
dwnlds['contentUrlRepository'] = "GenBank"
dwnlds['contentUrlIdentifier'] = dwnlds.accession

# [Export]  ----------------------------------------------------------------------------------------------------
# Experiments
expts[exptCols].to_json(f"{output_dir}/experiments/viral_seq_experiments_{today}.json", orient="records")
# patients
expts.loc[~expts.KGH_id, patientCols].to_json(f"{output_dir}/patients/viral_seq_patients_{today}.json", orient="records")
# samples
expts[sampleCols].to_json(f"{output_dir}/samples/viral_seq_samples_{today}.json", orient="records")
# data downloads
# Make sure only to get the experiment IDs of those in the alignment
expts.loc[expts.inAlignment,['seqType', 'experimentID']].groupby('seqType').experimentID.apply(list).to_json(f"{output_dir}/datadownloads/viral_seq_exptIDs_{today}.json")
dwnlds[downloadCols].to_json(f"{output_dir}/datadownloads/viral_seq_datadownloads_{today}.json", orient="records")

# datasets
dwnlds.identifier.to_json(f"{output_dir}/datasets/viral_seq_accession_downloadIDs_{today}.json", orient="records")

# Write log file
with open(f"{log_dir}/{today}_viral_sequence_cleanup.log", 'w') as f:
    for item in log_notes:
        f.write("%s\n" % item)
