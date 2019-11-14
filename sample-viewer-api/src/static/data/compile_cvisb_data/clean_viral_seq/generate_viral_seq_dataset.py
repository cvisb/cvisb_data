import pandas as pd
import os
import json

# [Import helper functions]  ----------------------------------------------------------------------------------------------------
os.chdir("/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/")
# Helper functions for cleanup...
import helpers



"""
datsetVirus should be Ebola || Lassa
"""
def get_viralseq_dataset(dateModified, downloads, metadata, version, datasetVirus):
    ds = {}

    # --- static variables ---
    # identifiers
    ds['@context'] = "http://schema.org/"
    ds["@type"] = "Dataset"
    ds["includedInDataCatalog"]= ["https://data.cvisb.org/"]
    ds["measurementCategory"] = "viral sequencing"
    ds["url"] = "https://github.com/cvisb/curated-alignments"

    if(datasetVirus == "Ebola"):
        ds["identifier"] = "ebola-viral-seq"
        ds["name"] = "Ebola Viral Sequencing"
        ds["variableMeasured"] = ["Ebola virus sequence"]
        ds["description"] = "Viral Sequencing of acute EBOV patients from Sierra Leone, Liberia, Guinea, and other countries generated using Illumina Platform sequencing technology. Viral sequencing data will be used to determine potential correlations between the specific infecting virus genome and patient survival and development of sequelae."
        ds["keywords"] = ["viral sequencing", "Ebola", "Ebola virus", "EBOV"]
    elif(datasetVirus == "Lassa"):
        ds["identifier"] = "lassa-viral-seq"
        ds["name"] = "Lassa Viral Sequencing"
        ds["variableMeasured"] = ["Lassa virus sequence"]
        ds["description"] = "Viral Sequencing of acute LASV patients from Sierra Leone, Nigeria, Liberia, Guinea, and other countries generated using Illumina Platform sequencing technology. Viral sequencing data will be used to determine potential correlations between the specific infecting virus genome and patient survival and development of sequelae."
        ds["keywords"] = ["viral sequencing", "Lassa", "Lassa virus", "LASV"]

    # credit
    ds['author'] = [helpers.getLabAuthor("KGA")]
    ds['publisher'] = [helpers.cvisb]
    ds['funding'] = helpers.cvisb_funding
    ds['license'] = "https://creativecommons.org/share-your-work/public-domain/cc0/"


# --- possibly variable, each time ---
    ds["version"] = version
    ds["dateModified"] = dateModified
    # data downloads
    dwnld_ids = list(downloads.loc[downloads.includedInDataset == ds["identifier"], 'identifier'])
    ds["dataDownloadIDs"] = dwnld_ids
    # pulled from metadata
    ds["spatialCoverage"] = helpers.getUnique(metadata, "country")
    ds["measurementTechnique"] = helpers.getUnique(metadata, "measurementTechnique")

    return(pd.DataFrame([ds]))

# get_viralseq_dataset("/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/output_data", "2019-10-16", [], [], '0.2')
