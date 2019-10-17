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
id_dict = "/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/output_data/patients/patients_2019-09-13_PRIVATE_dict.json"

# Outputs
output_dir = "/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/output_data"
log_dir = f"{output_dir}/log"


exptCols = ['privatePatientID', 'experimentID', 'genbankID', 'sampleID', '_source',
            'measurementTechnique', "measurementGroup", "includedInDataset",
            'publisher', 'citation', 'data', 'inAlignment',
            'updatedBy', 'dateModified', 'releaseDate', 'dataStatus', 'cvisb_data']
# for non-KGH patients
patientCols = ["patientID", "alternateIdentifier", "hasPatientData", "hasSurvivorData", "_source",
               "dateModified", "updatedBy", "cohort", "outcome", "country", "infectionYear", "species"]

# For all experiments, to relate sample <--> experiment
sampleCols = ["creatorInitials", "sampleLabel",
              "sampleType", "species", "sampleID", "samplingDate"]

# For all experiments with accession numbers, generate data downloads
downloadCols = ["name", "includedInDataset", "identifier", "contentUrl", "additionalType", "measurementTechnique", "measurementGroup",
                "dateModified", "experimentIDs", "contentUrlRepository", "contentUrlIdentifier", "citation", "updatedBy"]

updatedBy = "Raphaelle Klitting"
source = "ViralSeq_RK"

# [Import helper functions]  ----------------------------------------------------------------------------------------------------
os.chdir("/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/clean_patients/")
# Helper functions for cleanup...
import helpers

# [Commonalities]  ----------------------------------------------------------------------------------------------------
today = datetime.today().strftime('%Y-%m-%d')


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


def getDNAseq(all_seq, df, df_id, virus, seq_type="DNAsequence", segment=pd.np.nan, data_type = "ViralSeqData"):
    for seq in all_seq:
        id = seq.id.split("|")[0]
        if(sum(df[df_id] == id) == 0):
            log_notes.append(
                f"no patient found in sequence metadata file for sequence {seq.id}")
            log_notes.append("*" * 100)
        seq_obj = [{seq_type: str(seq.seq).upper(), "@type": data_type,
                    "virus": virus, "segment": segment}]
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
    # else:
    #     dupe_id = re.search("(.+)(\.\d)(.+)", row.id)
    #     # Assuming "id.2" is the same person as "id"
    #     if(dupe_id):
    #         return(dupe_id[1] + dupe_id[3])
    return(row.id)

# Experiment IDs should be unique... so adding back in .2 if it's a longitudinal sample.


def getExptID(row, expt_stub="LASV_seq_"):
    # dupe_id = re.search("(.+)(\.\d)(.+)", row.id)
    # # Assuming "id.2" is the same person as "id"
    # if(dupe_id):
    #     return(expt_stub + row.patientID + dupe_id[2])
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
lasv = pd.read_csv(lassa_MDfile)
lasv.head()
lasv["rawID"] = lasv.id.apply(lambda x: "_".join(x.split("_")[0:-2]))
lasv['KGH_id'] = lasv.rawID.apply(
    helpers.checkIDstructure).apply(lambda x: not x)
lasv['privatePatientID'] = lasv.apply(getPrivateID, axis=1)


# Check for duplicates
num_dupes = sum(lasv.duplicated(subset="privatePatientID", keep=False))
if(num_dupes > 0):
    log_notes.append(
        f"{num_dupes} duplicate privatePatientIDs found in viral sequences:")
    log_notes.append(lasv.loc[lasv.duplicated(subset="privatePatientID", keep=False), [
                     'id', 'privatePatientID']].sort_values("privatePatientID"))
    log_notes.append("*" * 100)
num_dupes = sum(lasv.duplicated(subset="id", keep=False))
if(num_dupes > 0):
    log_notes.append(f"{num_dupes} duplicate ids found in viral sequences:")
    log_notes.append(lasv.loc[lasv.duplicated(subset="id", keep=False), [
                     'id', 'privatePatientID']].sort_values("privatePatientID"))
    log_notes.append("*" * 100)

lasv['outcome_copy'] = lasv.outcome
lasv['outcome'] = lasv.outcome.apply(helpers.cleanOutcome)
lasv.groupby("outcome_copy").outcome.value_counts(dropna=False)

# static vars
lasv['cohort'] = "Lassa"
lasv['measurementTechnique'] = "Lassa viral sequencing"
lasv['includedInDataset'] = "lassa-viral-seq"
lasv['_source'] = "; ".join([lassaS_AAfile.split("/")[-1], lassaS_Alignedfile.split("/")[-1], lassaS_Rawfile.split("/")[-1], lassa_MDfile.split("/")[-1], id_dict.split("/")[-1] ])

# [Merge in ids]  ----------------------------------------------------------------------------------------------------
# Merge in the known set of ids...
lasv = pd.merge(lasv, ids[["ID", "patientID"]], how="left", indicator=True,
               # lasv = pd.merge(lasv, ids[["ID", "patientID", "outcome", "cohort", "countryName"]], how="left", indicator=True,
               right_on="ID", left_on="privatePatientID")

lasv.groupby('KGH_id')._merge.value_counts()

num_missing_pubIDs = sum((lasv.KGH_id) & (lasv._merge == "left_only"))
if(num_missing_pubIDs > 0):
    log_notes.append(
        f"{num_missing_pubIDs} KGH-esque IDs are missing public IDs in the master KGH roster:")
    log_notes.append(lasv[(lasv.KGH_id) & (lasv._merge == "left_only")][[
                     'privatePatientID', 'id']])
    log_notes.append("*" * 100)
    log_notes.append("\n")

lasv['patientID'] = lasv.apply(getPublicID, axis=1)
# Sequence ID in the files is publicID_countryiso3_year


def getSeqID(row):
    if(row.KGH_id):
        return(f"{row.patientID}_{row.country_iso3}_{row.year}")
    else:
        return(row.id)


lasv['seqID'] = lasv.apply(getSeqID, axis=1)

lasv['alternateIdentifier'] = lasv.apply(getAltIDs, axis=1)

# lasv['mergeIssue'] = None
# lasv = helpers.checkMerge2(lasv,
#                             mergeCols2Check=['outcome', 'cohort'],
#                             df1_label="Ebola Viral Seq Data", df2_label="Tulane metadata",
#                             mergeCol="ID", dropMerge=False,
#                             errorCol="mergeIssue", leftErrorMsg="", rightErrorMsg="")
# merge issue wrong
# lasv.mergeIssue.value_counts()

# lasv.loc[lasv.KGH_id, ['ID', 'privatePatientID', 'patientID', 'outcome_x', 'outcome_y']]
# sum((lasv_data.countryName_x != lasv_data.countryName_y) &
#     (lasv_data.countryName_y == lasv_data.countryName_y))


lasv['inAlignment'] = lasv.curated
lasv['cvisb_data'] = lasv.CViSB_data
lasv['country'] = lasv.country_iso3.apply(helpers.getCountry)

lasv['countryName'] = lasv.country.apply(helpers.pullCountryName)
lasv.groupby("country_iso3").countryName.value_counts(dropna=False)

lasv['infectionYear'] = lasv.year
lasv['samplingDate'] = lasv.year.apply(helpers.year2Range)

lasv['species'] = lasv.host.apply(helpers.convertSpecies)
lasv.groupby("host").species.value_counts(dropna=False)


# [S-sequence related info]  ----------------------------------------------------------------------------------------------------
lasv_data_seq = list(SeqIO.parse(lassaS_Rawfile, "fasta"))
lasv_data = lasv.copy(deep=True)
lasv_data['data'] = None
lasv_data = getDNAseq(lasv_data_seq, lasv_data, 'seqID',
                     "Lassa", "DNAsequence", "S")

# Remove anything without any seq data
lasv_data = lasv_data[lasv_data.data.apply(lambda x: x is not None)]

lasv_data['experimentID'] = lasv_data.apply(getExptID, axis=1)

num_dupes_expt = sum(lasv_data.duplicated(subset="experimentID", keep=False))
if(num_dupes_expt > 0):
    log_notes.append(
        f"{num_dupes_expt} duplicate experimentIDs found in viral sequences:")
    log_notes.append(lasv_data.loc[lasv_data.duplicated(subset="experimentID", keep=False), [
                     'id', 'privatePatientID', "experimentID"]].sort_values("privatePatientID"))
    log_notes.append("*" * 100)

lasv_data['sampleLabel'] = lasv_data.patientID
lasv_data['genbankID'] = lasv_data.accession_S
lasv_data['seqType'] = "LASV"
# Import AA sequences
# lasv_data_aaseq = list(SeqIO.parse("/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/input_data/expt_summary_data/viral_seq/Sseg_lasv_04102019_aa_aln.fasta", "fasta"))
# lasv_data['data'] = None
# lasv_data = getDNAseq(lasv_data_aaseq, lasv_data, 'sample_id', "Lassa", "AAsequence")
# lasv_data[exptCols].iloc[9].to_json()
# sum(lasv_data.data.apply(lambda x: x is None))
# lasv_data.columns
# lasv_data[['countryName', 'year', 'outcome', 'data', 'privatePatientID']].to_json("/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/output_data/experiments/viral_seq/Sseg_lasv_aa_test.json", orient="records")


# [Ebola]  ----------------------------------------------------------------------------------------------------
# ebov = pd.read_csv(ebov_file)
#
# ebov.head()
# # Ebola: check IDs if they're from KGH. Most are not.
# ebov['privatePatientID'] = ebov.sample_id.apply(helpers.interpretID)
# ebov['KGH_id'] = ebov.sample_id.apply(
#     helpers.checkIDstructure).apply(lambda x: not x)
#
# ebov['outcome'] = ebov.outcome.apply(helpers.cleanOutcome)
# ebov['cohort'] = "Ebola"
# ebov['experimentID'] = ebov.apply(
#     lambda x: "ebov_seq" + str(x.name).zfill(3), axis=1)
# ebov['genbankID'] = ebov.ncbi_accession
# ebov['measurementTechnique'] = "viral sequencing"
# ebov['dateModified'] = today
# ebov['cvisb_data'] = False
# ebov['publisher'] = ebov.apply(getPublisher, axis=1)
# ebov['citation'] = ebov.publisher.apply(helpers.getCitation)
#
# # Read in Ebola sequence data
# ebov_seq = list(SeqIO.parse(
#     "/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/input_data/expt_summary_data/viral_seq/ebola_wg_ntseq_names_02152019_orfs.fasta", "fasta"))
# ebov['data'] = None
# ebov = getDNAseq(ebov_seq, ebov, 'sample_id', "Ebola")
# sum(ebov.data.apply(lambda x: x is None))
#
# ebov[ebov.data.apply(lambda x: x is None)]
# ebov = pd.merge(ebov, ids, how="left", indicator=True,
#                right_on="ID", left_on="privatePatientID")
# ebov.columns
# ebov['mergeIssue'] = None
# ebov = helpers.checkMerge2(ebov,
#                           mergeCols2Check=['outcome', 'cohort'],
#                           df1_label="Ebola Viral Seq Data", df2_label="Tulane metadata",
#                           mergeCol="ID", dropMerge=False,
#                           errorCol="mergeIssue", leftErrorMsg="", rightErrorMsg="")
#
# ebov.mergeIssue.value_counts()
#
# ebov.loc[ebov.mergeIssue == ebov.mergeIssue, ['sample_id', 'ncbi_accession',
#                                            'outcome', 'outcome_x', 'outcome_y', 'cohort', 'cohort_x', 'cohort_y']]
# ebov.groupby('KGH_id')._merge.value_counts()


# [Merge and export: experimental data]  ----------------------------------------------------------------------------------------------------
# expts = pd.concat([ebov, lasv])
expts = lasv_data

# combined, common properties
expts['measurementGroup'] = "viral sequencing"
expts['dateModified'] = dateModified
expts['updatedBy'] = updatedBy
expts['releaseDate'] = today
expts['dataStatus'] = "final"
expts['publisher'] = expts.apply(getPublisher, axis=1)
expts['citation'] = np.nan
# expts['citation'] = expts.source_PMID.apply(helpers.getCitation)

# patient-specific properties
# Note: not technically true; if a KGH patient, could have patient / survivor data.
# But-- since only uploading the non-KGH patient data, should be fine.
expts['hasPatientData'] = False
expts['hasSurvivorData'] = False

# sample-specific properties
expts['sampleType'] = "viralRNA"
expts['creatorInitials'] = f"{(updatedBy.split(' ')[0][0] + updatedBy.split(' ')[1][0]).lower()}"
expts['sampleID'] = expts.apply(
    lambda x: f"{x.creatorInitials}-{x.sampleLabel}_{x.sampleType}", axis=1)

# datadownload-specific properties
idVars = list(set(expts.columns) - set(["accession_L", "accession_S"]))
dwnlds = pd.melt(expts, id_vars=idVars, value_vars=[
                 "accession_L", "accession_S"], value_name="accession")
dwnlds.dropna(subset=["accession"], axis=0, inplace=True)

dwnlds['name'] = dwnlds.apply(
    lambda x: x.patientID + "_" + x.accession, axis=1)
dwnlds['identifier'] = dwnlds.apply(
    lambda x: x.patientID + "_" + x.accession, axis=1)
dwnlds['contentUrl'] = dwnlds.apply(
    lambda x: "https://www.ncbi.nlm.nih.gov/nuccore/" + x.accession, axis=1)
dwnlds['includedInDataset'] = 'lassa-viral-seq'
dwnlds['additionalType'] = 'raw data'
dwnlds['experimentIDs'] = dwnlds.experimentID.apply(lambda x: [x])
dwnlds['contentUrlRepository'] = "GenBank"
dwnlds['contentUrlIdentifier'] = dwnlds.accession

# Make sure arrays are arrays
expts['data'] = expts.data.apply(helpers.listify)
expts['citation'] = expts.citation.apply(helpers.listify)

# samples
all_samples = expts[sampleCols]

all_samples.head()
sampleDupeCols = ["sampleID"]
samples = all_samples.drop_duplicates(subset=sampleDupeCols)
dupe_removed = len(all_samples) - len(samples)
if(dupe_removed > 0):
    log_notes.append(f"{dupe_removed} duplicate samples were removed:")
    dupe_samples = all_samples[all_samples.duplicated(subset=sampleDupeCols)]
    log_notes.append(dupe_samples.sampleID)
    log_notes.append("*" * 100)

# patients
# Remove duplicate patients
all_patients = expts.loc[~expts.KGH_id, patientCols]

# Can't check for any columns that are lists... but should be the same.
patientDupeCols = ["patientID", "hasPatientData", "hasSurvivorData",
                   "dateModified", "updatedBy", "cohort", "outcome", "infectionYear", "species"]
patients = all_patients.drop_duplicates(subset=patientDupeCols)
dupe_removed = len(all_patients) - len(patients)
dupe_removed
if(dupe_removed > 0):
    log_notes.append(f"{dupe_removed} duplicate patients were removed:")
    dupe_patients = all_patients[all_patients.duplicated(
        subset=patientDupeCols)]
    log_notes.append(dupe_patients.patientID)
    log_notes.append("*" * 100)


# [Export]  ----------------------------------------------------------------------------------------------------
# Experiments
expts[exptCols].to_json(
    f"{output_dir}/experiments/viral_seq_experiments_{today}.json", orient="records")
expts[exptCols].sample(5).to_json(
    f"{output_dir}/experiments/viral_seq_experiments-sample_{today}.json", orient="records")

# patients
patients.to_json(
    f"{output_dir}/patients/viral_seq_patients_{today}.json", orient="records")
# samples
samples.to_json(
    f"{output_dir}/samples/viral_seq_samples_{today}.json", orient="records")
# data downloads
# Make sure only to get the experiment IDs of those in the alignment
expts.loc[expts.inAlignment, ['seqType', 'experimentID']].groupby('seqType').experimentID.apply(
    list).to_json(f"{output_dir}/datadownloads/viral_seq_exptIDs_{today}.json")
dwnlds[downloadCols].to_json(
    f"{output_dir}/datadownloads/viral_seq_datadownloads_{today}.json", orient="records")

# datasets
dwnlds.identifier.to_json(
    f"{output_dir}/datasets/viral_seq_accession_downloadIDs_{today}.json", orient="records")

# Write log file
with open(f"{log_dir}/{today}_viral_sequence_cleanup.log", 'w') as f:
    for item in log_notes:
        f.write("%s\n" % item)
