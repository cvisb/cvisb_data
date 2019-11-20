# Imports and cleans serology data, to throw into Angular app.
# Does a bunch of things:
# 1) standardizes all inputs to conform with schema
# 2) creates a series of Experiment objects to store the experimental data with experiment IDs
# 5) creates a series of data download objects
# 6) creates a serology dataset

import pandas as pd
import os
import re
from datetime import datetime
from .generate_serology_dataset import get_serology_dataset
from .generate_serology_datadownload import get_serology_downloads
from .clean_immune_effector_funcs import clean_immune_effector_funcs

# [Static values]  ----------------------------------------------------------------------------------------------------

def clean_serology(sero_file, expt_cols, updatedBy, dateModified, version, verbose, output_dir, datasetID="systems-serology"):
    # All patients are from KGH; no need to add in paitents or samples
    patients = pd.DataFrame()
    samples = pd.DataFrame()
    experiments = clean_immune_effector_funcs(sero_file, expt_cols, updatedBy, dateModified, version, verbose, output_dir)
    # [Get DataDownload .json]  ----------------------------------------------------------------------------------------------------
    dwld = get_serology_downloads(dateModified, experiments, updatedBy, version, datasetID)
    # [Get Dataset .json]  ----------------------------------------------------------------------------------------------------
    ds = get_serology_dataset(dateModified, dwld,
                              experiments, version, datasetID)

    return({"patient": patients, "sample": samples, "dataset": ds, "datadownload": dwld, "experiment": experiments})
