import re
import pandas as pd
import numpy as np
# from . import updateError


def num2GID(id):
    id = str(id).upper().strip()

    # If it follows accepted formats, return that.
    known_id = cleanPrivateID(id)
    if known_id is not None:
        return(known_id)

    # timepoint = re.match("^(G\-)(\d\d\d\d)\-(\d)$", id)
    # if(timepoint):
    #     return(timepoint[1] + timepoint[2])
    # underscore = re.match("^(G)\_(\d\d\d\d)\-(\d)$", id)
    # if(underscore):
    #     return(underscore[1] + "-" + underscore[2])
    # underscore4 = re.match("^(G)\_(\d\d\d\d)\$", id)
    # if(underscore4):
    #     return(underscore4[1] + "-" + underscore4[2])
    # underscore3 = re.match("^(G)\_(\d\d\d)\$", id)
    # if(underscore3):
    #     return(underscore3[1] + "-" + underscore3[2])
    fourdigit = re.match("^(\d\d\d\d)$", id)
    if(fourdigit):
        return("G-" + fourdigit[1])
    threedigit = re.match("^(\d\d\d)$", id)
    if(threedigit):
        return("G-" + str(threedigit[1]).zfill(4))
    twodigit = re.match("^(\d\d)$", id)
    if(twodigit):
        return("G-" + str(twodigit[1]).zfill(4))
    return(id)


def splitGID(id):
    if((id == id) & (id != "") & (id != " ")):
        id_arr = str(id).split("/")
        ids = [num2GID(id) for id in id_arr]
        return(ids)
    else:
        # Ignore NaNs
        return(np.nan)


def checkIDtype(id):
    # Check and remove any gunk
    id = str(id).upper().strip()

    gpublic = re.search("^(G\d\d\-\d\d\d\d\d\d)$", id)
    if(gpublic):
        return("acute", gpublic[1], None)

    spublic = re.search("^(S-\d\d\d\d\d\d\d)$", id)
    if(spublic):
        return("survivor", spublic[1], None)

    cpublic = re.search("^(C-\d\d\d\d\d\d\d)$", id)
    if(cpublic):
        return("contact", cpublic[1], None)

    g2 = re.search("^(G\-)(\d\d)$", id)
    if(g2):
        return("acute", g2[1] + str(g2[2]).zfill(4), None)

    g2nohyphen = re.search("^(G)(\d\d)$", id)
    if(g2nohyphen):
        return("acute", g2nohyphen[1] + "-" + str(g2nohyphen[2]).zfill(4), None)

    g3 = re.search("^(G\-)(\d\d\d)$", id)
    if(g3):
        return("acute", g3[1] + str(g3[2]).zfill(4), None)

    g3nohyphen = re.search("^(G)(\d\d\d)$", id)
    if(g3nohyphen):
        return("acute", g3nohyphen[1] + "-" + str(g3nohyphen[2]).zfill(4), None)

    g3timepoint = re.search("^(G)\-(\d\d\d)\-(\d)$", id)
    if(g3timepoint):
        return("acute", g3timepoint[1] + "-" + str(g3timepoint[2]).zfill(4), g3timepoint[3])

    g3timepoint2 = re.search("^(G)(\d\d\d)\-(\d)$", id)
    if(g3timepoint2):
        return("acute", g3timepoint2[1] + "-" + str(g3timepoint2[2]).zfill(4), g3_timepoint2[3])

    g3underscore = re.search("^(G)\_(\d\d\d)$", id)
    if(g3underscore):
        return("acute", g3underscore[1] + "-" + str(g3underscore[2]).zfill(4), None)

    g3_timepoint = re.search("^(G)\_(\d\d\d)\-(\d)$", id)
    if(g3_timepoint):
        return("acute", g3_timepoint[1] + "-" + str(g3_timepoint[2]).zfill(4), g3_timepoint[3])

    g4 = re.search("^(G\-)(\d\d\d\d)$", id)
    if(g4):
        return("acute", g4[1] + g4[2], None)

    g4nohyphen = re.search("^(G)(\d\d\d\d)$", id)
    if(g4nohyphen):
        return("acute", g4nohyphen[1] + "-" + g4nohyphen[2], None)

    g4underscore = re.search("^(G)\_(\d\d\d\d)$", id)
    if(g4underscore):
        return("acute", g4underscore[1] + "-" + g4underscore[2], None)

    g4timepoint = re.search("^(G)\-(\d\d\d\d)\-(\d)$", id)
    if(g4timepoint):
        return("acute", g4timepoint[1] + "-" + g4timepoint[2], g4timepoint[3])

    g4timepointunhyphen = re.search("^(G)(\d\d\d\d)(\d)$", id)
    if(g4timepointunhyphen):
        return("acute", g4timepointunhyphen[1] + "-" + g4timepointunhyphen[2], g4timepointunhyphen[3])

    g4timepoint2 = re.search("^(G)(\d\d\d\d)\-(\d)$", id)
    if(g4timepoint2):
        return("acute", g4timepoint2[1] + "-" + g4timepoint2[2], g4timepoint2[3])

    g4_timepoint = re.search("^(G)\_(\d\d\d\d)\-(\d)$", id)
    if(g4_timepoint):
        return("acute", g4_timepoint[1] + "-" + g4_timepoint[2], g4_timepoint[3])

    g4dottimepoint = re.search("^(G)(\d\d\d\d)\.(\d)$", id)
    if(g4dottimepoint):
        return("acute", g4dottimepoint[1] + "-" + g4dottimepoint[2], g4dottimepoint[3])

    g4dotdashtimepoint = re.search("^(G)\-(\d\d\d\d)\.(\d)$", id)
    if(g4dotdashtimepoint):
        return("acute", g4dotdashtimepoint[1] + "-" + g4dotdashtimepoint[2], g4dotdashtimepoint[3])

    s1 = re.search("^(S\-)(\d)$", id)
    if(s1):
        return("survivor", s1[1] + "00" + s1[2], None)

    s2 = re.search("^(S\-)(\d\d)$", id)
    if(s2):
        return("survivor", s2[1] + "0" + s2[2, None])

    s3 = re.search("^(S\-)(\d\d\d)$", id)
    if(s3):
        return("survivor", s3[1] + s3[2], None)

    s3nohyphen = re.search("^(S)(\d\d\d)$", id)
    if(s3nohyphen):
        return("survivor", s3nohyphen[1] + "-" + s3nohyphen[2], None)

    s3underscore = re.search("^(S)\_(\d\d\d)$", id)
    if(s3underscore):
        return("survivor", s3underscore[1] + "-" + s3underscore[2], None)

    cnormal = re.search("^(C\-)(\d\d\d)(\-\d)$", id)
    if(cnormal):
        return("contact", cnormal[1] + cnormal[2] + cnormal[3], None)

# Requires some interpretation.
    weirdC = re.match("^(C)([0-9])\-([0-9][0-9][0-9])\-([0-9])$", id)
    if weirdC:
        # Contact numbers should only go from 1-3; if the "household number" is > 3, it's likely that's really the visit code.
        if(int(weirdC[4]) > 3):
            return(weirdC[1] + "-" + weirdC[3] + "-" + weirdC[2])
        return("contact", weirdC[1] + "-" + weirdC[3] + "-" + weirdC[4], weirdC[2])
    weirderC = re.match("^(C)([0-4])(\-[0-9][0-9][0-9])$", id)
    if weirderC:
        # Contact numbers should only go from 1-3; if the "household number" is > 3, it's likely that's really the visit code.
        return("contact", weirderC[1] + weirderC[3] + "-" + weirderC[2], None)
    # S-timepoint: assuming S-xxx-3 == S-xxx at visit 3.
    sTimepoint = re.match("^(S)(\-[0-9][0-9][0-9])\-([0-9])$", id)
    if sTimepoint:
        return("survivor", sTimepoint[1] + sTimepoint[2], sTimepoint[3])
    # 3-digit SID: S-0xxx-3 --> S-xxx at visit 3
    sTimepoint2 = re.match("^(S\-)0([0-9][0-9][0-9])\-([0-9])$", id)
    if sTimepoint2:
        return("survivor", sTimepoint2[1] + sTimepoint2[2], sTimepoint2[3])
    # S-timepoint in diff format: assuming S2-xxx == S-xxx at visit 2
    weirdS = re.match("^(S)([0-9])(\-[0-9][0-9][0-9])$", id)
    if weirdS:
        return("survivor", weirdS[1] + weirdS[3], weirdS[2])
    nohyphen = re.match("^(S)([0-9][0-9][0-9])$", id)
    if nohyphen:
        return("survivor", nohyphen[1] + "-" + nohyphen[2], None)
    s434a = re.match("^(S-434-A)$", id)
    if s434a:
        return("survivor", "S-434", None)
    s434b = re.match("^(S-434-B)$", id)
    if s434b:
        return("survivor", "S-435", None)

    return("unknown", None, None)

def interpretID(id_raw):
    """
    Check first if the ID is of a known, reasonably safe pattern.
    If not, try to interpret the ID.
    """
    id = str(id_raw).upper().strip()

    checkedID = checkIDtype(id)
    if(checkedID[0] != "unknown"):
        return(checkedID[1])
    else:
        # Try to convert what is presumably a C-id of ambiguous timepoint
        # Assuming C1-xxx-2 == C[visit number]-[id number]-[household number]
        # Therefore deleting the visit code
        weirdC = re.match("^(C)([0-9])\-([0-9][0-9][0-9])\-([0-9])$", id)
        if weirdC:
            # Contact numbers should only go from 1-3; if the "household number" is > 3, it's likely that's really the visit code.
            if(int(weirdC[4]) > 3):
                return(weirdC[1] + "-" + weirdC[3] + "-" + weirdC[2])
            return(weirdC[1] + "-" + weirdC[3] + "-" + weirdC[4])
        weirderC = re.match("^(C)([0-4])(\-[0-9][0-9][0-9])$", id)
        if weirderC:
            # Contact numbers should only go from 1-3; if the "household number" is > 3, it's likely that's really the visit code.
            return(weirderC[1] + weirderC[3] + "-" + weirderC[2])
        # S-timepoint: assuming S-xxx-3 == S-xxx at visit 3.
        sTimepoint = re.match("^(S)(\-[0-9][0-9][0-9])\-([0-9])$", id)
        if sTimepoint:
            return(sTimepoint[1] + sTimepoint[2])
        # 3-digit SID: S-0xxx-3 --> S-xxx at visit 3
        sTimepoint2 = re.match("^(S\-)0([0-9][0-9][0-9])\-([0-9])$", id)
        if sTimepoint2:
            return(sTimepoint2[1] + sTimepoint2[2])
        # S-timepoint in diff format: assuming S2-xxx == S-xxx at visit 2
        weirdS = re.match("^(S)([0-9])(\-[0-9][0-9][0-9])$", id)
        if weirdS:
            return(weirdS[1] + weirdS[3])
        nohyphen = re.match("^(S)([0-9][0-9][0-9])$", id)
        if nohyphen:
            return(nohyphen[1] + "-" + nohyphen[2])

        gpublic = re.search("^(G\d\d\-\d\d\d\d\d\d)", id)
        if(gpublic):
            return("acute", gpublic[1])

        spublic = re.search("^(S-\d\d\d\d\d\d\d)", id)
        if(spublic):
            return("survivor", spublic[1])

        cpublic = re.search("^(C-\d\d\d\d\d\d\d)", id)
        if(cpublic):
            return("contact", cpublic[1])

        return(str(id_raw).strip())

def interpretTimepoint(id_raw):
    id = str(id_raw).upper().strip()

    checkedID = checkIDtype(id)
    return(checkedID[2])

def getPrivateContactGroup(id):
    """
    Input IDs should be in a good format, so just pull out the three digits that relate to the contactGroup
    """
    s3 = re.search("^(S\-)(\d\d\d)$", id)
    if(s3):
        return(s3[2])
    c3 = re.search("^(C\-)(\d\d\d)\-(\d)$", id)
    if(c3):
        return(c3[2])

def checkPrivateID(id):
    s3 = re.search("^(S\-)(\d\d\d)$", id)
    if(s3):
        return(True)
    g4 = re.search("(G\-)(\d\d\d\d)", id)
    if(g4):
        return(True)
    g4nohyphen = re.search("(G)(\d\d\d\d)", id)
    if(g4nohyphen):
        return(True)
    cnormal = re.search("^(C\-)(\d\d\d)(\-\d)$", id)
    if(cnormal):
        return(True)
    return(False)

def assignOutcome(id):
    """
    Wrapper to assign cohort based on ID structure
    """
    outcome = checkIDtype(id)[0]
    if(outcome in ["survivor", "contact", "unknown"]):
        return(outcome)
    else:
        Warning("Outcome being assigned by ID structure is 'acute'-- not appropriate for determining the outcome more specifically.")
        return(outcome)


def cleanPrivateID(id):
    """
    Wrapper to pull out a normalized version of an ID
    """
    return(checkIDtype(id)[1])


def checkIDstructure(id):
    """
    Binary if the private IDs fall into a recognizable format.
    """
    if(checkIDtype(id)[0] == "unknown"):
        return(True)
    return(False)


def makePublicPatientID(row, publicID_col='study specific number'):
    """
    translator to append G/S/C to the start of the public ID / study-specific number based on the `outcome` field
    """
    if(row[publicID_col] == row[publicID_col]):
        if(row.outcome == "survivor"):
            return("S-" + row[publicID_col])

        elif(row.outcome == "contact"):
            return("C-" + row[publicID_col])
        else:
            return(row[publicID_col])


def arr2str(arr, delim="/"):
    if(arr == arr):
        return(delim.join(arr))

def combineIDs(row, idList=["gID", "sID", "patientID"]):
    arr = []
    for id in idList:
        if((row[id] == row[id]) & (row[id] is not None)):
            arr.append(row[id])
    return(arr)
