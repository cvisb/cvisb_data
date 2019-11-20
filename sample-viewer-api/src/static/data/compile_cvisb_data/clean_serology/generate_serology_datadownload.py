import pandas as pd
import os
import json

# [Import helper functions]  ----------------------------------------------------------------------------------------------------
# Helper functions for cleanup...
import helpers


def get_serology_downloads(dateModified, experiments, updatedBy, version, datasetID):
    ds = {}

    # --- static variables ---
    # identifiers
    ds['@context'] = "http://schema.org/"
    ds["@type"] = "DataDownload"
    ds["includedInDataset"] = datasetID
    ds["name"] = "CViSB-SystemsSerology.csv"
    ds["description"] = "Summary of systems serology measurements"
    ds["identifier"] = "CViSB_SystemsSerology.csv"

    # properties
    ds["measurementCategory"] = "Systems Serology"
    ds["additionalType"] = "summary data"
    ds["encodingFormat"] = "text/csv"
    ds["contentUrl"] = f"https://data.cvisb.org/dataset/{ds['name']}"

    # credit
    ds['author'] = [helpers.getLabAuthor("Galit")]
    ds['publisher'] = [helpers.cvisb]

    # --- possibly variable, each time ---
    ds["version"] = version
    ds["dateModified"] = dateModified
    ds["updatedBy"] = updatedBy

    # pulled from experiments
    ds["measurementTechnique"] = helpers.getUnique(experiments, "measurementTechnique")
    ds["citation"] = helpers.getUnique(experiments, "citation")
    ds["experimentIDs"] = experiments.experimentID

    # with open(export_file, 'w') as outfile:
    #     json.dump([ds], outfile)

    return(pd.DataFrame([ds]))
