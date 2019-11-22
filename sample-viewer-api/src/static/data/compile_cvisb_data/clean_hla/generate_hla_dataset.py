# @name:        generate_hla_dataset.py
# @summary:     Compiles together systems serology data in a CViSB schema format
# @description:
# @sources:
# @depends:
# @author:      Laura Hughes
# @email:       lhughes@scripps.edu
# @license:     Apache-2.0
# @date:        31 October 2019

import pandas as pd
import os
import json

# [Import helper functions]  ----------------------------------------------------------------------------------------------------
import helpers


def get_hla_dataset(dateModified, downloadIDs, experiments, countries, version, datasetID):
    ds = {}

    # --- static variables ---
    # identifiers
    ds['@context'] = "http://schema.org/"
    ds["@type"] = "Dataset"
    ds["identifier"] = datasetID
    ds["name"] = "HLA Genotype Sequencing of Ebola/Lassa Patients and Survivors"

    ds["includedInDataCatalog"] = ["https://data.cvisb.org/"]
    ds["url"] = "https://github.com/andersen-lab/lassa-ebola-hla"

    # descriptions
    ds["description"] = "Human leukocyte antigen (HLA) Genotype Sequencing of Ebola/Lassa survivors, non-survivors, contacts and healthy controls from Sierra Leone and Nigeria using Illumina TruSight HLA v2 Sequencing Panel. HLA data will be used to determine potential risk alleles for Ebola/Lassa infection, survival and development of sequelae."
    ds["keywords"] = ["HLA",
                      "human leukocyte antigen",
                      "Ebola",
                      "Ebola virus",
                      "EBOV",
                      "Lassa",
                      "Lassa virus",
                      "LASV"]
    ds["datePublished"] = "2017-08-11"

    # credit
    ds['funding'] = helpers.cvisb_funding
    ds['license'] = "https://creativecommons.org/licenses/by/4.0/"

# --- possibly variable, each time ---
    ds["version"] = version
    ds["dateModified"] = dateModified
    # passed in; from patient info.
    ds["spatialCoverage"] = countries
    # data downloads
    ds["dataDownloadIDs"] = downloadIDs
    # pulled from experiments
    cats = helpers.getUnique(experiments, "measurementCategory")
    if(len(cats) == 1):
        ds["measurementCategory"] = cats[0]
    else:
        raise Exception("More than one measurementCategory found.  Should only be one per dataset.")
    ds["measurementTechnique"] = helpers.getUnique(experiments, "measurementTechnique")
    ds['creator'] = helpers.getUnique(experiments, "creator")
    ds['publisher'] = helpers.getUnique(experiments, "publisher")

    return(pd.DataFrame([ds]))
