import pandas as pd

# TODO: clean up if sample or patient ID
serology_file = "/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/input_data/expt_summary_data/systems_serology/systemsserology_v1_2018-04-12_PRIVATE.xlsx"

sero = pd.read_excel(serology_file)
sero.head()
sero.rename(columns={'ID ': 'alternateIdentifier'}, inplace=True)
def getID(row):
    if (pd.isnull(row['Sample ID'])):
        # print(row.alternateIdentifier)
        return(row.alternateIdentifier)
    else:
        # print(row['Sample ID'])
        return(row['Sample ID'])


sero['patientID'] = sero.apply(lambda row: getID(row), axis=1)
sero.dropna(subset=['patientID'], inplace=True) # Remove standards
sero.head()
sero.Group.value_counts()


def getSeroGroup(x):
    if(x == "Ebola and Lassa Negative"):
        return("control")
    elif(x == "Ebola Survivor"):
        return("Ebola")
    elif(x == "Lassa Survivor, Ebola negative"):
        return("Lassa")
    elif(x == "Household Contact"):
        return("Ebola")
    else:
        return()

def getSeroOutcome(x):
    if(x == "Ebola and Lassa Negative"):
        return("control")
    elif(x == "Ebola Survivor"):
        return("survivor")
    elif(x == "Lassa Survivor, Ebola negative"):
        return("survivor")
    elif(x == "Household Contact"):
        return("contact")
    else:
        return()

sero['cohort'] = sero.Group.apply(lambda x: getSeroGroup(x))
sero['outcome'] = sero.Group.apply(lambda x: getSeroOutcome(x))

sero.cohort.value_counts()
sero.outcome.value_counts()
sero.shape
sero.head()

# File two : From Sept 2018, asked for patients for which Bonnie needed metadata.
crosscheck_file = "/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/input_data/cvisb_random_rosters/samples_needing_metadata_Sept2018_LDH-MP-BG_PRIVATE.xlsx"
cross = pd.read_excel(crosscheck_file)
cross.head()

cross = cross[cross.requester == 'Bonnie']

cross = cross[['ID', 'requester']].copy()
cross = cross.drop_duplicates()

test = pd.merge(sero, cross, how="outer", indicator=True, left_on="patientID", right_on="ID")

test._merge.value_counts()

test
