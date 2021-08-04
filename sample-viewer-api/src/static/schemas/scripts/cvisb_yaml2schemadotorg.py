# Assembles together CViSB jsonld schema for each of the specific types, based on YAML specifications
# Divides into two separate files:
#   - a `validation` jsonld, based on the validation field of the Class
#   - a `schema` jsonld, based on a schema.org graph representation of the data
# Specific types include: Dataset, DataDownload, Experiment, Sample, Patient
# NOTE: code isn't super robust.  Doesn't check for different versions of a given expected file.
#  python scripts/cvisb_yaml2schemadotorg.py cvisb-context.yaml

import sys
import os
import json
import yaml
import fnmatch
import csv

def open_yaml(yaml_file):
    '''Convert input yaml file as JSON file.'''
    with open(yaml_file) as in_f:
        schema_data = yaml.load(in_f)
    return(schema_data)
        # outfile = os.path.splitext(yaml_file)[0] + '.jsonld'
        # with open(outfile, 'w') as out_f:
        #     json.dump(schema_data, out_f, indent=2)

files = os.listdir("/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/schemas/Classes")
os.chdir("/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/schemas/")
context_file = "cvisb-context.yaml"

# file="/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/schemas/Classes/Patient-schema-v0.1.yaml"
# schema = open_yaml(file)

# output_file='test_valid.jsonld'
# for attr in schema:
#     print(attr['rdfs:label'])
#
# with open("cvisb_fields.csv", 'w', newline='') as myfile:
#      wr = csv.writer(myfile, quoting=csv.QUOTE_ALL)
#      wr.writerow(schema)

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


def convert(context_file, schema_files = schema_files, schema_dir = "Classes", output_file = None):
    current_dir = os.curdir
    schema_dir = f'{current_dir}/{schema_dir}'

    all_files = os.listdir(schema_dir)

    # Put together a list of *all* the different schemas to append together.
    yamls = []
    for file in all_files:
        if fnmatch.fnmatch(file, "*.yaml"):
            if(len(schema_files)):
                for schema_file in schema_files:
                    if fnmatch.fnmatch(file, f"{schema_file}*"):
                        yamls.append(file)
            else:
                yamls.append(file)
    schema_grps = {}
    schema_grps['schemadotorg'] = yamls
    context = open_yaml(f"{current_dir}/{context_file}")

    try:
        version = "v" + str(context['version'])
    except:
        version = ""

    context['@id'] = context['@id'].replace("{{version}}", version)

    # Loop over schema groups
    for key, sel_files in schema_grps.items():
        if(output_file is None):
            output_file = f"{os.path.splitext(context_file)[0].split('-')[0] + '-' + key + '-' + version + '.jsonld'}"

        schema_graph = []

        # Find files in directory
        for sel_file in sel_files:
            for file in all_files:
                if fnmatch.fnmatch(file, sel_file):
                    # print(sel_file)
                    schema = open_yaml(f"{schema_dir}/{file}")
                    schema_graph.extend(schema)

        schema_data = {**context, **{'@graph': schema_graph}}

        with open(output_file, 'w') as out_f:
            json.dump(schema_data, out_f, indent=2)
        print("DONE!")

# Call the conversion
# Convert a subset, for testing
schema_files = []

# All files
#  ["Accelerometry-schema-v0.1.yaml", "AdministrativeArea-schema-v0.1.yaml", "AndersenSequencing-schema-v0.1.yaml", "BloodCountData-schema-v0.1.yaml", "BodyTemperature-schema-v0.1.yaml", "ComaScore-schema-v0.1.yaml", "ContactPoint-schema-v0.1.yaml", "Country-schema-v0.1.yaml", "Data-schema-v0.1.yaml", "DataCatalog-schema-v0.1.yaml", "DataDownload-schema-v0.1.yaml", "Dataset-schema-v0.1.yaml", "DateRange-schema-v0.1.yaml", "DerivedSample-schema-v0.1.yaml", "DiastolicPressure-schema-v0.1.yaml", "ECGPoint-schema-v0.1.yaml", "ELISA-schema-v0.1.yaml", "Experiment-schema-v0.1.yaml", "HLAData-schema-v0.1.yaml", "HeartRate-schema-v0.1.yaml", "MeanArterialPressure-schema-v0.1.yaml", "Medication-schema-v0.1.yaml", "MonetaryGrant-schema-v0.1.yaml", "Organization-schema-v0.1.yaml", "OxygenSaturation-schema-v0.1.yaml", "Patient-schema-v0.1.yaml", "Person-schema-v0.1.yaml", "PiccoloData-schema-v0.1.yaml", "PiccoloMeasurement-schema-v0.1.yaml", "Place-schema-v0.1.yaml", "PostalAddress-schema-v0.1.yaml", "RDT-schema-v0.1.yaml", "RTPCR-schema-v0.1.yaml", "ReleaseNote-schema-v0.1.yaml", "ReleaseSummary-schema-v0.1.yaml", "RepertoireSequencing-schema-v0.1.yaml", "RespiratoryRate-schema-v0.1.yaml", "SNPData-schema-v0.1.yaml", "Sample-schema-v0.1.yaml", "SampleLocation-schema-v0.1.yaml", "ScholarlyArticle-schema-v0.1.yaml", "SequencingExperiment-schema-v0.1.yaml", "SkinTemperature-schema-v0.1.yaml", "SoftwareSourceCode-schema-v0.1.yaml", "Symptom-schema-v0.1.yaml", "SystemsSerology-schema-v0.1.yaml", "SystolicPressure-schema-v0.1.yaml", "ViralSeqData-schema-v0.1.yaml"]

convert("cvisb-context.yaml", schema_files = schema_files, output_file="cvisb_schemaorg.jsonld")

if __name__ == '__main__':
    context_file = sys.argv[1]
    convert(context_file)
