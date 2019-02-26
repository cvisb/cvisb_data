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
import fnmatch
import csv

os.chdir('/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/schemas/Classes')
all_files = os.listdir()
all_files
# How expected files should be combined:
schema_grps = {
'sample': ['sample-schema', 'SampleLocation-schema', 'derivedSample-schema'],
'experiment': ['andersenSequencing', 'ELISA', 'experiment', 'RDT', 'RepertoireSequencing', 'rt_pcrResult', 'sequencingExperiment', 'systemsSerology'],
'patient': ['Patient'],
'dataset': ['Dataset', 'DataDownload', 'DataCatalog'],
'cvisb': ['RepertoireSequencing',
 'Experiment',
 'ELISA',
 'AndersenSequencing',
 'Patient',
 'Sample',
 'DerivedSample',
 'Country',
 'SoftwareSourceCode',
 'cvisb_fields.csv',
 'AdministrativeArea',
 'DataCatalog',
 'SampleLocation',
 'Place',
 'SequencingExperiment',
 'PostalAddress',
 'RDT',
 'Organization',
 'DataDownload',
 'Dataset',
 'DateRange',
 'Person',
 'ContactPoint',
 'ScholarlyArticle',
 'SystemsSerology',
 'RTPCR']
}


def open_yaml(yaml_file):
    '''Convert input yaml file as JSON file.'''
    with open(yaml_file) as in_f:
        schema_data = yaml.load(in_f)
    return(schema_data)
        # outfile = os.path.splitext(yaml_file)[0] + '.jsonld'
        # with open(outfile, 'w') as out_f:
        #     json.dump(schema_data, out_f, indent=2)

# files = os.listdir("/Users/laurahughes/GitHub/sample_viewer_web/sample-viewer-api/src/static/schemas/")
# os.chdir("/Users/laurahughes/GitHub/sample_viewer_web/sample-viewer-api/src/static/schemas/")
# context_file = "cvisb-context.yaml"

# file="/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/schemas/Classes/Patient-schema-v0.1.yaml"
# schema = open_yaml(file)

output_file='test_valid.jsonld'
for attr in schema:
    print(attr['rdfs:label'])

with open("cvisb_fields.csv", 'w', newline='') as myfile:
     wr = csv.writer(myfile, quoting=csv.QUOTE_ALL)
     wr.writerow(schema)

def get_validation(schema):
    counter = 0;
    for obj in schema:
        if "validation" in obj.keys():
            if (counter == 0):
                validation_schema = obj['validation']
            else:
                raise Exception("Multiple `validation` objects specified in json.")
            counter += 1
    with open(validation_file, 'w') as out_f:
        json.dump(validation_schema, out_f, indent=2)

def convert(context_file, schema_grps = schema_grps, output_file = None):
    all_files = os.listdir()
    context = open_yaml(context_file)

    try:
        version = "v" + str(context['version'])
    except:
        version = ""

    context['@id'] = context['@id'].replace("{{version}}", version)

    # Loop over schema groups
    for key, sel_files in schema_grps.items():
        output_file = os.path.splitext(context_file)[0].split("-")[0] + "-" + key + "-" + version + ".jsonld"

        schema_graph = []

        # Find files in directory
        for sel_file in sel_files:
            for file in all_files:
                if fnmatch.fnmatch(file, sel_file + "*.yaml"):
                    schema = open_yaml(file)
                    schema_graph.extend(schema)

        schema_data = {**context, **{'@graph': schema_graph}}

        with open(output_file, 'w') as out_f:
            json.dump(schema_data, out_f, indent=2)

convert("cvisb-context.yaml")

if __name__ == '__main__':
    context_file = sys.argv[1]
    convert(context_file)
