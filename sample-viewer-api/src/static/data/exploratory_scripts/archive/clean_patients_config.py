# <<< config.py >>>
# @name:        config.py
# @summary:     config file to assemble CViSB patient roster
# @description: stores file names, other constants for import/merging/checking of CViSB patient info.
# @inputs:      none
# @outputs:     constant vars...
# @author:      Laura Hughes, lhughes@scripps.edu
# @dateModified: 3 April 2019

from datetime import datetime

# [ primary data file names ] -----------------------------------------------------------------------------

# acute patient roster, containing public patient IDs ("study specific numbers")
input_lassaAcute_ids = "../input_data/patient_rosters/acuteLassa_IDdict_v1_2019-03-27_PRIVATE.xlsx"

# acute Lassa data, containing demographics, ELISA results, etc. for suspected Lassa cases at KGH
input_lassaAcute = "../input_data/patient_rosters/acuteLassa_metadata_v2_2019-06-12_PRIVATE.csv"
# input_lassaAcute = "../input_data/patient_rosters/acuteLassa_metadata_v1_2019-03-27_PRIVATE.csv"

# survivor patient roster, containing public patient IDs ("study specific numbers")
input_survivor_ids = "../input_data/patient_rosters/survivor_IDdict_v2_2019-03-06_PRIVATE.xlsx"

# ebola survivor data, containing demographics, ELISA results, etc. for Ebola survivors and contacts tracked by KGH
input_ebolaSurvivor = "../input_data/patient_rosters/ebolaSurvivors_metadata_v2_2019-03-13_PRIVATE.xlsx"

# [ CViSB known patient roster ] --------------------------------------------------------------------------
# List of samples/patients that we either have samples for or have data for, as of March 2019
# Used to get a sense of weird IDs and coverage of metadata, etc.
input_cvisb_roster = "../input_data/cvisb_random_rosters/CViSB_knownpatients_cleaned_PRIVATE.json"

input_extra_ids = "../input_data/patient_rosters/additional_IDdict_v3_2019-10-23.csv"


# [ output directories, names ] ------------------------------------------------------------------------------------
output_dir = "../output_data/patients"
inconsistencies_dir = f"{output_dir}/inconsistencies"
today = datetime.today().strftime('%Y-%m-%d')

output_patients = f"{output_dir}/patients_{today}_PRIVATE"

output_allSurvivors = f"{output_dir}/survivors_cleaned_{today}_PRIVATE"
output_survivorRoster = f"{output_dir}/survivorsRoster_cleaned_{today}_PRIVATE"
output_survivorRosterWeirdos = f"{inconsistencies_dir}/survivorsRoster_inconsistencies_{today}_PRIVATE"
output_ebolaSurvivor = f"{output_dir}/ebolaSurvivors_cleaned_{today}_PRIVATE"
output_ebolaSurvivorWeirdos = f"{inconsistencies_dir}/ebolaSurvivors_inconsistencies_{today}_PRIVATE"

output_lassaAcute = f"{output_dir}/lassaAcute_cleaned_{today}_PRIVATE"
output_lassaAcuteWeirdos = f"{inconsistencies_dir}/lassaAcute_inconsistencies_{today}_PRIVATE"
output_lassaAcute_ids = f"{output_dir}/lassaAcuteIDs_cleaned_{today}_PRIVATE"
output_lassaAcuteWeirdos_ids = f"{inconsistencies_dir}/lassaAcuteIDs_inconsistencies_{today}_PRIVATE"
output_extraIDs_weirdos = f"{inconsistencies_dir}/extraIDs_inconsistencies_{today}_PRIVATE"

# [ Columns to export ] -----------------------------------------------------------------------------------
# sans dates, temporarily
export_cols = ['patientID', 'alternateIdentifier', 'gID', 'sID', 'cohort', 'outcome',
               'age', 'gender', 'country', 'occupation', 'pregnant', 'homeLocation', 'exposureLocation', 'admin2',
               'survivorEvalDates', 'survivorEnrollmentDate',
               'contactGroupIdentifier', 'contactSurvivorRelationship', 'exposureType', 'relatedTo', 'relatedToPrivate',
               'evalDate', 'dischargeDate', 'daysOnset', 'daysInHospital', 'symptoms', 'infectionDate', 'infectionYear',
               'elisa', 'dateModified', 'species', 'sourceFiles', 'publisher', 'correction']

dict_cols = ["patientID", "gID", "sID", "publicGID", "publicSID", "cohort", "outcome", "alternateIdentifier",
             'evalDate', 'dischargeDate', 'daysOnset', 'infectionDate',
             "age", "gender", "countryName", "elisa", "issue"]
