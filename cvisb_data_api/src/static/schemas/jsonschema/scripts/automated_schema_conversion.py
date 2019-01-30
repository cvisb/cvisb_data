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
    'schema:Number': {'type': 'number'}
}

def setup_yaml():
    """ https://stackoverflow.com/a/8661021 """
    represent_dict_order = lambda self, data:  self.represent_mapping('tag:yaml.org,2002:map', data.items())
    yaml.add_representer(OrderedDict, represent_dict_order)

def main():
    if len(sys.argv) < 3:
        raise("Missing required directory name containing files to convert")

    _directory = sys.argv[1]
    _error_out = sys.argv[2]

    setup_yaml()

    with open(_error_out, 'w') as error_file:
        files_list = list(glob.glob(os.path.join(_directory, '*.yaml')))

        for _file in files_list:
            error_file.write("*"*80+'\nStarting file {f}\n\n'.format(f=_file))
            file_name = os.path.split(_file)[1]

            modified_file_name = '.'.join(file_name.split('.')[:-1]) + '_modified.yaml'

            try:
                with open(_file, 'r') as yaml_inp:
                    yaml_json = yaml.safe_load(yaml_inp.read())
            except yaml.YAMLError as exc:
                error_file.write("File {f} failed loading with error {e}....  Skipping conversion...\n\n".format(f=_file, e=exc))
                error_file.write("*"*80 + '\n\n')
                continue 
 
            if not ((isinstance(yaml_json, list)) or ('@graph' in yaml_json and isinstance(yaml_json['@graph'], list))):
                error_file.write("Unrecognized yaml structure for {f}.  File must be a list of items at the document root or under @graph key with the root item first to use conversion utility.  Skipping file conversion\n\n".format(f=_file))
                error_file.write("*"*80 + '\n\n')
                continue

            _ret = {
                "$schema": SCHEMA_VERSION,
                "type": "object",
                "required": [],
                "properties": {}
            }

            if '@graph' in yaml_json:
                _items = yaml_json['@graph'][1:]
            else:
                _items = yaml_json[1:]

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

                if 'schema:rangeIncludes' not in _obj:
                    error_file.write("Missing rangeIncludes in field {f}, skipping...\n".format(f=_id))
                    continue
                
                _sub_schema = {'oneOf': []}

                if isinstance(_obj['schema:rangeIncludes'], dict):
                    _obj['schema:rangeIncludes'] = [_obj['schema:rangeIncludes']]

                for _type in _obj['schema:rangeIncludes']:
                    if _type['@id'] in SCHEMA_ROOT_TYPE_MAP:
                        _sub_schema['oneOf'].append(SCHEMA_ROOT_TYPE_MAP[_type['@id']])
                    elif _type['@id'].startswith('cvisb:'):
                        _sub_schema['oneOf'].append({'$ref': SCHEMA_SERVER + '/{i}.json'.format(i=_type['@id'].split(':')[1])})
                    else:
                        error_file.write('Unknown type "{t}" in {i}\n'.format(t=_type['@id'], i=_id))

                _sub_schema['oneOf'] = [json.loads(x) for x in list(set([json.dumps(y, sort_keys=True) for y in _sub_schema['oneOf']]))]

                if _many:
                    tmp = _sub_schema['oneOf']
                    if tmp:
                        tmp.append({'type': 'array', 'items': copy.deepcopy(tmp)})
                        _sub_schema['oneOf'] = tmp

                if len(_sub_schema['oneOf']) == 1:
                    _sub_schema = _sub_schema['oneOf'][0]

                if 'schema:Enumeration' in _obj:
                    _sub_schema['enum'] = copy.deepcopy(_obj['schema:Enumeration'])

                _ret['properties'][_id] = _sub_schema

                if _required:
                    _ret['required'].append(_id)

            if len(_ret['required']) == 0:
                _ret.pop('required')

            if '@graph' in yaml_json:
                yaml_json['@graph'][0]['validation'] = _ret
            else:
                yaml_json[0]['validation'] = _ret

            error_file.write('Writing "{}" to file...\n'.format(modified_file_name))

            with open(modified_file_name, 'w') as outfile:
                yaml.dump(yaml_json, outfile, default_flow_style=False)

            error_file.write("*"*80 + '\n\n')

if __name__ == '__main__':
    main()
