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
from .generate_serology_dataset import get_serology_dataset
from .generate_serology_datadownload import get_serology_downloads

# [Static values]  ----------------------------------------------------------------------------------------------------
UPDATEDBY = "Bonnie Gunn"

def clean_serology(export_dir, dateModified, version, datasetID="systems-serology"):
    experiments = []
    downloads = []
    # [Get Dataset .json]  ----------------------------------------------------------------------------------------------------
    ds = get_serology_dataset(dateModified, downloads, experiments, version, datasetID)
    # [Get DataDownload .json]  ----------------------------------------------------------------------------------------------------
    dwld = get_serology_downloads(export_dir, dateModified, downloads, experiments, version, datasetID)

    return({ "patient": pd.DataFrame(), "sample": pd.DataFrame(), "dataset": ds, "datadownload": dwld, "experiment": pd.DataFrame() })
