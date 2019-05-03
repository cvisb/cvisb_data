# <<< clean_survivors.py >>>
# @name:
# @summary:     Outermost function to clean/merge survivor IDs, Ebola survivor metadata, and Lassa survivor metadata
# @description:
# @inputs:
# @outputs:

import pandas as pd
from datetime import datetime
from . import clean_survivor_ids, clean_ebola_survivors, clean_lassa_survivors
import helpers

def clean_survivors(id_filename, ebola_filename, output_allSurvivors, output_survivorRoster, output_survivorRosterWeirdos, export_ebola, weirdos_ebola, dateModified_ebola = datetime.today().strftime('%Y-%m-%d')):
    ids = clean_survivor_ids(id_filename, output_survivorRoster, output_survivorRosterWeirdos)
    ebola = clean_ebola_survivors(ids, ebola_filename, export_ebola, weirdos_ebola)
    lassa = clean_lassa_survivors("temp file")

    merged = merge_survivors(ids, ebola, lassa, dateModified_ebola)

    merged.to_csv(output_allSurvivors + ".csv", index=False)
    # merged.to_json(output_allSurvivors + ".json", orient="records")
    df2export = helpers.removeIssues(merged, "survivor patients")

    return(merged)



def merge_survivors(ids, ebola, lassa, dateModified, idCol = "publicSID"):
    """
    Since merges have already taken place within clean_ebola_survivors, clean_lassa_survivors:
    This merge just identifies the unique publicSIDs not in either ebola or lassa.
    These rows are concatenated to the ebola, lassa dataframes.
    ... doing a full merge again becomes tricky, since the dataframe contains multiple lists within variables that can't be merged.
    """
    ebola_ids = ebola[idCol]


    missing_ids = ids[(~ids[idCol].isin(ebola_ids))].copy()
    # Add in static data
    missing_ids['cohort'] = "Unknown"
    missing_ids['hasSurvivorData'] = False
    # age, gender?


    merged = pd.concat([ebola, lassa, missing_ids])

    # --- dateModified ---
    merged['dateModified'] = dateModified

    # --- location ---
    # All assumed to be Sierra Leone (since from KGH)
    merged['countryName'] = "Sierra Leone"

    return(merged)
