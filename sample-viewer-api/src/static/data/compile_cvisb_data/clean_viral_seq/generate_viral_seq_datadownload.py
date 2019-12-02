import pandas as pd
import os
import json

# [Import helper functions]  ----------------------------------------------------------------------------------------------------
os.chdir("/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/compile_cvisb_data/")
# Helper functions for cleanup...
import helpers

ALIGNMENTS = [
    {"virus": "Lassa",
     "segment": "S",
     "filename": "LASV_NP-GP_2019-09-11.fasta",
     "description": "Lassa virus NP-GP curated alignment",
     "url": "https://raw.githubusercontent.com/cvisb/curated-alignments/master/lassa/LASV_NP_GPC_2019.11.21.fasta"},
    {"virus": "Lassa",
     "segment": "L",
     "filename": "LASV_L_Z_2019.11.22.fasta",
     "description": "Lassa virus L-Z curated alignment",
     "url": "https://raw.githubusercontent.com/cvisb/curated-alignments/master/lassa/LASV_L_Z_2019.11.22.fasta"},
    {"virus": "Ebola",
     "segment": None,
     "filename": "EBOV_ORFS_2019.11.22.fasta",
     "description": "Ebola virus curated alignment",
     "url": "https://github.com/cvisb/curated-alignments/blob/master/ebola/EBOV_ORFS_2019.11.22.fasta"}
]


def get_viralseq_downloads(dateModified, downloads, experiments, version, datasetVirus):
    # Combine together curated lassa sequence, curated ebola sequence, and all the individual raw files (contained in downloads, a DataFrame)
    lasv = pd.DataFrame()

    # Make sure arrays are arrays
    downloads['measurementTechnique'] = downloads.measurementTechnique.apply(
        helpers.listify)
    downloads['variableMeasured'] = downloads.variableMeasured.apply(
        helpers.listify)
    downloads['citation'] = downloads.citation.apply(helpers.listify)
    ds = downloads

    for file in ALIGNMENTS:
        if(file['virus'] == datasetVirus):
            download = get_curated(dateModified, version, experiments, datasetVirus,
                                    file['filename'], file['description'], file['url'], file['segment'])
            ds = ds.append(download, ignore_index=True)

    return(pd.DataFrame(ds))


""" Summary, curated file containing all the experiment IDs from the experiments.
"""


def get_curated(dateModified, version, experiments, datasetVirus, filename, description, url, virusSegment=None):
    ds = {}

 # Filter out only the experiments which are "curated"
    if(virusSegment is not None):
        expts = experiments[experiments.inAlignment & (experiments.segment == virusSegment)]
    else:
        expts = experiments[experiments.inAlignment]

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

    # properties
    ds["measurementCategory"] = "virus sequencing"
    ds["additionalType"] = "curated data"
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
