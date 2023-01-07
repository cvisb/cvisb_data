import pandas as pd
import numpy as np
from datetime import date
from os        import path,mkdir
import json

date_modified = date(2022, 11, 22).strftime('%Y-%m-%d')

country = {
    "@type": "Country",
    "name":  "Sierra Leone",
    "identifier": "SL",
    "url": f"https://www.iso.org/obp/ui/#iso:code:3166:SL"
}

dataset = {
    "_id":                  f"lassa_seroprev_household_dataset",
    "@context":             "http://schema.org/",
    "@type":                "Dataset",
    "identifier":           "lassa-household-measurements",
    "spatialCoverage":      [country],
    "license":              "https://creativecommons.org/licenses/by/4.0/",
    "name":                 "Lassa virus IgG seroprevalence in Sierra Leone",
    "variableMeasured":     ["Household measurements in relation to presence of LASV IgG antibodies"],
    "measurementTechnique": ["Household surveys; Household assessments; dried blood spot (DBS) collection"],
    "description":          "Seroprevalence of anti-Lassa Virus IgG antibodies in three districts of Sierra Leone: A cross-sectional, population-based study",
    "dateModified":         date_modified,
    "creator":              [{'name': 'Emily J. Engel'}, {'name': 'Donald S. Grant'}, {'name': 'John S. Schieffelin'}],
    "dataDownloadIDs":      ["PEER_HealthData_Public.xlsx"],
    "measurementCategory":  "clinical observations"
}
df = pd.read_excel(io="/Users/julia/code/peer_healthdata.xlsx", engine="openpyxl", sheet_name="peer_health")

def bool_or_null(val):
    if val:
        return bool(val)
    return None

experiments = []
patients    = []
for index, row in df.iterrows():
    survey_data = {
        "_id":                f"lassa_seroprev_household_survey_data_{index}",
        "@type":              "SurveyData",
        "rodentHoles":        bool_or_null(row["rodholes"]),
        "cement":             bool_or_null(row["cement"]),
        "foodInHouse":        bool_or_null(row["foodhouse"]),
        "foodInRoom":         bool_or_null(row["foodroom"]),
        "waterInHouse":       bool_or_null(row["waterhouse"]),
        "waterInRoom":        bool_or_null(row["waterroom"]),
        "rodentFecesInHouse": bool_or_null(row["rfhouse"]),
        "rodentFecesInRoom":  bool_or_null(row["rfroom"]),
        "waterstoreCovered":  bool_or_null(row["waterstore"]),
        "bushesDistance":     row["bushes"],
        "veggieDistance":     row["veggie"],
        "refuseDistance":     row["refuse"],
        "toiletDistance":     row["toilet"],
        "waterDistance":      row["water"],
        "waterType":          row["wtype"],
        "roofMaterial":       row["roof1"],
        "wallMaterial":       row["wall"],
        "floorMaterial":      row["floor"],
        "toiletCondition":    row["tcondition"] if row['tcondition'] else '',
        "occupation":         row["occ"]
    }

    survey_data = {k: v for k, v in survey_data.items() if v not in (None, "", np.nan)}

    gender = "Female" if row["sex"] == "F" else "Male"

    experiment = {
        "_id":               f"lassa_seroprev_household_experiment_{index}",
        "cohort":            "Lassa",
        "country":           country,
        "dateModified":      date_modified,
        "gender":            gender,
        "privatePatientID":  row["ID"],
        "experimentID":      row["Sample ID"],
        "variableMeasured":  "Household measurements in relation to presence of LASV IgG antibodies",
        "includedInDataset": "lassa-household-measurements",
        "data":              [survey_data],
        "measurementTechnique": "Clinical Observation",
        
    }

    elisa = {
        "virus":       "Lassa",
        "assayType":   "IgG",
        "ELISAresult": row["iggfinal"].lower()
    }

    chiefdom = {
        '@type': "AdministrativeArea",
        "administrativeType": "chiefdom",
        "administrativeUnit": 3,
        "locationType":       "home",
        "name":               row["chiefdom"],
    }

    village = {
        '@type': "AdministrativeArea",
        "administrativeType": "district",
        "administrativeUnit": 2,
        "locationType":       "home",
        "name":               row["village"],
    }

    admin_country = {
        '@type': "AdministrativeArea",
        "name":  "Sierra Leone",
        "administrativeUnit": 0,
        "administrativeType": "country",
        "locationType":       "home"
    }

    patient = {
        "_id":                  f"lassa_seroprev_household_patient_{index}",
        "patientID":            row["ID"],
        "dateModified":         date_modified,
        "cohort":               "Lassa",
        "outcome":              "unknown",
        "updatedBy":            "Julia Mullen",
        "country":              country,
        "location":             [admin_country, chiefdom, village],
        "elisa":                [elisa],
    }
    experiments.append(experiment)
    patients.append(patient)

def save(name, data, segmented=False):
    """
    Saves name, data in batches of 200 e.g., 'patients0.json, patients200.json'
    """
    output_path = path.join(path.dirname(path.abspath(__file__)), 'lassa_seroprev_housing_data')
    if not path.exists(output_path):
        mkdir(output_path)

    if segmented:
        i = 0
        while i < len(data):
            j = i + 20
            if j > len(data):
                j = len(data)

            file_path = path.join(output_path, f'{name}{i}.json')
            with open(file_path, 'w') as output_file:
                json.dump(data[i:j], output_file)

            return # remove
            i = j
    else:
        # usual case, just save like normal
        file_path = path.join(output_path, f'{name}.json')
        with open(file_path, 'w') as output_file:
            json.dump(data, output_file)

if __name__ == '__main__':
    output = {
        'patients':       patients,
        'experiments':    experiments,
        'dataset':        [dataset],
    }

    for name, data in output.items():
        print(f"{name} {len(data)}")
        save(name, data, segmented=True)
