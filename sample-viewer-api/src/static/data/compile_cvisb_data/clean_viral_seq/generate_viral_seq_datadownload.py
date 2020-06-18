import pandas as pd
import os
import json
from copy import deepcopy

# [Import helper functions]  ----------------------------------------------------------------------------------------------------
os.chdir("/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/compile_cvisb_data/")
# Helper functions for cleanup...
import helpers

ALIGNMENTS = [
    {"virus": "Lassa",
     "segment": "S",
     "filename": "LASV_NP-GP_2019-09-11.fasta",
     "description": "Lassa virus NP-GP curated alignment",
     "curated": True,
     "url": "https://raw.githubusercontent.com/cvisb/curated-alignments/master/lassa/LASV_NP_GPC_2019.11.21.fasta"},
    {"virus": "Lassa",
     "segment": "L",
     "filename": "LASV_L_Z_2019.11.22.fasta",
     "description": "Lassa virus L-Z curated alignment",
     "curated": True,
     "url": "https://raw.githubusercontent.com/cvisb/curated-alignments/master/lassa/LASV_L_Z_2019.11.22.fasta"},
    {"virus": "Ebola",
     "segment": None,
     "filename": "EBOV_ORFs_2020.06.12.fasta",
     "curated": True,
     "description": "Ebola virus curated alignment",
     "url": "https://raw.githubusercontent.com/cvisb/curated-alignments/master/ebola/EBOV_ORFs_2020.06.12.fasta"}
]


def get_viralseq_downloads(dateModified, downloads, experiments, version, datasetVirus):
    # Combine together curated lassa sequence, curated ebola sequence, and all the individual raw files (contained in downloads, a DataFrame)

    # Make sure arrays are arrays
    ds = deepcopy(downloads)
    ds['measurementTechnique'] = ds.measurementTechnique.apply(
        helpers.listify)
    ds['variableMeasured'] = ds.variableMeasured.apply(
        helpers.listify)
    ds['citation'] = ds.citation.apply(helpers.listify)


    for file in ALIGNMENTS:
        if(file['virus'] == datasetVirus):
            download = get_curated(dateModified, version, experiments, datasetVirus,
                                    file['filename'], file['description'], file['url'], file['curated'], file['segment'])
            ds = ds.append(download, ignore_index=True)

    return(pd.DataFrame(ds))


""" Summary, curated file containing all the experiment IDs from the experiments.
"""


def get_curated(dateModified, version, experiments, datasetVirus, filename, description, url, curated, virusSegment=None):
    ds = {}

 # Filter out only the experiments which are "curated"
    if(curated):
        expts = experiments[experiments.inAlignment]
    else:
        expts = experiments
    if(virusSegment is not None):
        expts = expts[expts.segment == virusSegment]

    # --- static variables ---
    # identifiers
    ds['@context'] = "http://schema.org/"
    ds["@type"] = "DataDownload"
    ds["name"] = filename
    ds["identifier"] = filename
    ds["description"] = description
    ds["contentUrl"] = url
    ds["url"] = "https://github.com/cvisb/curated-alignments"

    if(datasetVirus == "Ebola"):
        ds["includedInDataset"] = "ebola-virus-seq"
        ds["variableMeasured"] = ["Ebola virus sequence"]
        ds["keywords"] = ["virus sequencing", "Ebola", "Ebola virus", "EBOV"]
    elif(datasetVirus == "Lassa"):
        ds["includedInDataset"] = "lassa-virus-seq"
        ds["variableMeasured"] = ["Lassa virus sequence"]
        ds["keywords"] = ["virus sequencing", "Lassa", "Lassa virus", "LASV"]
    if(virusSegment is not None):
        ds["keywords"].append(f"{virusSegment} segment")

    # properties
    ds["measurementCategory"] = "virus sequencing"
    if(curated):
        ds["additionalType"] = "curated data"
    else:
        ds["additionalType"] = "summary data"
    ds["encodingFormat"] = "text/fasta"

    # credit
    ds['creator'] = [helpers.getLabAuthor("KGA")]
    ds['publisher'] = [helpers.cvisb]

    # --- possibly variable, each time ---
    ds["version"] = version
    ds["dateModified"] = dateModified

    # pulled from experiments
    ds['citation'] = helpers.getUnique(expts, "citation")
    # Flatten citations from list of lists to list
    # ds['citation'] = ds.citation.apply(lambda l: [item for sublist in l for item in sublist])
    ds["measurementTechnique"] = helpers.getUnique(
        expts, "measurementTechnique")
    ds["measurementTechnique"] = helpers.getUnique(
        expts, "measurementTechnique")
    ds["experimentIDs"] = helpers.getUnique(expts, "experimentID")

    return(ds)
    return(pd.DataFrame(ds))
