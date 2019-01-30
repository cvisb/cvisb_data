from biothings.web.settings import BiothingESWebSettings
from collections import OrderedDict
import glob
import yaml
import os

def _beautify(d):
    ''' takes a schema - d - and makes it pretty to look at '''
    _ret = OrderedDict()
    _ordered_keys = ['$schema', 'type', 'required', 'properties']

    for _key in _ordered_keys:
        if _key in d:
            if _key == 'properties':
                _ret[_key] = OrderedDict(sorted(d['properties'].items(), key=lambda i: i[0]))
            else:
                _ret[_key] = d[_key]

    for _key in set(d.keys()).difference(_ordered_keys):
        _ret[_key] = d[_key]

    return _ret

class APISettings(BiothingESWebSettings):
    def __init__(self, config='biothings.web.settings.default'):
        super(APISettings, self).__init__(config)
       
        self.JSON_SCHEMA_CACHE = {}

        for fi in glob.glob(os.path.join(self.SCHEMA_DIR, '*.yaml')):
            with open(fi, 'r') as yaml_inf:
                yaml_json = yaml.safe_load(yaml_inf.read())
            
            # assume root object is in list position 1
            if isinstance(yaml_json, list) and 'validation' in yaml_json[0]:
                self.JSON_SCHEMA_CACHE[yaml_json[0]['@id'].split(':')[1]] = _beautify(yaml_json[0]['validation'])
            elif isinstance(yaml_json, dict) and 'validation' in yaml_json['@graph'][0]:
                self.JSON_SCHEMA_CACHE[yaml_json['@graph'][0]['@id'].split(':')[1]] = _beautify(yaml_json['@graph'][0]['validation'])
