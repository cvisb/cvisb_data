import pandas as pd

def getData(id_list, export_path = None, dict_file = "/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/output_data/patients/patients_2019-08-09_PRIVATE_dict.json"):
    ids = pd.read_json(dict_file)
    ids.reset_index(inplace = True)
    ids.rename(columns = {'index': 'privatePatientID'}, inplace = True)

    id_list = pd.DataFrame(data=id_list, columns=["privatePatientID"])

    results = pd.merge(id_list, ids, how="left", on="privatePatientID", indicator=True)

    if(export_path is not None):
        results.to_csv(export_path, index=False)

    return(results)
