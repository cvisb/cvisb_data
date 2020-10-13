# Code to cleanup serology data from "Distinct Early Serological Signatures Track with SARS-CoV-2 Survival", Immunity 2020
# Note: code is certainly not the most efficient or elegant. Apologies
# Laura Hughes, lhughes@scripps.edu
# October 2020

import pandas as pd
import helpers
from datetime import datetime
import re

import os
os.chdir("/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/compile_cvisb_data")
# Helper functions for cleanup...
import helpers

sero_file="/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/input_data/sero_summary_data/systems_serology/systems-serology-covid19-01.xlsx"

def clean_sero_covid(sero_file, verion, dateUpdated)
# --- Load data ---
df = pd.read_excel(sero_file)

# --- provenance ---
df["dateModified"] = "2020-10-01"
df["updatedBy"] = "Laura Hughes"
df["sourceFiles"] = df.SampleID.apply(lambda x: [sero_file])
df["dataStatus"] = "final"
df['citation'] = df.SampleID.apply(lambda x: helpers.getCitation("32783920"))
df['creator'] = df.SampleID.apply(lambda x: [helpers.getLabAuthor("Galit")])
df['publisher'] = df.SampleID.apply(lambda x: [helpers.cvisb])

# --- patient attributes ---
patientCols = ["patientID", "gender", "ethnicity", "age", "outcome", "cohort", "species", "alternateIdentifier", "hasPatientData",
"dateModified", "updatedBy", "dataStatus", "sourceFiles", "country", "daysOnset","medications",
"location", "infectionYear", "publisher", "citation", "sourceCitation"]
df["patientID"] = df.SampleID.apply(lambda x: f"serology32783920_{str(x).zfill(2)}")
df["alternateIdentifier"] = list(df.patientID)
df["gender"] = df.Sex.apply(convertSex)
df["ethnicity"] = df.Race.apply(convertEthnicity)
df["age"] = df.Age.apply(convertAge)
df["outcome"] = df.Outcome.apply(convertOutcome)
df["daysOnset"] = df.Admit_From_Onset
df["medications"] = df.apply(getMeds, axis=1)

# constants
df["cohort"] = "COVID-19"
df["species"] = "Homo sapiens"
df["country"] = df.SampleID.apply(lambda x: helpers.getCountry("USA"))
df["countryName"] = "United States"
df["location"] = df.SampleID.apply(lambda x: [{"name": "Seattle", "locationType": "unknown", "administrativeType": "city"}, {"name": "Washington", "locationType": "unknown", "administrativeType": "state", "administrativeUnit": 1, "identifier": "US-WA"}, {"name": "United States", "locationType": "unknown", "administrativeType": "country", "administrativeUnit": 0, "identifier": "US"}])
df["hasPatientData"] = True
df["infectionYear"] = 2020
df['version'] = version

df["sourceCitation"] = ""
df["symptoms"] = df.Ards.apply(getSymptoms)

df.sample(1).iloc[0]["location"]


# --- Experiments cleanup ---
# --- SEROLOGY ---
NT50
sero = df[["patientID", "updatedBy", "version", "sourceFiles", "dataStatus", "citation", "creator", "publisher", "sourceCitation", "dateModified", 'S IgG1','RBD IgG1','N IgG1','S IgG2','RBD IgG2','N IgG2','S IgG3','RBD IgG3','N IgG3','S IgG4','RBD IgG4','N IgG4','S IgA1','RBD IgA1','N IgA1','S IgA2','RBD IgA2','N IgA2','S IgM','RBD IgM','N IgM','S FcRg2A','RBD FcRg2A','N FcRg2A','S FcRg2b','RBD FcRg2b','N FcRg2b','S FcRg3A','RBD FcRg3A','N FcRg3A','S SNA','RBD SNA','N SNA','S RCA','RBD RCA','N RCA','S ADCP','RBD ADCP','N ADCP','S ADNP','RBD ADNP','N ADNP','S ADCD','RBD ADCD','N ADCD','S NKD-CD107a','RBD NKD-CD107a','N NKD-CD107a','S NKD-MIP1b','RBD NKD-MIP1b','N NKD-MIP1b']]

# --- Compile data object ---
sero = pd.melt(sero, id_vars=["patientID", "updatedBy", "sourceFiles", "dataStatus", "citation", "creator", "publisher", "sourceCitation", "dateModified", "version"])
sero["antigen"] = sero.variable.apply(lambda x: x.split(" ")[0])
sero["assay"] = sero.variable.apply(lambda x: x.split(" ")[1])
sero["data"] = sero.apply(getSeroData, axis=1)

sero["experimentID"] = sero.patientID
sero["privatePatientID"] = sero.patientID
sero["releaseDate"] = "2020-10-01"

# --- experiment classifications ---
sero["variableMeasured"] = sero.assay
sero["measurementTechnique"] = "serology"
sero["measurementCategory"] = "Systems Serology"
sero["includedInDataset"] = "systems-serology-32783920"
sero['isControl'] = sero.experimentID.apply(getControl)


# --- RT-PCR ---
pcr = df[df.Viral_Load == df.Viral_Load][["patientID", "updatedBy", "version", "sourceFiles", "dataStatus", "citation", "creator", "publisher", "sourceCitation", "dateModified", "Viral_Load"]]
pcr["data"] = pcr.apply(getPCRData, axis=1)

pcr["experimentID"] = pcr.patientID.apply(lambda x: f"{x}_RT-PCR")
pcr["privatePatientID"] = pcr.patientID
pcr["releaseDate"] = "2020-10-01"

# --- experiment classifications ---
pcr["variableMeasured"] = "virus level"
pcr["measurementTechnique"] = "Reverse Transcriptase-Polymerase Chain Reaction"
pcr["measurementCategory"] = "clinical measurements"
pcr["includedInDataset"] = "rtpcr-32783920"

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
    return(obj)

def getPCRData(row):
    if(row.Viral_Load == row.Viral_Load):
        obj = {}
        obj['@type'] = "RTPCR"
        obj["virus"] = "SARS-CoV-2"
        obj["RTPCRresult"] = "positive"
        obj["RTPCRvalue"] = row.Viral_Load
        return(obj)

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

# --- Patient helper functions ---
# 0, Male | 1, Female
def convertSex(sex):
    if(sex == 0):
        return("Male")
    elif(sex == 1):
        return("Female")

# 0, Convalescent | 1, Deceased
def convertOutcome(outcome):
    if(outcome == 0):
        return("survivor")
    elif(outcome == 1):
        return("dead")

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
        "@type": "AcuteSymptoms",
        "symptoms": [{"@type": "Symptom", "acuteRespiratoryDistressSyndrome": bool(ards)}]
        }])

# --- Experiment helper functions ---
def getControl(id):
    return("control" in id.lower())


TO FIX:
1. symptoms
2. figure out citation/source/etc.
3. data
sero.head()
