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

def process_file(entity, entity_dict, error_file, _out_directory, args, namespace):
    depth = len(namespace.split('.')) - 1
    log_msg(error_file, "\t"*depth + "*"*80+'\n' + "\t"*depth + "Starting file {f}\n\n".format(f=entity_dict[entity]['file']), args.verbose)
    file_name = os.path.split(entity_dict[entity]['file'])[1]
    modified_file_name = '.'.join(file_name.split('.')[:-1]) + '_modified.yaml'

    # should potentially move this until later...

    _ret = {
        "$schema": SCHEMA_VERSION,
        "type": "object",
        "required": [],
        "properties": {}
    }

    unauthorized_leaves = set()

    for _obj in entity_dict[entity]['items']:
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
            log_msg(error_file, "\t"*depth + "Missing rangeIncludes in field {f}, skipping...\n".format(f=_id), args.verbose)
            continue

        _sub_schema = {'oneOf': []}

        if isinstance(_obj['schema:rangeIncludes'], dict):
            _obj['schema:rangeIncludes'] = [_obj['schema:rangeIncludes']]

        for _type in _obj['schema:rangeIncludes']:
            if _type['@id'] in SCHEMA_ROOT_TYPE_MAP:
                # if _id not in SKIPPED_KEYS and not _authenticated:
                if _id not in SKIPPED_KEYS:
                    public_field = '.'.join(namespace.split('.') + [_id]) if namespace else _id
                    unauthorized_leaves.add(public_field)
                _sub_schema['oneOf'].append(SCHEMA_ROOT_TYPE_MAP[_type['@id']])
            elif _type['@id'].startswith('cvisb:'):
                # if _id not in SKIPPED_KEYS and not _authenticated:
                if _id not in SKIPPED_KEYS:
                    new_namespace = '.'.join(namespace.split('.') + [_id]) if namespace else _id
                    unauthorized_leaves = unauthorized_leaves.union(
                        process_file(entity=_type['@id'].split(':')[1], entity_dict=entity_dict, error_file=error_file,
                                    _out_directory=_out_directory, args=args, namespace=new_namespace)
                    )
                if args.dev:
                    _sub_schema['oneOf'].append({'$ref': DEV_SCHEMA_SERVER + '/{i}.json'.format(i=_type['@id'].split(':')[1])})
                else:
                    _sub_schema['oneOf'].append({'$ref': SCHEMA_SERVER + '/{i}.json'.format(i=_type['@id'].split(':')[1])})
            else:
                log_msg(error_file, "\t"*depth + 'Unknown type "{t}" in {i}\n'.format(t=_type['@id'], i=_id), args.verbose)

        _sub_schema['oneOf'] = [json.loads(x) for x in list(set([json.dumps(y, sort_keys=True) for y in _sub_schema['oneOf']]))]

        if _many and _sub_schema['oneOf']:
            _sub_schema = {'type': 'array', 'items': {'oneOf': _sub_schema['oneOf']}}

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

    if '@graph' in entity_dict[entity]['yaml_json']:
        entity_dict[entity]['yaml_json']['@graph'][0]['validation'] = _ret
    else:
        entity_dict[entity]['yaml_json'][0]['validation'] = _ret

    if not entity_dict[entity]['processed']:
        log_msg(error_file, "\t"*depth + 'Writing "{}" to file...\n'.format(os.path.join(_out_directory, modified_file_name)), args.verbose)
        with open(os.path.join(_out_directory, modified_file_name), 'w') as outfile:
            yaml.dump(entity_dict[entity]['yaml_json'], outfile, default_flow_style=False)
    entity_dict[entity]['processed'] = True

    log_msg(error_file, "\t"*depth + "*"*80 + '\n\n', args.verbose)

    return unauthorized_leaves

def preprocess_directory(d, error_file, verbose=False):
    r = {}
    log_msg(error_file, "*"*80 + "\nPreprocessing directory '{d}'...\n".format(d=d), verbose=verbose)
    for _file in glob.glob(os.path.join(d, '*.yaml')):
        try:
            with open(_file, 'r') as yaml_inp:
                yaml_json = yaml.safe_load(yaml_inp.read())
        except yaml.YAMLError as exc:
            continue

        if isinstance(yaml_json, list):
            if '@id' not in yaml_json[0]:
                log_msg(error_file, "Unrecognized structure for file '{f}'.  '@id' attribute required to be in the first element of lists.".format(f=_file), verbose)
                continue
            _entity = yaml_json[0]['@id'].split(':')[1]
            _is_root = (('root_entity' in yaml_json[0]) and (yaml_json[0]['root_entity']))
            _items = yaml_json[1:]
        elif isinstance(yaml_json, dict) and '@graph' in yaml_json and isinstance(yaml_json['@graph'], list):
            if '@id' not in yaml_json['@graph'][0]:
                log_msg(error_file, "Unrecognized structure for file '{f}'.  '@id' attribute required to be in the first element of @graph field for dicts.".format(f=_file), verbose)
                continue
            _entity = yaml_json['@graph'][0]['@id'].split(':')[1]
            _is_root = (('root_entity' in yaml_json['@graph'][0]) and (yaml_json['@graph'][0]['root_entity']))
            _items = yaml_json['@graph'][1:]
        else:
            log_msg(error_file, "Unrecognized yaml structure for file '{f}'.".format(f=_file), verbose)
            continue

        r[_entity] = {
            'file': _file,
            'is_root': _is_root,
            'items': _items,
            'yaml_json': yaml_json,
            'processed': False
        }
    log_msg(error_file, "Finished preprocessing...\n" + "*"*80 + "\n", verbose=verbose)
    return r

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
        preprocess_dict = preprocess_directory(d=_directory, error_file=error_file, verbose=args.verbose)

        for entity, entity_dict in preprocess_dict.items():
            if entity_dict['is_root']:
                log_msg(error_file, "Opening file {} for root entity".format(entity_dict["file"]), verbose=args.verbose)
                unauthorized_fields = process_file(entity=entity, entity_dict=preprocess_dict, error_file=error_file, _out_directory=_out_directory, args=args, namespace='')
                sorted(unauthorized_fields)
                with open(_auth_out, 'a') as authfile:
                    authfile.write("*"*80 + "\nPublic fields for '{e}' entity: '{f}'\n".format(e=entity, f=list(unauthorized_fields)) + "*"*80 + '\n\n')

if __name__ == '__main__':
    main(parser.parse_args())
