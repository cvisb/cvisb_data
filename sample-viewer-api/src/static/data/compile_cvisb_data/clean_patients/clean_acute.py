# Rewriting Patient data from KGH again, since the latest version from Emily on 31 August 2020 has much of the data pre-merged.
# In this version, the data is divided into acute and survivor datasets.
# Also contains first version of clinical data.
# Will export patient and experiment (piccolo, whole blood count) records

import pandas as pd

import os
os.chdir("/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/compile_cvisb_data")
import helpers # Helpers module, for common cleanup functions
from datetime import date
from math import ceil

output_dir = "/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/output_data"
dateUpdated = "2020-11-02"
updatedBy = "Emily Engel"
patient_version = 0.3
rdt_version = 0.1
rdt_id = "rapid-diagnostics-vhf"
vitals_version = 0.1
vitals_id = "vitals-vhf"
rtpcr_version = 0.1
rtpcr_id = "rtpcr-vhf"
piccolo_version = 0.1
piccolo_id = "blood-chemistry-vhf"
vitals_version = 0.1
vitals_id = "vitals-vhf"
cbc_version = 0.1
cbc_id = "blood-counts-vhf"
# output_dir = "../output_data"


DATADIR = "/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/"
PATIENT_FILE = f"{DATADIR}input_data/patient_rosters/DisseminationData_2Nov20.xlsx"
filename= PATIENT_FILE
cols = ["gID", "gIDString", "patientID", "alternateIdentifier", "hasPatientData",
"dateModified", "updatedBy", "sourceFiles", "dataStatus",
"version", "publisher", "citation",
"gender", "cohort", "outcome", "age", "ethnicity", "pregnant",
"occupation", "height", "weight", "species",
"infectionDate", "infectionYear", "presentationDate", "presentationWeek",
"dischargeDate", "evalDate", "admittedLassaWard",
"daysOnset", "daysInHospital",
"country", "countryName", "location", "locationPrivate",
"elisa", "symptoms"]

df = pd.read_excel(filename, sheet_name="AllOthers")

# --- ids ---
df["gIDString"] = df["G-num"]
df["gID"] = df.gIDString.apply(lambda x: [x])
df["sIDPublic"] = df["RelatedIDs"]
df["patientID"] = df.publicid.apply(lambda x: "G" + x)
df["alternateIdentifier"] = df.apply(lambda x: [x.gIDString, x.patientID], axis=1)

# --- demographics ---
df["species"] = "Homo sapiens"
df["cohort"] = df.Cohort.apply(helpers.cleanCohort)
df["outcome"] = df.outcome.apply(helpers.cleanOutcome)
df["admittedLassaWard"] = df.Admitted.apply(helpers.binarize)
df['gender'] = df.sex.apply(helpers.convertGender)
df["age"] = df.age
df["pregnant"] = df.pregnant.apply(helpers.binarize)
df["occupation"] = df.occupation
df["weight"] = df.Weight.apply(helpers.removeZeros) # remove illogical values
df["height"] = df.Height.apply(helpers.removeZeros)
df["ethnicity"] = df.Ethnicity.apply(helpers.decodeEthnicity)

# --- provenance ---
df["dateModified"] = dateUpdated
df["hasPatientData"] = True
df["dataStatus"] = "final"
df["updatedBy"] = updatedBy
df["sourceFiles"] = df.apply(lambda x: [filename], axis=1)
df["citation"] = df.apply(lambda x: [helpers.kgh], axis=1)
df["publisher"] = df.apply(lambda x: helpers.cvisb, axis=1)
df["creator"] = df.apply(lambda x: [helpers.kgh], axis=1)
df["releaseDate"] = None
df["version"] = patient_version

# --- disease info / dates ---
df["infectionDate"] = df.DoOnset.apply(helpers.dates2String)
df["infectionYear"] = df.Year
df["evalDate"] = df.DoEval.apply(helpers.dates2String)
df["presentationDate"] = df.evalDate # No admit date in this dataset
df["presentationWeek"] = df.apply(lambda x: helpers.getInfectionWeek(x, "DoEval"), axis=1)
df["daysOnset"] = df.DaysOnset
df["daysInHospital"] = df.DaysHosp
df["dischargeDate"] = df.DoOutcome.apply(helpers.dates2String)

# --- geography ---
df["country"] = df.Country.apply(helpers.getCountry)
df["countryName"] = df.country.apply(helpers.pullCountryName)
df["location"] = df.apply(helpers.getLocation, axis=1)
df["locationPrivate"] = df.apply(helpers.getPrivateLocation, axis=1)

# --- CLINICAL DATA ---
# --- piccolo ---
df["piccolo"] = df.apply(lambda x: helpers.getPiccolo(x, dateUpdated, piccolo_version, piccolo_id), axis = 1)

# --- urine chemistry data ---
# September 2020: as of now, there are only ~ 12 patients who have any of these values, so seems not worth the effort to include.
# 'glucose',
# 'bilirubin',
# 'Ketone',
# 'specgrav',
# 'blood',
# 'pH',
# 'protein',
# 'urobili',
# 'nitrites',
# 'leukocytes',

# --- Piccolo complete blood count ---
# again, low numbers, but ~ 300 observations so rolling with it.
df["wbc"] = df.apply(lambda x: helpers.getWBC(x, dateUpdated, cbc_version, cbc_id), axis = 1)


# --- Clinical measurements ---
df["vitals"] = df.apply(lambda x: helpers.getVitals(x, dateUpdated, vitals_version, vitals_id, "patient admission"), axis = 1)

# --- symptoms ---
df["symptoms"] = df.apply(lambda x: helpers.getAcuteSymptoms(x, dateUpdated), axis = 1)

# --- elisas ---
df["elisa"] = df.apply(helpers.nestELISAs, axis = 1)

# --- RT-PCR ---
# RT-PCRs are all Lassa antigens, as per Emily Engel (2 November 2020)
df["rtpcr"] = df.apply(lambda x: helpers.getRTPCR(x, "RT-PCR", "Lassa", rtpcr_id, rtpcr_version), axis=1)

# --- RDTs ---
# RDTs are all Lassa antigens, as per Emily Engel (2 November 2020)
# Malaria assay is also an RDT, as per Emily Engel (6 November 2020)
df["rdt"] = df.apply(lambda x: helpers.getRDT(x, rdt_id, rdt_version, "RDT"), axis=1)
df["malaria"] = df.apply(lambda x: helpers.getRDT(x, rdt_id, rdt_version, "Malaria"), axis=1)

# --- merge experimental data ---
today = date.today().strftime("%Y-%m-%d")
df["exptData"] = df.apply(assembleExpt, axis = 1)
expts = df.exptData
expts = [item for sublist in expts for item in sublist]
expts = pd.DataFrame(expts)

# --- Check uniqueness ---
if(sum(df.duplicated(subset=["patientID"]))):
    print("ERROR! Duplicate patient IDs detected")

if(sum(expts.duplicated(subset=["experimentID"]))):
    print("ERROR! Duplicate experiment IDs detected")

# EXPORT EXPERIMENTS
chunk_size = 500
for i in range(0, ceil(len(expts)/chunk_size)):
    expts.iloc[i*chunk_size:(i+1)*chunk_size].to_json(f"{output_dir}/experiments/kgh_experiments_{i}_{today}.json", orient="records")


countries = helpers.getUnique(df, "country")

# EXPORT DATASETS
# EXPORT DATADOWNLOAD
os.chdir("/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/compile_cvisb_data/clean_patients/")
from generate_expt_downloads import get_expt_downloads
from generate_piccolo_dataset import get_piccolo_dataset
piccolo_dwnld = get_expt_downloads(dateUpdated, expts[expts.measurementTechnique == "Blood Chemistry Measurement"], updatedBy, piccolo_version, piccolo_id)
piccolo_ds = get_piccolo_dataset(dateUpdated, piccolo_dwnld,expts[expts.measurementTechnique == "Blood Chemistry Measurement"], countries, piccolo_version, piccolo_id)
piccolo_ds.to_json(f"{output_dir}/datasets/{today}_dataset_kgh_piccolo.json", orient="records")

from generate_vitals_dataset import get_vitals_dataset
vitals_dwnld = get_expt_downloads(dateUpdated, expts[expts.measurementTechnique == "Vital Signs Measurement"], updatedBy, vitals_version, vitals_id)
vitals_ds = get_vitals_dataset(dateUpdated, vitals_dwnld, expts[expts.measurementTechnique == "Vital Signs Measurement"], countries, vitals_version, vitals_id)
vitals_ds.to_json(f"{output_dir}/datasets/{today}_dataset_kgh_vitals.json", orient="records")

from generate_cbc_dataset import get_cbc_dataset
cbc_dwnld = get_expt_downloads(dateUpdated, expts[expts.measurementTechnique == "Blood Cell Count"], updatedBy, cbc_version, cbc_id)
cbc_ds = get_cbc_dataset(dateUpdated, cbc_dwnld, expts[expts.measurementTechnique == "Blood Cell Count"], countries, cbc_version, cbc_id)
cbc_ds.to_json(f"{output_dir}/datasets/{today}_dataset_kgh_cbc.json", orient="records")

from generate_rdt_dataset import get_rdt_dataset
rdt_dwnld = get_expt_downloads(dateUpdated, expts[expts.measurementTechnique == "Rapid Antigen Test"], updatedBy, rdt_version, rdt_id)
rdt_ds = get_rdt_dataset(dateUpdated, rdt_dwnld, expts[expts.measurementTechnique == "Rapid Antigen Test"], countries, rdt_version, rdt_id)
rdt_ds.to_json(f"{output_dir}/datasets/{today}_dataset_kgh_rdt.json", orient="records")

from generate_rtpcr_dataset import get_rtpcr_dataset
pcr_dwnld = get_expt_downloads(dateUpdated, expts[expts.measurementTechnique == "Reverse Transcriptase-Polymerase Chain Reaction"], updatedBy, rtpcr_version, rtpcr_id)
pcr_ds = get_rtpcr_dataset(dateUpdated, pcr_dwnld, expts[expts.measurementTechnique == "Reverse Transcriptase-Polymerase Chain Reaction"], countries, rtpcr_version, rtpcr_id)
pcr_ds.to_json(f"{output_dir}/datasets/{today}_dataset_kgh_rtpcr.json", orient="records")

pd.concat([piccolo_dwnld, vitals_dwnld, cbc_dwnld, rdt_dwnld, pcr_dwnld]).to_json(f"{output_dir}/datadownloads/{today}_download_kgh_expts.json", orient="records")

# [SURVIVORS]  ----------------------------------------------------------------------------------------------------
# Merge and combine survivor data
acute = df[cols]
from clean_survivors import getSurvivors
surv = getSurvivors(filename, output_dir, updatedBy, dateUpdated, patient_version, vitals_version, vitals_id)
comb = acute.merge(surv, how="outer", on=["gIDString"], indicator=True)
comb["_merge"].value_counts()
acute.sample(10).to_json(f"{output_dir}/patients/{today}_acute_tester.json", orient="records")
surv.sample(10).to_json(f"{output_dir}/patients/{today}_survivor_tester.json", orient="records")

# TEMP for the moment: export patients that are in the acute dataset or non-mergable S-numbers
filtered_surv = surv[surv.gID.isnull()]
# For Emily: testing
# cols2merge = ['gID','gender','cohort','outcome','age','occupation','height','weight','infectionYear','dischargeDate','countryName']
# comb = acute[cols2merge].merge(surv[cols2merge], how="outer", on=["gIDString"], indicator=True)
# x = acute.loc[acute.gID.isin(["G-6338","G-0100","G-6337", "G-0104","G-6323","G-0093"]), cols2merge]
# y = surv.loc[surv.gID.isin(["G-6338/0100","G-6337/0104","G-6323/0093"]), cols2merge]
# y["gID1"] = y.gID.apply(lambda x: x.split("/")[0])
# y["gID2"] = y.gID.apply(lambda x: "G-" + x.split("/")[1])
# yucky1 = x.merge(y, left_on="gID", right_on="gID1")
# yucky2 = x.merge(y, left_on="gID", right_on="gID2")
# cols2=["gID",'age_x', 'age_y', 'cohort_x', 'cohort_y', 'countryName_x', 'countryName_y', 'dischargeDate_x', 'dischargeDate_y', 'gender_x', 'gender_y', 'height_x', 'height_y', 'infectionYear_x', 'infectionYear_y', 'occupation_x', 'occupation_y', 'outcome_x', 'outcome_y', 'weight_x', 'weight_y']
# comb.loc[comb._merge == "both", cols2].to_csv("combined_survivor_acute.csv")
# yucky1[['gID_x','age_x', 'age_y', 'cohort_x', 'cohort_y', 'countryName_x', 'countryName_y', 'dischargeDate_x', 'dischargeDate_y', 'gender_x', 'gender_y', 'height_x', 'height_y', 'infectionYear_x', 'infectionYear_y', 'occupation_x', 'occupation_y', 'outcome_x', 'outcome_y', 'weight_x', 'weight_y', "gID_y"]].to_csv("combined_survivor_acute_1.csv")
# yucky2[['gID_x','age_x', 'age_y', 'cohort_x', 'cohort_y', 'countryName_x', 'countryName_y', 'dischargeDate_x', 'dischargeDate_y', 'gender_x', 'gender_y', 'height_x', 'height_y', 'infectionYear_x', 'infectionYear_y', 'occupation_x', 'occupation_y', 'outcome_x', 'outcome_y', 'weight_x', 'weight_y', "gID_y"]].to_csv("combined_survivor_acute_2.csv")


# EXPORT PATIENTS

chunk_size = 300
for i in range(0, ceil(len(acute)/chunk_size)):
    acute.drop("gIDString", axis=1).iloc[i*chunk_size:(i+1)*chunk_size].to_json(f"{output_dir}/patients/kgh_acute-patients_{i}_{today}.json", orient="records")
for i in range(0, ceil(len(filtered_surv)/chunk_size)):
    filtered_surv.drop("gIDString", axis=1).iloc[i*chunk_size:(i+1)*chunk_size].to_json(f"{output_dir}/patients/kgh_survivor-patients_{i}_{today}.json", orient="records")



def assembleExpt(row):
    expts = []
    if(row.rdt is not None):
        expts.append(row.rdt)
    if(row.malaria is not None):
        expts.append(row.malaria)
    if(row.rtpcr is not None):
        expts.append(row.rtpcr)
    if(row.piccolo is not None):
        expts.append(row.piccolo)
    if(row.wbc is not None):
        expts.append(row.wbc)
    if(row.vitals is not None):
        expts.append(row.vitals)
    return(expts)
