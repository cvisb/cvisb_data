# @name:        generate_serology_dataset.py
# @summary:     Compiles together systems serology data in a CViSB schema format
# @description:
# @sources:
# @depends:
# @author:      Laura Hughes
# @email:       lhughes@scripps.edu
# @license:     Apache-2.0
# @date:        1 October 2020
# @example:     get_serology_dataset()

import pandas as pd
import os
import json

# [Import helper functions]  ----------------------------------------------------------------------------------------------------
import helpers

def get_serology_dataset(dateModified, downloads, experiments, version, datasetID):
    ds = {}
    # --- static variables ---
    # identifiers
    ds['@context'] = "http://schema.org/"
    ds["@type"] = "Dataset"
    ds["identifier"] = datasetID
    if("rtpcr" in datasetID):
        ds["name"] = "RT-PCR Measurements of Seattle COVID-19 Patients"
        ds["measurementCategory"] = "clinical measurements"
        ds["description"] = "RT-PCR measurements of SARS-CoV-2 levels for COVID-19 patients in Seattle, Washington. Complimentary dataset to Systems Serology measurments of the same patient cohort."
        keywords = ["RT-PCR", "PCR", "SARS-CoV-2", "COVID-19", "Seattle"]
    else:
        ds["name"] = "Systems Serology Measurements of Seattle COVID-19 Patients"
        ds["measurementCategory"] = "Systems Serology"
        ds["description"] = "Systems Serology aims to define the features of the humoral immune response against a given pathogen. Systems Serology analysis includes measurement of the levels antigen-specific antibodies within individual patients, measurement of antibody-mediated induction of innate immune cell effector functions, measurement of binding of antigen-specific antibodies to Fc-receptors, and measurement of neutralizing activity. Samples are taken from COVID-19 patients in Seattle, Washington."
        keywords = ["Systems Serology", "SARS-CoV-2", "COVID-19", "Seattle"]

    ds["includedInDataCatalog"] = ["https://data.cvisb.org/"]

    # descriptions

    # credit
    ds['creator'] = [helpers.getLabAuthor("Galit")]
    ds['publisher'] = [helpers.cvisb]
    ds['funding'] = helpers.cvisb_funding
    ds['license'] = "https://creativecommons.org/licenses/by/4.0/"

# --- possibly variable, each time ---
    ds["spatialCoverage"] = [helpers.getCountry("USA")]
    ds["version"] = version
    ds["dateModified"] = dateModified
    # data downloads
    ds["dataDownloadIDs"] = helpers.getUnique(downloads, "identifier")

    measTechs = helpers.getUnique(experiments, "measurementTechnique")
    keywords.extend(measTechs)
    ds["keywords"] = keywords
    ds["measurementTechnique"] = measTechs
    ds["variableMeasured"] = helpers.getUnique(experiments, "variableMeasured")

    ds["citation"] = helpers.getUnique(experiments, "citation")

    return(pd.DataFrame([ds]))
