ncbi_stub = 'https://api.ncbi.nlm.nih.gov/lit/ctxp/v1/pubmed/?format=csl&id='
# example: 'https://api.ncbi.nlm.nih.gov/lit/ctxp/v1/pubmed/?format=csl&id=26276630'
import requests

def getCitation(pmid, ncbi_stub = ncbi_stub):
    res = requests.get(ncbi_stub + str(pmid))
    if(res.status_code == 200):
        citation = res.json()
        citation['url'] = 'https://www.ncbi.nlm.nih.gov/pubmed/?term=' + citation['PMID']
        return(citation)

# getCitation("26276630")
