from config_web import CVISB_ENDPOINTS
from elasticsearch.helpers import scan, bulk
from elasticsearch import Elasticsearch
from elasticsearch import NotFoundError
import uuid

def yield_transfer_actions(client, doc_type, source_index, target_index, query={"query": {"match_all":{}}},  document_transform_function=None):
    """ Transfer data from source_index to target_index. """
    for doc in scan(client=client, doc_type=doc_type, index=source_index, query=query):
        if document_transform_function and callable(document_transform_function):
            _doc = document_transform_function(source_index, doc_type, doc['_id'], doc['_source'].items())
        else:
            _doc = doc['_source']
        yield {
            "_index": target_index,
            "_type": doc_type,
            "_id": doc['_id'],
            "_source": _doc
        }

def create_indices(config_object, *es_args, **es_kwargs):
    """
    Example config_object structure

    {
        "{entity}": {
            "public_alias": string, if given, will assign this alias to new public index
            "private_alias": string, if given, will assign this alias to new private index
            "create_public_index": boolean, if given, will create a public index
            "create_private_index": boolean, if given, will create a private index
            "transfer_data": boolean, if given, will transfer data from source index to new private and/or public indices
            "raise_on_transfer"error": boolean, if given will raise an error if a document fails to index during data transfer
            "delete_source_index": boolean, if given will delete the source index once data is transferred and aliases are updated
            "private_document_transform_function": callable, if given will call on every document during the private index data transfer
            "public_document_transform_function": callable, if given will call on every document during the public index data transfer
        },
        . . . 
    }

    es_kwargs and es_args are passed to elasticsearch client instantiation.
    """
    es = Elasticsearch(*es_args, **es_kwargs)
    for (entity, entity_kwargs) in config_object.items():
        public_alias = entity_kwargs.get('public_alias', None)
        private_alias = entity_kwargs.get('private_alias', None)
        create_public_index = entity_kwargs.get('create_public_index', False)
        create_private_index = entity_kwargs.get('create_private_index', False)
        transfer_data = entity_kwargs.get('transfer_data', False)
        raise_on_transfer_error = entity_kwargs.get('raise_on_transfer_error', False)
        delete_source_index = entity_kwargs.get('delete_source_index', False)
        private_document_transform_function = entity_kwargs.get('private_document_transform_function', None)
        public_document_transform_function = entity_kwargs.get('public_document_transform_function', None)
        source_index = entity_kwargs.get('source_index', None)

        if create_public_index:
            # First create the new index
            _name = '{entity}_metadata_public_{uuid}'.format(entity=entity, uuid=uuid.uuid4().hex)
            es.indices.create(index=_name, body=CVISB_ENDPOINTS[entity]['elasticsearch_public_index_body'])
            
            if transfer_data:
                # Transfer the data
                (insertion_count, error_list) = bulk(client=es, actions=yield_transfer_actions(client=es, doc_type=entity, 
                                                    source_index=source_index, target_index=_name, 
                                                    document_transform_function=public_document_transform_function),
                                                    raise_on_exception=raise_on_transfer_error, raise_on_error=raise_on_transfer_error)
            
            # Append correct index names and corresponding aliases
            if public_alias:
                # get current alias, if any
                try:
                    alias_dict = es.indices.get_alias(name=public_alias)
                except NotFoundError:
                    alias_dict = {}
                index_list = ','.join(alias_dict.keys())
                # put alias
                es.indices.put_alias(index=_name, name=public_alias)
                # delete old alias(es)
                if index_list:
                    es.indices.delete_alias(index=index_list, name=public_alias)               

        if create_private_index:
            # First create the new index
            _name = '{entity}_metadata_{uuid}'.format(entity=entity, uuid=uuid.uuid4().hex)
            es.indices.create(index=_name, body=CVISB_ENDPOINTS[entity]['elasticsearch_private_index_body'])
            
            if transfer_data:
                # Transfer the data
                (insertion_count, error_list) = bulk(client=es, actions=yield_transfer_actions(client=es, doc_type=entity, 
                                                    source_index=source_index, target_index=_name, 
                                                    document_transform_function=private_document_transform_function),
                                                    raise_on_exception=raise_on_transfer_error, raise_on_error=raise_on_transfer_error)
            
            # Append correct index names and corresponding aliases
            if private_alias:
                # get current alias, if any
                try:
                    alias_dict = es.indices.get_alias(name=private_alias)
                except NotFoundError:
                    alias_dict = {}
                index_list = ','.join(alias_dict.keys())
                # put alias
                es.indices.put_alias(index=_name, name=private_alias)
                # delete old alias(es)
                if index_list:
                    es.indices.delete_alias(index=index_list, name=private_alias)

        if delete_source_index and source_index:
            es.indices.delete(index=source_index)
