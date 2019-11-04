# @name:        compile_cvisb_data.py
# @summary:     compiles together all data for upload to the CViSB website.
# @description: Pulls in all data from the various data sources across CViSB, in the form of tabular data.
# @sources:
# @depends:     pandas, argparse
# @author:      Laura Hughes
# @email:       lhughes@scripps.edu
# @license:     Apache-2.0
# @date:        31 October 2019
# @use:         python compile_cvisb_data.py # imports / saves all
# @use:         python compile_cvisb_data.py --sources patients hla lassa-viral-seq # only runs compilation for patient data (from Tulane), HLA data (from Andersen lab), Lassa viral sequencing data (from Andersen lab)

import pandas as pd
import argparse
import json

# --- cleanup modules ---
import clean_viral_seq as viralseq
import clean_serology as serology
import clean_hla as hla
import config

"""
Function to call when fed the "types" argument.
Each function should return a dict of form:
{ "patient": [...], "sample": [...], "dataset": [...], "datadownload": [...], "experiment": [...] }
"""
SWITCHER = {
    "patients": lambda: random_msg("patients!!"),
    "hla": lambda:  hla.clean_hla(config.EXPORTDIR, config.HLA_FILE, config.HLA_DATE, config.HLA_VERSION, config.HLA_UPDATEDBY, config.EXPTCOLS, config.PATIENTCOLS, config.SAMPLECOLS, config.DOWNLOADCOLS, config.SAVEINIVIDUAL),
    "systems-serology": lambda: serology.clean_serology(config.EXPORTDIR, config.SEROLOGY_DATE, config.SEROLOGY_VERSION),
    "lassa-viral-seq": lambda: viralseq.clean_viral_seq(config.EXPORTDIR, config.LVIRAL_AAFILE, config.LVIRAL_ALIGNEDFILE,
                                                        config.LVIRAL_RAWFILE, config.LVIRAL_MDFILE, config.ID_DICT,
                                                        config.EXPTCOLS, config.PATIENTCOLS, config.SAMPLECOLS, config.DOWNLOADCOLS,
                                                        config.LVIRAL_DATE, config.LVIRAL_VERSION, config.LVIRAL_UPDATEDBY, config.SAVEINIVIDUAL),
    "ebola-viral-seq": lambda: random_msg("Eviral!!")
}

"""
Compiles together all data after they have been cleaned, compiled, and coerced into
the CViSB data schema format.  After each cleanup function has been called, the data
are saved as a .json to be uploaded.
"""


def compile_data(args):
    print("compiling")
    # empty arrays to hold results
    patients = pd.DataFrame()
    samples = pd.DataFrame()
    datasets = pd.DataFrame()
    datadownloads = pd.DataFrame()
    experiments = pd.DataFrame()

    # clean, then combine.
    for type in args.types:
        print(f"\ncleaning {type}")

        result = call_cleaning(type)
        print(f"\t{len(result['patient'])} patients added.")
        print(f"\t{len(result['sample'])} samples added.")
        print(f"\t{len(result['experiment'])} experiments added.")
        print(f"\t{len(result['dataset'])} datasets added.")
        print(f"\t{len(result['datadownload'])} data downloads added.")

        patients = pd.concat([patients, result["patient"]], ignore_index=True)
        samples = pd.concat([samples, result["sample"]], ignore_index=True)
        experiments = pd.concat(
            [experiments, result["experiment"]], ignore_index=True)
        datasets = pd.concat([datasets, result["dataset"]], ignore_index=True)
        datadownloads = pd.concat(
            [datadownloads, result["datadownload"]], ignore_index=True)

    combined = {"patient": patients, "sample": samples, "dataset": datasets,
                "datadownload": datadownloads, "experiment": experiments}
    # print(combined)

    # --- save jsons ---
    if(args.save):
        saveJson(
            combined['patient'], f"{config.EXPORTDIR}/patients/CViSB__patient_ALL_{config.today}.json")
        saveJson(
            combined['sample'], f"{config.EXPORTDIR}/samples/CViSB__sample_ALL_{config.today}.json")
        saveJson(
            combined['dataset'], f"{config.EXPORTDIR}/datasets/CViSB__dataset_ALL_{config.today}.json")
        saveJson(combined['datadownload'],
                 f"{config.EXPORTDIR}/datadownloads/CViSB__datadownload_ALL_{config.today}.json")
        saveJson(combined['experiment'],
                 f"{config.EXPORTDIR}/experiments/CViSB__experiment_ALL_{config.today}.json")

    # --- save a sample of the data ---
    sample_n = args.export_sample
    if(sample_n > 0):
        if(sample_n < len(combined['patient'])):
            psample = combined['patient'].sample(sample_n)
        else:
            psample = combined['patient']

        if(sample_n < len(combined['sample'])):
            ssample = combined['sample'].sample(sample_n)
        else:
            ssample = combined['sample']

        if(sample_n < len(combined['dataset'])):
            dssample = combined['dataset'].sample(sample_n)
        else:
            dssample = combined['dataset']

        if(sample_n < len(combined['datadownload'])):
            dsample = combined['datadownload'].sample(sample_n)
        else:
            dsample = combined['datadownload']

        if(sample_n < len(combined['experiment'])):
            esample = combined['experiment'].sample(sample_n)
        else:
            esample = combined['experiment']

        saveJson(psample, f"{config.EXPORTDIR}/patients/CViSB__patient-sample_{config.today}.json")
        saveJson(ssample, f"{config.EXPORTDIR}/samples/CViSB__sample-sample_{config.today}.json")
        saveJson(dssample, f"{config.EXPORTDIR}/datasets/CViSB__dataset-sample_{config.today}.json")
        saveJson(dsample, f"{config.EXPORTDIR}/datadownloads/CViSB__datadownload-sample_{config.today}.json")
        saveJson(esample, f"{config.EXPORTDIR}/experiments/CViSB__experiment-sample_{config.today}.json")

    return(combined)


def call_cleaning(type, *args):
    x = SWITCHER.get(type, lambda *_: "ERROR: source type not valid")(*args)
    return(x)


def saveJson(data, export_file):
    # with open(export_file, 'w') as outfile:
        # json.dump(data, outfile)
    data.to_json(export_file, orient="records")


def random_msg(x):
    print(x)
    return({"patient": pd.DataFrame(), "sample": pd.DataFrame(), "dataset": pd.DataFrame(), "datadownload": pd.DataFrame(), "experiment": pd.DataFrame()})


# setup command line argument parser
parser = argparse.ArgumentParser(
    description='Compile together data for CViSB from raw files')
parser.add_argument('--save', '-s', required=False, type=bool, default=True,
                    help='save all combined data as .jsons for upload; True by default')
parser.add_argument('--export-sample', '-e', required=False, type=int, default=0,
                    help='number of records to save a portion of as a test uploade; 0 by default (as in, do not save a sample aside from the full download)')
# parser.add_argument('--output-schema-dir', '-o', required=True, help='output directory containing yaml files in schema.org style with jsonschema validation object embedded in root entity')
# parser.add_argument('--error-file', '-e', required=True, help='path to output error log')
# parser.add_argument('--auth-list-file', '-a', required=True, help='path to output file containing entity authentication information')
# parser.add_argument('--dev', required=False, help='flag indicating that output schema references should be made using the dev server URL', action='store_true')
# parser.add_argument('--verbose','-v', required=False, help='flag to log stuff to terminal', action='store_true')

parser.add_argument("--types", "-t", required=False,
                    # 0 or more values expected => creates a list
                    help="Which source types should be pulled in. Should correspond to the dataset IDs: one of 'patients', 'hla', 'lassa-viral-seq', 'ebola-viral-seq', 'systems-serology'. Multiple types can be specified by separating by a space, and by default all data will be combined.",  nargs="*",
                    type=str, default=["patients", "hla", "lassa-viral-seq", "ebola-viral-seq", "systems-serology"])

if __name__ == '__main__':
    compile_data(parser.parse_args())
