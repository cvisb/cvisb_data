from elasticsearch.helpers import scan
from elasticsearch import Elasticsearch
from config_web import CVISB_ENDPOINTS

def get_id_mapping(client, index='patient_metadata_current', doc_type='patient'):
    ''' return an id mapping structure for easier public document transforming. returns ID: Canonical Public ID dictionary. '''
    r = {}
    for doc in scan(client=client, index=index, doc_type=doc_type, query={"query": {"match_all": {}}}, _source=["patientID", "alternateIdentifier"]):
        for _id in doc['_source'].get('alternateIdentifier', []):
            r[_id] = doc['_source']['patientID']
    return r

def public_document_transform_function(source_index, entity, _id, doc_items):
    def pop_fields(d, l):
        for f in l:
            d.pop(f.split('.')[0], None)
        return d

    _doc = dict(doc_items)

    # pop all private fields from doc
    private_fields = CVISB_ENDPOINTS[entity]['private_fields']
    if entity in ['sample', 'experiment']:
        private_fields = [field for field in private_fields if field != 'privatePatientID']
    _doc = pop_fields(_doc, private_fields)
    # replace
    if entity in ['sample', 'experiment']:
        if 'privatePatientID' in _doc and _doc['privatePatientID'] in id_mapping:
            _doc['privatePatientID'] = id_mapping[_doc['privatePatientID']]
        else:
            _doc.pop('privatePatientID', None)
    elif entity == 'patient':
        _doc['alternateIdentifier'] = [_doc['patientID']]
    return _doc

_client = Elasticsearch()
id_mapping = get_id_mapping(client=_client)

