# --- district/village --> geo objects, check that they're appropriate ---
def cleanDistrict(district):
    if (district == district):
        # Clean up Western Area; assuming the Urban part of the district, since everyone is within Freetown.
        if (district.lower() == "western area"):
            return([{
            'administrativeType': 'district',
            'administrativeUnit': 2,
            'name': "Western Area Urban"
            }]
            )
        return([{
        'administrativeType': 'district',
        'administrativeUnit': 2,
        'name': district.title()
        }])

def getCountry(countryID):
    if((countryID == "SL") | (countryID == "SLE") | (countryID == "Sierra Leone")):
        return({
        "@type": "Country",
        "name": "Sierra Leone",
        "identifier": "SL",
        "url": "https://www.iso.org/obp/ui/#iso:code:3166:SL"
        })
    elif((countryID == "NG") | (countryID == "NGA") | (countryID == "Nigeria")):
        return({
        "@type": "Country",
        "name": "Nigeria",
        "identifier": "NG",
        "url": "https://www.iso.org/obp/ui/#iso:code:3166:NG"
        })
    elif((countryID == "GN") | (countryID == "GIN") | (countryID == "Guinea")):
        return({
        "@type": "Country",
        "name": "Guinea",
        "identifier": "GN",
        "url": "https://www.iso.org/obp/ui/#iso:code:3166:GN"
        })
    elif((countryID == "LR") | (countryID == "LBR") | (countryID == "Liberia")):
        return({
        "@type": "Country",
        "name": "Liberia",
        "identifier": "LR",
        "url": "https://www.iso.org/obp/ui/#iso:code:3166:LR"
        })
    else:
        return()

def getCountryName(countryID):
    """
    Pull out the country name from a country object.
    If there's no "name" property in the object, returns null
    """
    try:
        countryObj = getCountry(countryID)
        return(countryObj['name'])
    except:
        pass
