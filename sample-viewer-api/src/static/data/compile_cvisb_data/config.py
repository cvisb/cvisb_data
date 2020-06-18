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
# LVIRAL_AAFILE = f"{DATADIR}/input_data/expt_summary_data/viral_seq/LASV_curated_aln_2019.09.11_duplicates_public.translated.fasta"
LVIRAL_SFILE = f"{DATADIR}/input_data/expt_summary_data/viral_seq/LASV_NP_GPC_2019.11.21.fasta"
LVIRAL_LFILE = f"{DATADIR}/input_data/expt_summary_data/viral_seq/LASV_L-Z_2019-11-22.fasta"
LVIRAL_LFILE_UNCURATED = f"{DATADIR}/input_data/expt_summary_data/viral_seq/LASV_L_Z_non_curated_2019.11.26.fasta"
# LVIRAL_RAWFILE = f"{DATADIR}/input_data/expt_summary_data/viral_seq/LASV_curated_aln_2019.09.11_duplicates_public.fasta"
LVIRAL_MDFILE = f"{DATADIR}/input_data/expt_summary_data/viral_seq/dataset_up_public_curated_2019.11.25.csv"
LVIRAL_DATE = today
LVIRAL_VERSION = 0.2
LVIRAL_UPDATEDBY = "Raphaëlle Klitting"

# --- ebola virus seq ---
EVIRAL_ALIGNEDFILE = f"{DATADIR}/input_data/expt_summary_data/viral_seq/EBOV_ORFs_curated_2020.06.12.fasta"
EVIRAL_FILE_UNCURATED = f"{DATADIR}/input_data/expt_summary_data/viral_seq/EBOV_ORFs_non_curated_2020.06.12.fasta"
EVIRAL_MDFILE = f"{DATADIR}/input_data/expt_summary_data/viral_seq/dataset_ebola_up_public_curated_2020.06.12.csv"
EVIRAL_DATE = today
EVIRAL_VERSION = 0.2
EVIRAL_UPDATEDBY = "Raphaëlle Klitting"



#  --- serology ---
SEROLOGY_FILE = f"{DATADIR}/input_data/expt_summary_data/systems_serology/CViSB_SystemsSerology_v0.2_2019Nov22_LH.xlsx"
SEROLOGY_DATE = today
SEROLOGY_VERSION = 0.2
SEROLOGY_UPDATEDBY = "Bonnie Gunn"

#  [OUPUTS] ----------------------------------------------------------------------------------------------
EXPORTDIR = f"{DATADIR}/output_data"
LOGFILE = f"{DATADIR}/output_data/log/{today}_cvisb-compliation.log"

EXPTCOLS = ['privatePatientID', 'experimentID', 'sampleID', 'visitCode', 'batchID', 'experimentDate',
            'measurementTechnique', 'measurementCategory', 'variableMeasured', 'includedInDataset', 'isControl',
            'publisher', 'citation', 'creator',
            'data', 'correction', 'version',
            'updatedBy', 'dateModified', 'releaseDate', 'sourceFiles', 'dataStatus']


# for non-KGH patients: what info should be
PATIENTCOLS = ["patientID", "alternateIdentifier", "hasPatientData", "hasSurvivorData",
               "dateModified", "updatedBy", "cohort", "outcome", "country", "countryName", "admin2", "admin3", "homeLocation",
               "infectionYear", "species", 'sourceFiles', 'correction',
               'publisher', 'citation']

# For all experiments, to relate sample <--> experiment
SAMPLECOLS = ["creatorInitials", "sampleLabel",
              "sampleType", "species", "sampleID", "samplingDate", 'sourceFiles']

# All data download properties, from experiments
DOWNLOADCOLS = ["name", "includedInDataset", "identifier", "contentUrl", "additionalType",
                "variableMeasured", "measurementTechnique", "measurementCategory", "dateModified", "experimentIDs",
                "contentUrlRepository", "contentUrlIdentifier", "citation", "updatedBy", 'publisher', "creator"]

# Properties to export in patient ID dictionary
DICTCOLS = ["patientID", "gID", "sID", "publicGID", "publicSID", "cohort", "outcome", "alternateIdentifier",
            'evalDate', 'dischargeDate', 'daysOnset', 'infectionDate',
            "age", "gender", "countryName", "elisa", "issue"]
# DICTCOLS = ["patientID", "gID", "sID", "publicGID", "publicSID", "cohort", "outcome", "alternateIdentifier",
#             "issue"]

#  [GENERAL PARAMS] --------------------------------------------------------------------------------------
SAVEINIVIDUAL = False
