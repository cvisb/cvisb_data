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
    ds["name"] = "mmc2.xlsx"
    ds["description"] = "Source Data of Antigen-Specific Titers, FcRs, and Functional Responses across Samples"
    ds["identifier"] = f"{datasetID}_{ds['name']}"

    if("rtpcr" in datasetID):
        ds["measurementCategory"] = "clinical measurements"
    else:
        ds["measurementCategory"] = "Systems Serology"

    # properties
    ds["additionalType"] = "summary data"
    ds["encodingFormat"] = "application/vnd.ms-excel"
    ds["contentUrl"] = "https://www.cell.com/immunity/fulltext/S1074-7613(20)30327-7#supplementaryMaterial"

    # credit
    ds['creator'] = [helpers.getLabAuthor("Galit")]
    ds['publisher'] = [helpers.cvisb]

    # --- possibly variable, each time ---
    ds["version"] = version
    ds["dateModified"] = dateModified
    ds["updatedBy"] = updatedBy

    # pulled from experiments
    ds["measurementTechnique"] = helpers.getUnique(experiments, "measurementTechnique")
    ds["variableMeasured"] = helpers.getUnique(experiments, "variableMeasured")
    ds["citation"] = helpers.getUnique(experiments, "citation")
    ds["experimentIDs"] = experiments.experimentID

    # with open(export_file, 'w') as outfile:
    #     json.dump([ds], outfile)

    return(pd.DataFrame([ds]))
