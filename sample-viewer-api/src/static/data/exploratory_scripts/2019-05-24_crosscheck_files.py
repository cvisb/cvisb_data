import pandas as pd

import os
os.chdir("/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data")
import helpers

# Comparing two versions of survivor roster.

v1_file = "/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/input_data/patient_rosters/survivor_IDdict_v1_2019-02-27_PRIVATE.xlsx"
v2_file = "/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/input_data/patient_rosters/unnamed originals/Survivor Study Enrollment Log Stacked_6Mar19_For Dylan.xlsx"

mergeOn = ['G-Number', 'Study Specific #', 'Type', 'ID']


v1 = pd.read_excel(v1_file, converters={'Study Specific #': str, 'ID': str})
v2 = pd.read_excel(v2_file, usecols=list(range(0, 15)), converters={
                   'Study Specific #': str, 'ID Number': str})

v1.head()
v1.shape
v2.shape
v2.columns
v2.head()
v1.columns

# standardize ID length
v1['ID'] = v1.ID.apply(lambda x: x.zfill(3))
pd.np.nan
# standardize names
v2.rename(columns={'G-NUM': "G-Number", "ID Number": "ID", "Subject Type": "Type",
                   "Unnamed: 5": "age_months", "Unnamed: 6": "age_days"}, inplace=True)

# drop empty rows: for future patients not yet enrolled.
v2.dropna(subset=["ID"], inplace=True)

v2['cohort'] = v2['Case Type'].apply(helpers.cleanCohort)

v2.cohort.value_counts(dropna=False)

v2.groupby('cohort')['Case Type'].value_counts(dropna=False)
# Alright. Two files at least have the same length.
v2.shape
v1.shape

# Deal with outcome
v2["Enrolled Type"].value_counts()


v2['sID'] = v2.apply(lambda x: x.Type.upper() + x.ID.zfill(3), axis=1)
v2['outcome'] = v2.sID.apply(helpers.assignOutcome)

v2.outcome.value_counts(dropna=False)


def cleanSurvivorOutcome(input):
    if(input != input):
        return('unknown')
    outcome = input.lower()
    if(re.search("contac", outcome)):
        return("contact")
    # lots of misspellings...
    if(re.search("conat", outcome)):
        return("contact")
    if(re.search("ontact", outcome)):
        return("contact")
    if(re.search("contca", outcome)):
        return("contact")
    if(re.search("con(\w*)act", outcome)):
        return("contact")
    if(re.search("contat", outcome)):
        return("contact")
    if(re.search("cotact", outcome)):
        return("contact")
    if(outcome == "case"):
        return("survivor")
    else:
        return(outcome)

# For the survivor roster, their contact group number is also encoded in the
# "Enrolled Type" field


def getPrivateContactGroup_contacts(input):
    if(input == input):
        threedigit = re.search("(\d\d\d)", input)
        if(threedigit):
            return(threedigit[1])
        twodigit = re.search("(\d\d)", input)
        if(twodigit):
            return(twodigit[1].zfill(3))


v2['outcome2'] = v2["Enrolled Type"].apply(cleanSurvivorOutcome)
v2['PrivateContactGroup'] = v2.sID.apply(helpers.getPrivateContactGroup)
v2['PrivateContactGroup2'] = v2["Enrolled Type"].apply(
    getPrivateContactGroup_contacts)
v2['contactGroupAgree'] = v2.apply(
    lambda x: x.PrivateContactGroup == x.PrivateContactGroup2, axis=1)
v2['outcomeAgree'] = v2.apply(lambda x: x.outcome == x.outcome2, axis=1)


# Okay: two instances of contact group not agreeing, but given the messiness of "Enrolled Type"
# and the self-consistency with the public IDs, I'm going to ignore them.
v2.contactGroupAgree.value_counts()

v2.loc[(~v2.contactGroupAgree) & (v2.outcome == 'contact'), ['Type', 'Study Specifc #',
                                                             'ID', 'PrivateContactGroup', 'PrivateContactGroup2', 'Enrolled Type']]

v2.loc[(v2.PrivateContactGroup == "379") | (v2.PrivateContactGroup == "380"), [
    'Type', 'Study Specific #', 'ID']].sort_values('ID')

v2.outcomeAgree.value_counts(dropna=False)

v2.outcome2.value_counts(dropna=False)

v2.loc[~v2.outcomeAgree, ['Type', "ID", "Enrolled Type"]]

v2.loc[v2.PrivateContactGroup == "371", ['Type', "ID", "Enrolled Type", "Study Specific #"]]

v2.head()


# Check dupes-- as previously notices, v1 has one duplicate.
sum(v1.duplicated())
sum(v2.duplicated())
sum(v2.duplicated(subset=mergeOn))
sum(v2.duplicated(subset='ID'))
sum(v2.duplicated(subset='Study Specific #'))
sum(v2[v2["G-Number"].notnull()].duplicated(subset='G-Number'))

# Time to merge!
merged = pd.merge(v1, v2, how="outer", indicator=True, on=mergeOn)

merged._merge.value_counts()

# Alright, 7 mismatches...

id_merge = pd.merge(v1, v2, how="outer", indicator=True, on="Study Specific #")

id_merge._merge.value_counts()

id_merge.columns


def checkG(row):
    if((row["G-Number_x"] == row["G-Number_x"]) | (row["G-Number_y"] == row["G-Number_y"])):
        return(row["G-Number_x"] == row["G-Number_y"])
    else:
        return(True)


id_merge['id_match'] = id_merge.apply(lambda x: x.ID_x == x.ID_y, axis=1)
id_merge['type_match'] = id_merge.apply(lambda x: x.Type_x == x.Type_y, axis=1)
id_merge['g_match'] = id_merge.apply(lambda x: checkG(x), axis=1)

id_merge['mismatch'] = id_merge.apply(lambda x: not(
    all([x.id_match, x.type_match, x.g_match])), axis=1)

id_merge.id_match.value_counts()
id_merge.type_match.value_counts()
id_merge.g_match.value_counts()
id_merge.mismatch.value_counts()

id_merge.loc[id_merge.mismatch, ['Study Specific #', 'ID_x',
                                 'ID_y', 'G-Number_x', 'G-Number_y', 'Type_x', 'Type_y']]
