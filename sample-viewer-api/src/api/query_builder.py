from biothings.web.api.es.query_builder import ESQueryBuilder
from api.elisa_parser import parseElisaString
from elasticsearch.helpers import scan
from copy import copy
import logging
import re

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

    def do_cvisb_sample_joins(self, stage_one_query):
        ''' join other objects to a sample '''
        if self.options.entity in ['patient', 'sample', 'experiment', 'dataset', 'datadownload']:
            _samplePatientIdentifiers = get_all_hits(_index=self.options.cvisb_endpoints['sample']['index'],
                _doc_type='sample', _client=self.options.client, _field='privatePatientID', _query=stage_one_query)
            logging.debug('_samplePatientIdentifiers: {}'.format(_samplePatientIdentifiers))
            if self.options.entity == 'sample':
                # redundant query....
                self.join_filter = [{
                    "terms": {'privatePatientID.keyword': _samplePatientIdentifiers}
                }]
                return
            _patientIdentifiers = get_all_hits(_index=self.options.cvisb_endpoints['patient']['index'], _doc_type='patient',
                _client=self.options.client, _field='alternateIdentifier', 
                _query={"query": {"terms": {"alternateIdentifier.keyword": _samplePatientIdentifiers}}})
            logging.debug("_patientIdentifiers: {}".format(_patientIdentifiers))
            if self.options.entity == 'patient':
                self.join_filter = [{
                    "terms": {"alternateIdentifier.keyword": _patientIdentifiers}
                }]
                return
            if self.options.entity == 'experiment':
                self.join_filter = [{
                    "terms": {"privatePatientID.keyword": _patientIdentifiers}
                }]
                return
            _experimentIDs = get_all_hits(_index=self.options.cvisb_endpoints['experiment']['index'], _doc_type='experiment',
                _client=self.options.client, _field='experimentID', _query={
                    "query": {"terms": {"privatePatientID.keyword": _patientIdentifiers}}})
            logging.debug("_experimentIDs: {}".format(_experimentIDs))
            if self.options.entity == 'datadownload':
                self.join_filter = [{
                    "terms": {"experimentIDs.keyword": _experimentIDs}
                }]
                return
            _datadownloads = get_all_hits(_index=self.options.cvisb_endpoints['datadownload']['index'], _doc_type='datadownload', _client=self.options.client, _field='identifier',
                _query={"query": {
                        "terms": {"experimentIDs.keyword": _experimentIDs}
                        }})
            logging.debug("_datadownloads: {}".format(_datadownloads))
            self.join_filter = [{
                "terms": {"dataDownloadIDs.keyword": _datadownloads}
            }]

    def do_cvisb_experiment_joins(self, stage_one_query):
        ''' join other objects to an experiment '''
        if self.options.entity in ['patient', 'sample', 'experiment']:
            _experimentPatientIdentifiers = get_all_hits(_index=self.options.cvisb_endpoints['experiment']['index'],
                _doc_type='experiment', _client=self.options.client, _field='privatePatientID', _query=stage_one_query)
            logging.debug('_experimentPatientIdentifiers: {}'.format(_experimentPatientIdentifiers))
            if self.options.entity == 'experiment':
                # redundant query....
                self.join_filter = [{
                    "terms": {'privatePatientID.keyword': _experimentPatientIdentifiers}
                }]
                return
            _patientIdentifiers = get_all_hits(_index=self.options.cvisb_endpoints['patient']['index'], _doc_type='patient',
                _client=self.options.client, _field='alternateIdentifier', 
                _query={"query": {"terms": {"alternateIdentifier.keyword": _experimentPatientIdentifiers}}})
            if self.options.entity == 'patient':
                self.join_filter = [{
                    "terms": {"alternateIdentifier.keyword": _patientIdentifiers}
                }]
                return
            elif self.options.entity == 'sample':
                self.join_filter = [{
                    "terms": {"privatePatientID.keyword": _patientIdentifiers}
                }]
                return
        elif self.options.entity in ['datadownload', 'dataset']:
            _experimentIDs = get_all_hits(_index=self.options.cvisb_endpoints['experiment']['index'], _doc_type='experiment',
                _client=self.options.client, _field='experimentID', _query=stage_one_query)
            logging.debug("_experimentIDs: {}".format(_experimentIDs))
            if self.options.entity == 'datadownload':
                self.join_filter = [{
                    "terms": {"experimentIDs.keyword": _experimentIDs}
                }]
                return
            _datadownloads = get_all_hits(_index=self.options.cvisb_endpoints['datadownload']['index'], _doc_type='datadownload', _client=self.options.client, _field='identifier',
                _query={"query": {
                        "terms": {"experimentIDs.keyword": _experimentIDs}
                        }})
            logging.debug("_datadownloads: {}".format(_datadownloads))
            self.join_filter = [{
                "terms": {"dataDownloadIDs.keyword": _datadownloads}
            }]

    def do_cvisb_patient_joins(self, stage_one_query):
        ''' takes a stange_one_query that filters patient objects, and does the join between patient and patient, patient and sample, and patient and dataset '''
        if self.options.entity in ['patient', 'sample', 'experiment', 'dataset', 'datadownload']:
            _patientIdentifiers = get_all_hits(_index=self.options.cvisb_endpoints['patient']['index'],
                _doc_type='patient', _client=self.options.client, _field='alternateIdentifier',
                _query=stage_one_query)
            logging.debug('_patientIdentifiers: {}'.format(_patientIdentifiers))
            if self.options.entity == 'patient':
                # TODO:  This probably doesn't make much sense to do anymore since "alterIdentifier" was redone to include
                # all ids, can likely be removed
                self.join_filter = [{
                    "terms": {'alternateIdentifier.keyword': _patientIdentifiers}
                }]
                return
            if self.options.entity == 'sample':
                # get all patient IDs for the input list, alternativeID
                self.join_filter = [{
                    "terms": {"privatePatientID.keyword": _patientIdentifiers}
                }]
                return
            if self.options.entity == 'experiment':
                self.join_filter = [{
                    "terms": {"privatePatientID.keyword": _patientIdentifiers}
                }]
                return
            _experimentIDs = get_all_hits(_index=self.options.cvisb_endpoints['experiment']['index'], _doc_type='experiment',
                _client=self.options.client, _field='experimentID', _query={
                    "query": {
                        "terms": {"privatePatientID.keyword": _patientIdentifiers}
                    }
            })
            logging.debug("_experimentIDs: {}".format(_experimentIDs))
            if self.options.entity == 'datadownload':
                self.join_filter = [{
                    "terms": {"experimentIDs.keyword": _experimentIDs}
                }]
                return
            _datadownloads = get_all_hits(_index=self.options.cvisb_endpoints['datadownload']['index'], _doc_type='datadownload', _client=self.options.client, _field='identifier',
                _query={"query": {
                        "terms": {"experimentIDs.keyword": _experimentIDs}
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
            if self.options.patientQuery:
                self.do_cvisb_patient_joins({
                    "query": {
                        "query_string": {
                            "query": self.options.patientQuery
                        }
                    }
                })
            elif self.options.sampleQuery:
                self.do_cvisb_sample_joins({
                    "query": {
                        "query_string": {
                            "query": self.options.sampleQuery
                        }
                    }
                })
            elif self.options.experimentQuery:
                self.do_cvisb_experiment_joins({
                    "query": {
                        "query_string": {
                            "query": self.options.experimentQuery
                        }
                    }
                })
            elif (self.options.patientID or self.options.cohort or self.options.outcome or self.options.country or 
                  self.options.infectionYear or self.options.elisa):
                stage_one_patient_queries = []
                if self.options.patientID:
                    stage_one_patient_queries.append({
                        "terms": {"alternateIdentifier.keyword": self.options.patientID}
                    })
                if self.options.cohort:
                    stage_one_patient_queries.append({
                        "terms": {"cohort.keyword": self.options.cohort}
                    })
                if self.options.outcome:
                    stage_one_patient_queries.append({
                        "terms": {"outcome.keyword": self.options.outcome}
                    })
                if self.options.country:
                    stage_one_patient_queries.append({
                        "terms": {"country.name.keyword": self.options.country}
                    })
                if self.options.infectionYear:
                    stage_one_patient_queries.append({
                        "query_string": {
                            "query": "infectionYear:{}".format(self.options.infectionYear)
                        }
                    })
                if self.options.elisa:
                    stage_one_patient_queries.append(parseElisaString(self.options.elisa)['query'])
                # combine the patient queries
                if stage_one_patient_queries:
                    if len(stage_one_patient_queries) == 1:
                        self.do_cvisb_patient_joins({'query': stage_one_patient_queries[0]})
                    else:
                        self.do_cvisb_patient_joins({'query': {'bool': {'must': stage_one_patient_queries}}})
            elif self.options.measurementTechnique:
                self.do_cvisb_experiment_joins({
                    "query": {
                        "terms": {"measurementTechnique.keyword": self.options.measurementTechnique}
                    }
                })
            elif self.options.length:
                # TODO: should be analyzed carefully for possible injection.... 
                # inserting url strings into scripts is potentially risky business
                parse_regex = r'\s*(?P<entity>(sample|patient|experiment))\.(?P<compare_clause>\S+)\s*(?P<operator>(<|<=|>|>=))\s*(?P<number>\d+)\s*'
                m = re.fullmatch(parse_regex, self.options.length)
                if m:
                    d = m.groupdict()
                    _query = {
                        "query": {
                            "bool": {
                                "filter": {
                                    "script": {
                                        "script": {
                                            "source": "if (doc.containsKey('{cc}')) {{doc['{cc}'].values.length {op} {nu};}}".format(cc=d['compare_clause'], op=d['operator'], nu=d['number']),
                                            "lang": "painless"
                                        }
                                    }
                                }
                            }
                        }
                    }
                    if d['entity'] == 'sample':
                        self.do_cvisb_sample_joins(_query)
                    elif d['entity'] == 'patient':
                        self.do_cvisb_patient_joins(_query)
                    elif d['entity'] == 'experiment':
                        self.do_cvisb_experiment_joins(_query, full_stage_one_results=True)
        return super(ESQueryBuilder, self)._query_GET_query(q)
