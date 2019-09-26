ncbi_stub = 'https://api.ncbi.nlm.nih.gov/lit/ctxp/v1/pubmed/?format=csl&id='
# example: 'https://api.ncbi.nlm.nih.gov/lit/ctxp/v1/pubmed/?format=csl&id=26276630'
import requests
import numpy as np


def dateArr2Str(arr):
    return(f"{str(arr[0])}-{str(arr[1]).zfill(2)}-{str(arr[2]).zfill(2)}")

def convertAuthor(authorObj):
    try:
        given = authorObj['given']
    except:
        given = np.nan
    try:
        family = authorObj['family']
    except:
        family = np.nan
    return({'givenName': given,
    'familyName': family
    })

def getCitation(pmid, ncbi_stub=ncbi_stub):
    res = requests.get(ncbi_stub + str(pmid))
    if(res.status_code == 200):
        citation_raw = res.json()
        citation = {}
        # reformat to schema.org format.
        citation['doi'] = citation_raw['DOI']
        citation['pmid'] = citation_raw['PMID']
        citation["identifier"] = citation_raw['id']
        citation["issn"] = citation_raw['ISSN']

        citation["author"] = [convertAuthor(author) for author in citation_raw['author']]
        citation["datePublished"] = dateArr2Str(citation_raw['issued']['date-parts'][0])

        citation["issueNumber"] = citation_raw['issue']
        citation["journalName"] = citation_raw['container-title']
        citation["journalNameAbbrev"] = citation_raw['container-title-short']
        citation["name"] = citation_raw['title']

        citation["pagination"] = citation_raw['page']

        citation["volumeNumber"] = citation_raw['volume']
        citation['url'] =  'https://www.ncbi.nlm.nih.gov/pubmed/?term=' + \
            citation['pmid']
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

broad = {
    "url": "https://www.broadinstitute.org/",
    "name": "Broad Institute"
}


def getPublisher(name):
    if((name.lower() == "tsri") | (name.lower() == "cvisb")):
        return(cvisb)
    if((name.lower() == "broad")):
        return(broad)
