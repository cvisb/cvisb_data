import pandas as pd
import os
import json

# [Import helper functions]  ----------------------------------------------------------------------------------------------------
os.chdir("/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/")
# Helper functions for cleanup...
import helpers


def get_serology_downloads(export_dir, dateModified, downloads, experiments, version, datasetID="systems-serology"):
    ds = {}
    export_file = f"{export_dir}/datadownloads/CViSB_v{version}__datadownloads_serology_{dateModified}.json"

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

    return(ds)

get_serology_downloads("/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/output_data", "2019-10-16", [], [], '0.1')
