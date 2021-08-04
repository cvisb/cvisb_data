import pandas as pd
import helpers
from datetime import datetime
import re


def getData(row):
    obj = {}
    obj['@type'] = "SystemsSerology"
    obj['assayType'] = row.assay
    obj['value'] = row.value
    obj['valueCategory'] = row['category.1']
    obj['valueCategoryNumeric'] = row['category']

    if(row.antigen == "LASVGP_trimer_KH"):
        obj['antigen'] = row.antigen
        obj['antigenVirus'] = "Lassa"
    if(row.antigen == "EbolaGP_IBT"):
        obj['antigen'] = "Recombinant EBOV GPDTM (Sf9)"
        obj['antigenVirus'] = "Ebola"
        obj['antigenSource'] = "https://www.ibtbioservices.com/product/0501-016/"
    # Add in a pseudo-binary if the sample is a control experiment
    if(re.search("control", row.sampleID.lower())):
        obj['controlType'] = row.sampleID
    elif(re.search("negative", row.sampleID.lower())):
        obj['controlType'] = row.sampleID
    elif(re.search("positive", row.sampleID.lower())):
        obj['controlType'] = row.sampleID


    return([obj])

# DATADIR = "/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/"
# filename = f"{DATADIR}/input_data/expt_summary_data/systems_serology/CViSB_SystemsSerology_2019Nov12_BG.xlsx"

# df.loc[df.value.isnull(), ['assay', 'antigen', 'sampleID', 'experimentID', 'batchID', 'value', 'category']]

def clean_immune_effector_funcs(filename, expt_cols, updatedBy, dateModified, version, verbose, output_dir):
    today =  datetime.today().strftime('%Y-%m-%d')
    id_changed_path = f"{output_dir}/log/inconsistencies/experiments_SystemsSerology_idInterpretation_{today}.csv"

    # --- Load data ---
    # Import all the data; stored as individual sheets within the Excel file
    sheets = pd.read_excel(filename, sheet_name=None)

    # Append together the individual sheets
    df = pd.DataFrame()
    for name in sheets:
        df = pd.concat([df, sheets[name]], ignore_index=True)

    # --- provenance ---
    df['updatedBy'] = updatedBy
    df['dateModified'] = dateModified
    df['releaseDate'] = today
    df['sourceFiles'] = df.sampleID.apply(lambda x: filename.split("/")[-1])
    df['dataStatus'] = "final"
    df['version'] = version
    df['experimentDate'] = df.experimentDate.apply(lambda x: x.strftime('%Y-%m-%d'))

    # --- experiment classifications ---
    df['includedInDataset'] = "systems-serology"
    df['measurementCategory'] = "Systems Serology"
    df['measurementTechnique'] = "Serology"
    df['variableMeasured'] = df.assay

    # --- Credit ---
    df['creator'] = df["sampleID"].apply(lambda x: helpers.getLabAuthor("Alter"))
    df['publisher'] = df["sampleID"].apply(lambda x: helpers.cvisb)
    # Split and clean pubmedIDs
    citation_dict = helpers.splitCreateCitationDict(df, pmidCol= "pubmedID", delim=";")
    df['citation'] = df.pubmedID.apply(lambda x: helpers.splitGetCitation(x, citation_dict, True))

    # --- Compile data object ---
    df['data'] = None
    df['data'] = df.apply(getData, axis=1)

    # --- Deal with the ids... ---
    # create copies
    df['patient_id'] = df.patientID.copy()
    df['sample_id'] = df.sampleID.copy()
    df['experiment_id'] = df.experimentID.copy()
    df['batch_id'] = df.batchID.copy()


    df['isControl'] = df.sampleID.apply(getControl)
    df['privatePatientID'] = df.sampleID.apply(helpers.interpretID)
    # join with patient ID dictionary
    # # df['patientID'] =
    df['experimentID'] = df.apply(lambda row: getExptID(row), axis=1)
    df['visitCode'] = df.sampleID.apply(helpers.interpretTimepoint)
    df['batchID'] = df.apply(lambda row: f"{row.experiment_id}-{row.batch_id}", axis=1)
    df['idConverted'] = df.apply(lambda row: row.privatePatientID != row.sampleID, axis = 1)

    id_converts = df.loc[df.idConverted, ['sampleID', 'privatePatientID', 'visitCode']].drop_duplicates().sort_values("sampleID")

    if(len(id_converts) > 0):
        helpers.log_msg(f"{'-'*50}", verbose)
        helpers.log_msg(f"\tDATA WARNING: {len(id_converts)} Sample IDs were converted to privatePatientID and visitCode. Check that this was done properly in {id_changed_path.split('/')[-1]}", verbose)
        helpers.log_msg(f"{'-'*50}", verbose)
        id_converts.to_csv(id_changed_path, index=False)

    # --- checks ---
    # Experiment ID is unique
    # Check if data is null
    null_data = df[df['value'].isnull()]
    if(len(null_data) > 0):
        helpers.log_msg(f"{'-'*50}", verbose)
        helpers.log_msg(f"\tDATA WARNING: {len(null_data)} experiments have null data values", verbose)
        helpers.log_msg(null_data[['sampleID', 'experimentID', 'batchID']], verbose)
        helpers.log_msg(f"{'-'*50}", verbose)

    #  Check for:
    # 1) non-duplicate values
    # df.groupby(["assay", "antigen"]).sampleID.value_counts()
    # 2) Breaks
    # 3) duplicates when combine sample ID and public ID...
    #
    # # TODO:
    # 1. create expt ID... exptID/batchID
    # 2. fish out patientID
    # 3. standardize sampleID; break into timepoint
    # 4. PubMedIDs --> citation objects

    # Checking breaks
    # df.groupby(['assay', 'antigen', 'category.1', 'batchID']).value.agg([min, max])
    # df.groupby("batchID").experimentID.value_counts()
    return(df[expt_cols])

def getControl(id):
    controlIDs=["BostonNegative", "positiveControl", "positiveControl_c13C6", "negativeControl", "noAntibodyControl"]
    if(id in controlIDs):
        return(True)
    else:
        return(False)

def getExptID(row):
    if(row.isControl):
        return(f"{row.experiment_id}-{row.assay}-{row.antigen}_{row.sample_id}-{row.batchID}_{row.experimentDate}")
    return(f"{row.experiment_id}-{row.assay}-{row.antigen}_{row.sample_id}_{row.experimentDate}")
