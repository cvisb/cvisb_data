import pandas as pd
import os
import json

# [Import helper functions]  ----------------------------------------------------------------------------------------------------
os.chdir("/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/compile_cvisb_data/")
# Helper functions for cleanup...
import helpers

ALIGNMENTS = [{"virus": "Lassa",
               "filename": "LASV_NP-GP_2019-09-11.fasta",
               "description": "Lassa virus NP-GP alignment",
               "url": "https://raw.githubusercontent.com/cvisb/curated-alignments/master/lassa/LASV_NP-GP_2019-09-11.fasta"}]


def get_viralseq_downloads(dateModified, downloads, experiments, version, datasetVirus):
    # Combine together curated lassa sequence, curated ebola sequence, and all the individual raw files (contained in downloads, a DataFrame)
    lasv = pd.DataFrame()


    # Make sure arrays are arrays
    downloads['measurementTechnique'] = downloads.measurementTechnique.apply(
        helpers.listify)
    downloads['citation'] = downloads.citation.apply(helpers.listify)
    ds = downloads

    for file in ALIGNMENTS:
        download = get_lasv_curated(dateModified, "0.1", experiments, datasetVirus, file['filename'], file['description'], file['url'])
        ds = ds.append(download, ignore_index=True)

    return(pd.DataFrame(ds))


""" Summary, curated file containing all the experiment IDs from the experiments.
"""


def get_lasv_curated(dateModified, version, experiments, datasetVirus, filename, description, url, virusSegment=None):
    ds = {}

 # Filter out only the experiments which are "curated" and for that particular virus
    expts = experiments[(experiments.cohort == datasetVirus)
                        & experiments.inAlignment]

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
        ds["includedInDataset"] = "ebola-viral-seq"
        ds["variableMeasured"] = ["Ebola virus sequence"]
        ds["keywords"] = ["viral sequencing", "Ebola", "Ebola virus", "EBOV"]
    elif(datasetVirus == "Lassa"):
        ds["includedInDataset"] = "lassa-viral-seq"
        ds["variableMeasured"] = ["Lassa virus sequence"]
        ds["keywords"] = ["viral sequencing", "Lassa", "Lassa virus", "LASV"]

    # properties
    ds["measurementCategory"] = "viral sequencing"
    ds["additionalType"] = "curated data"
    ds["encodingFormat"] = "text/fasta"

    # credit
    ds['author'] = [helpers.getLabAuthor("KGA")]
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
    ds["experimentIDs"] = helpers.getUnique(expts, "experimentID")

    return(ds)
    return(pd.DataFrame(ds))


# get_lasv_curated("2019-10-01", "1", [])
#
#
#
# get_lasv_curated("2019-10-01", "1", [])['identifier']
