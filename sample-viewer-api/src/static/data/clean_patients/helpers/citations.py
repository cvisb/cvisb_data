ncbi_stub = 'https://api.ncbi.nlm.nih.gov/lit/ctxp/v1/pubmed/?format=csl&id='
# example: 'https://api.ncbi.nlm.nih.gov/lit/ctxp/v1/pubmed/?format=csl&id=26276630'
import requests


def getCitation(pmid, ncbi_stub=ncbi_stub):
    res = requests.get(ncbi_stub + str(pmid))
    if(res.status_code == 200):
        citation = res.json()
        citation['url'] = 'https://www.ncbi.nlm.nih.gov/pubmed/?term=' + \
            citation['PMID']
        return(citation)

# getCitation("26276630")


# Publisher Institution
cvisb = {
    "url": "https://cvisb.org/",
    "name": "Center for Viral Systems Biology",
    "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "technical support",
        "url": "https://cvisb.org/",
        "email": "info@cvisb.org"
    }
}

cvisb = {
    "url": "https://www.broadinstitute.org/",
    "name": "Broad Institute"
}


def getPublisher(name):
    if((name.lower() == "tsri") | (name.lower() == "cvisb")):
        return(cvisb)
    if((name.lower() == "broad")):
        return(broad)
