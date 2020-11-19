# @name:        generate_serology_dataset.py
# @summary:     Compiles together systems serology data in a CViSB schema format
# @description:
# @sources:
# @depends:
# @author:      Laura Hughes
# @email:       lhughes@scripps.edu
# @license:     Apache-2.0
# @date:        31 October 2019
# @example:     get_serology_dataset("/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/output_data", "2019-10-16", [], [], '0.1')

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
    ds["name"] = "Systems Serology Measurements of Ebola/Lassa Patients and Survivors"
    ds["measurementCategory"] = "Systems Serology"
    ds["includedInDataCatalog"] = ["https://data.cvisb.org/"]

    # descriptions
    ds["description"] = "Systems Serology aims to define the features of the humoral immune response against a given pathogen. Systems Serology analysis includes measurement of the levels antigen-specific antibodies within individual patients, measurement of antibody-mediated induction of innate immune cell effector functions, measurement of binding of antigen-specific antibodies to Fc-receptors, and measurement of neutralizing activity. Samples are taken from Ebola or Lassa Fever patients, convalescent survivors, or household contacts of these patients in Sierra Leone."

    # credit
    ds['creator'] = [helpers.getLabAuthor("Galit")]
    ds['publisher'] = [helpers.cvisb]
    ds['funding'] = helpers.cvisb_funding
    ds['license'] = "https://creativecommons.org/licenses/by/4.0/"

# --- possibly variable, each time ---
    ds["spatialCoverage"] = [helpers.getCountry("SLE")]
    ds["version"] = version
    ds["dateModified"] = dateModified
    # data downloads
    ds["dataDownloadIDs"] = helpers.getUnique(downloads, "identifier")

    measTechs = helpers.getUnique(experiments, "measurementTechnique")
    keywords = ["Systems Serology", "Ebola", "Ebola virus", "EBOV", "Lassa", "Lassa virus", "LASV"]
    keywords.extend(measTechs)
    ds["keywords"] = keywords
    ds["measurementTechnique"] = measTechs
    ds["variableMeasured"] = helpers.getUnique(experiments, "variableMeasured")

    ds["citation"] = helpers.getUnique(experiments, "citation")

    return(pd.DataFrame([ds]))
