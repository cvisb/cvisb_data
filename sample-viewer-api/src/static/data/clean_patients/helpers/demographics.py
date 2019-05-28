import pandas as pd
import re

# convert gender to M/F
def convertGender(gender):
    if(gender == gender):
        if((gender.lower() == 'm') | (gender.lower() == "male")):
            return("Male")
        elif((gender.lower() == 'f') | (gender.lower() == 'female')):
            return("Female")
    return("Unknown")

# --- cohort ---
def cleanCohort(input):
    if(input != input):
        return(pd.np.nan)
    if(re.search("Lassa", input.title())):
        return("Lassa")
    if(re.search("LSV", input.upper())):
        return("Lassa")
    if(re.search("LASV", input.upper())):
        return("Lassa")
    if(re.search("Ebola", input.title())):
        return("Ebola")
    if(re.search("EBOV", input.upper())):
        return("Ebola")
    if(re.search("EBV", input.upper())):
        return("Ebola")
    if(re.search("EVD", input.upper())):
        return("Ebola")

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

    outcome = input.lower()
    # outcome looks good; just pass it through
    if((outcome == "contact") | (outcome == "control")):
        return(outcome)
    elif((outcome == 'discharged') | (outcome == "survivor")):
        return('survivor')
    elif((outcome == 'died') |( outcome == 'dead')):
        return('dead')
    else:
    # if((outcome == '?') | (outcome == "other") | (outcome == "transferred") | (outcome == "not admitted")):
        return('unknown')

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
        return(pd.np.nan)
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
        return(pd.np.nan)
    return(years + months/12 + days/365)
