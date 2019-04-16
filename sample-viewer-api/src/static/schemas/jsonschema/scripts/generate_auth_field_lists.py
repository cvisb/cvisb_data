'''
Script to automatically convert schema.org style schema to jsonschema style schema.
'''
import sys
import glob
import os
import yaml
import json
import copy
from collections import OrderedDict

SCHEMA_SERVER = 'http://data.cvisb.org/jsonschema'

SCHEMA_VERSION = "http://json-schema.org/draft-04/schema#"

SCHEMA_ROOT_TYPE_MAP = {
    'xsd:string': {'type': 'string'},
    'schema:Text': {'type': 'string'},
    'schema:GeoCoordinates': {'type': 'string', 'format': 'cvisb-geocoordinates'},
    'schema:GeoShape': {'type': 'string', 'format': 'cvisb-geoshape'},
    'schema:GenderType': {'type': 'string', 'format': 'cvisb-gendertype'},
    'schema:URL': {'type': 'string', 'format': 'cvisb-url'},
    'schema:Date': {'type': 'string', 'format': 'cvisb-date'},
    'schema:DateTime': {'type': 'string', 'format': 'date-time'},
    'schema:Boolean': {'type': 'boolean'},
    'schema:Integer': {'type': 'integer'},
    'schema:Number': {'type': 'number'},
    'cvisb:DateRange': {'type': 'string', 'format': 'cvisb-daterange'}
}

SKIPPED_KEYS = ['_version']

def setup_yaml():
    """ https://stackoverflow.com/a/8661021 """
    represent_dict_order = lambda self, data:  self.represent_mapping('tag:yaml.org,2002:map', data.items())
    yaml.add_representer(OrderedDict, represent_dict_order)

def create_key(path, _id, sep='.'):
    if not path:
        return _id
    return path + sep + _id

def flatten_file(f, err_out, key_path, d):
    _ret = []
    try:
        with open(f, 'r') as yaml_inp:
            yaml_json = yaml.safe_load(yaml_inp.read())
    except yaml.YAMLError as exc:
        err_out.write("File {f} failed loading with error {e}....  Skipping conversion...\n\n".format(f=_file, e=exc))
        err_out.write("*"*80 + '\n\n')
        return ([], [])

    if not ((isinstance(yaml_json, list)) or ('@graph' in yaml_json and isinstance(yaml_json['@graph'], list))):
        err_out.write("Unrecognized yaml structure for {f}.  File must be a list of items at the document root or under @graph key with the root item first to use conversion utility.  Skipping file conversion\n\n".format(f=_file))
        err_out.write("*"*80 + '\n\n')
        return ([], [])

    authorized_leaves = set()
    unauthorized_leaves = set()

    if '@graph' in yaml_json:
        _items = yaml_json['@graph'][1:]
        if 'root_entity' not in yaml_json['@graph'][0] or not yaml_json['@graph'][0]['root_entity']:
            return ([], [])
    else:
        _items = yaml_json[1:]
        if 'root_entity' not in yaml_json[0] or not yaml_json[0]['root_entity']:
            return ([], [])

    for _obj in _items:
        try:
            _id = _obj['@id'].split(':')[1]
        except:
            _id = _obj['@id']

        k = create_key(key_path, _id)

        if k in SKIPPED_KEYS:
            continue

        if 'schema:rangeIncludes' not in _obj:
            error_file.write("Missing rangeIncludes in field {f}, skipping...\n".format(f=_id))
            continue

        _authenticated = False
        if 'authenticated' in _obj and _obj['authenticated']:
            _authenticated = True

        if isinstance(_obj['schema:rangeIncludes'], dict):
            _obj['schema:rangeIncludes'] = [_obj['schema:rangeIncludes']]

        for _type in _obj['schema:rangeIncludes']:
            if _type['@id'] in SCHEMA_ROOT_TYPE_MAP:
                # this is a leaf
                if _authenticated:
                    authorized_leaves.add(k)
                else:
                    unauthorized_leaves.add(k)
            elif _type['@id'].startswith('cvisb:'):
                if _authenticated:
                    authorized_leaves.add('{}.*'.format(k))
                else:
                    unauthorized_leaves.add('{}.*'.format(k))
            else:
                err_out.write('Unknown type "{t}" in {i}\n'.format(t=_type['@id'], i=_id))

    return (list(authorized_leaves), list(unauthorized_leaves))

def main():
    if len(sys.argv) < 3:
        raise("Missing required directory name containing files to convert")

    _directory = os.path.abspath(sys.argv[1])
    _error_out = os.path.abspath(sys.argv[2])
    _out_out = os.path.abspath(sys.argv[3])

    setup_yaml()

    with open(_error_out, 'w') as error_file, open(_out_out, 'w') as out_file:
        files_list = list(glob.glob(os.path.join(_directory, '*.yaml')))

        for _file in files_list:
            error_file.write("*"*80+'\nStarting file {f}\n\n'.format(f=_file))
            file_name = os.path.split(_file)[1]

            (authorized_leaves, unauthorized_leaves) = flatten_file(_file, error_file, '', _directory)

            if not authorized_leaves and not unauthorized_leaves:
                # assume this is not a type we care about
                continue
            else:
                out_file.write("*"*80+ '\n{f}\n\nauthorized_keys: {ak}\n\nunauthorized_keys: {uk}\n'.format(f=_file, ak=authorized_leaves, uk=unauthorized_leaves) + '*'*80 + '\n\n')

            error_file.write("*"*80 + '\n\n')

if __name__ == '__main__':
    main()
