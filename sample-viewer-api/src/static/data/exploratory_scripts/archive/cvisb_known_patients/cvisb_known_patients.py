# <<< cvisb_known_patients.py >>>
# @name:        cvisb_known_patients
# @summary:     Compiles together lists of patients known within CViSB, as of February 2019
# @description: Merges together various inventories of samples, data, and patients that have been analyzed or used
#               somehow within the CViSB universe, as of ~ February 2019.
#               Note: SHOULD NOT BE CONSIDERED DEFINITIVE; used merely as a cross-check with what Tulane has provided, to get a sense
#               of what patient data is missing.  Outcome/cohort are not verified, and assumptions are made when sample IDs (and not patient IDs) are listed.
#               Note: references to file imports are hardcoded, and cleanup functions haven't been refactored to use the same modules.
#               Code is therefore somewhat brittle and potentially not sync'd with other patient pipeline, but this is used mainly as
#               a crosscheck to get a sense of what is missing and isn't used in the CViSB website.
# @inputs:
# @outputs:
# @examples:
# @author:      Laura Hughes, lhughes@scripps.edu
# @dateModified: 3 April 2019
#
# As of 2019-01-31, creating list of paitents from all sources of patient info:
# 1) HLA data (from Karthik)
# 2) Systems Serology data (from Bonnie)
# 3a) July 2018 SL trip (samples) (from Matthias)
# 3b/c) January 2019 SL trip (samples) (from Matthias)
# 4) Kristian's previously compiled list of HLA
# 5) Random RNA/DNA extraction list from Matthias
# 6) Brian's roster of patients
# 7) Matthias's wishlist before Jan 2019 trip-- things he knows about that he wants more info about
# 8) Karthik's list of preveiously virally sequenced lassa patients (from Broad)
# 9) Dylan's list of acute Ebola cohort from the Broad.

import pandas as pd
import os as os
import re
os.chdir("/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/clean_patients/")

output_file = "/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/input_data/cvisb_random_rosters/CViSB_knownpatients_cleaned_20190619_PRIVATE"

# [1] HLA data
import cvisb_known_patients.getHLApatients as hla

hla.hla_df['source'] = 'HLA_karthik'
hla.hla_df
hla.hla_df.drop('availableData', axis=1, inplace= True)

df1 = hla.hla_df
df1.head()

# [2] Systems Serology data
import cvisb_known_patients.getSerologyPatients as ss
ss.sero['source'] = 'serology'

df2 = ss.sero[['patientID', 'alternateIdentifier', 'cohort', 'outcome', 'source']]

# [3/4] Sample rosters
from cvisb_known_patients.getSampleRosters import samples

df3 = samples

df3.sample(4)
# [5] Previously compiled lists
from cvisb_known_patients.getRandomPatientLists import kdf, mdf, bdf, wl, lsv
df4 = kdf
df5 = mdf
df6 = bdf
df7 = wl
df8 = lsv

# [6] Raphaelle's merged viral sequences from publicly available datasets.
from cvisb_known_patients.getViralSeqPatients import viralseq
df9 = viralseq

# [7] Matthias's cleaned and verified list of samples from May 2019, post shipment from KGH.
from cvisb_known_patients.getSamplesMay2019 import samples
df10 = samples

# [8] Broad's list of Ebola patients
from cvisb_known_patients.getBroadEbola import ebv

ebv.head()
df11 = ebv[['patientID', 'cohort', 'outcome', 'source']]

# [LAST] Merge together all the patients, and export for John ----------------------------------------------------------------------------------------------------
# df = pd.merge(df1, df2, how="outer", on=["patientID", "cohort", "outcome"], indicator=True)

df = pd.concat([df1, df2, df3, df4, df5, df6, df7, df8, df9, df10, df11])
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
crosscheck_file = "/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/input_data/cvisb_random_rosters/samples_needing_metadata_Sept2018_LDH-MP-BG_PRIVATE.xlsx"
cross = pd.read_excel(crosscheck_file)

cross = cross[cross.requester == 'Matthias']

cross = cross[['ID', 'requester']].copy()
cross = cross.drop_duplicates()

test = pd.merge(df, cross, how="outer", indicator=True, left_on="patientID", right_on="ID")
test._merge.value_counts()

test[test._merge == 'right_only']

# [AGGREGATE DOWN] -----------------------------------------------------------------------
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
        hyphenated = re.search("^G\-[0-9][0-9][0-9][0-9]$", x)
        if hyphenated:
            return(hyphenated[0])

        nohyphen = re.search("^G[0-9][0-9][0-9][0-9]$", x)
        if nohyphen:
            return(nohyphen[0].replace("G", "G-"))

        shorthyphenated = re.search("^G\-[0-9][0-9][0-9]$", x)
        if shorthyphenated:
            return(shorthyphenated[0])

        shortnohyphen = re.search("^G[0-9][0-9][0-9]$", x)
        if shortnohyphen:
            return(shortnohyphen[0].replace("G", "G-"))
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

# Interpret the IDs...
os.chdir("/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/clean_patients/")

from helpers import interpretID

# Find the G-numbers, standardize them.
df['Gnum'] = df.apply(getG, axis = 1)
df['allIDs'] = df.apply(combineIDs, axis = 1)
df['ID'] = df.patientID.apply(interpretID)

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

# Combine and aggregate!
patients = df.groupby(['ID']).agg({'allIDs': extendIDs, 'country': [combine, dataDisagreement], 'cohort': [combine, dataDisagreement], 'outcome': [combine, dataDisagreement], 'source': combine}).reset_index()
patients.shape
patients.country.dataDisagreement.value_counts()
patients.cohort.dataDisagreement.value_counts()
patients.outcome.dataDisagreement.value_counts()

patients[patients.outcome.dataDisagreement == True].to_csv("2019-05-10_LSVseq_outcomeDisagreements_PRIVATE.csv")


# Reset column names
patients.columns = ['_'.join(tup).rstrip('_').replace('_extendIDs', '').replace('_combine', '') for tup in patients.columns.values]
patients = patients[['ID', 'allIDs', 'country', 'cohort', 'outcome', 'source']]
patients.sort_values('ID', inplace = True)
patients.sample(14)



# patients[patients.country != 'Nigeria'].drop('country', axis = 1).shape
# Export everything.
patients.to_json(output_file + ".json", orient='records')
# Ignore Nigerian samples for John
patients.to_csv(output_file+".csv", index = False)
