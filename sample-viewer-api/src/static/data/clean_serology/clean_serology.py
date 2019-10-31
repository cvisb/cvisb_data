# Imports and cleans viral sequencing data, to throw into Angular app.
# Does a bunch of things:
# 1) standardizes all inputs to conform with schema
# 2) creates a series of Experiment objects to store the experimental data with experiment IDs
# 3) creates a series of Patient objects for patients who are not in the KGH roster.
# 4) creates a series of Samples for all the experiments.
# 5) creates a series of data download objects
# 6) creates a serology dataset

import pandas as pd
import os
import re
from datetime import datetime

# [Static values]  ----------------------------------------------------------------------------------------------------
updatedBy = "Bonnie Gunn"

# [File locations]  ----------------------------------------------------------------------------------------------------
# inputs
id_dict = "/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/output_data/patients/patients_2019-09-13_PRIVATE_dict.json"

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
sampleCols = ["creatorInitials", "sampleLabel",
              "sampleType", "species", "sampleID", "samplingDate"]

# For all experiments with accession numbers, generate data downloads
downloadCols = ["name", "includedInDataset", "identifier", "contentUrl", "additionalType", "measurementTechnique",
                "dateModified", "experimentIDs", "contentUrlRepository", "contentUrlIdentifier", "citation", "updatedBy"]


# [Import helper functions]  ----------------------------------------------------------------------------------------------------
os.chdir("/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/")
# Helper functions for cleanup...
import helpers

# [Commonalities]  ----------------------------------------------------------------------------------------------------
today = datetime.today().strftime('%Y-%m-%d')

if(dateModified != dateModified):
    dateModified = today

# [Get Dataset .json]  ----------------------------------------------------------------------------------------------------
# [Get DataDownload .json]  ----------------------------------------------------------------------------------------------------
