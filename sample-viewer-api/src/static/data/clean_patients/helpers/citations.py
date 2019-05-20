ncbi_stub = 'https://api.ncbi.nlm.nih.gov/lit/ctxp/v1/pubmed/?format=csl&id='
# example: 'https://api.ncbi.nlm.nih.gov/lit/ctxp/v1/pubmed/?format=csl&id=26276630'
import requests

def getCitation(pmid, ncbi_stub = ncbi_stub):
    res = requests.get(ncbi_stub + str(pmid))
    if(res.status_code == 200):
        return(res.json())
