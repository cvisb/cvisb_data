# <<< 2018-11-02_getHLA_patients.py >>>
# @name:        2018-11-02_getHLA_patients.py
# @summary:     quick function to extract patient metadata from HLA dataset
# @description: Based on genotype_call.csv summary file, grab the limited known metadata about the patients and conform to Patient schema.
# @inputs:      2018-10-29_Genotype_calls.csv
# @outputs:
# @examples:


import pandas as pd

filename = "/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/input_data/expt_summary_data/HLA/HLA_genotypeCalls_v1_2019-01-09_PRIVATE.csv"


# Read in the data
hla_df = pd.read_csv(filename)

hla_df.head()

# import Refugio's data
# rrs_file = "/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/HLA Compiled TSRI_Broad n257 09_04_18 _Refugio_PRIVATE.xlsx"
#
# rrs = pd.read_excel(rrs_file)
# rrs.shape
# rrs.head()
#
# rrs['ID'] = rrs["ID"].apply(lambda x: str(x).replace("_", "-"))
#
# merged = pd.merge(rrs, hla_df, indicator=True, how="outer")
#
# merged['_merge'].value_counts()
#
# lonelies = merged[merged['_merge']!='both']
# lonelies.to_csv("/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/2019-01-31HLA_mismatches_PRIVATE.csv")

# Rename.
hla_df.rename(columns={'ID': 'patientID',
                   'Alternative ID': 'alternateIdentifier'}, inplace=True)
hla_df.set_index('patientID', inplace=True)

# Standardize column values, as needed.
# Check what exists.
hla_df.Outcome.value_counts()

hla_df['Status '].value_counts()

# Cleaning functions
def cleanCohort(status):
    if((status.strip() == "EBOV") or (status.strip() == "EBV")):
        return("Ebola")
    elif((status.strip() == "LASV") or (status.strip() == "LSV")):
        return("Lassa")
    else:
        return(status.strip().lower())

def cleanOutcome(outcome):
    # Need to fix DEAD to Dead
    if(outcome.lower().strip() == "not admitted"):
        return("unknown")
    else:
        return(outcome.lower().strip())


def cleanCountry(country):
    if country.strip() == "Sierra Leone":
        return({
            'name': "Sierra Leone",
            'identifier': "SL"})
    elif country.strip() == "Nigeria":
        return({
            'name': "Nigeria",
            'identifier': "NG"})
    else:
        return({})

def getHLAdata(row):
    return([{
      'name': "HLA",
      'identifier': "hla",
      'data': row.tolist()
    }])

def getAltIDs(id):
    if(id == id):
        return(id)
    else:
        return(pd.np.nan)

hla_df['alternateIdentifier'] = hla_df['alternateIdentifier'].apply(lambda x: getAltIDs(x))
hla_df['outcome'] = hla_df['Outcome'].apply(lambda x: cleanOutcome(x))
hla_df['cohort'] = hla_df['Status '].apply(lambda x: cleanCohort(x))
hla_df['country'] = hla_df['Location']
hla_df['availableData'] = hla_df[hla_df.columns.difference(['Location', 'Typing Institution', "Outcome", "Status ", "alternateIdentifier", "outcome", "cohort", "country"])].apply(lambda row: getHLAdata(row), axis=1)


hla_df.columns
# Check it looks right...
hla_df.cohort.value_counts()
hla_df.head()


hla_df.reset_index(inplace=True)

hla_df = hla_df[['patientID', 'alternateIdentifier', 'cohort', 'outcome', 'country', 'availableData']]

# Fix to add G to known G-number
hla_df.loc[hla_df.patientID == "1951", "patientID"] = "G-1951"
