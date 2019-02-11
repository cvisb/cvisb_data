from biothings.web.api.es.query_builder import ESQueryBuilder

class ESQueryBuilder(ESQueryBuilder):
    # Implement app specific queries here
    def _return_query_kwargs(self, query_kwargs):
        _kwargs = {"index": self.index, "doc_type": self.doc_type, "version": True}
        _kwargs.update(query_kwargs)
        return _kwargs
