# "corrected" file has the original data plus corrected study-specific ids
import pandas as pd
base = pd.read_csv("/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/input_data/patient_rosters/unnamed originals/StudySpecificNumbersforLaura_20Jun19_EE.csv")
fixed = pd.read_csv("/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/input_data/patient_rosters/unnamed originals/fixed_duplicates_StudySpecificNum_27Jun19.csv")

base = base.dropna(subset=["gID"])
len(base) #2689

fixedIDs = fixed.gID

# Drop the "outdated" data
df = base[~base.gID.isin(fixedIDs)]

# concat the "new" data
fixed.columns
fixed.rename(columns={'Study Specific #': "publicID",
       'Unnamed: 5': "newID"}, inplace=  True)

def getID(row):
    if(row.newID == row.newID):
        return(row.newID)
    return(row.publicID)

fixed['Study Specific #'] = fixed.apply(getID, axis = 1)
fixed.drop(["publicID", "newID"], axis = 1, inplace=True)
df = pd.concat([df, fixed], ignore_index=True)
len(df)
df.iloc[2666:]
df[df.gID=="G-4102"]
df.to_csv("/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/input_data/patient_rosters/additional_IDdict_v2_2019-09-13.csv", index=False)
