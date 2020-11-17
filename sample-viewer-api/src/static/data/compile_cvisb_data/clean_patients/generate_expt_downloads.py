import pandas as pd
import os
import json

# [Import helper functions]  ----------------------------------------------------------------------------------------------------
# Helper functions for cleanup...
import helpers


def get_expt_downloads(dateModified, experiments, updatedBy, version, datasetID):
    ds = {}

    # --- static variables ---
    # identifiers
    ds['@context'] = "http://schema.org/"
    ds["@type"] = "DataDownload"
    ds["includedInDataset"] = datasetID
    ds["name"] = f"CViSB_{datasetID}"
    ds["description"] = f"Download for CViSB dataset {datasetID}, experimental data from Kenema Government Hospital"
    ds["identifier"] = f"CViSB_{datasetID}"

    # properties
    ds["additionalType"] = "summary data"
    ds["encodingFormat"] = "text/html"
    ds["contentUrl"] = f"https://data.cvisb.org/download/{ds['name']}"

    # credit
    ds['creator'] = [helpers.kgh]
    ds['publisher'] = [helpers.cvisb]

    # --- possibly variable, each time ---
    ds["version"] = version
    ds["dateModified"] = dateModified
    ds["updatedBy"] = updatedBy

    # pulled from experiments
    ds["measurementTechnique"] = helpers.getUnique(experiments, "measurementTechnique")
    cats = helpers.getUnique(experiments, "measurementCategory")
    if(len(cats) == 1):
        ds["measurementCategory"] = cats[0]
    else:
        raise Exception("More than one measurementCategory found.  Should only be one per dataset.")

    ds["variableMeasured"] = helpers.getUnique(experiments, "variableMeasured")
    ds["citation"] = helpers.getUnique(experiments, "citation")
    ds["experimentIDs"] = experiments.experimentID

    return(pd.DataFrame([ds]))
