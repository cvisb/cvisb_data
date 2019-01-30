import sys
import os.path
import json
import yaml


def convert(yaml_file, outfile=None):
    '''Convert input yaml file as JSON file.'''
    with open(yaml_file) as in_f:
        schema_data = yaml.load(in_f)
        outfile = os.path.splitext(yaml_file)[0] + '.jsonld'
        with open(outfile, 'w') as out_f:
            json.dump(schema_data, out_f, indent=2)


if __name__ == '__main__':
    yaml_file = sys.argv[1]
    convert(yaml_file)
