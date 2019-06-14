from biothings_client import get_client
import requests

class CViSBClient(object):
    def __init__(self, url="https://data.cvisb.org/api"):
        self.url = url
        for entity in eval(requests.get(url+'//').json()['error'].split(':')[1].strip()):
            _client = get_client(entity, url=self.url)
            _client._query_endpoint = '/{}/query/'.format(entity)
            setattr(self, entity, _client)
