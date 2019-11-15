# Imports all chrome lighthouse performance .jsons in a folder and organizes into a tidy dataset.

import pandas as pd
import json
import datetime as datetime
import os


def extractJSON(filename, date, versionComment):
    exportCols = ['index', 'description', 'displayValue', 'numericValue', 'score']
    with open(filename, encoding='utf-8') as json_file:
        data = json.load(json_file)
    url = data['requestedUrl']
    df = pd.DataFrame(data['audits'])
    df = df.transpose().reset_index()

    numericDF = df.loc[~df.numericValue.isnull(), exportCols]
    numericDF['url'] = url
    numericDF['date'] = date
    if(versionComment is not None):
        numericDF['version'] = versionComment
    return(numericDF)

def extractAuditData(directory, versionComment=None, date=datetime.datetime.now().strftime("%Y-%m-%d")):
    files = os.listdir(directory)
    all_results = pd.DataFrame()
    export_filename = f"{directory}/chrome-audit-performance_{date}_{directory.split('/')[-1]}.csv"

    for filename in files:
        if(filename.endswith(".json")):
            result = extractJSON(f"{directory}/{filename}", date, versionComment)
            # concat
            all_results = pd.concat([all_results, result], ignore_index=True)
    all_results.to_csv(export_filename, index=False)
    return(all_results)

extractAuditData("/Users/laurahughes/GitHub/cvisb_data/notes/performance/2019-10-25_dev_loggedin", "Angular 8 upgrade")
extractAuditData("/Users/laurahughes/GitHub/cvisb_data/notes/performance/2019-10-25_prod_loggedin", "prod version 0.1; Angular 6.1.10")
