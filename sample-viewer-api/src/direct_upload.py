from jsonschema.exceptions import relevance
from api.schema import FormatChecker, iter_validate 
from elasticsearch.helpers import bulk, scan
from index import web_settings
import json
import csv
from datetime import datetime as dt
from collections import defaultdict

from os import listdir
from os.path import isfile, join
import re

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


def get_schema(e):
    schema_json = web_settings.JSON_SCHEMA_CACHE[web_settings.CVISB_ENDPOINTS[e]['cache_key']]
    return schema_json 

def get_index(entity):
    index = web_settings.CVISB_ENDPOINTS[entity]['private_index']
    return index

class CVISBValidationError(Exception):
    pass

def validate(obj, schema_json):
        try:
                validate_errors = iter_validate(obj, schema_json, format_checker=FormatChecker())
        except SchemaError as e:
                print("Schema for '{}' not valid.\n error_messages: {}".format(entity, str(e)))
                print(obj)
                raise
        errors = [str(e) for e in sorted(validate_errors, key=relevance, reverse=True)]
        if errors:
                error_msg     = '\n'.join(errors)
                error_nu      = len(errors)
                error_message = "Validation failed for {}  {}".format(error_nu, error_msg)
                print(error_message)
                raise Exception
        return True

def upload(ret, entity=None, _id=None, dry_run=True):
    entity = entity
    op = 'w'

    schema_json = web_settings.JSON_SCHEMA_CACHE[web_settings.CVISB_ENDPOINTS[entity]['cache_key']]

    # VALIDATE
    errs = []
    
    for _obj in ret:
        validate(_obj, schema_json)
    
    if dry_run:
        return

    # PERFORM ES INSERT
    index = web_settings.CVISB_ENDPOINTS[entity]['private_index']
    es_actions = form_actions(_source=ret, index=index, doc_type=entity)
    (insertion_count, error_list) = bulk(client=web_settings.es_client, actions=es_actions, raise_on_exception=False, raise_on_error=False)
    if error_list:
        print("{} documents inserted correctly, {} documents encountered errors in insertion.\n {}".format(insertion_count, len(error_list), str(error_list)))
    # Get data catalog to update date
    data_catalog_res = web_settings.es_client.search(index="datacatalog_metadata_current", doc_type="datacatalog", body={"query": {"match": {"identifier": "https://data.cvisb.org/"}}})
    catalog_update_msg = "DateModified updated in data catalog"
    if data_catalog_res["hits"]["total"] != 1:
        catalog_update_msg = "Update of dateModified in data catalog failed due to {} docs matching identifier: \"https://data.cvisb.org/\"".format(data_catalog_res["hits"]["total"])
        print(catalog_update_msg)

    else:
        data_catalog = data_catalog_res["hits"]["hits"][0]
        update_doc = {
            "doc": {
                "dateModified": dt.now().strftime("%Y-%m-%d")
            }
        }
        web_settings.es_client.update(index="datacatalog_metadata_current", doc_type="datacatalog", id=data_catalog["_id"],body=update_doc)
    print("success! {n} documents updated. {ctlg_updt_msg}".format(n=insertion_count, ctlg_updt_msg=catalog_update_msg))
    return

def uploader(folder):
    reg = re.compile(r"([a-z]*)s\d*\.json")
    data = [f for f in listdir(folder) if isfile(join(folder, f))]
    for f in data:
        print(f)
        index =  reg.search(f).group(1)
        if 'dataset' in index:
            ds, dsi = f, index
            continue
        with open(join(folder, f), 'r') as data_file:
            full_file_data = [json.loads(line) for line in data_file]
            if 'patient' in index:
                for f in full_file_data:
                    if f.get('country') == '':
                        del f['country']
            try:
                upload(full_file_data, index)#, dry_run=False)
            except Exception:
                print(line)
                print(join(folder, f))
                raise

    
    # do dataset last
    with open(join(folder, ds), 'r') as data_file:
        data_segment = json.load(data_file)
    upload(data_segment, dsi, dry_run=False)

def categorical_uploader(folder):
    reg = re.compile(r"([a-z]*)s\d*\.json")
    data = [f for f in listdir(folder) if isfile(join(folder, f))]
    to_upload = defaultdict(list)
    for f in data:
        print(f)
        index =  reg.search(f).group(1)
        with open(join(folder, f), 'r') as data_file:
            full_file_data = [json.loads(line) for line in data_file]

            to_upload[index].extend(full_file_data)

    for i in to_upload['patient']:
        if i.get('country') == '':
            del i['country']
    #return to_upload
    chunk_size = 5000
    for i in ['patient', 'experiment', 'datadownload', 'dataset']:
            try:
                index_list = to_upload[i]
                for chunk_index in range(0, len(index_list), chunk_size):
                        print("{i} {chunk_index}".format(i=i, chunk_index=chunk_index))
                        upload(index_list[chunk_index: chunk_index + chunk_size], i, dry_run=False)
            except Exception:
                print(i)
                raise
        
    return
    #for index, full_data in to_upload.enumerate()
    #if 'patient' in index:
    #    for f in full_file_data:
    #        if f.get('country') == '':
    #            del f['country']
    #try:
    #    upload(full_file_data, index)#, dry_run=False)

    #
    ## do dataset last
    #with open(join(folder, ds), 'r') as data_file:
    #    data_segment = json.load(data_file)
    #upload(data_segment, dsi, dry_run=False)
def deleter():
    queries = {
        'experiment':   'includedInDataset:sarscov2-virus-seq',
        'datadownload': 'includedInDataset:sarscov2-virus-seq',
        'dataset':      'includedInDataset:sarscov2-virus-seq',
        'patient':      'cohort:COVID-19'
    }

    for entity, query_clause in queries.items():
        es_index = web_settings.CVISB_ENDPOINTS[entity]['private_index']
        client = web_settings.es_client
        doc_type = entity
        query = {"query": {'query_string': {"query": query_clause}}, "size": 1000}

        # should be possible to bulk delete?
        # i.e., client.delete_by_query(index=es_index, q=query)
        ids = [doc['_id'] for doc in scan(client, query, index=es_index)]
        successful_deletions = 0
        for delete_id in ids:
            res = client.delete(index=es_index, id=delete_id, doc_type=doc_type)
            if res['result'] == 'deleted':
                successful_deletions += 1
        print('{} deleted {}'.format(successful_deletions, entity))
        
if __name__ == '__main__':
    #deleter()
    categorical_uploader('/home/ubuntu/sarscov2_output/sarscov2_output_2022_1')
