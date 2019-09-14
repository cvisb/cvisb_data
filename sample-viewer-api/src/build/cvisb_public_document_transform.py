from biothings.utils.doc_traversal import breadth_first_traversal
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

def prune_doc(d, public_fields, path=''):
    _items = list(d.items())
    for k, v in _items:
        #print('k: {} path: {}'.format(k, path))
        new_path = '.'.join(path.split('.') + [k]) if path else k
        if isinstance(v, dict):
            d[k] = prune_doc(v, public_fields, new_path)
        elif isinstance(v, list) and v and isinstance(v[0], dict):
            d[k] = [prune_doc(i, public_fields, new_path) for i in v]
        elif new_path not in public_fields:
            d.pop(k, None)
    return d

def public_document_transform_function(source_index, entity, _id, doc_items):
    #print('entity: {}   _id: {}'.format(entity, _id))
    _doc = dict(doc_items)

    public_fields = CVISB_ENDPOINTS[entity]['public_fields']

    if entity in ['sample', 'experiment']:
        canonical_public_id = None
        if 'privatePatientID' in _doc and _doc['privatePatientID'] in id_mapping:
            canonical_public_id = id_mapping[_doc['privatePatientID']]
        prune_doc(_doc, public_fields=public_fields)
        if canonical_public_id:
            _doc['privatePatientID'] = canonical_public_id
    elif entity == 'patient':
        canonical_public_id = _doc['patientID']
        prune_doc(_doc, public_fields=public_fields)
        _doc['alternateIdentifier'] = [canonical_public_id]
    else:
        prune_doc(_doc, public_fields=public_fields)
    return _doc

def old_public_document_transform_function(source_index, entity, _id, doc_items):
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
