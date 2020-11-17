# Code to cleanup serology data from "Distinct Early Serological Signatures Track with SARS-CoV-2 Survival", Immunity 2020
# Note: code is certainly not the most efficient or elegant. Apologies
# Laura Hughes, lhughes@scripps.edu
# October 2020

import pandas as pd
# import helpers
from datetime import datetime
import re
from math import ceil

import os
os.chdir("/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/compile_cvisb_data")
# Helper functions for cleanup...
import helpers

# constants, statics.
sero_file="/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/input_data/expt_summary_data/systems_serology/systems-serology-covid19-01.xlsx"
version = 0.1
updatedBy = "Tomer Zohar"
dateUpdated = "2020-10-19"
output_dir = "/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/output_data"
# output_dir = "../output_data"
def clean_sero_covid(sero_file, version, updatedBy, dateUpdated, output_dir):
    patientCols = ["patientID", "alternateIdentifier",
    "gender", "ethnicity", "age",
    "outcome", "cohort", "species", "hasPatientData",
    "dateModified", "updatedBy", "dataStatus", "sourceFiles",
    "country", "location", "locationPrivate", "daysOnset","medications", "symptoms",
    "infectionYear", "publisher", "citation"]
    today = datetime.today().strftime("%Y-%m-%d")
    # --- Load data ---
    df = pd.read_excel(sero_file)
    # Remove blank rows
    df.dropna(subset=["SampleID"], inplace=True)

    # --- provenance ---
    df["dateModified"] = dateUpdated
    df["updatedBy"] = updatedBy
    df["sourceFiles"] = df.SampleID.apply(lambda x: [sero_file])
    df["dataStatus"] = "final"
    df['creator'] = df.SampleID.apply(lambda x: [helpers.getLabAuthor("Galit")])
    df['publisher'] = df.SampleID.apply(lambda x: helpers.cvisb)
    citation = helpers.getSource(df.iloc[0],["32783920"])
    df['citation'] = df.SampleID.apply(lambda x: citation)

    # --- patient attributes ---
    df["patientID"] = df.SampleID.apply(lambda x: f"serology32783920_{str(x).zfill(2)}")
    df["alternateIdentifier"] = df.patientID.apply(lambda x: [x])
    df["gender"] = df.Sex.apply(convertSex)
    df["ethnicity"] = df.Race.apply(convertEthnicity)
    # df["age"] = df.Age.apply(convertAge)
    df["age"] = None
    df["outcome"] = df.apply(convertOutcome, axis=1)
    df["daysOnset"] = df.Admit_From_Onset
    df["medications"] = df.apply(getMeds, axis=1)

    # constants
    df["cohort"] = "COVID-19"
    df["species"] = "Homo sapiens"
    df["country"] = df.SampleID.apply(lambda x: helpers.getCountry("USA"))
    df["countryName"] = "United States"
    df["location"] = df.SampleID.apply(lambda x: [{"name": "Seattle", "locationType": "unknown", "administrativeType": "city", "@type": "AdministrativeArea"}, {"name": "Washington", "locationType": "unknown", "administrativeType": "state", "administrativeUnit": 1, "identifier": "US-WA", "@type": "AdministrativeArea"}, {"name": "United States", "locationType": "unknown", "administrativeType": "country", "administrativeUnit": 0, "identifier": "US", "@type": "Country"}])
    df["locationPrivate"] = df.location
    df["hasPatientData"] = True
    df["infectionYear"] = 2020
    df['version'] = version

    df["symptoms"] = df.Ards.apply(getSymptoms)

    # --- Check uniqueness ---
    if(sum(df.duplicated(subset=["patientID"]))):
        print("ERROR! Duplicate patient IDs detected")

    df[patientCols].to_json(f"{output_dir}/patients/{today}_patient_sero_serology32783920.json", orient="records")


    # --- Experiments cleanup ---
    # --- SEROLOGY ---
    sero = df[["patientID", "updatedBy", "version", "sourceFiles", "dataStatus", "citation", "creator", "publisher", "dateModified", 'S IgG1','RBD IgG1','N IgG1','S IgG2','RBD IgG2','N IgG2','S IgG3','RBD IgG3','N IgG3','S IgG4','RBD IgG4','N IgG4','S IgA1','RBD IgA1','N IgA1','S IgA2','RBD IgA2','N IgA2','S IgM','RBD IgM','N IgM','S FcRg2A','RBD FcRg2A','N FcRg2A','S FcRg2b','RBD FcRg2b','N FcRg2b','S FcRg3A','RBD FcRg3A','N FcRg3A','S SNA','RBD SNA','N SNA','S RCA','RBD RCA','N RCA','S ADCP','RBD ADCP','N ADCP','S ADNP','RBD ADNP','N ADNP','S ADCD','RBD ADCD','N ADCD','S NKD-CD107a','RBD NKD-CD107a','N NKD-CD107a','S NKD-MIP1b','RBD NKD-MIP1b','N NKD-MIP1b', 'NT50']]

    # --- Compile data object ---
    sero = pd.melt(sero, id_vars=["patientID", "updatedBy", "sourceFiles", "dataStatus", "citation", "creator", "publisher", "dateModified", "version"])
    sero["antigen"] = sero.variable.apply(getAntigen)
    sero["assay"] = sero.variable.apply(getAssay)
    sero["data"] = sero.apply(getSeroData, axis=1)

    sero["experimentID"] = sero.apply(lambda x: f"{x.patientID}_{x.assay}_{x.antigen}", axis=1)
    sero["privatePatientID"] = sero.patientID
    sero["releaseDate"] = "2020-10-01"

    # --- experiment classifications ---
    sero["variableMeasured"] = sero.assay
    sero["measurementTechnique"] = "serology"
    sero["measurementCategory"] = "Systems Serology"
    sero["includedInDataset"] = "systems-serology-32783920"
    sero['isControl'] = sero.experimentID.apply(getControl)
    sero.drop(["variable", "value", "antigen", "assay"], axis=1, inplace=True)
    # --- Check uniqueness ---
    if(sum(sero.duplicated(subset=["experimentID"]))):
        print("ERROR! Duplicate experiment IDs detected in serology data")

    chunk_size = 500
    for i in range(0, ceil(len(sero)/chunk_size)):
        sero.iloc[i*chunk_size:(i+1)*chunk_size].to_json(f"{output_dir}/experiments/{today}_experiment_sero_serology32783920_{i}.json", orient="records")

    # --- RT-PCR ---
    pcr = df[df.Viral_Load == df.Viral_Load][["patientID", "updatedBy", "version", "sourceFiles", "dataStatus", "citation", "creator", "publisher", "dateModified", "Viral_Load"]]
    pcr["data"] = pcr.apply(getPCRData, axis=1)

    pcr["experimentID"] = pcr.patientID.apply(lambda x: f"{x}_RT-PCR")
    pcr["privatePatientID"] = pcr.patientID
    pcr["releaseDate"] = "2020-10-01"

    # --- experiment classifications ---
    pcr["variableMeasured"] = "virus level"
    pcr["measurementTechnique"] = "Reverse Transcriptase-Polymerase Chain Reaction"
    pcr["measurementCategory"] = "clinical measurements"
    pcr["includedInDataset"] = "rtpcr-32783920"
    if(sum(pcr.duplicated(subset=["experimentID"]))):
        print("ERROR! Duplicate experiment IDs detected in PCR data")
    pcr.to_json(f"{output_dir}/experiments/{today}_experiment_rtpcr_serology32783920.json", orient="records")

    return({"sero":sero, "pcr": pcr})


def getSeroData(row):
    obj = {}
    obj['@type'] = "SystemsSerology"
    obj['assayType'] = row.assay
    obj['value'] = row.value
    antigen = None
    if(row.antigen == "S"):
        obj['antigen'] = "SARS-CoV-2 Spike Antigen"
    elif(row.antigen == "RBD"):
        obj['antigen'] = "SARS-CoV-2 Receptor Binding Domain Antigen"
    if(row.antigen == "N"):
        obj['antigen'] = "SARS-CoV-2 Nucleocapsid Antigen"
    obj['antigenVirus'] = "SARS-CoV-2"
    # Add in a pseudo-binary if the sample is a control experiment
    if(re.search("control", row.patientID.lower())):
        obj['controlType'] = row.patientID
    return([obj])

def getPCRData(row):
    if(row.Viral_Load == row.Viral_Load):
        obj = {}
        obj['@type'] = "RTPCR"
        obj["virus"] = "SARS-CoV-2"
        obj["RTPCRresult"] = "positive"
        obj["RTPCRvalue"] = row.Viral_Load
        return([obj])

def clean_immune_effector_funcs(filename, sero_cols, updatedBy, dateModified, version, verbose, output_dir):
    # --- checks ---
    # Experiment ID is unique
    # Check if data is null
    null_data = df[df['value'].isnull()]
    if(len(null_data) > 0):
        helpers.log_msg(f"{'-'*50}", verbose)
        helpers.log_msg(f"\tDATA WARNING: {len(null_data)} experiments have null data values", verbose)
        helpers.log_msg(null_data[['sampleID', 'experimentID', 'batchID']], verbose)
        helpers.log_msg(f"{'-'*50}", verbose)

    return(df[sero_cols])

def getAntigen(variable):
    terms = variable.split(" ")
    if(len(terms) == 2):
        return terms[0]

def getAssay(variable):
    terms = variable.split(" ")
    if(len(terms) == 2):
        return terms[1]
    else:
        return(terms[0])

# --- Patient helper functions ---
# 0, Male | 1, Female
def convertSex(sex):
    if(sex == 0):
        return("Male")
    elif(sex == 1):
        return("Female")
# 0, Convalescent | 1, Deceased
def convertOutcome(row):
    if(row.Outcome == 0):
        return("survivor")
    elif(row.Outcome == 1):
        return("dead")
    elif("control" in row.SampleID.lower()):
        return("control")

# 1, American Indian/Alaska Native (AIAN) | 2, Asian | 3, Black | 4, White | 5, Other | 6, Multiracial
def convertEthnicity(race):
    if(race == 1):
        return("American Indian/Alaska Native")
    elif(race == 2):
        return("Asian")
    elif(race == 3):
        return("Black")
    elif(race == 4):
        return("White")
    elif(race == 5):
        return("Other")
    elif(race == 6):
        return("Multiracial")


# 0, younger than 49 | 1, 50-59 | 2, 60-69 | 3, 70-79 | 4, 80 and older
def convertAge(age):
    if(age == 0):
        return("<= 49")
    elif(age == 1):
        return("50-59")
    elif(age == 2):
        return("60-69")
    elif(age == 3):
        return("70-79")
    elif(age == 4):
        return(">= 80")

def getMeds(row):
    return([
    {"@type": "Medication", "name":'Remdesivir', "isDrugAdministered": bool(row.Remdesivir)},
    {"@type": "Medication", "name":'Antibiotics', "isDrugAdministered": bool(row.Antibiotics)},
    {"@type": "Medication", "name":'Chloroquines', "isDrugAdministered": bool(row.Chloroquines)},
    {"@type": "Medication", "name":'Tocilizumab', "isDrugAdministered": bool(row.Tocilizumab)}
    ])

def getSymptoms(ards):
    if(ards==ards):
        return([{
        "@type": "AcuteSymptom", "acuteRespiratoryDistressSyndrome": bool(ards)
        }])

# --- Experiment helper functions ---
def getControl(id):
    return("control" in id.lower())

experiments = clean_sero_covid(sero_file, version, updatedBy, dateUpdated, output_dir)


# EXPORT DATASETS
# EXPORT DATADOWNLOAD
today = datetime.today().strftime("%Y-%m-%d")
os.chdir("/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/compile_cvisb_data/clean_serology/")
from generate_serology_covid1_datadownload import get_serology_downloads
from generate_serology_covid1_dataset import get_serology_dataset

dwnld = get_serology_downloads(dateUpdated, experiments["sero"], updatedBy, version, "systems-serology-32783920")
dwnld.to_json(f"{output_dir}/datadownloads/{today}_download_sero_serology32783920.json", orient="records")
ds = get_serology_dataset(dateUpdated, dwnld, experiments["sero"], version, "systems-serology-32783920")
ds.to_json(f"{output_dir}/datasets/{today}_dataset_sero_serology32783920.json", orient="records")

dwnld = get_serology_downloads(dateUpdated, experiments["pcr"], updatedBy, version, "rtpcr-32783920")
dwnld.to_json(f"{output_dir}/datadownloads/{today}_download_rtpcr_serology32783920.json", orient="records")
ds = get_serology_dataset(dateUpdated, dwnld, experiments["pcr"], version, "rtpcr-32783920")
ds.to_json(f"{output_dir}/datasets/{today}_dataset_rtpcr_serology32783920.json", orient="records")
