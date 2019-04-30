# File to manually convert the roster of a batch of samples to match the CViSB schema
#

import pandas as pd
import re

input_file = "/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/input_data/sample_rosters/2019-02-26_DNA and RNA sample List_MP_PRIVATE.xlsx"
output_file  = "/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/output_data/samples/2019-04-30_samples_PRIVATE.json"

lab = "TSRI-Andersen"
numAliquots = 1
dateModified = "2019-02-26"
updatedBy = "Laura Hughes"

# Functions
def getType(x):
    if(x == "Viral RNA (from Serum/Plasma)"):
        return("viralRNA")
    elif(x == "Genomic DNA (from buffycoats)"):
        return("DNA")
    else:
        return("unknown")

def getPrimary(x):
    if(x == "Viral RNA (from Serum/Plasma)"):
        return("serum_or_plasma")
    elif(x == "Genomic DNA (from buffycoats)"):
        return("buffy_coat")
    else:
        return("unknown")

def makePrimaryID(row):
    return(str(row.privatePatientID) + "_" + str(row.sourceSampleType))

def makeSampleID(row):
    # return("mp" + str(row.sampleType) + str(row.rowNum) + "_" + str(row.sampleType) + str(row.isolationDate))
    return(str(row.timepointID) + "_" + str(row.sampleType) + str(row.isolationDate))


def splitGID(id):
    if(id == id):
        threedigit = re.search("^([A-Z])([0-9][0-9][0-9])$", id)
        fourdigit = re.search("^([A-Z])([0-9][0-9][0-9][0-9])$", id)
        if(threedigit):
            return(threedigit[1] + "-" + threedigit[2])
        elif(fourdigit):
            return(fourdigit[1] + "-" + fourdigit[2])

def cleanSamples(df, date, id_col, species="human", modified = dateModified, updated = updatedBy, lab = lab, numAliquots = numAliquots):
    # splay the columns long
    df = pd.melt(df, id_vars=id_col, value_name='timepointID')

    # separate out the patient ID from visit code.
    df['patientID'] = "unknown"
    df['sampleLabel'] = df.timepointID
    df['privatePatientID'], df['visitCode'] = df['timepointID'].str.split('\-', 1).str
    df['privatePatientID'] = df.privatePatientID.apply(splitGID) # Add in hyphen

    df['visitCode'] = df.visitCode.fillna("unknown")
    df['isolationDate'] = date
    df['species'] = species
    df['derivedIndex'] = 1

    df['sampleType'] = df.variable.map(getType)
    df['sourceSampleType'] = df.variable.map(getPrimary)
    df['sourceSampleID'] = df.apply(makePrimaryID, axis=1)
    df['lab'] = lab
    df['numAliquots'] = numAliquots
    df['dateModified'] = modified
    df['updatedBy'] = updated

    # drop blank rows
    df.dropna(subset=["timepointID"], inplace=True)

    return(df)

# sampleID

# Import the sheets
# Lassa1: batch 1 from 2018-06-30;
lassa1 = pd.read_excel(input_file, sheetname=0, skiprows=1)
lassa1_date = pd.read_excel(input_file, sheetname=0, skiprows=0, header=None)
lassa1_date = lassa1_date[2][0].strftime('%Y-%m-%d')
lassa1.head()

l1 = cleanSamples(lassa1, lassa1_date, "Unnamed: 0")

# Lassa2: batch 1 from 2018-07-08;
lassa2 = pd.read_excel(input_file, sheetname=1, skiprows=1)
lassa2_date = pd.read_excel(input_file, sheetname=1, skiprows=0, header=None)
lassa2_date = lassa2_date[2][0].strftime('%Y-%m-%d')
l2 = cleanSamples(lassa2, lassa2_date, "#")

# Ebola;
ebola = pd.read_excel(input_file, sheetname=2, skiprows=1)
ebola_date = pd.read_excel(input_file, sheetname=2, skiprows=0, header=None)
ebola_date = ebola_date[2][0].strftime('%Y-%m-%d')
ebv = cleanSamples(ebola, ebola_date, "#")


# --- Combine, create new IDs, delete unnecessary stuff.
# concat together sheets
df = pd.concat([l1, l2, ebv])


# Create new sampleID == type + running count
# df["rowNum"] = df.groupby("sampleType").cumcount()+1
# df["sampleID"] = df.apply(makeSampleID, axis = 1)

df.columns
df[df.duplicated(subset=["derivedIndex", "isolationDate", "dateModified", "lab", "numAliquots", "visitCode", "privatePatientID", "sampleType", "sourceSampleID", "sourceSampleType", "timepointID"])]
# remove unneeded cols
df.drop(["#", "Unnamed: 0", "variable", "timepointID"], axis=1, inplace=True)

# --- Export ---
df.to_json(output_file, orient="records")
