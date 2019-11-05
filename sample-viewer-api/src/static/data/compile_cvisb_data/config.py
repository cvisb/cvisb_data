# Config file to specify the inputs / outputs of CViSB data compilation
from datetime import datetime

today = datetime.today().strftime('%Y-%m-%d')
#  [INPUTS] ----------------------------------------------------------------------------------------------
# --- id dictionary ---
ID_DICT = "/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/output_data/patients/patients_2019-09-13_PRIVATE_dict.json"

# --- hla ---
HLA_FILE = "/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/input_data/expt_summary_data/HLA/Genotype_calls_20191024.csv"
HLA_DATE = today
HLA_VERSION = 0.2
HLA_UPDATEDBY = "Matthias Pauthner"

# --- lassa viral seq ---
LVIRAL_AAFILE = "/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/input_data/expt_summary_data/viral_seq/LASV_curated_aln_2019.09.11_duplicates_public.translated.fasta"
LVIRAL_ALIGNEDFILE = "/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/input_data/expt_summary_data/viral_seq/LASV_curated_aln_2019.09.11_duplicates_public.fasta"
LVIRAL_RAWFILE = "/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/input_data/expt_summary_data/viral_seq/LASV_curated_aln_2019.09.11_duplicates_public.fasta"
LVIRAL_MDFILE = "/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/input_data/expt_summary_data/viral_seq/LASV_dataset.2019.09.06.csv"
LVIRAL_DATE = today
LVIRAL_VERSION = 0.1
LVIRAL_UPDATEDBY = "Raphaelle Klitting"

#  --- serology ---
SEROLOGY_FILE = ""
SEROLOGY_DATE = today
SEROLOGY_VERSION = 0.1

#  [OUPUTS] ----------------------------------------------------------------------------------------------
EXPORTDIR = "/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/output_data"
LOGFILE = f"/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/output_data/log/{today}_cvisb-compliation.log"

EXPTCOLS = ['privatePatientID', 'experimentID', 'sampleID',
            'measurementTechnique', 'measurementCategory', 'includedInDataset',
            'publisher', 'citation', 'author', 'data', 'correction',
            'updatedBy', 'dateModified', 'releaseDate', 'sourceFiles', 'dataStatus']


# for non-KGH patients: what info should be
PATIENTCOLS = ["patientID", "alternateIdentifier", "hasPatientData", "hasSurvivorData",
               "dateModified", "updatedBy", "cohort", "outcome", "country",
               "infectionYear", "species", 'sourceFiles', 'correction', 'publisher']

# For all experiments, to relate sample <--> experiment
SAMPLECOLS = ["creatorInitials", "sampleLabel",
              "sampleType", "species", "sampleID", "samplingDate", 'sourceFiles']

# All data download properties, from experiments
DOWNLOADCOLS = ["name", "includedInDataset", "identifier", "contentUrl", "additionalType",
                "measurementTechnique", "measurementCategory", "dateModified", "experimentIDs",
                "contentUrlRepository", "contentUrlIdentifier", "citation", "updatedBy", 'publisher', "author"]

#  [GENERAL PARAMS] --------------------------------------------------------------------------------------
SAVEINIVIDUAL = False
