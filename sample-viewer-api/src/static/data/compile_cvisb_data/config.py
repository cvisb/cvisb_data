# Config file to specify the inputs / outputs of CViSB data compilation
from datetime import datetime

today = datetime.today().strftime('%Y-%m-%d')
DATADIR = "/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/"
#  [INPUTS] ----------------------------------------------------------------------------------------------
# --- id dictionary ---
ID_DICT = f"{DATADIR}/output_data/patients/patients_2019-09-13_PRIVATE_dict.json"

# --- patients ---
# ACUTE_IDS_FILE = f"{DATADIR}/input_data/patient_rosters/additional_IDdict_v3_2019-10-23.csv"
ACUTE_IDS_FILE = f"{DATADIR}/input_data/patient_rosters/complete_acuteid_roster_v1_2019-11-01.xlsx"
ACUTE_LASSA_FILE = f"{DATADIR}/input_data/patient_rosters/acuteLassa_patientdata_v2_2019-06-12_PRIVATE.csv"
ACUTE_LASSA_IDS = f"{DATADIR}/input_data/patient_rosters/acuteLassa_IDdict_v1_2019-03-27_PRIVATE.xlsx"
SURVIVOR_IDS = f"{DATADIR}/input_data/patient_rosters/survivor_IDdict_v2_2019-03-06_PRIVATE.xlsx"
SURVIVOR_EBOLA_FILE = f"{DATADIR}/input_data/patient_rosters/ebolaSurvivors_metadata_v2_2019-03-13_PRIVATE.xlsx"
PATIENTS_UPDATEDBY = "John Schieffelin"
PATIENTS_DATE = today
PATIENTS_VERSION = 0.2

# --- hla ---
HLA_FILE = f"{DATADIR}/input_data/expt_summary_data/HLA/Genotype_calls_20191024.csv"
HLA_DATE = today
HLA_VERSION = 0.2
HLA_UPDATEDBY = "Matthias Pauthner"

# --- lassa virus seq ---
LVIRAL_AAFILE = f"{DATADIR}/input_data/expt_summary_data/viral_seq/LASV_curated_aln_2019.09.11_duplicates_public.translated.fasta"
LVIRAL_ALIGNEDFILE = f"{DATADIR}/input_data/expt_summary_data/viral_seq/LASV_curated_aln_2019.09.11_duplicates_public.fasta"
LVIRAL_RAWFILE = f"{DATADIR}/input_data/expt_summary_data/viral_seq/LASV_curated_aln_2019.09.11_duplicates_public.fasta"
LVIRAL_MDFILE = f"{DATADIR}/input_data/expt_summary_data/viral_seq/LASV_dataset.2019.09.06.csv"
LVIRAL_DATE = today
LVIRAL_VERSION = 0.1
LVIRAL_UPDATEDBY = "Raphaëlle Klitting"

# --- ebola virus seq ---
EVIRAL_ALIGNEDFILE = f"{DATADIR}/input_data/expt_summary_data/viral_seq/clean_ebola_orfs_aln_2019.11.12.fasta"
EVIRAL_MDFILE = f"{DATADIR}/input_data/expt_summary_data/viral_seq/survival_dataset_ebov_public_2019.11.12.csv"
EVIRAL_DATE = today
EVIRAL_VERSION = 0.1
EVIRAL_UPDATEDBY = "Raphaëlle Klitting"



#  --- serology ---
SEROLOGY_FILE = f"{DATADIR}/input_data/expt_summary_data/systems_serology/CViSB_SystemsSerology_v0.2_2019Nov22_LH.xlsx"
SEROLOGY_DATE = today
SEROLOGY_VERSION = 0.1
SEROLOGY_UPDATEDBY = "Bonnie Gunn"

#  [OUPUTS] ----------------------------------------------------------------------------------------------
EXPORTDIR = f"{DATADIR}/output_data"
LOGFILE = f"{DATADIR}/output_data/log/{today}_cvisb-compliation.log"

EXPTCOLS = ['privatePatientID', 'experimentID', 'sampleID', 'visitCode', 'batchID', 'experimentDate',
            'measurementTechnique', 'measurementCategory', 'includedInDataset', 'isControl',
            'publisher', 'citation', 'creator',
            'data', 'correction', 'version',
            'updatedBy', 'dateModified', 'releaseDate', 'sourceFiles', 'dataStatus']


# for non-KGH patients: what info should be
PATIENTCOLS = ["patientID", "alternateIdentifier", "hasPatientData", "hasSurvivorData",
               "dateModified", "updatedBy", "cohort", "outcome", "country",
               "infectionYear", "species", 'sourceFiles', 'correction',
               'publisher', 'citation']

# For all experiments, to relate sample <--> experiment
SAMPLECOLS = ["creatorInitials", "sampleLabel",
              "sampleType", "species", "sampleID", "samplingDate", 'sourceFiles']

# All data download properties, from experiments
DOWNLOADCOLS = ["name", "includedInDataset", "identifier", "contentUrl", "additionalType",
                "measurementTechnique", "measurementCategory", "dateModified", "experimentIDs",
                "contentUrlRepository", "contentUrlIdentifier", "citation", "updatedBy", 'publisher', "creator"]

# Properties to export in patient ID dictionary
DICTCOLS = ["patientID", "gID", "sID", "publicGID", "publicSID", "cohort", "outcome", "alternateIdentifier",
            'evalDate', 'dischargeDate', 'daysOnset', 'infectionDate',
            "age", "gender", "countryName", "elisa", "issue"]
DICTCOLS = ["patientID", "gID", "sID", "publicGID", "publicSID", "cohort", "outcome", "alternateIdentifier",
            "issue"]

#  [GENERAL PARAMS] --------------------------------------------------------------------------------------
SAVEINIVIDUAL = False
