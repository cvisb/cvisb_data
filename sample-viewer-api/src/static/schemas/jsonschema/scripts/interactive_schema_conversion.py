''' 
Script to (hopefully) allow easy conversion of schema.org style schema to jsonschema style schema.

This is only a partially automated solution - still requires a human to make some calls...
'''
import sys
import glob
import os
import yaml
import pprint
from collections import OrderedDict

def setup_yaml():
    """ https://stackoverflow.com/a/8661021 """
    represent_dict_order = lambda self, data:  self.represent_mapping('tag:yaml.org,2002:map', data.items())
    yaml.add_representer(OrderedDict, represent_dict_order)

def main():
    if len(sys.argv) < 2:
        raise("Directory name for converting required")
        
    _directory = sys.argv[1]
    for fi in glob.glob(os.path.join(_directory, '*.yaml')):
        _fi = os.path.split(fi)[1]
        print("Converting file {f} in directory {d}\n".format(f=_fi, d=_directory))
        
        try:
            with open(fi, 'r') as yaml_inp:
                _yaml_json = yaml.safe_load(yaml_inp.read())
        except (yaml.YAMLError, exc):
            print("File {f} failed with error {e}...  Skipping conversion...".format(f=_fi, e=exc))
            continue

        if not isinstance(_yaml_json, list):
            print("Unrecognized yaml structure for {f}.  File must be a list of items with the root item first to use conversion utility.  Skipping file conversion\n".format(f=_fi))
            continue

        if 'validation' in _yaml_json[0]:
            _choice = input("Warning, 'validation' key detected in {f},\n\n{d}\n\n continue (y/n)?\n>> ".format(f=_fi, d=_yaml_json[0]['validation']))
            if _choice.lower() in ['n', '0', 'f', 'no', 'false']:
                continue
        _ret = {
            "$schema": "http://json-schema.org/draft-04/schema#",
            "type": "object",
            "required": [],
            "properties": {}
        }

        for _obj in _yaml_json[1:]:
            try:
                _id = _obj['@id'].split(':')[1]
            except:
                _id = _obj['@id']
            print('Processing Object ID: {}\n'.format(_id))
            pprint.pprint(_obj)
            _choice = input("Convert as: default (s)tring, (d)ate-time string, (h)ostname string, default (i)nteger, default (f), default (b)oolean, or input custom mapping?\n>> ")
            if _choice.lower() in ['s', 'string']:
                _ret['properties'][_id] = {'type': 'string'}
            elif _choice.lower() in ['d', 'date', 'date-time']:
                _ret['properties'][_id] = {'type': 'string', 'format': 'date-time'}
            elif _choice.lower() in ['h', 'host', 'hostname', 'url']:
                _ret['properties'][_id] = {'type': 'string', 'format': 'hostname'}
            elif _choice.lower() in ['i', 'int', 'integer']:
                _ret['properties'][_id] = {'type': 'integer'}
            elif _choice.lower() in ['b', 'bool', 'boolean']:
                _ret['properties'][_id] = {'type': 'boolean'}
            elif _choice.lower() in ['f', 'float', 'double', 'd', 'n', 'number']:
                _ret['properties'][_id] = {'type': 'number'}
            else:
                try:
                    _ret[_id] = json.loads(_choice)
                except:
                    print("Can't convert field {f} in file {fil} with mapping {m}, unrecongized json object".format(f=_id, fil=_fi, m=_choice))
                    continue
            _choice = input("Field {f} required (y/n)?\n>> ".format(f=_id))
            if _choice.lower() in ['y', 'yes', 'true']:
                _ret['required'].append(_id)
 
        _choice = input("Mapping finalized.\n\n{m}\n\nSave to file (y/n)?\n>> ".format(m=_ret))

        if _choice.lower() in ['y', 'yes', 'true']:
            _yaml_json[0]['validation'] = _ret
            setup_yaml()
            with open(fi[:-5] + '_modified.yaml', 'w') as outf:
                yaml.dump(_yaml_json, outf, default_flow_style=False)


if __name__ == '__main__':
    main()
