import pandas as pd
import helpers
import re
from datetime import datetime
from Bio import SeqIO
from .generate_viral_seq_dataset import get_viralseq_dataset
from .generate_viral_seq_datadownload import get_viralseq_downloads


# DATADIR = "/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/"
# alignment_file_S = f"{DATADIR}/input_data/expt_summary_data/viral_seq/LASV_NP_GPC_2020.11.19.fasta"
# alignment_file_S_uncurated = f"{DATADIR}/input_data/expt_summary_data/viral_seq/LASV_NP_GPC_non_curated_2020.11.19.fasta"
# alignment_file_L = f"{DATADIR}/input_data/expt_summary_data/viral_seq/LASV_L_Z_2020.11.20.fasta"
# alignment_file_L_uncurated = f"{DATADIR}/input_data/expt_summary_data/viral_seq/LASV_L_Z_non_curated_2020.11.20.fasta"
# metadata_file = f"{DATADIR}/input_data/expt_summary_data/viral_seq/dataset_up_curated_2020.11.19.csv"
#
# import os
# os.chdir("/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/compile_cvisb_data/")
# import pandas as pd
# import helpers
# from datetime import datetime
# from Bio import SeqIO
#
# expt_cols = ['privatePatientID', 'experimentID', 'sampleID', 'visitCode', 'batchID', 'experimentDate',
#             'measurementTechnique', 'measurementCategory', 'includedInDataset', 'isControl',
#             'publisher', 'citation', 'creator',
#             'data', 'correction', 'version',
#             'updatedBy', 'dateModified', 'releaseDate', 'sourceFiles', 'dataStatus']
# verbose = True
# virus="Lassa"
# version="0.2"
# today = datetime.today().strftime('%Y-%m-%d')
# dateModified= today
# updatedBy='raph'
# output_dir = ""

def clean_lassa_viral_seq(export_dir, alignment_file_L, alignment_file_S, alignment_file_L_uncurated, alignment_file_S_uncurated, metadata_file, alignments, expt_cols, patient_cols, sample_cols, download_cols, dateModified, version, updatedBy, saveFiles, verbose, output_dir, onlyCurated = False, virus="Lassa"):
    # --- constants ---
    today = datetime.today().strftime('%Y-%m-%d')
    # Custom, extra properties specific to viral sequencing
    exptCols = expt_cols.copy()
    exptCols.extend(['genbankID', 'inAlignment', 'cvisb_data', 'segment'])
    dupes_path = f"{output_dir}/log/inconsistencies/experiments_LassaViralSeq_icatePatients_{dateModified}.csv"

    # --- read in metadata ---
    md = pd.read_csv(metadata_file)
    if(onlyCurated):
        md = md[md.curated]

    # --- Initial checks ---
    dupe_patientID = md[md.duplicated(
        subset=["label", "segment"], keep=False)]
    if(len(dupe_patientID) > 0):
        helpers.log_msg(
            f"DATA ERROR: {len(dupe_patientID)} duplicate patient ids found in virus sequences:", verbose)
        helpers.log_msg(dupe_patientID[['label', 'segment']].sort_values(
            "label"), verbose)
        helpers.log_msg("-" * 50, verbose)

    dupe_seqID = md[md.duplicated(
        subset=["sequenceID"], keep=False)]
    if(len(dupe_seqID) > 0):
        helpers.log_msg(
            f"DATA ERROR: {len(dupe_seqID)} duplicate sequence ids found in virus sequences:", verbose)
        helpers.log_msg(dupe_seqID[['sequenceID', 'label']].sort_values(
            "label"), verbose)
        helpers.log_msg("-" * 50, verbose)

    dupe_accession = md[md.duplicated(subset=["accession"], keep=False)]
    if(len(dupe_accession) > 0):
        helpers.log_msg(
            f"DATA ERROR: {len(dupe_accession)} duplicate accession IDs found in virus sequences:", verbose)
        helpers.log_msg(dupe_patientID[[
                        'label', 'patient_timepoint', 'accession']].sort_values("accession"), verbose)
        helpers.log_msg("-" * 50, verbose)

        # --- clean up common properties, across patient/expt/sample/downloads/dataset ---
    md['variableMeasured'] = f"{virus} virus sequence"
    md['measurementTechnique'] = "Nucleic Acid Sequencing"
    md['measurementCategory'] = "virus sequencing"
    md['includedInDataset'] = f"{virus.lower()}-virus-seq"
    md['creator'] = None
    md['correction'] = None
    md['version'] = version
    md['dateModified'] = dateModified
    md['updatedBy'] = updatedBy
    md['releaseDate'] = today
    md['dataStatus'] = "final"
    md['publisher'] = md.apply(getPublisher, axis=1)
    md['batchID'] = None
    md['isControl'] = False
    md['experimentDate'] = md.date.apply(getExptDate)
    md['sourceFiles'] = md.apply(lambda row: getSourceFiles(row, alignment_file_L, alignment_file_S, alignment_file_S_uncurated, alignment_file_L_uncurated, metadata_file), axis = 1)

    # --- clean up patient metadata ---
    # NOTE: SUPER IMPORTANT!
    # Nigeria recycles patient ID numbers (ugh), so `patientID` should be ignored.
    # Instead, use label, which concat's patientID, year, location
    # For KGH ids, need to pull out the KGH part.
    md["rawID"] = md.label.apply(lambda x: "_".join(x.split("_")[0:-2]))
    md['KGH_id'] = md.rawID.apply(
        helpers.checkIDstructure).apply(lambda x: not x)
    md['privatePatientID'] = md.apply(getPrivateID, axis=1)
    md['patientID_copy'] = md.patientID
    md['patientID'] = md.privatePatientID # Raphaelle has already combined with public IDs, so should be the same.
    md['isPrivateID'] = md.patientID.apply(helpers.checkPrivateID)
    if(sum(md.isPrivateID) > 0):
        helpers.log_msg(
            f"DATA ERROR: {sum(md.isPrivateID)} patientIDs look like private KGH IDs:", verbose)
        helpers.log_msg(md.loc[md.isPrivateID, ['patientID']].sort_values("patientID"), verbose)
        helpers.log_msg("-" * 50, verbose)
    md['outcome_copy'] = md.outcome
    md['outcome'] = md.outcome.apply(helpers.cleanOutcome)
    md['cohort'] = virus
    md['alternateIdentifier'] = md.privatePatientID.apply(helpers.listify)
    md['country'] = md.country_iso3.apply(helpers.getCountry)
    md['countryName'] = md.country.apply(helpers.pullCountryName)
    md['location'] = md.apply(getLocation, axis = 1)
    md['locationPrivate'] = md.apply(getLocationPrivate, axis = 1)
    md['infectionYear'] = md.year
    md['samplingDate'] = md.date.apply(helpers.date2Range)
    md['species'] = md.host.apply(helpers.convertSpecies)
    # Raphaelle using patient_timepoint as a binary if there are multiple measurements / patient
    md['visitCode'] = None
    # md['visitCode'] = md.patient_timepoint.apply(lambda x: str(x))
    # Note: not technically true; if a KGH patient, could have patient / survivor data.
    # But-- since only uploading the non-KGH patient data, should be fine.
    md['hasPatientData'] = False
    md['hasSurvivorData'] = False

    # --- clean up experiment properties ---
    md['inAlignment'] = md.curated.apply(bool)
    md['cvisb_data'] = md.CViSB_data.apply(bool)
    print("Is this going really slowly? Make sure your VPN is turned off when you're getting citations from NCBI.")
    citation_dict = helpers.createCitationDict(md, "source_PMID")
    md['citation'] = md["source_PMID"].apply(
        lambda x: helpers.lookupCitation(x, citation_dict))
    # Make sure arrays are arrays
    md['citation'] = md.citation.apply(helpers.listify)
    md['experimentID'] = md.apply(lambda x: getExptID(x, virus), axis=1)
    md['genbankID'] = md.accession
    # --- clean up sample properties ---
    md['sampleLabel'] = md.label
    md['sampleType'] = "viralRNA"
    md['creatorInitials'] = f"{(updatedBy.split(' ')[0][0] + updatedBy.split(' ')[1][0]).lower()}"
    md['sampleID'] = md.apply(
        lambda x: f"{x.creatorInitials}-{x.sampleLabel}_{x.sampleType}", axis=1)

    # --- clean up download properties ---
    md['name'] = md.apply(lambda x: getDwnldID(x), axis=1)
    md['identifier'] = md.name
    md['contentUrl'] = md.accession.apply(getDwnldUrl)
    md['additionalType'] = 'raw data'
    md['experimentIDs'] = md.experimentID.apply(lambda x: [x])
    md['contentUrlRepository'] = "GenBank"
    md['contentUrlIdentifier'] = md.accession

    # --- Merge together data and metadata ---
    Lseqs = getDNAseq(alignment_file_L, alignment_file_L_uncurated, virus, segment="L")
    Sseqs = getDNAseq(alignment_file_S, alignment_file_S_uncurated, virus, segment="S")

    seqs = pd.concat([Lseqs, Sseqs], ignore_index=True)

    merged = pd.merge(md, seqs, on="sequenceID", how="outer", indicator=True)
    no_seq = merged[(merged._merge == "left_only")]
    seq_only = merged[merged._merge == "right_only"]
    if(len(no_seq) > 0):
        helpers.log_msg(f"\tDATA ERROR: no sequence found in sequence alignment file for {len(no_seq)} patients:", verbose)
        helpers.log_msg(no_seq[['label', 'segment']], verbose)
        helpers.log_msg("-" * 50, verbose)
    if(len(seq_only) > 0):
        helpers.log_msg(f"\tDATA ERROR: no patient found in sequence metadata file for {len(seq_only)} sequences:", verbose)
        helpers.log_msg(seq_only[['sequenceID']], verbose)
        helpers.log_msg("-" * 50, verbose)

    # Make sure arrays are arrays
    # merged['data'] = merged.data.apply(helpers.listify)

    # --- partition data to different endpoints ---
    # Patient and sample data is a bit special; since Lassa has both S and L, there will be duplicate entries.  Remove them.

    patientDupeCols = ["patientID", "countryName", "hasPatientData", "hasSurvivorData",
                   "dateModified", "updatedBy", "cohort", "outcome",
                   "infectionYear", "species", 'correction']
    new_patients = merged[~ merged.KGH_id]

    # Remove redundant patient data
    # first: remove the data points that Raph has designated as being duplicate.
    original = len(new_patients)
    new_patients = new_patients[new_patients.duplicate == 0]
    helpers.log_msg(f"{original - len(new_patients)} removed because they're duplicate sequences.", verbose)
    dupe_patients2 = new_patients[new_patients.duplicated(subset = patientDupeCols, keep=False)]
    if(len(dupe_patients2) > 0):
        patients = new_patients.drop_duplicates(subset = patientDupeCols)[patient_cols]
        helpers.log_msg(
            f"DATA WARNING: {len(new_patients) - len(patients)} duplicate patient records have been removed. This commonly happens because there are records for L/S segments.", verbose)
        dupeSegments = dupe_patients2.loc[dupe_patients2.duplicated(subset=['patientID', 'segment']), ['label', 'patientID', 'segment']].sort_values("patientID")
        if(len(dupeSegments) > 0):
            helpers.log_msg("Double check these entries, which have duplicate patient IDs and segments:", verbose)
            helpers.log_msg(dupeSegments, verbose)
        helpers.log_msg("-" * 50, verbose)
    else:
        patients = new_patients[patient_cols]
    # Double check all patient IDs are unique
    patients_dupePatientID = patients[patients.duplicated(subset = ['patientID'], keep=False)]
    if(len(patients_dupePatientID) > 0):
        helpers.log_msg(
            f"DATA ERROR: {len(patients_dupePatientID)} duplicate patient IDs exist in the data to be uploaded. Saved to {dupes_path}", verbose)
        dupe_patients4save = new_patients.loc[new_patients.patientID.isin(patients_dupePatientID.patientID), ["patientID", "label", "segment", "countryName", "infectionYear", "cohort", "outcome", "species", 'source_PMID']]
        helpers.log_msg(dupe_patients4save, verbose)
        helpers.log_msg("-" * 50, verbose)
        dupe_patients4save.sort_values("patientID").to_csv(dupes_path, index=False)

    samples = md.loc[~ md.KGH_id, sample_cols]

    # Remove experiments where there's no experimental data.
    # As of 2019-11-25, this is only the curated sequences.
    experiments = merged.loc[merged.data == merged.data, exptCols]

    # --- Call to get data downloads, dataset ---
    dwnlds = md[download_cols]
    dwnlds["publisher"] = dwnlds.publisher.apply(helpers.listify)
    all_dwnlds = get_viralseq_downloads(alignments, dateModified, dwnlds, experiments, version, virus)
    ds = get_viralseq_dataset(dateModified, dwnlds, md, version, virus)

    # [Export]  ----------------------------------------------------------------------------------------------------
    if(saveFiles):
        # --- experiments ---
        experiments.to_json(
            f"{output_dir}/experiments/virus_seq_experiments_{today}.json", orient="records")

        # --- patients ---
        patients.to_json(
            f"{output_dir}/patients/virus_seq_patients_{today}.json", orient="records")
        # --- samples ---
        samples.to_json(
            f"{output_dir}/samples/virus_seq_samples_{today}.json", orient="records")

    return({"patient": patients, "sample": samples, "dataset": ds, "datadownload": all_dwnlds, "experiment": experiments})
# sum(md.duplicated(subset = "accession"))


def getPrivateID(row):
    if(row.KGH_id):
        return(helpers.interpretID(row.rawID))
    return(row.label)


def getPublisher(row, varName="CViSB_data"):
    # Check binary if CVISB_data
    if(row[varName]):
        return(helpers.cvisb)

def getExptID(row, virus):
    if(virus == "Ebola"):
        expt_stub = "EBOV_seq_"
        return(expt_stub + row.accession)
    if(virus == "Lassa"):
        expt_stub = "LASV_seq_"
        if(row.accession == row.accession):
            return(expt_stub + row.accession)
        else:
            return(expt_stub + row.label + "_" + row.segment)

def getDwnldID(row):
    if(row.accession == row.accession):
        return(row.label + "_" + row.segment + "_" + row.accession)
    else:
        return(row.label + "_" + row.segment)

def getDwnldUrl(accession):
    if(accession == accession):
        return("https://www.ncbi.nlm.nih.gov/nuccore/" + accession)
    else:
        return("https://data.cvisb.org/download/lassa-virus-seq")

def getExptDate(date_str):
    if(date_str == date_str):
        if(re.search("\d\d\d\d-\d\d-\d\d", date_str)):
            return(date_str)
    return None

def getSourceFiles(row, alignment_file_L, alignment_file_S, alignment_file_L_uncurated, alignment_file_S_uncurated, metadata_file):
    if(row.segment == "S"):
        return([alignment_file_S.split("/")[-1], alignment_file_S_uncurated.split("/")[-1], metadata_file.split("/")[-1]])
    if(row.segment == "L"):
        if(row.curated):
            return([alignment_file_L.split("/")[-1], alignment_file_L_uncurated.split("/")[-1], metadata_file.split("/")[-1]])
        else:
            return([alignment_file_L_uncurated.split("/")[-1], metadata_file.split("/")[-1]])

def combineSeqs(row):
    if(row.uncurated == row.uncurated):
        if(row.curated == row.curated):
            return([row.curated, row.uncurated])
        else:
            return([row.uncurated])
    else:
        return([row.curated])

def getDNAseq(alignment_file, uncurated_alignment, virus, seq_type="DNAsequence", segment=None, data_type="VirusSeqData"):
    all_seq = list(SeqIO.parse(alignment_file, "fasta"))
    if(uncurated_alignment is not None):
        uncurated_seq = list(SeqIO.parse(uncurated_alignment, "fasta"))
    else:
        uncurated_seq = list()

    # curated sequences
    curated = pd.DataFrame(columns=['sequenceID', 'curated'])
    for seq in all_seq:
        seq_obj = [{
        seq_type: str(seq.seq).upper(),
        "@type": data_type,
        "virus": virus,
        "curated": True,
        "virusSegment": segment}]
        curated = curated.append(pd.DataFrame({'sequenceID': seq.id, 'curated': seq_obj}))

    uncurated = pd.DataFrame(columns=['sequenceID', 'uncurated'])
    for seq in uncurated_seq:
        seq_obj = [{
        seq_type: str(seq.seq).upper(),
        "@type": data_type,
        "virus": virus,
        "curated": False,
        "virusSegment": segment}]
        uncurated = uncurated.append(pd.DataFrame({'sequenceID': seq.id, 'uncurated': seq_obj}))

    # Merge together curated and uncurated
    df = pd.merge(curated, uncurated, how="outer", on="sequenceID", indicator=True)
    df['data'] = df.apply(combineSeqs, axis=1)
    cols2return = ['sequenceID', 'data']
    return(df[cols2return])

def getLocation(row):
    loc = []
    if((row.country == row.country) & (row.country is not None)):
        row["country"]["locationType"] = "home"
        loc.append(row.country)
    if((row.admin2 == row.admin2) & (row.admin2 is not None)):
        loc.append({"@type": "AdministrativeArea", "name": row.admin2.replace("_", " ").title(), "locationType": "home", "administrativeUnit": 2})
    return(loc);

def getLocationPrivate(row):
    loc = getLocation(row)
    if((row["admin3-4"] == row["admin3-4"]) & (row["admin3-4"] is not None)):
            loc.append({"@type": "AdministrativeArea", "name": row["admin3-4"].replace("_", " ").title(), "locationType": "home"})
    return(loc);
