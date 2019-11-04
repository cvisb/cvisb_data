# File containing additional connections between private and public IDs.
# Contains both IDs of patients that are in other data sources but who are missing a study specific number,
# as well as those for whom we have no data.
# cohort, outcome usually from other CViSB sources, not necessarily Tulane.

import pandas as pd
import helpers

def cleanCombined(arr):
    if(len(arr) == 1):
        return(arr[0])
    filtered = [x for x in arr if "Unknown" not in x.title()]
    if(len(filtered) == 1):
        return(filtered[0])
    retun(filtered)

def clean_extra_ids(file, output_file):
    print("\n\nCleaning additional IDs...")
    df = pd.read_csv(file)
    df = df.dropna(subset=["gID"], axis=0)

    # Bit of a cheat... but they're all G-ids
    df['patientID'] = df['Study Specific #'].apply(lambda x: f"G{x}")

    # check everything looks okay
    df['gID'] = df.gID.apply(helpers.interpretID)
    df['countryName'] = "Sierra Leone"


    df.drop(["Study Specific #", 'hasPatientData'], inplace=True, axis = 1)

    # There are some duplicate IDs in the file I gave Emily... cleaning those up:
    # Removing duplicates if have same gID, patientID, and cohort/outcome (removing unknowns)
    cohorts = df.groupby("gID").cohort.apply(lambda x: list(set(x)))
    cohorts = cohorts.reset_index()
    cohorts['cohortMerged'] = cohorts.cohort.apply(cleanCombined)

    outcomes = df.groupby("gID").outcome.apply(lambda x: list(set(x)))
    outcomes = outcomes.reset_index()
    outcomes['outcomeMerged'] = outcomes.outcome.apply(cleanCombined)
    # merge back
    df = pd.merge(outcomes[['outcomeMerged', 'gID']], df, on="gID")
    df = pd.merge(cohorts[['cohortMerged', 'gID']], df, on="gID")
    df.drop(["cohort", "outcome"], inplace=True, axis = 1)
    df.rename(columns = {'cohortMerged': 'cohort', 'outcomeMerged': 'outcome'}, inplace=True)

    # Double check that cohort, outcome are Ebola/Lassa/Unknown, etc.
    # For some of the extra IDs, they're ambiguous, so cohort = "[Ebola, Lassa]"
    # Converting back to unknown
    df['cohort'] = df.cohort.apply(helpers.cleanCohort)
    df['outcome'] = df.outcome.apply(helpers.cleanOutcome)


    df_unique = df.drop_duplicates(subset=["gID", "patientID", "cohort", "outcome"])
    len(df_unique)

    num_dupes = len(df) - len(df_unique)
    if(num_dupes > 0):
        print(f"{num_dupes} exact duplicate extra IDs have been safely combined and removed.\n")

    dupes = df_unique[df_unique.duplicated(subset=["patientID"], keep=False)].sort_values("patientID")

    if(len(dupes) > 0):
        print(f"{len(dupes)} duplicate public IDs found in additional roster!  Being removed")
        dupes.to_csv(output_file + ".csv", index=False)
    extra_ids = df_unique[~df_unique.duplicated(subset=["patientID"], keep=False)]

    return(extra_ids)
