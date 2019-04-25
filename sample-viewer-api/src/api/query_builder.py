from biothings.web.api.es.query_builder import ESQueryBuilder
from elasticsearch.helpers import scan
from copy import copy
import logging

def get_all_hits(_index, _query, _client, _field, _doc_type):
    #this_query = copy(_query)
    _query['_source'] = [_field]
    _ret = []
    for x in scan(client=_client, query=_query, index=_index, doc_type=_doc_type):
        if '_source' in x and _field in x['_source']:
            if isinstance(x['_source'][_field], list) or isinstance(x['_source'][_field], tuple):
                for _x in x['_source'][_field]:
                    _ret.append(_x)
            else:
                _ret.append(x['_source'][_field])
    return list(set(_ret))

class ESQueryBuilder(ESQueryBuilder):
    # Implement app specific queries here
    def _return_query_kwargs(self, query_kwargs):
        _kwargs = {"index": self.index, "doc_type": self.doc_type, "version": True}
        _kwargs.update(query_kwargs)
        return _kwargs

    def get_query_filters(self):
        return self._get_query_filters() + self.join_filter

    def add_extra_filters(self, q):
        if 'query' not in q:
            return {'query': q}
        return q

    def do_cvisb_patient_joins(self, stage_one_query):
        ''' takes a stange_one_query that filters patient objects, and does the join between patient and patient, patient and sample, and patient and dataset '''
        if self.options.entity == 'sample':
            # get all patients, either by patientID or alternativeID
            _associatedSamples = get_all_hits(_index=self.options.cvisb_endpoints['patient']['index'], _doc_type='patient', _client=self.options.client, _field='associatedSamples',
                _query=stage_one_query)
            logging.debug("_associatedSamples: {}".format(_associatedSamples))
            self.join_filter = [{
                "terms": {"sampleID.keyword": _associatedSamples}
            }]
        elif self.options.entity == 'patient':
            _patients = get_all_hits(_index=self.options.cvisb_endpoints['patient']['index'], _doc_type='patient', _client=self.options.client, _field='patientID',
                _query=stage_one_query)
            logging.debug("_patients: {}".format(_patients))
            self.join_filter = [{
                "terms": {"patientID.keyword": _patients}
            }]
        elif self.options.entity == 'dataset':
            _patients = get_all_hits(_index=self.options.cvisb_endpoints['patient']['index'], _doc_type='patient', _client=self.options.client, _field='patientID',
                _query=stage_one_query)
            logging.debug("_patients: {}".format(_patients))
            _datadownloads = get_all_hits(_index=self.options.cvisb_endpoints['datadownload']['index'], doc_type='datadownload', _client=self.options.client, _field='identifier',
                _query={"query": {
                        "terms": {"patientIDs.keyword": _patients}
                        }})
            logging.debug("_datadownloads: {}".format(_datadownloads))
            self.join_filter = [{
                "terms": {"dataDownloadIDs.keyword": _datadownloads}
            }]

    def _query_GET_query(self, q):
        # override to add new things to biothings
        if ((not self.options.cvisb_user) or 
            ('email' not in self.options.cvisb_user) or 
            (self.options.cvisb_user['email'] not in self.options.cvisb_user_list)):
            self.es_options['_source']['excludes'] = self.options.cvisb_endpoints[self.options.entity]['public_excluded_return_fields']
            return self._return_query_kwargs({'body': self.queries.raw_query({"query": 
                {
                    "simple_query_string": 
                        {
                            "query": q,
                            "fields": self.options.cvisb_endpoints[self.options.entity]['public_permitted_search_fields']
                        }
                    }
                })})
        
        self.join_filter = []
        if self.options.cvisb_user and self.options.cvisb_user['email'] in self.options.cvisb_user_list:
            # check joined queries
            if self.options.patientID:
                self.do_cvisb_patient_joins({
                    "query": {
                        "bool": {
                            "should": [
                                {"terms": {"alternateIdentifier.keyword": self.options.patientID}},
                                {"terms": {"patientID.keyword": self.options.patientID}}
                            ]
                        }
                    }
                })
            elif self.options.cohort:
                self.do_cvisb_patient_joins({
                    "query": {
                        "terms": {"cohort.keyword": self.options.cohort}
                    }
                })
            elif self.options.outcome:
                self.do_cvisb_patient_joins({
                    "query": {
                        "terms": {"outcome.keyword": self.options.outcome}
                    }
                })
            elif self.options.country:
                self.do_cvisb_patient_joins({
                    "query": {
                        "terms": {"country.name.keyword": self.options.country}
                    }
                })
            elif self.options.relatedTo:
                stage_one_query = {
                    "query": {
                        "bool": {
                            "should": [
                                {"terms": {"alternateIdentifier.keyword": self.options.relatedTo}},
                                {"terms": {"patientID.keyword": self.options.relatedTo}}
                            ]
                        }
                    }
                }
                if self.options.entity == 'sample':
                    _patients = get_all_hits(_index=self.options.cvisb_endpoints['patient']['index'], _doc_type='patient', _client=self.options.client, _field='relatedTo',
                        _query=stage_one_query)
                    logging.debug("_patients: {}".format(_patients))
                    self.join_filter = [{
                        "terms": {"patientID.keyword": _patients}
                    }]
                elif self.options.entity == 'patient':
                    _patients = get_all_hits(_index=self.options.cvisb_endpoints['patient']['index'], _doc_type='patient', _client=self.options.client, _field='relatedTo',
                        _query=stage_one_query)
                    logging.debug("_patients: {}".format(_patients))
                    self.join_filter = [{
                        "terms": {"patientID.keyword": _patients}
                    }]
                elif self.options.entity == 'dataset':
                    _patients = get_all_hits(_index=self.options.cvisb_endpoints['patient']['index'], doc_type='patient', _client=self.options.client, 
                        _field='relatedTo', _query=stage_one_query)
                    logging.debug("_patients: {}".format(_patients))
                    _datadownloads = get_all_hits(_index=self.options.cvisb_endpoints['datadownload']['index'], doc_type='datadownload', _client=self.options.client, _field='identifier',
                        _query={"query": {
                            "terms": {"patientIDs.keyword": _patients}
                        }})
                    logging.debug("_datadownloads: {}".format(_datadownloads))
                    self.join_filter = [{
                        "terms": {"dataDownloadIDs.keyword": _datadownloads}
                    }]
            elif self.options.availableData:
                stage_one_query = {
                    "query": {
                        "terms": {"measurementTechnique.keyword": self.options.availableData}
                    }
                }
                if self.options.entity == 'sample':
                    _patients = get_all_hits(_index=self.options.cvisb_endpoints['datadownload']['index'], _doc_type='datadownload', _client=self.options.client, _field='patientIDs',
                        _query=stage_one_query)
                    logging.debug("_patients: {}".format(_patients))
                    self.join_filter = [{
                        "terms": {"patientID.keyword": _patients}
                    }]
                elif self.options.entity == 'patient':
                    _patients = get_all_hits(_index=self.options.cvisb_endpoints['datadownload']['index'], _doc_type='datadownload', _client=self.options.client, _field='patientIDs',
                        _query=stage_one_query)
                    logging.debug("_patients: {}".format(_patients))
                    self.join_filter = [{
                        "terms": {"patientID.keyword": _patients}
                    }]
                elif self.options.entity == 'dataset':
                    _datadownloads = get_all_hits(_index=self.options.cvisb_endpoints['datadownload']['index'], doc_type='datadownload', _client=self.options.client, 
                        _field='identifier', _query=stage_one_query)
                    logging.debug("_datadownloads: {}".format(_datadownloads))
                    self.join_filter = [{
                        "terms": {"dataDownloadIDs.keyword": _datadownloads}
                    }]
        return super(ESQueryBuilder, self)._query_GET_query(q)
