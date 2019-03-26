from biothings.web.api.es.query_builder import ESQueryBuilder
from elasticsearch.helpers import scan
import logging

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

    def _query_GET_query(self, q):
        # override to add new things to biothings
        if ((not self.options.cvisb_user) or 
            ('email' not in self.options.cvisb_user) or 
            (self.options.cvisb_user['email'] not in self.options.cvisb_user_list)):
            self.es_options['_source']['excludes'].extend(self.options.cvisb_endpoints[self.options.entity]['public_excluded_return_fields'])
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
                if self.options.entity == 'sample':
                    # get all patients, either by patientID or alternativeID
                    _associatedSamples = list(set(
                        [x['_source']['associatedSamples'] for x in scan(client=self.options.client, query={
                        "query": 
                            {"bool":
                                {"should": [
                                    {"terms": {"alternateIdentifier.keyword": self.options.patientID}}, 
                                    {"terms": {"patientID.keyword": self.options.patientID}}
                                ]}
                            }, "_source": ["associatedSamples"]
                    }, index=self.options.cvisb_endpoints["sample"]['index'], doc_type="sample") if '_source' in x and 'associatedSamples' in x['_source']]))
                    logging.debug("_associatedSamples: {}".format(_associatedSamples))
                    self.join_filter = [{
                        "terms": {"sampleID.keyword": _associatedSamples}
                    }]
                elif self.options.entity == 'patient':
                    _patients = list(set(
                        [x['_source']['patientID'] for x in scan(client=self.options.client, query = {
                        "query":
                            {"bool":
                                {"should": [
                                    {"terms": {"alternateIdentifier.keyword": self.options.patientID}},
                                    {"terms": {"patientID.keyword": self.options.patientID}}
                                ]}
                            }, "_source": ["patientID"]
                        }, index=self.options.cvisb_endpoints["patient"]["index"], doc_type="patient") if '_source' in x and 'patientID' in x['_source']]))
                    logging.debug("_patients: {}".format(_patients))
                    self.join_filter = [{
                        "terms": {"patientID.keyword": _patients}
                    }]
        return super(ESQueryBuilder, self)._query_GET_query(q)
