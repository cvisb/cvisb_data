# Config file to specify the inputs / outputs of CViSB data compilation
from datetime import datetime

today = datetime.today().strftime('%Y-%m-%d')
DATADIR = "/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/"
#  [INPUTS] ----------------------------------------------------------------------------------------------
# --- id dictionary ---
ID_DICT = f"{DATADIR}/output_data/patients/patients_2019-09-13_PRIVATE_dict.json"

# --- patients ---
# ACUTE_IDS_FILE = f"{DATADIR}/input_data/patient_rosters/additional_IDdict_v3_2019-10-23.csv"
PATIENT_FILE = f"{DATADIR}/input_data/expt_summary_data/HLA/DisseminationData_31Aug20.xlsx"
PATIENTS_UPDATEDBY = "Emily Engel"
PATIENTS_DATE = today
PATIENTS_VERSION = 0.3

# --- hla ---
HLA_FILE = f"{DATADIR}/input_data/expt_summary_data/HLA/Genotype_calls_2020-01-30.csv"
HLA_DATE = "2020-11-23"
HLA_VERSION = 0.3
HLA_UPDATEDBY = "Matthias Pauthner"

# --- lassa virus seq ---
ALIGNMENTS = [
    {"virus": "Lassa",
     "segment": "S",
     "filename": "LASV_NP-GP_2020.11.23.fasta",
     "description": "Lassa virus NP-GP curated alignment",
     "curated": True,
     "url": "https://raw.githubusercontent.com/cvisb/curated-alignments/master/lassa/LASV_NP_GPC_2020.11.23.fasta"},
    {"virus": "Lassa",
     "segment": "L",
     "filename": "LASV_L_Z_2020.11.23.fasta",
     "description": "Lassa virus L-Z curated alignment",
     "curated": True,
     "url": "https://raw.githubusercontent.com/cvisb/curated-alignments/master/lassa/LASV_L_Z_2020.11.23.fasta"},
    {"virus": "Ebola",
     "segment": None,
     "filename": "EBOV_ORFs_2020.08.04.fasta",
     "curated": True,
     "description": "Ebola virus curated alignment",
     "url": "https://raw.githubusercontent.com/cvisb/curated-alignments/master/ebola/EBOV_ORFs_2020.08.04.fasta"}
]
# LVIRAL_AAFILE = f"{DATADIR}/input_data/expt_summary_data/viral_seq/LASV_curated_aln_2019.09.11_duplicates_public.translated.fasta"
LVIRAL_SFILE = f"{DATADIR}/input_data/expt_summary_data/viral_seq/LASV_NP_GPC_2020.11.23.fasta"
LVIRAL_SFILE_UNCURATED = f"{DATADIR}/input_data/expt_summary_data/viral_seq/LASV_NP_GPC_non_curated_2020.11.23.fasta"
LVIRAL_LFILE = f"{DATADIR}/input_data/expt_summary_data/viral_seq/LASV_L_Z_2020.11.23.fasta"
LVIRAL_LFILE_UNCURATED = f"{DATADIR}/input_data/expt_summary_data/viral_seq/LASV_L_Z_non_curated_2020.11.23.fasta"
LVIRAL_MDFILE = f"{DATADIR}/input_data/expt_summary_data/viral_seq/dataset_lasv_curated_2020.11.23.csv"
LVIRAL_DATE = "2020-11-23"
LVIRAL_VERSION = 0.3
LVIRAL_UPDATEDBY = "Raphaëlle Klitting"

# --- ebola virus seq ---
EVIRAL_ALIGNEDFILE = f"{DATADIR}/input_data/expt_summary_data/viral_seq/EBOV_ORFs_up_public_curated_2020.08.04.fasta"
EVIRAL_FILE_UNCURATED = f"{DATADIR}/input_data/expt_summary_data/viral_seq/EBOV_ORFs_up_public_non_curated_2020.08.04.fasta"
EVIRAL_MDFILE = f"{DATADIR}/input_data/expt_summary_data/viral_seq/dataset_ebola_up_public_curated_2020.08.03.csv"
EVIRAL_DATE = "2020-11-16"
EVIRAL_VERSION = 0.3
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
PATIENTCOLS = [
                "patientID", "species", "alternateIdentifier",
                "hasPatientData", "hasSurvivorData",
                "dateModified", "updatedBy", "dataStatus",
                'sourceFiles', "version",
                "cohort", "outcome",
                "country", "countryName", "location", "locationPrivate",
                "infectionYear",
                'publisher', 'citation','correction']

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
