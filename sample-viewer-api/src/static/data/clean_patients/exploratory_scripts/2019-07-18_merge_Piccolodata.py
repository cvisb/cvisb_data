# Goal: double check Brian's copy of the Piccolo data to make sure it agrees w/ data from Tulane

import pandas as pd
import os
os.chdir("/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/clean_patients/")
# Helper functions for cleanup...
import helpers


# [constants]  ----------------------------------------------------------------------------------------------------
piccolo_file = "/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/input_data/expt_summary_data/piccolo/LF data 07172019_sheet1.xlsx"
cols2save = [
'ID', 'privatePatientID', 'sID', 'publicPatientID',
'Tulane_missing',

'Survival', 'outcome_Tulane', 'outcomeDisagree',
'Age', 'age_Tulane','ageDisagree',
'Gender',        'gender_Tulane', 'genderDisagree',
'Ag Pos/Ag Neg',  'ELISA_Ag_Tulane', 'elisaDisagree']


# [import Piccolo data]  ----------------------------------------------------------------------------------------------------
df_raw = pd.read_excel(piccolo_file)

merged.columns

# Focus on the relevant columns
df = df_raw[['ID', 'Ag Pos/Ag Neg', 'Survival', 'Age', 'Gender']]

# Normalize IDs
df['privatePatientID'] = df.ID.apply(lambda x: helpers.interpretID("G" + str(x)))


# Filter out NA IDs
df = df.loc[df.ID == df.ID]



# [ID rosters] ------------------------------------------------------------------------------------------
id_dict = "/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/output_data/patients/patients_2019-07-22_PRIVATE_dict.json"

ids = pd.read_json(id_dict)
ids.head()
ids.reset_index(inplace = True)
ids.rename(columns = {'index': 'privatePatientID', 'patientID': 'publicPatientID', 'outcome': 'outcome_Tulane', 'gender': 'gender_Tulane', 'age': 'age_Tulane'}, inplace = True)

# [merge IDs to patient list]  ----------------------------------------------------------------------------------------------------
merged = pd.merge(df, ids, how="left", indicator=True, on="privatePatientID")

# [outcome]  ----------------------------------------------------------------------------------------------------

def compareOutcome(row):
    if(row.Survival != row.Survival):
        if((row.outcome_Tulane != row.outcome_Tulane) | (row.outcome_Tulane == "unknown")):
            return(False)
        else:
            return(True)
    if(row.outcome_Tulane == "dead"):
        if row.Survival == "died":
            return(False)
        else:
            return(True)

    if(row.outcome_Tulane == "survivor"):
        if row.Survival == "survive":
            return(False)
        else:
            return(True)

    if(row.outcome_Tulane == "unknown"):
        if (row.Survival == "unknown") | (row.Survival != row.Survival):
            return(False)
        else:
            return(True)
    if(row._merge == "left_only"):
        return(True)

merged['outcomeDisagree'] = merged.apply(compareOutcome, axis = 1)

merged.outcomeDisagree.value_counts()

merged.groupby("outcome_Tulane").Survival.value_counts(dropna = False)



# [age]  ----------------------------------------------------------------------------------------------------
merged.groupby("age_Tulane").Age.value_counts(dropna = False)

def compareAge(row):
    if(row.age_Tulane != row.age_Tulane):
        if(row.Age != row.Age):
            return(False)
        else:
            return(True)
    else:
        return(round(row.age_Tulane,0) != row.Age)

# merged['ageDisagree'] = merged.apply(lambda row: row.age_Tulane != row.Age, axis=1)
merged['ageDisagree'] = merged.apply(compareAge, axis=1)

# merged[merged.ageDisagree & (merged.Age == merged.Age)][['age_Tulane', 'Age', 'ageDisagreeRound']]

merged.ageDisagree.value_counts()

# [gender]  ----------------------------------------------------------------------------------------------------
def compareGender(row):
    if(row.Gender != row.Gender):
        if((row.gender_Tulane != row.gender_Tulane) | (row.gender_Tulane == "Unknown")):
            return(False)
        else:
            return(True)
    if(row.gender_Tulane == row.gender_Tulane):
        return(row.gender_Tulane[0].lower() != row.Gender)
    else:
        # no Tulane gender
        return(True)


merged['genderDisagree'] = merged.apply(compareGender, axis = 1)

merged.genderDisagree.value_counts()
merged.groupby("gender_Tulane").Gender.value_counts(dropna=False)

# [cohort]  ----------------------------------------------------------------------------------------------------
# Should be all Lassa patients
merged.cohort.value_counts()
merged["Tulane_missing"] = merged._merge.apply(lambda x: x == "left_only")

# [ELISA]  ----------------------------------------------------------------------------------------------------
def getElisa(elisa, assayType="Ag"):
    if((elisa == elisa) & (elisa is not None)):
        for x in elisa:
            if(x["assayType"] == assayType):
                return(x["ELISAresult"])

def getAbbrevElisa(elisa):
    if((elisa == elisa) & (elisa is not None)):
        return(elisa[0:3])

def compareElisa(row):
    if((row.elisaAbbrev != row.elisaAbbrev) | (row.elisaAbbrev is None)):
        if((row['Ag Pos/Ag Neg'] != row['Ag Pos/Ag Neg']) | (row['Ag Pos/Ag Neg'] == "CNTRL")):
            return(False)
        else:
            return(True)
    else:
        return(row.elisaAbbrev != row['Ag Pos/Ag Neg'])

merged["ELISA_Ag_Tulane"] = merged.elisa.apply(getElisa)
merged["elisaAbbrev"] = merged.ELISA_Ag_Tulane.apply(getAbbrevElisa)

merged["elisaDisagree"] = merged.apply(compareElisa, axis = 1)

merged.elisaDisagree.value_counts()

merged.groupby(["Ag Pos/Ag Neg", "elisaDisagree"])['ELISA_Ag_Tulane'].value_counts(dropna = False)

merged[cols2save].to_csv("/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/input_data/expt_summary_data/piccolo/LF data 07172019_discrepancies.csv", index=False)
