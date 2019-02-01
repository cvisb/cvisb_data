import pandas as pd
import os as os
import re
os.chdir("/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data")

# As of 2019-01-31, creating list of paitents from all sources of patient info:
# 1) HLA data (from Karthik)
# 2) Systems Serology data (from Bonnie)
# 3) July 2018 SL trip (samples) (from Matthias)
# 4) January 2019 SL trip (samples) (from Matthias)
# 5) Kristian's previously compiled list of HLA
# Brian's roster of patients
# 6) Random RNA/DNA extraction list from Matthias
output_file = "/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/2019-01-31_patients"

# [1] HLA data
import getHLApatients as hla

hla.hla_df['source'] = 'HLA_karthik'
hla.hla_df
hla.hla_df.drop('availableData', axis=1, inplace= True)

df1 = hla.hla_df

# [2] Systems Serology data
import getSerologyPatients as ss
ss.sero['source'] = 'serology'

df2 = ss.sero[['patientID', 'alternateIdentifier', 'cohort', 'outcome', 'source']]

# [3/4] Sample rosters
from getSampleRosters import samples

df3 = samples

# [5] Previously compiled lists
from getRandomPatientLists import kdf, mdf, bdf, wl
df4 = kdf
df5 = mdf
df6 = bdf
df7 = wl




# [LAST] Merge together all the patients, and export for John ----------------------------------------------------------------------------------------------------
# df = pd.merge(df1, df2, how="outer", on=["patientID", "cohort", "outcome"], indicator=True)

df = pd.concat([df1, df2, df3, df4, df5, df6, df7])
# df.country = df.country.apply(lambda x: hla.cleanCountry(x))

df.cohort.value_counts()
# Good: nothing merged, as expected
# df['_merge'].value_counts()

df.sort_values('patientID', inplace = True)
df = df[['patientID', 'alternateIdentifier', 'cohort', 'outcome', 'country', 'source']]
# df[df['_merge']=="both"]
#
df.source.value_counts(dropna= False)

# hla_df[hla_df.patientID == "SMS7020"]
# hla_df.to_json(output_file, orient='records')
# df.drop('_merge', axis=1).to_json(output_file+".json", orient='records')
# df[df['country'] != 'Nigeria'].drop('_merge', axis=1).to_csv(output_file+".csv")

# Last check: What patients Matthias requested in September 2018
crosscheck_file = "/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/samples_needing_metadata_Sept2018_LDH-MP-BG_PRIVATE.xlsx"
cross = pd.read_excel(crosscheck_file)

cross = cross[cross.requester == 'Matthias']

cross = cross[['ID', 'requester']].copy()
cross = cross.drop_duplicates()

test = pd.merge(df, cross, how="outer", indicator=True, left_on="patientID", right_on="ID")
test._merge.value_counts()

test[test._merge == 'right_only']

# [AGGREGATE DOWN] -----------------------------------------------------------------------
"G1000".replace("G", "G-")
df.head()

def getG(df):
    patientG = findG(df.patientID)
    if(patientG == patientG): # test if exists
        return(patientG)
    altG = findG(df.alternateIdentifier)
    if(altG == altG):
        return(altG)
    return(pd.np.nan)

def findG(x):
    if x == x:
        hyphenated = re.search("G\-[0-9][0-9][0-9][0-9]", x)
        if hyphenated:
            return(hyphenated[0])

        nohyphen = re.search("G[0-9][0-9][0-9][0-9]", x)
        if nohyphen:
            return(nohyphen[0].replace("G", "G-"))
    return(pd.np.nan)



def combineIDs(row):
    # altIDs: split on ; and / to get array of IDs

    altID = row.alternateIdentifier
    if altID == altID:
        altID = str(altID)
        alt = [item for sublist in [id.split(";") for id in altID.split("/")] for item in sublist]
    else:
        alt = []
    # print(alt)
    ids = [row.patientID] + alt
    ids = list(set(ids)) # remove duplicates

    return(ids)

def getID(row):
    if row.Gnum == row.Gnum:
        return(row.Gnum)
    return(row.patientID)

# Find the G-numbers, standardize them.
df['Gnum'] = df.apply(getG, axis = 1)
df['allIDs'] = df.apply(combineIDs, axis = 1)
df['ID'] = df.apply(getID, axis = 1)

df[df.patientID=='S2-084']
df.sample(15)

def removeNaN(var):
    no_nan = [x for x in var if str(x) != 'nan']
    return(list(set(no_nan)))

# Check if the variable has disagreements amongst datasets.
def dataDisagreement(var):
    unique = removeNaN(var)
    if(len(unique) > 1):
        return True
    return False

def combine(var):
    unique = removeNaN(var)
    if(len(unique) == 1):
        return(unique[0])
    if(len(unique) == 0):
        return(pd.np.nan)
    return(unique)

def extendIDs(ids):
    flat_list = [item for sublist in list(ids) for item in sublist]
    return(combine(flat_list))



df.ID.value_counts()
# Combine and aggregate!
patients = df.groupby(['ID']).agg({'allIDs': extendIDs, 'country': [combine, dataDisagreement], 'cohort': [combine, dataDisagreement], 'outcome': [combine, dataDisagreement], 'source': combine}).reset_index()

patients.country.dataDisagreement.value_counts()
patients.cohort.dataDisagreement.value_counts()
patients.outcome.dataDisagreement.value_counts()

# Reset column names
patients.columns = ['_'.join(tup).rstrip('_').replace('_extendIDs', '').replace('_combine', '') for tup in patients.columns.values]
patients = patients[['ID', 'allIDs', 'country', 'cohort', 'outcome', 'source']]
patients.sort_values('ID', inplace = True)
# patients[patients.ID == "G-4007"]
patients.sample(14)


# Export everything.
patients.to_json(output_file+".json", orient='records')
# Ignore Nigerian samples for John
patients[patients.country != 'Nigeria'].drop('country', axis = 1).to_csv(output_file+".csv", index = False)
