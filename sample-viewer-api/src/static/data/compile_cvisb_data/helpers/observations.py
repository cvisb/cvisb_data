import numpy as np


def binarize(val):
    if(val == val):
        if(val.lower() == "yes"):
            return(True)
        elif(val.lower() == "no"):
            return(False)
        elif(val.lower() == "positive"):
            return(True)
        elif(val.lower() == "negative"):
            return(False)
        elif(val == 0):
            return(False)
        elif(val == "0"):
            return(False)
        elif(val == 1):
            return(True)
        elif(val == "1"):
            return(True)

# Convert symptoms to an array of objects with T/F values


def nestSequelae(row):
    obj = {}
    # double check that there is data...
    if(
        (row['joint pain'] == row['joint pain']) |
        (row['muscle pain'] == row['muscle pain']) |
        (row['hearing loss'] == row['hearing loss']) |
        (row['ringing in ears'] == row['ringing in ears']) |
        (row['dry eyes'] == row['dry eyes']) |
        (row['burning eyes'] == row['burning eyes']) |
        (row['loss of vision'] == row['loss of vision']) |
        (row['blurry vision'] == row['blurry vision']) |
        (row['light sensitivity'] == row['light sensitivity']) |
        (row['painful eyes'] == row['painful eyes']) |
        (row['sensation of foreign body in eye'] == row['sensation of foreign body in eye'])
    ):
        obj["joint_pain"] = binarize(row['joint pain'])
        obj["muscle_pain"] = binarize(row['muscle pain'])
        obj["hearing_loss"] = binarize(row['hearing loss'])
        obj["ringing_in_ears"] = binarize(row['ringing in ears'])
        obj["dry_eyes"] = binarize(row['dry eyes'])
        obj["burning_eyes"] = binarize(row['burning eyes'])
        obj["vision_loss"] = binarize(row['loss of vision'])
        obj["blurry_vision"] = binarize(row['blurry vision'])
        obj["light_sensitivity"] = binarize(row['light sensitivity'])
        obj["eye_pain"] = binarize(row['painful eyes'])
        obj["eye_foreign_body_sensation"] = binarize(
            row['sensation of foreign body in eye'])
        return(obj)


# Convert ELISAs from a series of columns to an array
def nestELISAs(row):
    elisas = []
    # ELISAs are unfortunately stored in a bunch of different variable names.
    # Catching in a try/except rather than passing specific column names and/or checking exists.
    # Also will catch NA values for the ELISA.
    # try:
    #     elisas.append(
    #         {"lassa_Ag": row['agvresultcc1'].lower()}
    #     )
    # except:
    #     pass
    # try:
    #     elisas.append(
    #         {"lassa_IgG": row['iggvresultcc1'].lower()}
    #     )
    # except:
    #     pass
    # try:
    #     elisas.append(
    #         {"lassa_IgM": row['igmvresultcc1'].lower()}
    #     )
    # except:
    #     pass
    # try:
    #     elisas.append(
    #         {"lassa_IgG": row['lassa IgG'].lower()}
    #     )
    # except:
    #     pass
    # try:
    #     elisas.append(
    #         {"ebola_IgG": row['ebola IgG'].lower()}
    #     )
    # except:
    #     pass
    # return(elisas)
    try:
        # survivor; timepoint = survivor enrollment
        if((row['ebola IgG'] == row['ebola IgG']) & (row['ebola IgG'] is not None)):
            elisas.append({
                "virus": "Ebola",
                "assayType": "IgG",
                "ELISAresult": row['ebola IgG'].lower(),
                "timepoint": "survivor enrollment"
            })
        else:
            elisas.append({
                "virus": "Ebola",
                "assayType": "IgG",
                "ELISAresult": np.nan,
                "timepoint": "survivor enrollment"
            })
        if((row['lassa IgG'] == row['lassa IgG']) & (row['lassa IgG'] is not None)):
            elisas.append({
                "virus": "Lassa",
                "assayType": "IgG",
                "ELISAresult": row['lassa IgG'].lower(),
                "timepoint": "survivor enrollment"
            })
        else:
            elisas.append({
                "virus": "Lassa",
                "assayType": "IgG",
                "ELISAresult": np.nan,
                "timepoint": "survivor enrollment"
            })
    except:
        # Acute; timepoint = patient admission
        if((row['agvresultcc1'] == row['agvresultcc1']) & (row['agvresultcc1'] is not None)):
            elisas.append(
                {
                    "virus": "Lassa",
                    "assayType": "Ag",
                    "ELISAresult": row['agvresultcc1'].lower(),
                    "timepoint": "patient admission"
                })
        else:  # NA
            elisas.append(
                {
                    "virus": "Lassa",
                    "assayType": "Ag",
                    "ELISAresult": np.nan,
                    "timepoint": "patient admission"
                })
        if((row['iggvresultcc1'] == row['iggvresultcc1']) & (row['iggvresultcc1'] is not None)):
            elisas.append(
                {
                    "virus": "Lassa",
                    "assayType": "IgG",
                    "ELISAresult": row['iggvresultcc1'].lower(),
                    "timepoint": "patient admission"
                })
        else:
            elisas.append(
                {
                    "virus": "Lassa",
                    "assayType": "IgG",
                    "ELISAresult": np.nan,
                    "timepoint": "patient admission"
                })
        if((row['igmvresultcc1'] == row['igmvresultcc1']) & (row['igmvresultcc1'] is not None)):
            elisas.append(
                {
                    "virus": "Lassa",
                    "assayType": "IgM",
                    "ELISAresult": row['igmvresultcc1'].lower(),
                    "timepoint": "patient admission"
                })
        else:
            elisas.append(
                {
                    "virus": "Lassa",
                    "assayType": "IgM",
                    "ELISAresult": np.nan,
                    "timepoint": "patient admission"
                })
    return(elisas)
    # try:
    #     # survivor; timepoint = survivor enrollment
    #     if((row['ebola IgG'] == row['ebola IgG']) & (row['lassa IgG'] == row['lassa IgG'])):
    #         return([
    #             {
    #                 "virus": "Ebola",
    #                 "assayType": "IgG",
    #                 "ELISAresult": row['ebola IgG'],
    #                 "timepoint": "survivor enrollment"
    #             },
    #             {
    #                 "virus": "Lassa",
    #                 "assayType": "IgG",
    #                 "ELISAresult": row['lassa IgG'],
    #                 "timepoint": "survivor enrollment"
    #             }
    #         ])
    #     elif(row['ebola IgG'] == row['ebola IgG']):
    #         return([{
    #             "virus": "Ebola",
    #             "assayType": "IgG",
    #             "ELISAresult": row['ebola IgG'],
    #             "timepoint": "survivor enrollment"
    #         }])
    #     elif(row['lassa IgG'] == row['lassa IgG']):
    #         return([{
    #             "virus": "Lassa",
    #                 "assayType": "IgG",
    #                 "ELISAresult": row['lassa IgG'],
    #                 "timepoint": "survivor enrollment"
    #                 }])
    # except:
    #     # Acute; timepoint = patient admission
    #     if((row['agvresultcc1'] == row['agvresultcc1'])):
    #         elisas.append(
    #             {
    #                 "virus": "Lassa",
    #                 "assayType": "Ag",
    #                 "ELISAresult": row['agvresultcc1'].lower(),
    #                 "timepoint": "patient admission"
    #             })
    #     if((row['iggvresultcc1'] == row['iggvresultcc1'])):
    #         elisas.append(
    #             {
    #                 "virus": "Lassa",
    #                 "assayType": "IgG",
    #                 "ELISAresult": row['iggvresultcc1'].lower(),
    #                 "timepoint": "patient admission"
    #             })
    #     if((row['igmvresultcc1'] == row['igmvresultcc1'])):
    #         elisas.append(
    #             {
    #                 "virus": "Lassa",
    #                 "assayType": "IgM",
    #                 "ELISAresult": row['igmvresultcc1'].lower(),
    #                 "timepoint": "patient admission"
    #             })
    #     return(elisas)

# Assumption is that if ANY ELISA is positive, they will be classified as Lassa positive
def classifyELISA(row):
    if((row['agvresultcc1'] == "Positive") | (row['agvresultcc1'] == "positive")):
        return(True)
    if((row['igmvresultcc1'] == "Positive") | (row['igmvresultcc1'] == "positive") & (row['iggvresultcc1'] == "Positive") | (row['iggvresultcc1'] == "positive")):
        return(True)
    return(False)
