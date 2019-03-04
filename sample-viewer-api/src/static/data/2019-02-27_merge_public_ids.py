import pandas as pd
import re

roster_file = "/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/2019-01-31_patients_PRIVATE.csv"
new_id_file = "/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/Survivor Scrambled ID Master_27FEB19_PRIVATE.xlsx"

# import new IDs from John
# read in new IDs as string to ensure preserve leading 0s
ids = pd.read_excel(new_id_file, converters={'Study Specific #': str})

# --- Grab the household ID information ---
# Double check all IDs are 7-digits
ids['id_length'] = ids['Study Specific #'].map(len)
ids.id_length.value_counts()

ids['hhID'] = ids['Study Specific #'].apply(lambda x: x[:-1])
ids['hhNumber'] = ids['Study Specific #'].apply(lambda x: x[-1])

# Huh. More contacts than I would have thought; roughly divided between primary contacts, #1, #2, #3
ids.hhNumber.value_counts()

ids[ids.Type == "s-"]

# Fix case of type; some S/s ambiguities
# Majority of samples are contacts.
ids.Type.value_counts()
ids["ID_type"] = ids.Type.apply(lambda x: x.upper())

# n = G: 137, S: 358, C: 1293
# ids[ids.ID_type=="S-"]["G-Number"].notnull().sum()
# --- Append ID_type to study number to create new id ---


def makePublicID(row):
    return(row.ID_type + row['Study Specific #'])


ids['publicPatientID'] = ids.apply(makePublicID, axis=1)

# Double check public PatientIDs are unique.
len(ids["Study Specific #"].unique()) == len(ids)
len(ids) - len(ids["Study Specific #"].unique())
# Duplicate rows: checking if duplicated in entire array. One value totally duplicated...
ids[ids.duplicated()]

# ... and another where the same new ID is assigned to two different contacts. :(
ids[ids.duplicated(subset=["Study Specific #"])]
ids[ids["Study Specific #"] == "8177251"]

ids[ids["hhID"] == "817725"]


# --- Create dictionary of known IDs ---
# split G-numbers into multiple values
def getGID(id):
    if(id == id):
        if(re.search("^[0-9][0-9][0-9]", id)):
            return("G-" + str(id))
        else:
            # For EM110
            return(str(id))
    else:
        # Ignore NaNs
        return(pd.np.nan)


def splitGID(id):
    if(id == id):
        return(str(id).split("/"))
    else:
        # Ignore NaNs
        return(pd.np.nan)


def getSID(row):
    return(row.ID_type + str(row.ID).zfill(3))

# Extract only the S-ids from S and C-ids


def findSID(id):
    if(re.search("^S\-[0-9][0-9][0-9]", id)):
        return(id)
    else:
        return(pd.np.nan)

# def grabIDs(row):
#     # split G-numbers into multiple values
#     if(row["G-Number"]==row["G-Number"]):
#         gID = str(row["G-Number"]).split("/")
#         # Append G- to G numbers
#         gID = ["G-" + s for s in gID]
#     else:
#         # Ignore NaNs
#         gID = []

    # # Append S- or C- to IDs
    # sID = row.ID_type + str(row.ID).zfill(3)
    # # Merge together and return
    # gID.append(sID)
    # return(gID)


ids['gID'], ids['gID2'] = ids['G-Number'].apply(splitGID).str
ids['gID'] = ids.gID.apply(getGID)
ids['gID2'] = ids.gID2.apply(getGID)
# Taking the first G-number to be its G-number
ids['G_number'] = ids.gID
ids['alternateIdentifier'] = ids.gID2

# ids['id_dict'] = ids.apply(grabIDs, axis = 1)
# ids['id_count'] = ids.id_dict.map(len)

ids['sID'] = ids.apply(getSID, axis=1)
ids['S_number'] = ids.sID.apply(findSID)

# Hand check anything with a dictionary value length > 2
# Expect 137 IDs to have more than 1 ID.
# Seems to check out.
ids["G-Number"].notnull().sum()

# ids.id_count.value_counts()


# Check S-ids are unique. They are not.
ids[ids.duplicated(subset=["sID"])].sID
# G-ids seem to be unique.
ids.dropna(subset=["G-Number"]
           )[ids.dropna(subset=["G-Number"]).duplicated(subset=["gID"])]


# --- Group by household IDs to generate relatedTo, hhCount ---
ids["hhCount"] = ids.groupby("hhID").publicPatientID.transform("count")
# ids["relatedTo"] = ids.groupby("hhID")['publicPatientID'].apply(listicle, axis = 1)


# convert wide to long, to create a many:many ID --> publicID dictionary.
id_df = pd.melt(ids, value_vars=["gID", "gID2", "sID"], id_vars=["publicPatientID", "hhID", 'hhNumber', "hhCount",
                                                                 "ID_type", "G_number", "S_number", "alternateIdentifier"], var_name="type_discard", value_name='ID')

id_df = id_df.dropna(subset=["ID"]).drop(["type_discard"], axis=1)

# id_dict =
id_dict = id_df.set_index("ID").to_dict("index")

# -------------------------------- MERGE --------------------------------
cvisb = pd.read_csv(roster_file)

cvisb.head()

# Categorize the ID type


def findType(id):
    if(re.search("^G\-[0-9][0-9][0-9]", id)):
        return("G-id")
    elif(re.search("^C.*[0-9][0-9][0-9]", id)):
        return("C-id")
    elif(re.search("^S.*\-[0-9][0-9][0-9]", id)):
        return("S-id")
    elif(re.search("^S[0-9][0-9][0-9]", id)):
        return("S-id")
    else:
        return("unknown")


cvisb['id_type'] = cvisb.ID.apply(findType)

# Very different distribution of data between John's roster and the samples we've pulled!
cvisb.id_type.value_counts()

# Initial test: merging based on G-ID or S/C-ID.  Mostly fails.... 75 match exactly w/ G-ids, 146 with S or C-ids.
# Problems:
dfG = pd.merge(cvisb, ids, how='left', indicator=True,
               left_on="ID", right_on="gID")
dfS = pd.merge(cvisb, ids, how='left', indicator=True,
               left_on="ID", right_on="sID")

dfG._merge.value_counts()
dfS.groupby("id_type")._merge.value_counts()


g_pdmerge = dfG[(dfG.id_type == "G-id") & (dfG._merge == "both")].ID_x
s_pdmerge = dfS[(dfS.id_type != "G-id") & (dfS._merge == "both")].ID_x

dfS._merge.value_counts()
dfS.groupby("id_type")._merge.value_counts()


# -------------------------------- MERGE #2: manual loop function --------------------------------
# Re-importing data, so the allIDs comes in as an array
import os
os.chdir("/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/")
from cvisb_patient_prep import patients

# Remove Nigerian patients
patients = patients[patients.country != 'Nigeria'].drop('country', axis=1)

patients['id_type'] = patients.ID.apply(findType)

# from ast import literal_eval
# # Convert strings to array
# def string2array(val):
#     if(re.search("^\[.+\]$", val)):
#         print('converting')
#         return(literal_eval(val))
#     else:
#         return((val))

# cvisb['allIDs2'] = cvisb.allIDs.apply(string2array)


def findID(row, includeAssumptions=False):
    # for all: check no whitespace on any side
    public_ids = []
    # Check the main ID
    # print(row.ID)
    main_id = row.ID.strip()
    if(main_id in id_dict):
        # print('found')
        public_ids.append(id_dict[main_id]['publicPatientID'])

    # If include assumed IDs, check those as well.
    if(includeAssumptions):
        assumed_id = str(row.ID_assumed).strip()
        if(assumed_id in id_dict):
            public_ids.append(id_dict[assumed_id]['publicPatientID'])

# Array of Alternate IDs
    if(isinstance(row.allIDs, list)):
        for id in row.allIDs:
            # print(id)
            # Check if it exists in the dictionary
            if(id.strip() in id_dict):
                # print('found')
                public_ids.append(id_dict[id.strip()]['publicPatientID'])
    else:
        # Single ID string
        # print(row.allIDs)
        alt_id = row.allIDs.strip()
        if(alt_id in id_dict):
            public_ids.append(id_dict[alt_id]['publicPatientID'])
    print(public_ids)
    # remove duplicates
    return(list(set(public_ids)))


def interpretID(id):
    id = str(id)
    print(id)
    # Interpret ID based on regex patterns
    # Assuming C1-496-2 == C[visit number]-[id number]-[household number]
    # Therefore deleting the visit code
    weirdC = re.match("^(C)([0-9])(\-[0-9][0-9][0-9]\-[0-9])$", id)
    if weirdC:
        return(weirdC[1] + weirdC[3])
    # S-timepoint: assuming S-108-3 == S-108 at visit 3.
    sTimepoint = re.match("^(S)(\-[0-9][0-9][0-9])\-([0-9])$", id)
    if sTimepoint:
        return(sTimepoint[1] + sTimepoint[2])
    # 4-digit SID: S-0021-3 --> S-021 at visit 3
    sTimepoint2 = re.match("^(S\-)0([0-9][0-9][0-9])\-([0-9])$", id)
    if sTimepoint2:
        return(sTimepoint2[1] + sTimepoint2[2])
    # S-timepoint in diff format: assuming S2-183 == S-183 at visit 2
    weirdS = re.match("^(S)([0-9])(\-[0-9][0-9][0-9])$", id)
    if weirdS:
        return(weirdS[1] + weirdS[3])
    nohyphen = re.match("^(S)([0-9][0-9][0-9])$", id)
    if nohyphen:
        return(nohyphen[1] + "-" + nohyphen[2])

    return(pd.np.nan)


patients['ID_assumed'] = patients.ID.apply(interpretID)

# Only look for exact matches between IDs in our roster and John's.
# Only interpretation I did: Gxxx or Gxxxx = G-xxx / G-xxxx
patients['publicID_exact'] = patients.apply(findID, axis=1)
patients['exactLength'] = patients.publicID_exact.apply(len)

patients.exactLength.value_counts()
patients.groupby("id_type").exactLength.value_counts()

# Look for exact + inexact matches.
# Only interpretation I did: Gxxx or Gxxxx = G-xxx / G-xxxx
patients['publicID_inexact'] = patients.apply(
    lambda x: findID(row=x, includeAssumptions=True), axis=1)
patients['inexactLength'] = patients.publicID_inexact.apply(len)
patients['inexactMatch'] = patients.publicID_inexact.apply(
    lambda x: len(x) > 0)

patients.inexactLength.value_counts()
patients.groupby("id_type").inexactLength.value_counts()

patients.sample(10)

# A couple of entries seem to be transcribed improperly, leading to multiple identifiers:
# G-3284	"This should be G-3283" -- Brian's rosters
# S-492 	"This should be S-452" -- Brian's rosters
# G-4009	S-009 -- Brian's roster
patients[patients.inexactLength > 1]


# Check difference
g_mymerge = patients[(patients.id_type == "G-id")
                     & (patients.exactLength > 0)].ID
s_mymerge = patients[(patients.id_type != "G-id")
                     & (patients.exactLength > 0)].ID
set(g_pdmerge) - set(g_mymerge)
set(g_mymerge) - set(g_pdmerge)
set(s_pdmerge) - set(s_mymerge)
set(s_mymerge) - set(s_pdmerge)

# Bit of cleanup before exporting


def cleanID(id):
    if(len(id) == 0):
        return pd.np.nan
    elif(len(id) == 1):
        return(id[0])
    else:
        return(id)

    id_df.head()


# Final check for merges: are there unused IDs from the matches that I have that John doesn't have?
# -- and therefore might be contradictory.
matches = patients[patients.inexactLength == 1][[
    'ID', 'allIDs', 'ID_assumed', 'publicID_inexact']]
matches['publicPatientID'] = matches.publicID_inexact.apply(cleanID)
matches.head()

merged = pd.merge(matches, id_df, how="left",
                  on="publicPatientID", indicator=True)
merged._merge.value_counts()  # YAY! all merge.


def compareRosters(row):
    # Pull out all identifiers from CViSB
    cvisb = row.allIDs
    if(isinstance(cvisb, list)):
        cvisb.append(row.ID_x)
        if(row.ID_assumed == row.ID_assumed):
            cvisb.append(row.ID_assumed)
    else:
        cvisb = [row.ID_x, row.ID_assumed, row.allIDs]

    # Use the same assumptions to get rid of timepoint IDs
    cvisb = [convert(id) for id in cvisb]

    # Pull out Tulane identifiers
    john = set([row.G_number, row.S_number, row.alternateIdentifier, row.ID_y])

    return(list(set(cvisb) - john))


def convert(id):
    if(id == id):
        id = id.strip()
        # Use interpretID function to clean up S and C IDs
        first_pass = interpretID(id)
        if(first_pass == first_pass):  # not null
            return(first_pass)

        sid = re.match("^(S\-)([0-9][0-9])(\-[0-9])$", id)
        if sid:
            return(sid[1] + "0" + sid[2])

        gid = re.match("^(G)([0-9][0-9][0-9][0-9])$", id)
        if gid:
            return(gid[1] + "-" + gid[2])

        gidTime = re.match("^(G)([0-9][0-9][0-9][0-9])\-\d$", id)
        if gidTime:
            return(gidTime[1] + "-" + gidTime[2])
        if id == "nan":
            return(pd.np.nan)

    return(id)


[convert(id) for id in ["S3-107", "G5578"]]

merged.head()
merged['leftover_IDs'] = merged.apply(compareRosters, axis=1)
merged['leftover_length'] = merged.leftover_IDs.apply(len)

merged.leftover_length.value_counts()

merged[merged.leftover_length > 0][["ID_x", "ID_assumed", "allIDs",  "ID_y", "G_number", "S_number",
                                    "alternateIdentifier", "leftover_IDs", "leftover_length"]].to_csv("2019-02-28_weirdIDjoins.csv")


# ----- Export G-numbers without matches -------
# reorder rows and columns
patients.sort_values(["inexactLength", "id_type", "ID"], inplace=True)


missing = patients[patients.exactLength != 1]
missing = missing[["ID", "ID_assumed", "allIDs", "id_type",
                   "cohort", "outcome", "publicID_inexact", "inexactMatch", "source"]]
missing["publicID_inexact"] = missing.publicID_inexact.apply(cleanID)

missing.to_csv(
    "2019-02-28_CViSBmissingPublicIDs_PRIVATE.csv", index=False)
