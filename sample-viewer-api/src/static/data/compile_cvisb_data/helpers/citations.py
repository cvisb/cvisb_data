ncbi_stub = 'https://api.ncbi.nlm.nih.gov/lit/ctxp/v1/pubmed/?format=csl&id='
# example: 'https://api.ncbi.nlm.nih.gov/lit/ctxp/v1/pubmed/?format=csl&id=26276630'
import requests
import numpy as np
from .checks import getUnique


def dateArr2Str(arr):
    if(len(arr) == 3):
        return(f"{str(arr[0])}-{str(arr[1]).zfill(2)}-{str(arr[2]).zfill(2)}")
    if(len(arr) == 2):
        return(f"{str(arr[0])}-{str(arr[1]).zfill(2)}-01")
    if(len(arr) == 1):
        return(f"{str(arr[0])}-01-01")


def convertAuthor(authorObj):
    try:
        given = authorObj['given']
    except:
        given = None
    try:
        family = authorObj['family']
    except:
        family = None
    return({'givenName': given,
            'familyName': family
            })


def getCitation(pmid, ncbi_stub=ncbi_stub):
    if(pmid == pmid):
        if(isinstance(pmid, str)):
            pmid_string = pmid
        elif(isinstance(pmid, int) | isinstance(pmid, float)):
            pmid_string = "{:.0f}".format(pmid)
        if(pmid_string):
            res = requests.get(ncbi_stub + pmid_string)
            citation = {}
            if(res.status_code == 200):
                citation_raw = res.json()
                # reformat to schema.org format.
                citation['doi'] = citation_raw['DOI']
                citation['pmid'] = citation_raw['PMID']
                citation["identifier"] = citation_raw['id']
                citation["issn"] = citation_raw['ISSN']

                citation["author"] = [convertAuthor(
                    author) for author in citation_raw['author']]
                citation["datePublished"] = dateArr2Str(
                    citation_raw['issued']['date-parts'][0])

                try:
                    citation["issueNumber"] = citation_raw['issue']
                except:
                    pass
                citation["journalName"] = citation_raw['container-title']
                citation["journalNameAbbrev"] = citation_raw['container-title-short']
                citation["name"] = citation_raw['title']

                citation["pagination"] = citation_raw['page']

                citation["volumeNumber"] = citation_raw['volume']
                citation['url'] = 'https://www.ncbi.nlm.nih.gov/pubmed/?term=' + \
                    citation['pmid']
                return(citation)

# getCitation("26276630")


def createCitationDict(df, pmidCol= "source_PMID"):
    pmids = getUnique(df, pmidCol)

    citation_dict = {}
    for id in pmids:
        cite = getCitation(id)
        citation_dict[id] = cite
    return(citation_dict)

def lookupCitation(id, citation_dict):
    if(id == id):
        return(citation_dict[id])


def getLabAuthor(name):
    if((name == "Galit") | (name == "Alter") | (name == "Galit Alter")):
        return({
            "@type": "Organization",
            "url": "http://www.ragoninstitute.org/portfolio-item/alter-lab/",
            "name": "Galit Alter laboratory"
        })
    elif((name == "KGA") | (name == "Kristian") | (name == "Andersen")):
        return({
            "@type": "Organization",
            "url": "https://andersen-lab.com/",
            "name": "Kristian Andersen laboratory",
            "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "technical support",
                "url": "https://andersen-lab.com/",
                "email": "data@andersen-lab.com"
            }
        })


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

cvisb_funding = [{
"identifier": "U19AI135995",
"funder": {
  "@type": "Organization",
  "name": "National Institute of Allergy & Infectious Diseases",
  "alternateName": ["NIAID"],
  "description": "Funding for the Center for Viral Systems Biology is provided by National Institute of Allergy & Infectious Diseases (National Institutes for Health) award U19AI135995",
  "url": "https://taggs.hhs.gov/Detail/AwardDetail?arg_AwardNum=U19AI135995&arg_ProgOfficeCode=104",
  "parentOrganization": "National Institutes for Health"
}
}]

# Publisher Institution
patientSource = {
    "url": "https://vhfc.org",
    "name": "Viral Hemorrhagic Fever Consortium / Kenema Government Hospital"
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

def getAuthor(name):
    if((name.lower() == "tsri") | (name.lower() == "cvisb")):
        return(getLabAuthor("KGA"))
    return(None)
