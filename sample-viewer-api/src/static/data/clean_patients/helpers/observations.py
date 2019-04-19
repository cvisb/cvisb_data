def binarize(val):
    if(val == val):
        if(val.lower() == "yes"):
            return(True)
        elif(val.lower() == "no"):
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
def nestSymptoms(row, timepoint = "survivor enrollment"):
    obj = {}
    obj["timepoint"] = timepoint
    obj["symptoms"] = {}

    obj["symptoms"]["joint_pain"] = binarize(row['joint pain'])
    obj["symptoms"]["muscle_pain"] = binarize(row['muscle pain'])
    obj["symptoms"]["hearing_loss"] = binarize(row['hearing loss'])
    obj["symptoms"]["ringing_in_ears"] = binarize(row['ringing in ears'])
    obj["symptoms"]["dry_eyes"] = binarize(row['dry eyes'])
    obj["symptoms"]["burning_eyes"] = binarize(row['burning eyes'])
    obj["symptoms"]["vision_loss"] = binarize(row['loss of vision'])
    obj["symptoms"]["blurry_vision"] = binarize(row['blurry vision'])
    obj["symptoms"]["light_sensitivity"] = binarize(row['light sensitivity'])
    obj["symptoms"]["eye_pain"] = binarize(row['painful eyes'])
    obj["symptoms"]["eye_foreign_body_sensation"] = binarize(row['sensation of foreign body in eye'])
    return([obj])


# Convert ELISAs from a series of columns to an array
def nestELISAs(row):
    elisas = []
    # ELISAs are unfortunately stored in a bunch of different variable names.
    # Catching in a try/except rather than passing specific column names and/or checking exists.
    # Also will catch NA values for the ELISA.
    try:
        elisas.append(
            {"lassa_Ag": row['agvresultcc1'].lower()}
        )
    except:
        pass
    try:
        elisas.append(
            {"lassa_IgG": row['iggvresultcc1'].lower()}
        )
    except:
        pass
    try:
        elisas.append(
            {"lassa_IgM": row['igmvresultcc1'].lower()}
        )
    except:
        pass
    try:
        elisas.append(
            {"lassa_IgG": row['lassa IgG'].lower()}
        )
    except:
        pass
    try:
        elisas.append(
            {"ebola_IgG": row['ebola IgG'].lower()}
        )
    except:
        pass
    return(elisas)
    # if((row['ebola IgG'] == row['ebola IgG']) & (row['lassa IgG'] == row['lassa IgG'])):
    #     return([
    #         {
    #             "virus": "Ebola",
    #             "assayType": "IgG",
    #             "ELISAresult": row['ebola IgG']
    #         },
    #         {
    #             "virus": "Lassa",
    #             "assayType": "IgG",
    #             "ELISAresult": row['lassa IgG']
    #         }
    #     ])
    # elif(row['ebola IgG'] == row['ebola IgG']):
    #     return([{
    #         "virus": "Ebola",
    #         "assayType": "IgG",
    #         "ELISAresult": row['ebola IgG']
    #     }])
    # elif(row['lassa IgG'] == row['lassa IgG']):
    #     return([{
    #         "virus": "Lassa",
    #             "assayType": "IgG",
    #             "ELISAresult": row['lassa IgG']
    #             }])
# def nestELISAs(row):
#     elisas = []
#     if((row['agvresultcc1'] == row['agvresultcc1'])):
#         elisas.append(
#             {
#                 "virus": "Lassa",
#                 "assayType": "Ag",
#                 "ELISAresult": row['agvresultcc1'].lower()
#             })
#     if((row['iggvresultcc1'] == row['iggvresultcc1'])):
#         elisas.append(
#             {
#                 "virus": "Lassa",
#                 "assayType": "IgG",
#                 "ELISAresult": row['iggvresultcc1'].lower()
#             })
#     if((row['igmvresultcc1'] == row['igmvresultcc1'])):
#         elisas.append(
#             {
#                 "virus": "Lassa",
#                 "assayType": "IgM",
#                 "ELISAresult": row['igmvresultcc1'].lower()
#             })
#     return(elisas)
