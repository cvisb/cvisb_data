import pandas as pd
import numpy as np
import collections
import numpy as np

def createDict(df, index_col, cols2include = "all", dropdupes = False):
    """
    Creates dictionary from a DataFrame
    If the index_col is an array, will explode out the values, so there is one row for each instance of the index_col.
    """
    if(cols2include == "all"):
        cols2include = df.columns
        cols2include.append("index_col")
    else:
        cols2include = cols2include.copy()
        cols2include.append(index_col)
        cols2include.append("index_col")
        cols2include = np.unique(cols2include)

    # create a copy of the index column
    df['index_col'] = df.loc[:,index_col].copy()

    # Select only what you need
    df = df[cols2include]

    if(df[index_col].apply(lambda x: isinstance(x, list)).any()):
        df = explode(df, "index_col")

    df.rename(index=str, columns = {"index_col": "ID"}, inplace = True)

    if(dropdupes):
        df_orig = len(df)
        df.drop_duplicates(subset=["ID"], inplace = True)
        if(df_orig != len(df)):
            print("\n\n" + str(df_orig - len(df)) + " IDS REMOVED FROM DICTIONARY BECAUSE DUPLICATED!")

    df = df.set_index("ID")

    return((df, df.to_dict("index")))

def explode(df, lst_cols, fill_value='', preserve_index=False):
    """
    From https://stackoverflow.com/questions/12680754/split-explode-pandas-dataframe-string-entry-to-separate-rows
    """
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


def flatten(l):
    """
    takes a list of lists (which could include single elements) and returns a single flattened list
    from https://stackoverflow.com/questions/2158395/flatten-an-irregular-list-of-lists
    """
    for el in l:
        if isinstance(el, collections.Iterable) and not isinstance(el, (str, bytes)):
            yield from flatten(el)
        else:
            yield el


def combineIDs(row, columns=["gID", "sID", "publicGID", "publicSID"], unique = True):
    """
    Creator for `alternateIdentifier` -- an array of all known IDs for a given patient
    """
    ids = []

    for column in columns:
        if ((isinstance(row[column], pd.Series)) | (isinstance(row[column], list)) | (isinstance(row[column], np.ndarray))):
            if(pd.notnull(row[column]).any()):
                ids.extend(row[column])
        elif ((row[column] == row[column]) & (pd.notnull(row[column])) & (row[column] is not None)):
            ids.append(row[column])

    if(unique):
        ids = list(set(ids))
    if(len(ids) > 0):
        return([ids])
    return(np.nan)

def mergeByPublicIDs(df1, df2, on=["publicPatientID"], how="left",
                     mergeCols2Check=["gID", "sID", "alternateIdentifier", "outcome"], errorCol="issue",
                     df1_label="patient data", df2_label="id roster"):
    """
    Merges two dataframes by publicPatientID (by default).
    After merging, will also manually merge the columns in `mergeCols2Check`, which are assumed to be redundant in df1 and df2 (though it'll check they exist)
    Lastly, it'll add any errors to the `errorCol`, where values in the `mergeCols2Check` don't agree.
    """
    # check if publicPatientID, sID, outcome, etc. all exist
    # Raise error for no merge value.
    df_merged = pd.merge(df1, df2, on=on, how=how, indicator=True)

    df_merged = checkMerge(df_merged, mergeCols2Check, df1_label, df2_label, on, errorCol)

    # print(df_merged.sample(5))

    return(df_merged)


def checkMerge(merged, mergeCols2Check, df1_label, df2_label, mergeCol, errorCol,
dropMerge = True, leftErrorMsg = None, rightErrorMsg = None, ignoreUnknown = True, cols2Ignore = ["issue"]):
    """
    Helper function for `mergeByPublicIDs(...)`
    Does two things:
    (1) updates the errorCol if there are discrepancies between the values within the two data sources
    (2) creates a new merged value for the two data sources. If equal, will be the same; otherwise, will concat the two different values.
    Need to double check that overlapping variables are the same.
    Choosing to do this way rather than merging on=["publicPatientID", "sID", "gID", "outcome"] to isolate where the discrepancy occurs.
    Also can't merge on gID, since it's a list.

    Loops over the columns to combine to check if there are discrepancies
    (which would have prevented merge) and updates new values for those variables.
    After creating error messages, drops `_merge` column
    """

    # Add in _merge error.
    if(leftErrorMsg is not None):
        merged = addError(merged, merged._merge == "left_only", leftErrorMsg, errorCol)
    else:
        merged = addError(merged, merged._merge == "left_only", f"{df2_label} doesn't include this {mergeCol} value", errorCol)
    if(rightErrorMsg is not None):
        merged = addError(merged, merged._merge == "right_only", rightErrorMsg, errorCol)
    else:
        merged = addError(merged, merged._merge == "right_only", f"{df1_label} doesn't include this {mergeCol} value", errorCol)
    merged_cols = merged.columns


    for colVar in mergeCols2Check:
        # Double check that the columns exist in the merged dataframe
        if((f"{colVar}_x" in merged_cols) & (f"{colVar}_y" in merged_cols)):
            merged[colVar] = np.nan
            merged[errorCol] = merged.apply(lambda x: checkMergeRowwise(x, colVar, errorCol, df1_label, df2_label, ignoreUnknown, cols2Ignore), axis=1)
            merged[colVar] = merged.apply(lambda x: combineColsRowwise(x, colVar, ignoreUnknown), axis=1)
    # Get rid of the _merge tracking variable
    if(dropMerge):
        merged.drop(['_merge'], axis = 1, inplace = True)
    return(merged)


def checkMerge2(merged, mergeCols2Check, df1_label, df2_label, mergeCol, errorCol,
dropMerge = True, leftErrorMsg = None, rightErrorMsg = None, ignoreUnknown = True, cols2Ignore = ["issue"]):
    # Add in _merge error.
    if(leftErrorMsg is not None):
        merged = addError(merged, merged._merge == "left_only", leftErrorMsg, errorCol)
    else:
        merged = addError(merged, merged._merge == "left_only", f"{df2_label} doesn't include this {mergeCol} value", errorCol)
    if(rightErrorMsg is not None):
        merged = addError(merged, merged._merge == "right_only", rightErrorMsg, errorCol)
    else:
        merged = addError(merged, merged._merge == "right_only", f"{df1_label} doesn't include this {mergeCol} value", errorCol)
    merged_cols = merged.columns


    for colVar in mergeCols2Check:
        # Double check that the columns exist in the merged dataframe
        if((f"{colVar}_x" in merged_cols) & (f"{colVar}_y" in merged_cols)):
            merged[colVar] = np.nan
            merged[errorCol] = merged.apply(lambda x: checkMergeRowwise(x, colVar, errorCol, df1_label, df2_label, ignoreUnknown, cols2Ignore), axis=1)
            merged[colVar] = merged.apply(lambda x: combineColsRowwise2(x, colVar, ignoreUnknown), axis=1)
    # Get rid of the _merge tracking variable
    if(dropMerge):
        merged.drop(['_merge'], axis = 1, inplace = True)
    return(merged)


def checkMergeRowwise(row, colVar, errorCol, df1_label, df2_label, ignoreUnknown, cols2Ignore):
    """
    Adds error if the columns disagree.

    cols2Ignore are columns to ignore, since they will be combined/concatenated
    regardless of whether they disagree. For instance: issue should be merged-- they don't need to agree.
    """
    x = row[colVar + "_x"]
    y = row[colVar + "_y"]

    if(ignoreUnknown):
        # Replaces "unknown" or "Unknown" with NA
        if(str(x).lower() == "unknown"):
            x = np.nan
        if(str(y).lower() == "unknown"):
            y = np.nan


    # Two values disagree and both _x or _y are not null
    # If either x or y is null, assuming that the non-null value is the correct one; replace info
    if((x != y) & ((x == x) & (y == y)) & (colVar not in cols2Ignore)):
        new_msg = updateError(row[errorCol],  f"{colVar} disagrees in {df1_label} and {df2_label}")
        return(new_msg)
    # Else, return the previous error message
    return(row[errorCol])


def combineColsRowwise(row, colVar, ignoreUnknown):
    """
    Returns the combination of two columns from a merge
    e.g. sID_x and sID_y
    if they're the same, return just the value
    otherwise, return the list.
    If they're NA, return the non-NA value.
    """
    x = row[colVar + "_x"]
    y = row[colVar + "_y"]

    # Special, custom merge objects
    if(colVar == "issue"):
        return(updateError(x, y))

    if(ignoreUnknown):
        # Replaces "unknown" or "Unknown" with NA
        if(str(x).lower() == "unknown"):
            x = np.nan
        if(str(y).lower() == "unknown"):
            y = np.nan

    if(x != y):
        # x is NA; return y
        if (x != x):
            return(y)
        # y is NA; return x
        if (y != y):
            return(x)
        if (isinstance(x, list)):
            x.extend(y)
            return(x)
        if (isinstance(y, list)):
            y.extend(x)
            return(y)
        # x and y aren't lists; concatenate and remove duplicates
        return(list(set([x, y])))
    return(x)

def combineColsRowwise2(row, colVar, ignoreUnknown):
    """
    Returns the combination of two columns from a merge
    e.g. sID_x and sID_y
    if they're the same, return just the value
    otherwise, return the list.
    If they're NA, return the non-NA value.
    """
    x = row[colVar + "_x"]
    y = row[colVar + "_y"]

    # Special, custom merge objects
    if(colVar == "issue"):
        # For `issue`, concat together the previous issues
        return(updateError(x, y))

    # if(ignoreUnknown & (colVar != "outcome")):
    #     # Replaces "unknown" or "Unknown" with NA
    #     if(str(x).lower() == "unknown"):
    #         x = np.nan
    #     if(str(y).lower() == "unknown"):
    #         y = np.nan

    xIsList = isinstance(x, list)
    yIsList = isinstance(y, list)

    if(xIsList | yIsList):
        if(x == y):
            return([x])
        else:
            if(x != x):
                return([y])
            if(y != y):
                return([x])
            if(xIsList):
                arr = x.copy()
                arr.extend(y)
                try:
                    # Try to return only unique items.
                    # Will not work for array of dicts (like ELISAs)-- so just return the values
                    return([np.unique(arr)])
                except:
                    return(arr)
            if(yIsList):
                arr = y.copy()
                arr.extend(x)
                try:
                    # Try to return only unique items.
                    # Will not work for array of dicts (like ELISAs)-- so just return the values
                    return([np.unique(arr)])
                except:
                    return(arr)
    else:
        if(x != y):
            # x is NA; return y
            if (x != x):
                return(y)
            # y is NA; return x
            if (y != y):
                return(x)
            # If one of the values is 'unknown', replace with the other.
            if (x.lower() == "unknown"):
                return(y)
            if (y.lower() == "unknown"):
                return(x)
            # if (isinstance(x, list)):
            #     x.extend(y)
            #     return(x)
            # if (isinstance(y, list)):
            #     y.extend(x)
            #     return(y)
            # x and y aren't lists; concatenate and remove duplicates
            return(list(set([x, y])))
        # Equal; just return x (since they're the same)
        return(x)

def drop_mergeVars(df, cols2drop):
    """
    Removes any columns specified in `cols2drop` appended with `_x` or `_y`-- products of a merge
    Should be done after the merged values are reconcilled.
    """
    droppable = set(map(lambda x: f"{x}_x", cols2drop))
    droppable.update(map(lambda x: f"{x}_y", cols2drop))

    cols2drop = list(set(df.columns) & droppable)

    return(df.drop(cols2drop, axis = 1))

def matchByDict(row, id_dict, col2LookIn, col2Return):
    """
    Essentially, a merge.
    For each row, if `row[col2LookIn]` is id_dict, return id_dict[col2Return]
    """
    found_val = []
    if(isinstance(row[col2LookIn], list)):
        for val in row[col2LookIn]:
            if(row[col2LookIn] == "G-6957"):
                print("G6957")
            found_val.append(findInDict(id_dict, val, col2Return))
        return(found_val)
    else:
        return(findInDict(id_dict, row[col2LookIn], col2Return))


def findInDict(id_dict, val, col2Return):
    try:
        return(id_dict[val][col2Return])
    except:
        pass
