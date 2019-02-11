# Assembles together CViSB jsonld schema for each of the specific types, based on YAML specifications
# Divides into two separate files:
#   - a `validation` jsonld, based on the validation field of the Class
#   - a `schema` jsonld, based on a schema.org graph representation of the data
# Specific types include: Dataset, DataDownload, Experiment, Sample, Patient
# NOTE: code isn't super robust.  Doesn't check for different versions of a given expected file.

import sys
import os
import json
import yaml
import pandas as pd
import csv


export_file = "/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/schemas/cvisb_variables.csv"

# Find all files containing schema
os.chdir('/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/schemas/Classes')
all_files = os.listdir()
all_files.sort()

# Helper functions
def open_yaml(yaml_file):
    '''Convert input yaml file as JSON file.'''
    with open(yaml_file) as in_f:
        schema_data = yaml.load(in_f)
    return(schema_data)

# def write_csv(data, filename = export_file):
#     with open(filename, 'w', newline='') as myfile:
#         wr = csv.writer(myfile, quoting=csv.QUOTE_ALL)
#         wr.writerow(data)


def removeIDs(entries):
    arr = []
    if (type(entries) == list):
        for entry in entries:
            arr.append(entry['@id'])
        if(len(arr) == 1):
            return("".join(arr))
        return(", ".join(arr))
    elif (type(entries) == dict):
        return(entries['@id'])
    return(entries)

def clean_schemas(schemas):
    df = pd.DataFrame(schemas)
    # de-nest fields
    # remove unnecessary columns
    df = df[['schema:domainIncludes', 'rdfs:label', '@type', 'rdfs:comment',
             'rdfs:subClassOf', 'schema:sameAs',
             'schema:rangeIncludes',
             'marginality', 'owl:cardinality', 'authenticated', 'maximum', 'minimum',
             'schema:Enumeration'
             ]]

    df.rename(columns={'rdfs:label': 'variable', 'rdfs:comment': 'description',
                   'schema:domainIncludes': 'Class', 'rdfs:subClassOf': 'derived_from', 'schema:rangeIncludes': 'type',
                   'owl:cardinality': 'cardinality', 'schema:Enumeration': 'enumeration'}, inplace=True)

    df.Class = df.Class.map(removeIDs)
    df.derived_from = df.derived_from.map(removeIDs)
    df.type = df.type.map(removeIDs)
    df['schema:sameAs'] = df['schema:sameAs'].map(removeIDs)
    return(df)


def yaml2csv(all_files, filename=export_file):
    schemas = []
    for file in all_files:
        schema = open_yaml(file)
        schemas.extend(schema)

    schema_df = clean_schemas(schemas)

    schema_df.to_csv(filename, index=False)
    return(schema_df)

schema = open_yaml('ELISA-schema-v0.1.yaml')
pd.DataFrame(schema)

df = yaml2csv(all_files)
