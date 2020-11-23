# Rewriting Patient data from KGH again, since the latest version from Emily on 31 August 2020 has much of the data pre-merged.
# In this version, the data is divided into acute and survivor datasets.

import pandas as pd
from datetime import datetime
from dateutil.relativedelta import relativedelta

import os
os.chdir("/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/compile_cvisb_data")
import helpers # Helpers module, for common cleanup functions
from math import ceil

# constant: what columns to save
cols = ['patientID', 'sID', 'gID', 'gIDString', 'alternateIdentifier',
"contactGroupIdentifier", "relatedTo",
# "relatedToPrivate","presentationWeek", "infectionWeek"
"hasSurvivorData", "dateModified", "updatedBy", "dataStatus",
"citation", "sourceFiles", "publisher", "version",
"cohort", "outcome", "age", "occupation", "pregnant",
"gender", "species", "height", "weight",
"elisa", "symptoms",
"infectionYear", "infectionDate", "presentationDate",
"admitDate", "dischargeDate", "survivorEnrollmentDate", "survivorEvalDates",
"country", "countryName", "location", "locationPrivate"
]

def getSurvivors(filename, output_dir, updatedBy, dateModified, patient_version, vitals_version, vitals_id):
    releaseDate = datetime.strptime(dateModified, "%Y-%m-%d") + relativedelta(months=+6)

    surv = pd.read_excel(filename, sheet_name="SurvivorStudy", dtype={"PublicID": str})

    # First and most importantly-- remove patients who have not consented
    surv = surv[surv.Consent]

    # --- ids ---
    surv["patientID"] = surv.apply(lambda x: x.Type[0] + "-" + x.PublicID.zfill(7), axis=1)
    surv["sID"] = surv.apply(lambda x: x.Type[0] + "-" + str(x.ID).zfill(3), axis=1)
    surv["gID"] = surv.GID.apply(parseG)
    surv["gIDString"] = surv.GID.apply(appendG)
    surv["alternateIdentifier"] = surv.apply(combineIDs, axis=1)
    surv["contactGroupIdentifier"] = surv.PublicID.apply(lambda x: x[0:5])
    surv["relatedTo"] = surv.apply(lambda x: getRelated(x, surv), axis=1)
    # surv["relatedToPrivate"]
    surv["hasSurvivorData"] = True
    # --- demographics ---
    surv["species"] = "Homo sapiens"
    surv["gender"] = surv.Sex.apply(helpers.convertGender)
    surv["age"] = surv.Age
    surv["pregnant"] = surv.Pregnant.apply(helpers.binarize)
    surv["occupation"] = surv.Occupation
    surv["weight"] = surv.Weight.apply(helpers.removeZeros) # remove illogical values
    surv["height"] = surv.Height.apply(helpers.removeZeros)

    # --- disease info ---
    surv["cohort"] = surv.Cohort.apply(helpers.cleanCohort)
    surv["outcome"] = surv.Type.apply(lambda x: x.lower())
    surv["infectionYear"] = surv.Year
    surv["infectionDate"] = surv.DoInf.apply(helpers.dates2String)
    # surv["infectionWeek"] = surv.apply(lambda x: helpers.getInfectionWeek(x, "DoInf"), axis=1)
    surv["admitDate"] = surv.DoAdm.apply(helpers.dates2String)
    surv["presentationDate"] = surv.admitDate
    # surv["presentationWeek"] = surv.apply(lambda x: helpers.getInfectionWeek(x, "DoAdm"), axis=1)
    surv["dischargeDate"] = surv.DoDis.apply(helpers.dates2String)
    surv["survivorEvalDates"] = surv.apply(assembleDates, axis=1)
    surv["survivorEnrollmentDate"] = surv.DoEnroll.apply(helpers.dates2String)



    # --- provenance ---
    surv["dateModified"] = dateModified
    surv["updatedBy"] = updatedBy
    surv["sourceFiles"] = surv.apply(lambda x: [filename], axis=1)
    surv["publisher"] = surv.apply(lambda x: helpers.cvisb, axis=1)
    surv["citation"] = surv.apply(lambda x: [helpers.kgh], axis=1)
    surv["dataStatus"] = "final"
    surv["releaseDate"] =  releaseDate
    surv["version"] =  patient_version

    # --- geography ---
    surv["country"] = surv.Country.apply(helpers.getCountry)
    surv["countryName"] = surv.country.apply(helpers.pullCountryName)
    surv["location"] = surv.apply(helpers.getLocation, axis=1)
    surv["locationPrivate"] = surv.apply(helpers.getPrivateLocation, axis=1)

    # date checks
    # infection date and year agree
    # infection date and week agree

    # Clinical data
    # --- sequelae ---
    surv["symptoms"] = surv.apply(lambda x: helpers.getSurvivorSymptoms(x, dateModified, releaseDate), axis = 1)


    # --- ELISA ---
    surv["elisa"] = surv.apply(helpers.nestELISAs, axis = 1)

    # --- vitals ---
    surv_expts = surv.apply(lambda x: helpers.getVitals(x, dateModified, vitals_version, vitals_id, "survivor enrollment"), axis = 1)
    surv_expts = surv_expts[surv_expts==surv_expts] # remove Nulls

    # EXPORT EXPERIMENTS
    chunk_size = 500
    today = datetime.today().strftime("%Y-%m-%d")
    for i in range(0, ceil(len(surv_expts)/chunk_size)):
        surv_expts.iloc[i*chunk_size:(i+1)*chunk_size].to_json(f"{output_dir}/experiments/{today}_experiment_kgh-survivor_{i}.json", orient="records")


    # --- checks ---
    if(sum(surv.PublicID.duplicated())):
        print("Public IDs duplicated!")
    if(sum(surv.patientID.duplicated())):
        print("Patient ID duplicated")
    if(sum(surv.sID.duplicated())):
        print("S-IDs duplicated")
    if(sum(surv[surv.gIDString == surv.gIDString].gIDString.duplicated())):
        print("G-IDs duplicated")

    return(surv[cols])



def combineIDs(row, idList=["gID", "sID", "patientID"]):
    arr = []
    for id in idList:
        if((row[id] == row[id]) & (row[id] is not None)):
            arr.append(row[id])
    return(arr)



def getRelated(row, df):
    ids = df.loc[(df.contactGroupIdentifier == row.contactGroupIdentifier) & (df.patientID != row.patientID), "patientID"].to_list()
    return(ids)

def appendG(id):
    if(id == id):
        return("G-" + str(id).zfill(4))

# TEMP: taking only the first gID if there are two.
def parseG(id):
    if(id == id):
        return(["G-" + str(id.split("/")[0]).zfill(4)])

def assembleDates(row):
    dates = []
    try:
        dates.append(row.DoEnroll.strftime( "%Y-%m-%d"))
    except:
        pass
    try:
        dates.append(row.DoV2.strftime( "%Y-%m-%d"))
    except:
        pass
    try:
        dates.append(row.DoV3.strftime( "%Y-%m-%d"))
    except:
        pass
    try:
        dates.append(row.DoV4.strftime( "%Y-%m-%d"))
    except:
        pass
    try:
        dates.append(row.DoV5.strftime( "%Y-%m-%d"))
    except:
        pass
    try:
        dates.append(row.DoV6.strftime( "%Y-%m-%d"))
    except:
        pass
    try:
        dates.append(row.DoV7.strftime( "%Y-%m-%d"))
    except:
        pass
    try:
        dates.append(row.DoV8.strftime( "%Y-%m-%d"))
    except:
        pass
    try:
        dates.append(row.DoV9.strftime( "%Y-%m-%d"))
    except:
        pass
    try:
        dates.append(row.DoV10.strftime( "%Y-%m-%d"))
    except:
        pass
    try:
        dates.append(row.DoV11.strftime( "%Y-%m-%d"))
    except:
        pass
    return(dates)
