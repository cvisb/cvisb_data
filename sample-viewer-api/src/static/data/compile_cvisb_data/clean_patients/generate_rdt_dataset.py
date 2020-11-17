# @name:        generate_vitals_dataset.py
# @summary:     Compiles together systems serology data in a CViSB schema format
# @description:
# @sources:
# @depends:
# @author:      Laura Hughes
# @email:       lhughes@scripps.edu
# @license:     Apache-2.0
# @date:        13 November 2020

import pandas as pd

# [Import helper functions]  ----------------------------------------------------------------------------------------------------
import helpers


def get_rdt_dataset(dateModified, downloadIDs, experiments, countries, version, dataset_id):
    ds = {}

    # --- static variables ---
    # identifiers
    ds['@context'] = "http://schema.org/"
    ds["@type"] = "Dataset"
    ds["identifier"] = dataset_id
    ds["name"] = "Rapid Antigen Tests of Ebola/Lassa Patients"

    ds["includedInDataCatalog"] = ["https://data.cvisb.org/"]
    ds["url"] = f"https://data.cvisb.org/dataset/{dataset_id}"

    # descriptions
    ds["description"] = "Rapid antigen test data of suspected or confirmed Ebola or Lassa Fever patients in the acute phase of infection."
    ds["keywords"] = ["RDT", "Rapid Diagnostic Test", "Rapid Antigen Test",
    "Malaria", "Plasmodium",
                      "Ebola",
                      "Ebola virus",
                      "EBOV",
                      "Lassa",
                      "Lassa virus",
                      "LASV"]
    ds["datePublished"] = "2020-11-16"

    # credit
    ds['funding'] = helpers.cvisb_funding
    ds['license'] = "https://creativecommons.org/licenses/by/4.0/"

# --- possibly variable, each time ---
    ds["version"] = version
    ds["dateModified"] = dateModified
    # passed in; from patient info.
    ds["spatialCoverage"] = countries
    # data downloads
    ds["dataDownloadIDs"] = helpers.getUnique(downloadIDs, "identifier")
    # pulled from experiments
    cats = helpers.getUnique(experiments, "measurementCategory")
    if(len(cats) == 1):
        ds["measurementCategory"] = cats[0]
    else:
        raise Exception("More than one measurementCategory found.  Should only be one per dataset.")
    ds["measurementTechnique"] = helpers.getUnique(experiments, "measurementTechnique")
    ds["variableMeasured"] = helpers.getUnique(experiments, "variableMeasured")
    ds['creator'] = helpers.getUnique(experiments, "creator")
    ds['publisher'] = helpers.getUnique(experiments, "publisher")

    return(pd.DataFrame([ds]))
