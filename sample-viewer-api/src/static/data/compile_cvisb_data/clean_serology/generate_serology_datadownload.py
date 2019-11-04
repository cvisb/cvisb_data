import pandas as pd
import os
import json

# [Import helper functions]  ----------------------------------------------------------------------------------------------------
# Helper functions for cleanup...
import helpers


def get_serology_downloads(export_dir, dateModified, downloads, experiments, version, datasetID):
    ds = {}
    export_file = f"{export_dir}/datadownloads/CViSB_v{version}__datadownload_serology_{dateModified}.json"

    # --- static variables ---
    # identifiers
    ds['@context'] = "http://schema.org/"
    ds["@type"] = "DataDownload"
    ds["includedInDataset"] = datasetID
    ds["name"] = "CViSB_SystemsSerology.csv"
    ds["description"] = "Summary of systems serology measurements"
    ds["identifier"] = "CViSB_SystemsSerology.csv"

    # properties
    ds["measurementCategory"] = "Systems Serology"
    ds["additionalType"] = "summary data"
    ds["encodingFormat"] = "text/csv"
    ds["contentUrl"] = f"https://data.cvisb.org/dataset/{datasetID}"

    # credit
    ds['author'] = [helpers.getLabAuthor("Galit")]
    ds['publisher'] = [helpers.cvisb]


# --- possibly variable, each time ---
    ds["version"] = version
    ds["dateModified"] = dateModified
    # pulled from experiments
    ds["measurementTechnique"] = ["ADNP"]
    ds["experimentIDs"] = experiments

    with open(export_file, 'w') as outfile:
        json.dump([ds], outfile)

    return(pd.DataFrame([ds]))
