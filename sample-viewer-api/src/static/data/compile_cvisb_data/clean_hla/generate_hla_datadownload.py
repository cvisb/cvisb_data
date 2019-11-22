import pandas as pd
import os
import json

# [Import helper functions]  ----------------------------------------------------------------------------------------------------
# Helper functions for cleanup...
import helpers


def get_hla_downloads(dateModified, downloads, experiments, version, datasetID):
    summary = get_hla_summary(dateModified, experiments, version, datasetID)
    bams = get_bam_files(dateModified, experiments, version, datasetID)

    ds = pd.concat([summary, bams])
    return(ds)

def get_hla_summary(dateModified, experiments, version, datasetID, fileName = "HLA_Genotype_calls.csv", fileURL="https://raw.githubusercontent.com/andersen-lab/lassa-ebola-hla/master/Genotype_calls.csv"):
    ds = {}

    # --- static variables ---
    # identifiers
    ds['@context'] = "http://schema.org/"
    ds["@type"] = "DataDownload"
    ds["includedInDataset"] = datasetID
    ds["name"] = fileName
    ds["description"] = "Summary table of all HLA genotype assignments"
    ds["identifier"] = fileName

    # properties
    ds["measurementCategory"] = "Systems Serology"
    ds["additionalType"] = "summary data"
    ds["encodingFormat"] = "text/csv"
    ds["contentUrl"] = fileURL
    ds["datePublished"] = "2017-08-11"

    # credit
    ds['creator'] = [helpers.getLabAuthor("KGA")]
    ds['publisher'] = [helpers.cvisb]


# --- possibly variable, each time ---
    ds["version"] = version
    ds["dateModified"] = dateModified
    # pulled from experiments
    cats = helpers.getUnique(experiments, "measurementCategory")
    if(len(cats) == 1):
        ds["measurementCategory"] = cats[0]
    else:
        raise Exception("More than one measurementCategory found.  Should only be one per dataset.")
    datasets = helpers.getUnique(experiments, "includedInDataset")
    if(len(datasets) == 1):
        id = datasets[0]
        if(id != datasetID):
            raise Exception("includedInDataset doesn't match between experiments and dataDownloads")
    else:
        raise Exception("More than one includedInDataset found.  Should only be one per dataset.")
    ds['creator'] = helpers.getUnique(experiments, "creator")
    ds['publisher'] = helpers.getUnique(experiments, "publisher")
    ds["measurementTechnique"] = helpers.getUnique(experiments, "measurementTechnique")
    ds["experimentIDs"] = list(experiments.experimentID)

    return(pd.DataFrame([ds]))

def get_bam_files(dateModified, experiments, version, datasetID):
    bams = []
    for i, expt in experiments.iterrows():
        bam_loc = get_bam_file(dateModified, expt, version, datasetID)
        bams.append(bam_loc)

    return(pd.DataFrame(bams))

def get_bam_file(dateModified, expt, version, datasetID, fileDescription="raw .bam file for"):
    ds = {}

    # --- static variables ---
    # identifiers
    ds['@context'] = "http://schema.org/"
    ds["@type"] = "DataDownload"
    ds["includedInDataset"] = datasetID
    ds["name"] = f"{expt.privatePatientID}.bam"
    ds["description"] = f"{fileDescription} {ds['name']}"
    ds["identifier"] = ds['name']

    # properties
    ds["additionalType"] = "raw data"
    ds["encodingFormat"] = "application/bam"
    loc = get_bam_location(expt.privatePatientID)
    ds["contentUrl"] = loc['contentUrl']
    ds["contentUrlRepository"] = loc['contentUrlRepository']
    ds["contentUrlIdentifier"] = expt.privatePatientID

# --- possibly variable, each time ---
    ds["version"] = version
    ds["dateModified"] = dateModified
    # pulled from experiments
    creator = expt.creator
    if(creator is not None):
        ds['creator'] = [expt.creator]
    ds['publisher'] = [expt.publisher]
    ds["measurementTechnique"] = [expt.measurementTechnique]
    ds["measurementCategory"] = expt.measurementCategory
    ds["experimentIDs"] = [expt.experimentID]

    return(ds)

def get_bam_location(exptID):
    url = f"https://storage.cloud.google.com/andersen-lab_project_hla/bam_files/{exptID}.bam?folder=true&organizationId=583273335017"
    contentUrlRepository = "SRA"
    contentRepository = "Google Cloud Storage"
    return({"contentUrl": url, "contentRepository": contentRepository, "contentUrlRepository": contentUrlRepository})
