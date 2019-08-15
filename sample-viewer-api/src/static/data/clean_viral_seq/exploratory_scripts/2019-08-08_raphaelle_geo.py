import pandas as pd
import re


filename="/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/input_data/expt_summary_data/viral_seq/LASV_all_metadata_Raphaelle_2019-07-23.xlsx"
lsv_file = "/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/input_data/patient_rosters/acuteLassa_metadata_v2_2019-06-12_PRIVATE.csv"

df = pd.read_excel(filename, sheetname=1)
df.head()

# Pulling out the IDs from the sequencing string.
# Assuming segment_S / segment_L are identical aside from the accession number.
def getSeqID(row):
    if(row.segment_S == row.segment_S):
        return(row.segment_S)
    return(row.segment_L)


df['seq_id'] = df.apply(getSeqID, axis = 1)

df.head()
df['acc_num'], df['id'], df['species'], df['country2'], df['date'] =  df.seq_id.str.split("|").str

# Find the GIDs
def getGID(id):
    if(id == id):
        gid = re.search("G(\d\d\d\d)", id)
        if(gid):
            return(f"G-{gid[1]}")
        gid5 = re.search("G(\d\d\d\d)\d", id)
        if(gid5):
            return(f"G-{gid5[1]}")
        gid3 = re.search("G(\d\d\d)", id)
        if(gid3):
            return(f"G-0{gid3[1]}")
        gid4_ = re.search("G-(\d\d\d\d)", id)
        if(gid4_):
            return(f"G-{gid4_[1]}")
        gid3_ = re.search("G-(\d\d\d)", id)
        if(gid3_):
            return(f"G-0{gid3_[1]}")



df['gID'] = df.id.apply(getGID)
kgh.shape
kgh = df[df.gID == df.gID]
kgh.columns


# Admin1 == district (actually admin2)
kgh.admin1.value_counts(dropna=False)


# Mostly villages?
kgh.location.value_counts(dropna=False)

# [Read in the geographic info]  ----------------------------------------------------------------------------------------------------
# Geo Data hasn't been cleaned up yet, so importing the geo data separately.
lsv_geo = pd.read_csv(lsv_file)
lsv_geo['gID'] = lsv_geo.gid.apply(getGID)

# very mild clean-- Ken is clearly Kenema
def cleanDistrict(district):
    if(district == district):
        if(district.title() == "Ken"):
            return("Kenema")
        return(district)

lsv_geo['district'] = lsv_geo.District.apply(cleanDistrict)
lsv_geo.head()

lsv_geo = lsv_geo[['gID', 'district', "Chiefdom", "Village"]]
merged = pd.merge(kgh, lsv_geo, how="left", left_on="gID", right_on="gID", indicator=True)

merged._merge.value_counts()

merged.rename(columns={"_merge": "geo_merge"}, inplace=True)

# [Merge in additional basic metadata]  ----------------------------------------------------------------------------------------------------
ids = pd.read_json("/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/output_data/patients/patients_2019-08-09_PRIVATE_dict.json")
# /Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/output_data/patients/patients_2019-07-22_PRIVATE.json
ids.head()

ids.reset_index(inplace=True)
ids.rename(columns={"index":"ID"}, inplace=True)
ids.drop("gID", axis=1, inplace=True) # removing gID, since viral seq data are all gIDs to merge
ids.columns

merged = pd.merge(merged, ids, how="left", left_on="gID", right_on="ID", indicator=True)


merged._merge.value_counts()
merged.columns

# [Check values]  ----------------------------------------------------------------------------------------------------
merged['district_match'] = merged.apply(lambda x: x.admin1 == x.district, axis=1)
merged['village_match'] = merged.apply(lambda x: x.location == x.Village, axis=1)
merged[
['gID', 'admin1', "district", 'location', "Village", "Chiefdom", "district_match",
"village_match", "geo_merge", "outcome", "gender", "age", 'infectionDate', 'daysOnset', 'evalDate', 'dischargeDate',  "source", "reference", "latitude", "longitude", "precision"]].rename(columns = {
"district":"district_Tulane", "Village": "village_Tulane", "Chiefdom": "chiefdom_Tulane", "outcome": "outcome_Tulane",
"gender": "gender_Tulane", "age": "age_Tulane", 'evalDate':"evalDate_Tulane", 'dischargeDate':"dischargeDate_Tulane",
'daysOnset':"daysOnset_Tulane", 'infectionDate':"infectionDate_Tulane"
}).to_csv("/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/clean_viral_seq/exploratory_scripts/2019-08-08_raphaelle_geo_matches.csv", index=False)

merged.district_match.value_counts(dropna=False)
