'''
Script to automatically convert schema.org style schema to jsonschema style schema.
'''
import sys
import glob
import os
import yaml
import json
import copy
import argparse
from collections import OrderedDict

SCHEMA_SERVER = 'http://data.cvisb.org/jsonschema'
DEV_SCHEMA_SERVER = 'http://dev.cvisb.org/jsonschema'

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
    'schema:Float': {'type': 'number'}
}

SKIPPED_KEYS = ['_version', '_source']

# setup command line argument parser
parser = argparse.ArgumentParser(description='Convert schema.org input schema to jsonschema style schema')
parser.add_argument('--input-schema-dir', '-i', required=True, help='input directory containing yaml files in schema.org style')
parser.add_argument('--output-schema-dir', '-o', required=True, help='output directory containing yaml files in schema.org style with jsonschema validation object embedded in root entity')
parser.add_argument('--error-file', '-e', required=True, help='path to output error log')
parser.add_argument('--auth-list-file', '-a', required=True, help='path to output file containing entity authentication information')
parser.add_argument('--dev', required=False, help='flag indicating that output schema references should be made using the dev server URL', action='store_true')
parser.add_argument('--verbose','-v', required=False, help='flag to log stuff to terminal', action='store_true')

def setup_yaml():
    """ https://stackoverflow.com/a/8661021 """
    represent_dict_order = lambda self, data:  self.represent_mapping('tag:yaml.org,2002:map', data.items())
    yaml.add_representer(OrderedDict, represent_dict_order)

def log_msg(outfile, msg, verbose):
    outfile.write(msg)
    if verbose:
        print(msg)

def main(args):
    if os.path.exists(os.path.abspath(args.output_schema_dir)) and os.path.isdir(os.path.abspath(args.output_schema_dir)):
        _out_directory = os.path.abspath(args.output_schema_dir)
    else:
        raise Exception("Invalid output schema directory, argument must exist and be a directory")

    if os.path.exists(os.path.abspath(args.input_schema_dir)) and os.path.isdir(os.path.abspath(args.input_schema_dir)):
        _directory = os.path.abspath(args.input_schema_dir)
    else:
        raise Exception("Invalid input schema directory, argument must exist and be a directory")

    _error_out = os.path.abspath(args.error_file)
    _auth_out = os.path.abspath(args.auth_list_file)

    setup_yaml()

    with open(_error_out, 'w') as error_file:
        files_list = list(glob.glob(os.path.join(_directory, '*.yaml')))

        for _file in files_list:
            log_msg(error_file, "*"*80+'\nStarting file {f}\n\n'.format(f=_file), args.verbose)
            file_name = os.path.split(_file)[1]
            modified_file_name = '.'.join(file_name.split('.')[:-1]) + '_modified.yaml'
            try:
                with open(_file, 'r') as yaml_inp:
                    yaml_json = yaml.safe_load(yaml_inp.read())
            except yaml.YAMLError as exc:
                log_msg(error_file, "File {f} failed loading with error {e}....  Skipping conversion...\n\n".format(f=_file, e=exc),
                        args.verbose)
                log_msg(error_file, "*"*80 + '\n\n', args.verbose)
                continue

            if not ((isinstance(yaml_json, list)) or ('@graph' in yaml_json and isinstance(yaml_json['@graph'], list))):
                log_msg(error_file, "Unrecognized yaml structure for {f}.  File must be a list of items at the document root or under @graph key with the root item first to use conversion utility.  Skipping file conversion\n\n".format(f=_file), args.verbose)
                log_msa(error_file, "*"*80 + '\n\n', args.verbose)
                continue

            _ret = {
                "$schema": SCHEMA_VERSION,
                "type": "object",
                "required": [],
                "properties": {}
            }

            authorized_leaves = set()
            unauthorized_leaves = set()
            no_authorization = False

            if '@graph' in yaml_json:
                _items = yaml_json['@graph'][1:]
                if 'root_entity' not in yaml_json['@graph'][0] or not yaml_json['@graph'][0]['root_entity']:
                    no_authorization = True
            else:
                _items = yaml_json[1:]
                if 'root_entity' not in yaml_json[0] or not yaml_json[0]['root_entity']:
                    no_authorization = True

            for _obj in _items:
                try:
                    _id = _obj['@id'].split(':')[1]
                except:
                    _id = _obj['@id']

                _required = False
                if 'marginality' in _obj and _obj['marginality'].lower() == 'required':
                    _required = True

                _many = False
                if 'owl:cardinality' in _obj and (_obj['owl:cardinality'].lower() == 'many' or _obj['owl:cardinality'].lower() == 'multiple'):
                    _many = True

                _authenticated = False
                if 'authenticated' in _obj and _obj['authenticated']:
                    _authenticated = True

                if 'schema:rangeIncludes' not in _obj:
                    log_msg(error_file, "Missing rangeIncludes in field {f}, skipping...\n".format(f=_id), args.verbose)
                    continue

                _sub_schema = {'oneOf': []}

                if isinstance(_obj['schema:rangeIncludes'], dict):
                    _obj['schema:rangeIncludes'] = [_obj['schema:rangeIncludes']]

                for _type in _obj['schema:rangeIncludes']:
                    if _type['@id'] in SCHEMA_ROOT_TYPE_MAP:
                        if _id not in SKIPPED_KEYS:
                            if _authenticated:
                                authorized_leaves.add(_id)
                            else:
                                unauthorized_leaves.add(_id)
                        _sub_schema['oneOf'].append(SCHEMA_ROOT_TYPE_MAP[_type['@id']])
                    elif _type['@id'].startswith('cvisb:'):
                        if _id not in SKIPPED_KEYS:
                            if _authenticated:
                                authorized_leaves.add('{}.*'.format(_id))
                            else:
                                unauthorized_leaves.add('{}.*'.format(_id))
                        if args.dev:
                            _sub_schema['oneOf'].append({'$ref': DEV_SCHEMA_SERVER + '/{i}.json'.format(i=_type['@id'].split(':')[1])})
                        else:
                            _sub_schema['oneOf'].append({'$ref': SCHEMA_SERVER + '/{i}.json'.format(i=_type['@id'].split(':')[1])})
                    else:
                        log_msg(error_file, 'Unknown type "{t}" in {i}\n'.format(t=_type['@id'], i=_id), args.verbose)

                _sub_schema['oneOf'] = [json.loads(x) for x in list(set([json.dumps(y, sort_keys=True) for y in _sub_schema['oneOf']]))]

                if _many and _sub_schema['oneOf']:
                    _sub_schema = {'type': 'array', 'items': _sub_schema['oneOf']}

                if _required:
                    _ret['required'].append(_id)
                elif 'oneOf' in _sub_schema:
                    _sub_schema['oneOf'].append({"type": "null"})
                else:
                    _sub_schema = {'oneOf': [{"type": "null"}, _sub_schema]}

                if ('oneOf' in _sub_schema) and len(_sub_schema['oneOf']) == 1:
                    _sub_schema = _sub_schema['oneOf'][0]

                if 'schema:Enumeration' in _obj:
                    _sub_schema['enum'] = copy.deepcopy(_obj['schema:Enumeration'])

                _ret['properties'][_id] = _sub_schema


            if len(_ret['required']) == 0:
                _ret.pop('required')

            if '@graph' in yaml_json:
                yaml_json['@graph'][0]['validation'] = _ret
            else:
                yaml_json[0]['validation'] = _ret

            log_msg(error_file, 'Writing "{}" to file...\n'.format(os.path.join(_out_directory, modified_file_name)), args.verbose)

            if not no_authorization:
                with open(_auth_out, 'a') as auth_outfile:
                    log_msg(auth_outfile, "*"*80 + '\n{f}\n\nauthorized_keys: {ak}\n\nunauthorized_keys: {uk}\n'.format(f=_file, ak=list(authorized_leaves), uk=list(unauthorized_leaves)) + '*'*80 + '\n\n', args.verbose)

            with open(os.path.join(_out_directory, modified_file_name), 'w') as outfile:
                yaml.dump(yaml_json, outfile, default_flow_style=False)

            log_msg(error_file, "*"*80 + '\n\n', args.verbose)

if __name__ == '__main__':
    main(parser.parse_args())
