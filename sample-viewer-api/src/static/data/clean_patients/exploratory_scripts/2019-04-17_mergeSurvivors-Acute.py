"""
Exploratory script to play with data before adding functions into compile_patient_roster.py
"""

import pandas as pd
import numpy as np
import collections

import os
os.chdir("/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/clean_patients")
import config

import helpers

filename = "/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/output_data/patients/patients_2019-04-17_PRIVATE.json"

df = pd.read_json(filename)
df.shape
df.columns

df.loc[1, config.export_cols]

df.groupby("AdmitStatus").daysInHospital.value_counts()

# Test merges
survivors = pd.read_json("/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/output_data/patients/survivors_cleaned_2019-04-17_PRIVATE.json")
lsv = pd.read_json("/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/output_data/patients/lassaAcute_cleaned_2019-04-17_PRIVATE.json")
# survivors = survivors[survivors.issue != survivors.issue]
# lsv = lsv[lsv.issue != lsv.issue]
lsv = lsv[lsv.gID == lsv.gID]
survivors.head()


set(survivors.columns) & set(lsv.columns)
survivors['hasGID'] = survivors.gID.apply(lambda x: x is not None)
# print(acuteLassa['gID', 'outcome', 'cohort', 'age', 'gender', 'elisa'].to_csv('lassa.csv')
# print(survivorsAll['gID', 'sID', 'outcome', 'cohort', 'age', 'gender', 'elisa'].to_csv('lassa.csv')

survivors.groupby("cohort").hasGID.value_counts()
survivors.hasGID.value_counts()

# Can't directly merge on gID b/c they're in an array
# Only bothering w/ the survivors w/
lsv_surv = survivors.loc[(survivors.hasGID == True), ['age', 'cohort', 'elisa', 'gID', 'sID', 'publicGID', 'publicSID', 'gender', 'outcome']]
lsv_surv



def explode(df, lst_cols, fill_value='', preserve_index=False):
    # make sure `lst_cols` is list-alike
    if (lst_cols is not None
        and len(lst_cols) > 0
        and not isinstance(lst_cols, (list, tuple, np.ndarray, pd.Series))):
        lst_cols = [lst_cols]
    # all columns except `lst_cols`
    idx_cols = df.columns.difference(lst_cols)
    # calculate lengths of lists
    lens = df[lst_cols[0]].str.len()
    # preserve original index values
    idx = np.repeat(df.index.values, lens)
    # create "exploded" DF
    res = (pd.DataFrame({
                col:np.repeat(df[col].values, lens)
                for col in idx_cols},
                index=idx)
             .assign(**{col:np.concatenate(df.loc[lens>0, col].values)
                            for col in lst_cols}))
    # append those rows that have empty lists
    if (lens == 0).any():
        # at least one list in cells is empty
        res = (res.append(df.loc[lens==0, idx_cols], sort=False)
                  .fillna(fill_value))
    # revert the original index order
    res = res.sort_index()
    # reset index if requested
    if not preserve_index:
        res = res.reset_index(drop=True)
    return res

index_col="alternateIdentifier"
import numpy as np
surv_long = explode(lsv_surv, ['gID'])
lsv_long = lsv.copy()
lsv_long['gID']= lsv_long.gID.apply(lambda x: x[0])

merged = pd.merge(surv_long, lsv_long, on="gID", indicator=True, how="outer")

merged[merged._merge=="both"].cohort_x.value_counts()
merged._merge.value_counts()
surv_long
x
createDict(merged.iloc[0:2], 'alternateIdentifier', ['gID'])
.to_dict(orient="records")

def createDict(df, index_col, cols2include = df.columns):
    """
    Creates dictionary from a DataFrame
    If the index_col is an array, will explode out the values, so there is one row for each instance of the index_col.
    """
    cols2include.append(index_col)
    df = df[cols2include]
    if(df[index_col].apply(lambda x: isinstance(x, list)).any()):
        df = explode(df, index_col)
    df_dict = df.set_index(index_col).to_dict("index")
    return(df_dict)

merged
merged._merge.value_counts()
merged['alternateIdentifier'] = merged.apply(lambda x: helpers.combineIDs(x, columns=["gID", "sID", "publicSID"]), axis = 1)
merged[['gID', 'sID', 'publicSID', 'alternateIdentifier']]
merged[merged._merge=="left_only"].sort_values("gID")

lsv['issue']= None
helpers.mergeByPublicIDs(surv_long[surv_long.cohort == "Unknown"], lsv, on=["gID"], mergeCols2Check=["age", "cohort", "gender"])


survivors.loc[survivors.gID == survivors.gID, ['gID', 'publicSID']]
_, g_dict = helpers.createDict(survivors[survivors.gID == survivors.gID], 'gID', ['publicSID'])
np.unique([1,1,2])
x = set(map(lambda x: f"{x}_x",["1", "2"]))
x.update(map(lambda x: f"{x}_y",["1", "2"]))
x
list(set(survivors.columns) & set(["gID_x"]))

survivors.shape
drop_mergeVars(survivors, ["gID", "ssID"]).shape



def matchByDict()
