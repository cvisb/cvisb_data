import pandas as pd
import os
import json

# [Import helper functions]  ----------------------------------------------------------------------------------------------------
os.chdir("/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/clean_patients/")
# Helper functions for cleanup...
import helpers


def get_serology_dataset(export_dir, dateModified, downloads, experiments, version, datasetID="systems-serology"):
    ds = {}
    export_file = f"{export_dir}/datasets/CViSB_v{version}__dataset_serology_{dateModified}.json"

    # --- static variables ---
    # identifiers
    ds['@context'] = "http://schema.org/"
    ds["@type"] = "Dataset"
    ds["identifier"] = datasetID
    ds["name"] = "Systems Serology"
    ds["measurementCategory"] = "Systems Serology"
    ds["includedInDataCatalog"]= ["https://data.cvisb.org/"]

    # descriptions
    ds["description"] = "Systems Serology aims to define the features of the humoral immune response against a given pathogen. Systems Serology analysis includes measurement of the levels antigen-specific antibodies within individual patients, measurement of antibody-mediated induction of innate immune cell effector functions, measurement of binding of antigen-specific antibodies to Fc-receptors, and measurement of neutralizing activity."
    ds["keywords"] = ["systems serology", "Ebola", "Ebola virus", "EBOV", "Lassa", "Lassa virus", "LASV", "ADCD", "ADNP", "ADCP", "NKD"]

    # credit
    ds['author'] = [helpers.getLabAuthor("Galit")]
    ds['publisher'] = [helpers.cvisb]
    ds['funding'] = helpers.cvisb_funding
    ds['license'] = "https://creativecommons.org/share-your-work/public-domain/cc0/"




# --- possibly variable, each time ---
    ds["version"] = version
    ds["dateModified"] = dateModified
    # data downloads
    ds["dataDownloadIDs"] = downloads
    # pulled from experiments
    ds["spatialCoverage"] = []
    ds["measurementTechnique"] = ["ADNP"]

    with open(export_file, 'w') as outfile:
        json.dump([ds], outfile)

    return(ds)

get_serology_dataset("/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/output_data", "2019-10-16", [], [], '0.1')
