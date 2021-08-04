import numpy as np
from .citations import cvisb, kgh

def binarize(val):
    if((val == val) & (val is not None)):
        if(val == 0):
            return(False)
        elif(val == 1):
            return(True)
        elif(val.lower() == "yes"):
            return(True)
        elif(val.lower() == "no"):
            return(False)
        elif(val.lower() == "y"):
            return(True)
        elif(val.lower() == "n"):
            return(False)
        elif(val == "0"):
            return(False)
        elif(val == "1"):
            return(True)

def removeZeros(val):
    if(val != 0):
        return(val)

# Convert symptoms to an array of objects with T/F values
def nestSymptoms(row, timepoint = "survivor enrollment"):
    obj = {}
    obj["timepoint"] = timepoint
    obj["symptoms"] = {}

    obj["symptoms"]["joint_pain"] = binarize(row['joint pain'])
    obj["symptoms"]["muscle_pain"] = binarize(row['muscle pain'])
    obj["symptoms"]["hearing_loss"] = binarize(row['hearing loss'])
    obj["symptoms"]["ringing_in_ears"] = binarize(row['ringing in ears'])
    obj["symptoms"]["dry_eyes"] = binarize(row['dry eyes'])
    obj["symptoms"]["burning_eyes"] = binarize(row['burning eyes'])
    obj["symptoms"]["vision_loss"] = binarize(row['loss of vision'])
    obj["symptoms"]["blurry_vision"] = binarize(row['blurry vision'])
    obj["symptoms"]["light_sensitivity"] = binarize(row['light sensitivity'])
    obj["symptoms"]["eye_pain"] = binarize(row['painful eyes'])
    obj["symptoms"]["eye_foreign_body_sensation"] = binarize(row['sensation of foreign body in eye'])
    return([obj])


# Convert ELISAs from a series of columns to an array
def nestELISAs(row):
    elisas = []
    # ELISAs are unfortunately stored in a bunch of different variable names.
    # Catching in a try/except rather than passing specific column names and/or checking exists.
    # Also will catch NA values for the ELISA.
    try:
        # survivor; timepoint = survivor enrollment
        if((row['EVD_IgG'] == row['EVD_IgG']) & (row['EVD_IgG'] is not None)):
            elisas.append({
                "virus": "Ebola",
                "assayType": "IgG",
                "ELISAresult": row['EVD_IgG'].lower(),
                "timepoint": "survivor enrollment"
            })
        else:
            elisas.append({
                "virus": "Ebola",
                "assayType": "IgG",
                "ELISAresult": np.nan,
                "timepoint": "survivor enrollment"
            })
        if((row['LASV_IgG'] == row['LASV_IgG']) & (row['LASV_IgG'] is not None)):
            elisas.append({
                "virus": "Lassa",
                    "assayType": "IgG",
                    "ELISAresult": row['LASV_IgG'].lower(),
                    "timepoint": "survivor enrollment"
                    })
        else:
            elisas.append({
                "virus": "Lassa",
                    "assayType": "IgG",
                    "ELISAresult": np.nan,
                    "timepoint": "survivor enrollment"
                    })
    except:
        # Acute; timepoint = patient admission
        if((row['Ag'] == row['Ag']) & (row['Ag'] is not None)):
            elisas.append(
                {
                    "virus": "Lassa",
                    "assayType": "Ag",
                    "ELISAresult": row['Ag'].lower(),
                    "timepoint": "patient admission"
                })
        else: # NA
            elisas.append(
            {
                "virus": "Lassa",
                "assayType": "Ag",
                "ELISAresult": np.nan,
                "timepoint": "patient admission"
            })
        if((row['IgG'] == row['IgG']) & (row['IgG'] is not None)):
            elisas.append(
                {
                    "virus": "Lassa",
                    "assayType": "IgG",
                    "ELISAresult": row['IgG'].lower(),
                    "timepoint": "patient admission"
                })
        else:
            elisas.append(
                {
                    "virus": "Lassa",
                    "assayType": "IgG",
                    "ELISAresult": np.nan,
                    "timepoint": "patient admission"
                })
        if((row['IgM'] == row['IgM']) & (row['IgM'] is not None)):
            elisas.append(
                {
                    "virus": "Lassa",
                    "assayType": "IgM",
                    "ELISAresult": row['IgM'].lower(),
                    "timepoint": "patient admission"
                })
        else:
            elisas.append(
                {
                    "virus": "Lassa",
                    "assayType": "IgM",
                    "ELISAresult": np.nan,
                    "timepoint": "patient admission"
                })
    return(elisas)


def getPiccolo(row, dateUpdated, version, dataset_id, timepoint = "patient admission"):
    if((row.ALT == row.ALT) | (row.Alb == row.Alb)):
        obj = {
        "@type": "PiccoloData",
        "alanineAminotransferase": row.ALT,
        "albumin": row.Alb,
        "alkalinePhosphatase": row.AlkPhos,
        "aspatateAminotransferase": row.AST,
        "bloodUreaNitrogen": row.BUN,
        "calcium": row.Ca,
        "chloride": row.Cl,
        "creatinine": row.Cr,
        "glucose": row.Glu,
        "potassium": row.K,
        "sodium": row.Na,
        "totalBilirubin": row.Tbili,
        "totalCarbonDioxide": row.TCO2,
        "totalProtein": row.TP,
        }


        expt = {"experimentID": f"piccolo_{row.patientID}",
        "patientID": row.patientID, "privatePatientID": row.patientID,
        "timepoint": timepoint,
        "variableMeasured": "blood chemistry", "measurementTechnique": "Blood Chemistry Measurement",
        "measurementCategory": "clinical measurements", "includedInDataset": dataset_id,
        "dateModified": dateUpdated, "publisher": cvisb, "creator": [kgh],
        "updatedBy": row.updatedBy,
        "version": version,
        "sourceFiles": row.sourceFiles,
        "dataStatus": row.dataStatus,
        "citation": row.citation,
        "releaseDate": row.releaseDate,
        "data":[obj]}
        return(expt)

def getWBC(row, dateUpdated, version, dataset_id, timepoint = "patient admission"):
    obj = {
    "@type": "BloodCountData"
    }

    if(row.WBC == row.WBC):
        obj["wholeBloodCount"] = row.WBC
    if(row.Hgb == row.Hgb):
        obj["hemoglobin"] = row.Hgb
    if(row.Plts == row.Plts):
        obj["platelets"] = row.Plts
    if(row.Neuts == row.Neuts):
        obj["neutrophils"] = row.Neuts
    if(row.Bands == row.Bands):
        obj["bands"] = row.Bands
    if(row.Lymphs == row.Lymphs):
        obj["lymphocytes"] = row.Lymphs
    if(row.Monos == row.Monos):
        obj["monocytes"] = row.Monos
    if(row.Eos == row.Eos):
        obj["eosinophils"] = row.Eos
    if(row.Baso == row.Baso):
        obj["basophils"] = row.Baso
    if(row.PT == row.PT):
        obj["prothrombinTime"] = row.PT
    if(row.INR == row.INR):
        obj["internationalNormalizationRatio"] = row.INR
    if(row.Ddimer == row.Ddimer):
        obj["dDimer"] = row.Ddimer

    if(len(obj) > 1):
        expt = {"experimentID": f"cbc_{row.patientID}",
        "patientID": row.patientID, "privatePatientID": row.patientID,
        "timepoint": timepoint,
        "variableMeasured": "blood cell count", "measurementTechnique": "Blood Cell Count",
        "measurementCategory": "clinical measurements",
        "includedInDataset": dataset_id,
        "updatedBy": row.updatedBy,
        "version": version,
        "sourceFiles": row.sourceFiles,
        "dataStatus": row.dataStatus,
        "citation": row.citation,
        "releaseDate": row.releaseDate,
        "dateModified": dateUpdated, "publisher": cvisb, "creator": [kgh],
        "data":[obj]}
        return(expt)


def getAcuteSymptoms(row, dateUpdated, releaseDate):
    symptoms = {
    "@type": "AcuteSymptom",
    "timepoint": "patient admission",
    "dateModified": dateUpdated,
    "releaseDate": releaseDate
    }
    symptoms["bleeding_gums"] = binarize(row.BGums)
    symptoms["bleeding_gums"] = binarize(row.BGums)
    symptoms["bleeding_hematoma"] = binarize(row.BHemat)
    symptoms["bleeding_injection"] = binarize(row.BInjection)
    symptoms["bleeding_nose"] = binarize(row.BNose)
    symptoms["bleeding_sputum"] = binarize(row.BStool)
    symptoms["bleeding_stools"] = binarize(row.BSputum)
    symptoms["bleeding_urine"] = binarize(row.BUrine)
    symptoms["bleeding_vaginal"] = binarize(row.BVaginal)
    symptoms["bleeding_vomit"] = binarize(row.BVomit)
    if(row.BOther1 == row.BOther1):
        symptoms["bleeding_other"] = [str(row.BOther1)]

    symptoms["abdominal_pain"] = binarize(row.PAbdominal)
    symptoms["back_pain"] = binarize(row.PBack)
    symptoms["joint_pain"] = binarize(row.PJoint)
    symptoms["muscle_pain"] = binarize(row.PMuscle)
    symptoms["retrosternal_pain"] = binarize(row.PRetrosternal)
    symptoms["side_pain"] = binarize(row.PSide)
    if(row.POther1 == row.POther1):
        symptoms["other_pain"] = [str(row.POther1)]

    return ([symptoms])

def getSurvivorSymptoms(row, dateUpdated, releaseDate):
    symptoms = {
    "@type": "Sequela",
    "timepoint": "survivor enrollment",
    "dateModified": dateUpdated,
    "releaseDate": releaseDate
    }
    symptoms["rheumatologicalSequelae"] = binarize(row['Rheum'])
    symptoms["rheumatologicalGISequelae"] = binarize(row['RheumGI'])
    symptoms["pyschNeuroSequelae"] = binarize(row['PsychNeuro'])
    symptoms["cardiacGISequelae"] = binarize(row['CardiacGI'])
    symptoms["opthoAudioSequelae"] = binarize(row['OphthAudio'])
    symptoms["constitutionalSequelae"] = binarize(row['Const'])

    return ([symptoms])


def getVitals(row, dateUpdated, version, dataset_id, timepoint = "patient admission"):
    data = []
    if("GCS" in row.keys()):
        if(row.GCS == row.GCS):
            gcs = { "@type": "ComaScore", "glasgowComaScore": row.GCS }
            data.append(gcs)
    if("Temp" in row.keys()):
        if(row.Temp == row.Temp):
            temp =  { "@type": "BodyTemperature", "bodyTemperature": row.Temp }
            data.append(temp)

    if("OxSat" in row.keys()):
        if(row.OxSat == row.OxSat):
            oxsat =  { "@type": "OxygenSaturation", "oxygenSaturation": row.OxSat, "collectionInstrument": "conventional" }
            data.append(oxsat)
    if("SBP" in row.keys()):
        if(row.SBP == row.SBP):
            systolic =  { "@type": "SystolicPressure", "systolicPressure": row.SBP, "collectionInstrument": "conventional" }
            data.append(systolic)

    if("DBP" in row.keys()):
        if(row.DBP == row.DBP):
            diastolic =  { "@type": "DiastolicPressure", "diastolicPressure": row.DBP, "collectionInstrument": "conventional" }
            data.append(diastolic)
    if("HRate" in row.keys()):
        if(row.HRate == row.HRate):
            heartrate =  { "@type": "HeartRate", "heartRate": row.HRate, "collectionInstrument": "conventional" }
            data.append(heartrate)

    if("RRate" in row.keys()):
        if(row.RRate == row.RRate):
            resprate =  { "@type": "RespiratoryRate", "respiratoryRate": row.RRate, "collectionInstrument": "conventional" }
            data.append(resprate)

    if(len(data) > 0):
        if(timepoint == "patient admission"):
            time_stub="acute"
        elif(timepoint == "survivor enrollment"):
            time_stub = "survivor"
        else:
            time_stub = "unknown"
        expt = { "experimentID": f"vitals_{row.patientID}_{time_stub}",
        "patientID": row.patientID,
        "privatePatientID": row.patientID,
        "variableMeasured": "vitals",
        "timepoint": timepoint,
        "measurementTechnique": "Vital Signs Measurement",
        "measurementCategory": "clinical measurements",
        "includedInDataset": dataset_id,
        "creator": [kgh],
        "dateModified": dateUpdated,
        "publisher": cvisb,
        "updatedBy": row.updatedBy,
        "version": version,
        "sourceFiles": row.sourceFiles,
        "dataStatus": row.dataStatus,
        "citation": row.citation,
        "releaseDate": row.releaseDate,
        "data": data
        }
        return(expt)

def getRTPCR(row, variable, antigen, dataset_id, version, timepoint="patient admission"):
    if(row[variable] == row[variable]):
        data = {}
        data['@type'] = "RTPCR"
        data["virus"] = antigen
        data["RTPCRresult"] = row[variable].lower()

        pcr = {}

        pcr["data"] = [data]
        pcr['timepoint'] = timepoint
        pcr["experimentID"] = f"{row.patientID}_RT-PCR_{antigen}"
        pcr["privatePatientID"] = row.patientID
        pcr["updatedBy"] = row.updatedBy
        pcr["version"] = version
        pcr["sourceFiles"] = row.sourceFiles
        pcr["dataStatus"] = row.dataStatus
        if("citation" in row.keys()):
            if((row.citation == row.citation) & (row.citation is not None)):
                pcr["citation"] = row.citation
        pcr["creator"] = row.creator
        pcr["publisher"] = row.publisher
        pcr["dateModified"] = row.dateModified
        pcr["releaseDate"] = None # embargoed for the moment

        # --- experiment classifications ---
        pcr["variableMeasured"] = "virus level"
        pcr["measurementTechnique"] = "Reverse Transcriptase-Polymerase Chain Reaction"
        pcr["measurementCategory"] = "clinical measurements"
        pcr["includedInDataset"] = dataset_id
        return(pcr)

def getRDT(row, dataset_id, version, variable, timepoint = "patient admission"):
    if(row[variable] == row[variable]):
        rdt = {}

        rdt["privatePatientID"] = row.patientID
        rdt["updatedBy"] = row.updatedBy
        rdt["version"] = version
        rdt["sourceFiles"] = row.sourceFiles
        rdt["dataStatus"] = row.dataStatus
        if("citation" in row.keys()):
            if((row.citation == row.citation) & (row.citation is not None)):
                rdt["citation"] = row.citation
        rdt["creator"] = row.creator
        rdt["publisher"] = row.publisher
        rdt["dateModified"] = row.dateModified
        rdt["releaseDate"] = None # embargoed for the moment

        # --- experiment classifications ---
        rdt["variableMeasured"] = "virus level"
        rdt["measurementTechnique"] = "Rapid Antigen Test"
        rdt["measurementCategory"] = "clinical measurements"
        rdt["includedInDataset"] = dataset_id
        rdt['timepoint'] = timepoint

        data = {}
        data['@type'] = "RDT"
        if(variable == "RDT"):
            antigen = "Lassa"
        elif(variable == "Malaria"):
            antigen = "Plasmodium"
        data["infectiousAgent"] = antigen
        data["RDTresult"] = row[variable].lower()
        rdt["experimentID"] = f"{row.patientID}_RDT_{antigen}"
        rdt["data"] = [data]
        return(rdt)
