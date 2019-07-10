from biothings.web.api.es.handlers import BiothingHandler
from biothings.web.api.es.handlers import QueryHandler
from biothings.web.api.helper import BaseHandler
from jsonschema import validate, ValidationError
from jsonschema.exceptions import relevance
from api.schema import FormatChecker, iter_validate
from web.handlers import encode_user, decode_user
from biothings.utils.common import dotdict
from elasticsearch.helpers import bulk
from collections import OrderedDict
import json
import csv
#import logging
import yaml
import copy
from datetime import datetime as dt


class UserAuth(object):
    def get_current_user(self):
        user_json = decode_user(self.get_secure_cookie("user"))
        if not user_json:
            return None
        return user_json

    def _authenticate_request(self, r=False, w=False):
        _user = self.get_current_user() or {}

        if not _user:
            self.return_json({"success": False, "message": "Identity authentication is required to access this data.  Please login using a gmail address and retry."}, status_code=401)
            return False
        
        if r:
            _user_list = self.web_settings.CVISB_ENDPOINTS[self.entity]['permitted_reader_list']
            _msg = 'Read'
        elif w:
            _user_list = self.web_settings.CVISB_ENDPOINTS[self.entity]['permitted_writer_list']
            _msg = 'Write'
        else:
            _user_list = []
            _msg = ''

        if _user['email'] not in _user_list:
            self.return_json({"success": False, "message": "{} access forbidden for '{}' endpoint.  Contact administrators for access.".format(_msg, self.entity)}, status_code=403)
            return False

        return True

def form_actions(_source, index, doc_type, _id=None):
    for _doc in _source:
        _action = {
            '_op_type': 'index',
            '_type': doc_type,
            '_index': index,
            '_source': _doc
        }
        if _id:
            _action['_id'] = _id
        elif '_id' in _doc:
            new_id = _doc['_id']
            _doc.pop('_id')
            _action['_id'] = new_id
        yield _action


def decode_PUT_request_body(body):
    ''' decodes the request body for a PUT, returns a list of json objects '''
    # turn into a string first
    body = body.decode('utf-8')
    # if request is a single json object
    try:
        ret = json.loads(body)
        return [ret]
    except json.JSONDecodeError:
        pass
    # if request is many json objects, one per line
    try:
        ret = [json.loads(x.strip('\n')) for x in body.splitlines()]
        return ret
    except json.JSONDecodeError:
        pass
    # if request is comma-separated string...
    ret = [{k: v for k, v in row.items()} for row in csv.DictReader(body.splitlines(), skipinitialspace=True)]
    return ret


def entity_check(inst, entity):
    if not entity or entity not in inst.web_settings.CVISB_ENDPOINTS:
        inst.return_json({"success": False, "error": "No endpoint named '{}' recognized.  Possible endpoints are: {}".format(entity, list(inst.web_settings.CVISB_ENDPOINTS.keys()))})
        return False
    return True


class EntityHandler(UserAuth, BiothingHandler):
    ''' This class is for handling requests to a generic entity endpoint.  Endpoints are configured
        by a dictionary in config_web.CVISB_ENDPOINTS '''
    def _get_es_index(self, options):
        _user = self.get_current_user() or {}
        if ('email' not in _user) or (self.op == 'r' and _user['email'] not in self.web_settings.CVISB_ENDPOINTS[self.entity]['permitted_reader_list']):
            return self.web_settings.CVISB_ENDPOINTS[self.entity]['public_index']
        else:
            return self.web_settings.CVISB_ENDPOINTS[self.entity]['private_index']

    def _get_es_doc_type(self, options):
        return self.entity

    def get(self, entity=None, bid=None):
        if not entity_check(self, entity):
            return

        self.entity = entity
        self.op = 'r'

        super(EntityHandler, self).get(bid)


    def post(self, entity=None, ids=None):
        if not entity_check(self, entity):
            return

        self.entity = entity
        self.op = 'r'

        super(EntityHandler, self).post(ids)


    def put(self, entity=None, _id=None):
        if not entity_check(self, entity):
            return

        self.entity = entity
        self.op = 'w'

        if not self._authenticate_request(w=True):
            return

        try:
            ret = decode_PUT_request_body(self.request.body)
        except:
            # TODO: catch more errors
            self.return_json({"success": False, "error": "Couldn't decode payload.  Currently accepted formats:  json, json list (newline separated), csv"}, status_code=400)
            return
        
        # get the entity schema from cache... don't do this, get instead from schema endpoint?
        schema_json = self.web_settings.JSON_SCHEMA_CACHE[self.web_settings.CVISB_ENDPOINTS[self.entity]['cache_key']]

        # do validation
        errs = []
        
        for _obj in ret:
            try:
                validate_errors = iter_validate(_obj, schema_json, format_checker=FormatChecker())
            except SchemaError as e:
                self.return_json({"success": False, "error": "Schema for '{}' not valid".format(self.entity), "error_messages": str(e)})
                return
            object_errors = [str(_error) for _error in sorted(validate_errors, key=relevance, reverse=True)]
            if object_errors: 
                errs.append({"input_obj": _obj, "error_messages": object_errors})
        if errs:
            self.return_json({"success": False, "error": "{} objects failed validation".format(len(errs)), "error_list": errs}, status_code=400)
            return

        if _id:
            if len(ret) != 1:
                self.return_json({"success": False, "error": "Payload must be exactly length 1 when used with an id"}, status_code=400)
                return
            es_actions = form_actions(_source=ret, index=self._get_es_index({}), doc_type=self._get_es_doc_type({}), _id=_id)
        else:
            es_actions = form_actions(_source=ret, index=self._get_es_index({}), doc_type=self._get_es_doc_type({}))
        (insertion_count, error_list) = bulk(client=self.web_settings.es_client, actions=es_actions, raise_on_exception=False, raise_on_error=False)
        if error_list:
            self.return_json({"success": False, "error": "{} documents inserted correctly, {} documents encountered errors in insertion".format(insertion_count, len(error_list)), "error_list": error_list}, status_code=400)
            return
        # Get data catalog to update date
        data_catalog_res = self.web_settings.es_client.search(index="datacatalog_metadata_current", doc_type="datacatalog", body={"query": {"match": {"identifier": "https://data.cvisb.org/"}}})
        catalog_update_msg = "DateModified updated in data catalog"
        if data_catalog_res["hits"]["total"] != 1:
            catalog_update_msg = "Update of dateModified in data catalog failed due to {} docs matching identifier: \"https://data.cvisb.org/\"".format(data_catalog_res["hits"]["total"])
        else:
            data_catalog = data_catalog_res["hits"]["hits"][0]
            update_doc = {
                "doc": {
                    "dateModified": dt.now().strftime("%Y-%m-%d")
                }
            }
            self.web_settings.es_client.update(index="datacatalog_metadata_current", doc_type="datacatalog", id=data_catalog["_id"],body=update_doc)
        self.return_json({"success": True, "message": "{n} documents updated. {ctlg_updt_msg}".format(n=insertion_count, ctlg_updt_msg=catalog_update_msg)})
        return

    def delete(self, entity=None, _id=None):
        if not entity_check(self, entity):
            return

        self.entity = entity
        self.op = 'w'

        if not self._authenticate_request(w=True):
            return

        if not _id:
            self.return_json({"success": False, "error": "{} ID required".format(self.entity)}, status_code=400)
            return

        try:
            self.web_settings.es_client.delete(index=self._get_es_index({}), doc_type=self._get_es_doc_type({}), id=_id)
        except:
            self.return_json({"success": False, "error": "Error deleting id: {}".format(_id)}, status_code=400)
        self.return_json({"success": True, "message": "{} ID '{}' successfully deleted".format(self.entity, _id)})


class QueryHandler(UserAuth, QueryHandler):
    ''' This class is for the /query endpoint. '''
    def is_read_authenticated(self):
        _user = self.get_current_user() or {}
        if ('email' not in _user) or (self.op == 'r' and _user['email'] not in self.web_settings.CVISB_ENDPOINTS[self.entity]['permitted_reader_list']):
            return False
        return True

    def _get_es_index(self, options):
        _user = self.get_current_user() or {}
        if ('email' not in _user) or (self.op == 'r' and _user['email'] not in self.web_settings.CVISB_ENDPOINTS[self.entity]['permitted_reader_list']):
            return self.web_settings.CVISB_ENDPOINTS[self.entity]['public_index']
        else:
            return self.web_settings.CVISB_ENDPOINTS[self.entity]['private_index']

    def _get_es_doc_type(self, options):
        return self.entity
    
    def _pre_query_builder_GET_hook(self, options):
        options['esqb_kwargs']['entity'] = self.entity
        options['esqb_kwargs']['client'] = self.web_settings.es_client
        options['esqb_kwargs']['cvisb_endpoints'] = self.web_settings.CVISB_ENDPOINTS   
        options['esqb_kwargs']['is_authenticated'] = self.is_read_authenticated()
        return options

    def get(self, entity=None):
        if not entity_check(self, entity):
            return

        self.entity = entity
        self.op = 'r'

        super(QueryHandler, self).get()

    def post(self, entity=None, ids=None):
        if not entity_check(self, entity):
            return

        self.entity = entity
        self.op = 'r'

        super(QueryHandler, self).post()


class SchemaHandler(BaseHandler):
    ''' Serves the jsonschema entity schema '''
    def initialize(self, web_settings):
        self.web_settings = web_settings

    def get(self, entity=None):
        if not entity:
            self.return_json({
                "available_schema": sorted(list(self.web_settings.JSON_SCHEMA_CACHE.keys()))
            })
            return

        if entity not in self.web_settings.JSON_SCHEMA_CACHE:
            self.return_json({"success": False, "error": "No schema entity named: {n}.  Available options are: '{l}'.".format(n=entity, l=list(self.web_settings.JSON_SCHEMA_CACHE.keys()))}, status_code=400)
            return

        self.return_json(self.web_settings.JSON_SCHEMA_CACHE[entity])
