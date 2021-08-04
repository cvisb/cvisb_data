# Script to take .csv from Karthik containing HLA calls and morph it into the correct format for use in HLA summary graphs.
# Mainly: standardize variable names, classifications
# And convert to a long dataset from wide
import pandas as pd
import numpy as np
import helpers
import re
import json
from datetime import datetime
from .generate_hla_dataset import get_hla_dataset
from .generate_hla_datadownload import get_hla_downloads

def clean_hla(output_dir, filename, dateModified, version, updatedBy,
exptCols, patientCols, sampleCols, downloadCols, saveJsons, verbose, datasetID="hla"):
    # [Static vars] -----------------------------------------------------------------------------------------
    hla_cols = ["A", "A.1", "B", "B.1", "C", "C.1", "DPA1", "DRB4", "DRB4.1", "DRB5","DRB5.1", "DPA1.1", "DPB1", "DPB1.1", "DQA1", "DQA1.1", "DQB1", "DQB1.1", "DRB1", "DRB1.1", "DRB3", "DRB3.1"]

    hla_code = {
        "dateModified": "2019-06-03",
        "version": "https://github.com/andersen-lab/lassa-ebola-hla/commit/ea4f9e10fd569c9a21b06d0ab310a7157f1eedd0",
        "codeRepository": "https://github.com/andersen-lab/lassa-ebola-hla",
        "license": "https://opensource.org/licenses/MIT",
        "creator": helpers.getLabAuthor("KGA")
    }

    today =  datetime.today().strftime('%Y-%m-%d')

    # export files
    dataset_path = f"{output_dir}/datasets/CViSB_v{version}__dataset_HLA_{dateModified}.json"
    download_path = f"{output_dir}/datadownloads/CViSB_v{version}__datadownload_HLA_{dateModified}.json"
    experiments_path = f"{output_dir}/experiments/CViSB_v{version}__experiment_HLA_{dateModified}.json"
    patients_path = f"{output_dir}/patients/CViSB_v{version}__patient_HLA_{dateModified}.json"
    samples_path = f"{output_dir}/samples/CViSB_v{version}__sample_HLA_{dateModified}.json"
    dupes_path = f"{output_dir}/log/inconsistencies/experiments_HLA_duplicates_{dateModified}.csv"

    # [Import HLA dataset] ----------------------------------------------------------------------------------
    df = pd.read_csv(filename)

    # [Check for duplicates] --------------------------------------------------------------------------------
    # Multiple IDs have exactly the same HLA call...
    dupes = df.copy()

    identical_ids = dupes[dupes.duplicated(keep=False, subset=["ID"])]
    if(len(identical_ids) > 0):
        helpers.log_msg(f"\tDATA ERROR: {len(identical_ids)} sequences have identical private patient IDs:", verbose)
        helpers.log_msg(f"\t\t{pd.unique(identical_ids.ID)}", verbose)


    # Replace - with NA
    for col in hla_cols:
        dupes[col].replace(r'\-', np.nan, regex=True, inplace=True)
    # exact_dupes = dupes[dupes.duplicated(keep=False, subset=hla_cols)]

    # Less conservative estimation of duplication:
    # Only looking at first four digits of call, plus sorting
    dupes["simplified_genotype"] = dupes.apply(lambda x: simplifyAllele(x, hla_cols), axis = 1)

    dupes = dupes[dupes.duplicated(keep=False, subset=["simplified_genotype"])]
    if(len(dupes) > 0):
        dupes['duplicate_type'] = "match in first four digits of all alleles"
        dupes.loc[dupes.duplicated(keep=False, subset=hla_cols), "duplicate_type"] = "exact"
        dupes.sort_values("simplified_genotype", inplace=True)

        helpers.log_msg(f"\tDATA WARNING: {len(dupes)} sequences have similar HLA calls. See {dupes_path.split('/')[-1]}", verbose)
        dupes.to_csv(dupes_path, index=False)

    # [Clean IDs, add generic properties] -------------------------------------------------------------------
    # rename columns
    df.rename(columns={'Alternative ID': 'alternateIdentifier'}, inplace=True)

    # Static, common properties
    df['sourceFiles'] = filename.split("/")[-1]
    df['citation'] = None
    df['variableMeasured'] = "HLA genotype"
    df['measurementTechnique'] = "Nucleic Acid Sequencing"
    df['measurementCategory'] = "HLA sequencing"
    df['includedInDataset'] = "hla"
    df['dateModified'] = dateModified
    df['updatedBy'] = updatedBy
    df['correction'] = None
    df['version'] = version

    # Fish out / coerce to schema format.
    df['privatePatientID'] = df.ID.apply(helpers.interpretID)
    df['patientID'] = df.privatePatientID # with new data, HLA data has already been joined w/ public IDs
    df['analysisCode'] = df.apply(lambda x: hla_code, axis = 1)
    df['publisher'] = df["Typing Institution"].apply(helpers.getPublisher)
    df['creator'] = df["Typing Institution"].apply(helpers.getAuthor)
    df['KGH_id'] = df.ID.apply(helpers.checkIDstructure).apply(lambda x: not x)
    df['alternateIdentifier'] = df.patientID.apply(lambda x: [x])

    # standardize categories
    df['outcome'] = df['Outcome'].apply(lambda x: helpers.cleanOutcome(x))
    df['cohort'] = df['Status '].apply(lambda x: helpers.cleanCohort(x))
    df['country'] = df['Location'].apply(lambda x: helpers.getCountry(x))
    df['countryName'] = df.country.apply(lambda x: helpers.getCountryName(x["identifier"]))
    df['location'] = df.country.apply(lambda x: addLocationType(x))
    df['locationPrivate'] = df.location
    df["infectionYear"] = None # just needed for variable listing

    # Check for duplicates
    # dupe_cols =  ["privatePatientID", "ID", "gID", "sID", "cohort", "outcome", "Typing Institution"]
    # # dupe_cols =  ["privatePatientID", "ID", "gID", "sID", "cohort", "outcome", "Typing Institution"]
    # dupe_cols.extend(hla_cols)
    #
    # dupes = df.loc[df.duplicated(subset = ["privatePatientID"], keep=False), dupe_cols].sort_values("privatePatientID")
    # dupes.duplicated(subset=hla_cols)

    # [Conversion for database upload]  ----------------------------------------------------------------------------------------------------
    # experiment-specific properties
    df['experimentID'] = df.apply(lambda x: f"HLA_{x.patientID}", axis=1)
    df['releaseDate'] = today
    df['dataStatus'] = "final"
    # don't exist now...
    df['experimentDate'] = None
    df['visitCode'] = None
    df['batchID'] = None
    df['isControl'] = False

    # sample-specific properties
    df['sampleLabel'] = df.experimentID
    df['sampleType'] = "PBMC"
    df['samplingDate'] = None
    df['creatorInitials'] = f"{(updatedBy.split(' ')[0][0] + updatedBy.split(' ')[1][0]).lower()}"
    df['sampleID'] = df.apply(lambda x: f"{x.creatorInitials}-{x.sampleLabel}_{x.sampleType}", axis = 1)

    # patient-specific properties
    df['species'] = helpers.convertSpecies("human")
    # Note: not technically true; if a KGH patient, could have patient / survivor data.
    # But-- since only uploading the non-KGH patient data, should be fine.
    df['hasPatientData'] = False
    df['hasSurvivorData'] = False


    # [Convert wide --> long dataset]  ----------------------------------------------------------------------------------------------------
    """
    For the /experiment endpoint, convert the wide dataset into a nested object array.
    Expected format:
    {
    data: {
    A: [{"A*300101",	"A*300201"}],
    B: [{"B*420101",	"B*530101"}],
    ...
    }
    }
    Original form:
    {"patientID":"id12","outcome":"control","cohort":"control","country":"Sierra Leone","locus":"A","allele":"A*020101","novel":false},
    """
    longCols = hla_cols.copy()
    longCols.extend(["patientID", "cohort", "outcome"])

    df_long = pd.melt(df[longCols], id_vars=['patientID', "cohort", "outcome"], var_name="locus", value_name="allele")

    df_long['novel'] = df_long.allele.apply(findNovel)
    df_long['locus'] = df_long.locus.apply(cleanLoci)

    # Check all NANs are really nan
    df_long.allele.replace(r'\-', np.nan, regex=True, inplace=True)
    # From 2019-01-09 calls: 1095 '-' + 213 NaNs.
    # Double check no other '-', etc.
    df_long.allele.value_counts(dropna=False)
    df_long['@type'] = "HLAData"

    # Sure there's a less kludgey way to do this, but it gets the job done.
    df_agg = df_long.groupby("patientID").apply(lambda x: x.to_json(orient="records"))
    df_agg = df_agg.reset_index()
    df_agg.rename(columns = {0: 'data'}, inplace = True)
    df_agg['data'] = df_agg.data.apply(lambda x: json.loads(x))
    # Merge allele calls back into the df object.
    df_merged = pd.merge(df, df_agg, how="outer", on="patientID", indicator = True)
    df_merged._merge.value_counts()

# [Pull out data]  ----------------------------------------------------------------------------------------------------
    # Any patient that isn't a KGH patient needs to be added to /patient with any assoicated data.
    patients = df_merged.loc[~df_merged.KGH_id, patientCols]

    expts = df_merged[exptCols]
    samples = df_merged[sampleCols]
    downloads = df_merged.experimentID

    # [Get Dataset .json]  ----------------------------------------------------------------------------------------------------
    countries = helpers.getUnique(df_merged, "country")
    downloadIDs = list(df_merged.experimentID)
    ds = get_hla_dataset(dateModified, downloadIDs, expts, countries, version, datasetID)
    dwnlds = get_hla_downloads(dateModified, downloads, expts, version, datasetID)


    # [Export data]  ----------------------------------------------------------------------------------------------------
    if(saveJsons):
        expts.to_json(expt_path, orient="records")
        # patients
        patients.to_json(patients_path, orient="records")
        # samples
        samples.to_json(samples_path, orient="records")
        # data downloads
        dwnlds.to_json(download_path, orient="records")
        # data downloads
        ds.to_json(dataset_path, orient="records")

    return({ "patient": patients, "sample": samples, "dataset": ds, "datadownload": dwnlds, "experiment": expts })

# [helper functions]  ----------------------------------------------------------------------------------------------------
# # Clean up loci, undefined calls, and novel status
def findNovel(allele):
    loc = str(allele).find("@")
    return(loc > 0)


def cleanLoci(locus):
    return(locus.replace(".1", ""))

def simplifyAllele(row, hla_cols):
    allele = []
    for col in hla_cols:
        if(row[col] == row[col]):
            call = re.match("([A-z]+\d*\*)(\d\d\d\d)(\d*)", row[col])
            if(call):
                allele.append(call[1] + call[2])
    allele.sort()
    return("_".join(allele))

def addLocationType(obj, type = "home"):
    obj["locationType"] = "home"
    return(obj)
