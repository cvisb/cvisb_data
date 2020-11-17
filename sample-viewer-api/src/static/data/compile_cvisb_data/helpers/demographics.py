import pandas as pd
import numpy as np
import re

def convertLower(input, unknownVal = np.nan):
    # Value is NA; collapse to unknown
    if(input != input):
        return(unknownVal)
    return(input.lower())

def convertBoolean(input):
    # Value is NA
    if(input != input):
        return(np.nan)
    if((input.lower() == "n") | (input.lower() == "no")):
        return(False)
    if((input.lower() == "y") | (input.lower() == "yes")):
        return(True)

# convert gender to M/F
def convertGender(gender):
    if(gender == gender):
        if(isinstance(gender, list)):
            return("Unknown")
        if((gender.lower() == 'm') | (gender.lower() == "male")):
            return("Male")
        elif((gender.lower() == 'f') | (gender.lower() == 'female')):
            return("Female")
    return("Unknown")

# convert species to controlled vocabulary
def convertSpecies(species):
    if(species == species):
        if((species.lower() == 'hs') | (species.lower() == "homo sapiens") | (species.lower() == "human")):
            return("Homo sapiens")
        elif((species.lower() == 'hp') | (species.lower() == "hylomyscus pamfi")):
            return("Hylomyscus pamfi")
        elif((species.lower() == 'me') | (species.lower() == "Mastomys erythroleucus")):
            return("Mastomys erythroleucus")
        elif((species.lower() == 'mn') | (species.lower() == "Mastomys natalensis")):
            return("Mastomys natalensis")
        elif((species.lower() == 'rodent')):
            return("rodent")
    return(np.nan)

# --- cohort ---
def cleanCohort(input):
    if(input != input):
        return("Unknown")
    if(isinstance(input, list)):
        return("Unknown")
    if(re.search("Lassa", input.title())):
        return("Lassa")
    if(re.search("LSV", input.upper())):
        return("Lassa")
    if(re.search("LASV", input.upper())):
        return("Lassa")
    if(re.search("LF", input.upper())):
        return("Lassa")
    if(re.search("Ebola", input.title())):
        return("Ebola")
    if(re.search("EBOV", input.upper())):
        return("Ebola")
    if(re.search("EBV", input.upper())):
        return("Ebola")
    if(re.search("EVD", input.upper())):
        return("Ebola")
    if(re.search("Control", input.title())):
        return("Control")
    if(re.search("COVID-19", input.upper())):
        return("COVID-19")
    else:
        return("Unknown")

# --- outcome ---
# collapse to [survivor, dead, contact, control, unknown]
# outcome --> lowercase;
# not admitted --> unknown?
# discharged --> survivor
# transferred --> unknown?
# other --> unknown
# ? --> unknown
def cleanOutcome(input):
    # Value is NA; collapse to unknown
    if(input != input):
        return('unknown')
    if(isinstance(input, list)):
        return("unknown")
    outcome = input.lower()
    # outcome looks good; just pass it through
    if((outcome == "contact") | (outcome == "control")):
        return(outcome)
    elif((outcome == 'discharged') | (outcome == "survivor") | (outcome == "survived")):
        return('survivor')
    elif((outcome == 'died') | ( outcome == 'dead') | ( outcome == 'died?')):
        return('dead')
    else:
    # if((outcome == '?') | (outcome == "other") | (outcome == "transferred") | (outcome == "not admitted")):
        return('unknown')

def decodeEthnicity(input):
    if(input == 1):
        return("Mende")
    if(input == 2):
        return("Temne")
    if(input == 3):
        return("Fullah")
    if(input == 4):
        return("Krio")

# For the survivor roster, they are listed as either a "case" (aka survivor)
# or a contact to XXX -- aka a contact.
def cleanSurvivorOutcome(input):
    if(input != input):
        return('unknown')
    outcome = input.lower()
    if(re.search("contac", outcome)):
        return("contact")
    if(outcome == "case"):
        return("survivor")
    else:
        return(outcome)

# --- age ---
def getAge(row):
    if((row.Agey != row.Agey) & (row.Agem != row.Agem) & (row.Aged != row.Aged)):
        return(np.nan)
    try:
        years = int(row.Agey)
    except:
        # years is a weird string or NA
        years = 0
    try:
        months = int(row.Agem)
    except:
        # months is a weird string or NA
        months = 0
    try:
        days = int(row.Aged)
    except:
        # days is a weird string or NA
        days = 0
    if((years + months + days) == 0):
        # Age is too small, likely from weird strings in one of the arguments
        return(np.nan)
    return(years + months/12 + days/365)
