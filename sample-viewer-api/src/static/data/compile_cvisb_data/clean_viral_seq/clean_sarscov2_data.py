import config
import helpers

from datetime  import datetime, timedelta
from os        import path
from itertools import chain

import requests
import csv
import json
import re

today = datetime.today().strftime('%Y-%m-%d')

def create_data():
    data_files = get_metadata_from_gcloud_files()
    metadata   = get_metadata_from_github()

    patients = [
        create_patient(
            patient_id     = patient['ID'],
            patient_source = patient['authors'],
            location       = patient['location'],
            sample_date    = patient['collection_date']
        )
        for patient in metadata
    ]

    experiments    = [create_experiment(patient['patientID'], patient['authors']) for patient   in patients]
    data_downloads = [create_data_download(name, url, [])     for name, url in data_files.items()]
    dataset        = create_dataset(data_downloads)

    output = {
        'patients':       patients,
        'experiments':    experiments,
        'datadownloads':  data_downloads,
        'dataset':        dataset,
    }

    for name, data in output.items():
        if len(data) > 200:
            count = 0
            while count < len(data):
                file_path = path.join(path.dirname(path.abspath(__file__)), 'sarscov2_output', f'{name}{count}.json')
                next_count = count + 200
                if next_count > len(data):
                    next_count = len(data)

                with open(file_path, 'w') as output_file:
                    json.dump(data[count:next_count], output_file)
                count = next_count

        file_path = path.join(path.dirname(path.abspath(__file__)), 'sarscov2_output', f'{name}.json')
        with open(file_path, 'w') as output_file:
            json.dump(data, output_file)

def get_metadata_from_github():
    metadata         = requests.get("https://raw.githubusercontent.com/andersen-lab/HCoV-19-Genomics/master/metadata.csv")
    decoded_metadata = metadata.content.decode('utf-8')

    metadata_csv     = csv.DictReader(decoded_metadata.splitlines(), delimiter=',')

    return metadata_csv

def get_metadata_from_gcloud_files():
    file_path    = path.join(path.dirname(path.abspath(__file__)), 'sarscov2_cloud_files')
    bams_path    = path.join(file_path, 'bam_files.txt')
    fastas_path  = path.join(file_path, 'consensus_files.txt')
    sras_path    = path.join(file_path, 'SraRunTable.csv')
    url_for_file = {}

    with open(sras_path, newline='') as sra_file:
        sra_dict = {remove_location_patient_id(sra['Library Name']): sra['Run']
                    for sra in csv.DictReader(sra_file)}

    with open(bams_path, 'r') as bams_file:
        bams   = {bam.split('/')[-1].strip():   bam.strip()   for bam in bams_file}

    with open(fastas_path, 'r') as fastas_file:
        fastas = {fasta.split('/')[-1].strip(): fasta.strip() for fasta in fastas_file}

    gcloud_url = "https://console.cloud.google.com/storage/browser/_details/andersen-lab_hcov-19-genomics/{cloud_path}"
    sra_url    = "https://www.ncbi.nlm.nih.gov/sra/{sra_id}[accn]"

    for file_name, file_path in chain(bams.items(), fastas.items()):
        sra_id = sra_dict.get(remove_location_patient_id(file_name))

        if sra_id:
            url = sra_url.format(sra_id=sra_id)

        else:
            file_path = file_path.replace('gs://andersen-lab_hcov-19-genomics/', '')
            url = gcloud_url.format(cloud_path=file_path)

        url_for_file[file_name] = url

    return url_for_file

def create_dataset(data_downloads):
    search_alliance = {
        "@type": "Organization",
        "identifier": "SEARCH",
        "url": "https://searchcovid.info/",
        "name": "SEARCH Alliance"
    }

    dataset = {
        '@context':             'http://schema.org/',
        '@type':                'Dataset',
        'identifier':           'sarscov2-virus-seq',
        'creator':              [helpers.getLabAuthor('Kristian')],
        'publisher':            [search_alliance],
        'funding':              helpers.cvisb_funding,
        'license':              'https://creativecommons.org/licenses/by/4.0/',
        'name':                 'SARS-CoV-2 Virus Sequencing',
        'variableMeasured':     'SARS-CoV-2 virus sequence',
        'measurementTechnique': 'Nucleic Acid Sequencing',
        'measurementCategory':  'virus sequencing',
        'includedInDataset':    'sarscov2-virus-seq',
        'description':          'Virus sequencing of patients infected with COVID-19 from Southern California, Tijuana, New Orleans and Jordan by the SEARCH Alliance along with a large number of partners. The virus sequence data will be used to to gain insights into the emergence and spread of SARS-CoV-2. The sequencing is being performed using an amplicon-based sequencing scheme using PrimalSeq with artic nCoV-2019 scheme. Nanopore data was processed using the artic-nCoV019 pipeline with minimap2 and medaka. Illumina data was processed using iVar (Grubaguh et al. Genome Biology 2019) with bwa. Methodology is available at https://github.com/andersen-lab/HCoV-19-Genomics',
        'dateModified':         today,
        'keywords':             ['SARS-CoV-2', 'COVID-19'],
        'dataDownloadIDs':      [dd['identifier'] for dd in data_downloads],
    }

    return dataset

def create_data_download(name, url, experiment_ids):
    datadownload = {
        "includedInDataset":    'sarscov2-virus-seq',
        "identifier":           name,
        "name":                 name,
        "contentUrl":           url,
        "additionalType":       'raw data',
        "variableMeasured":     ['SARS-CoV-2 virus sequence'],
        "measurementTechnique": ['Nucleic Acid Sequencing'],
        "dateModified":         today,
        "experimentIDs":        experiment_ids,
    }

    return datadownload

def create_experiment(patient_id, patient_source):
    experiment =  {
        "experimentID":         patient_id + '-sarscov2',
        "privatePatientID":     patient_id,
        "variableMeasured":     'SARS-CoV-2 virus sequence',
        "measurementTechnique": 'Nucleic Acid Sequencing',
        "includedInDataset":    'sarscov2-virus-seq',
        "dateModified":         today,
        "citation":             [patient_source]
    }

    return experiment

def create_patient(patient_id, patient_source, location, sample_date):
    country, home_location = create_location(location)
    if type(patient_source) == str:
        patient_source = { 'name': patient_source, '@type': 'Organization' }

    patient = {
        "patientID":            patient_id,
        "dateModified":         today,
        "cohort":               'COVID-19',
        "outcome":              'unknown',
        "alternateIdentifier":  [patient_id],
        "infectionYear":        2020,
        'publisher':            helpers.cvisb,
        "citation":             [patient_source],
        "updatedBy":            "Julia Mullen",
        "country":              country,
    }

    try:
        confirm_date = datetime.strptime(sample_date, '%Y-%m-%d')
        week = create_week(confirm_date)
        patient['presentationDate'] = sample_date
        patient['presentationWeek'] = week

    except ValueError:
        # sample_date is not in YYYY-MM-DD format
        pass

    return patient

def create_week(date):
    # considering ISO week -- Monday to Monday
    previous_monday = date + timedelta(days=-date.weekday())
    next_monday     = date + timedelta(days=-date.weekday(), weeks=1)

    upper_bound = "lt"
    lower_bound = "gt"

    if previous_monday == date:
        upper_bound = "lte"
    if next_monday     == date:
        lower_bound = "gte"

    return {
        lower_bound: previous_monday.strftime('%Y-%m-%d'),
        upper_bound: next_monday.strftime('%Y-%m-%d'),
    }

def create_location(location_string):
    COUNTRIES = {
        'MEX':    ('MX', 'Mexico'),
        'USA':    ('US', 'United States'),
        'Jordan': ('JO', 'Jordan'),
    }

    country_indicator = location_string.split('/')[0]
    city              = location_string.split('/')[-1]
    identifier, name  = COUNTRIES[country_indicator]

    country = {'name': name}

    country = {
        "@type": "Country",
        "name":  name,
        "administrativeUnit": 0,
        "administrativeType": "country",
        "identifier": identifier,
        "url": f"https://www.iso.org/obp/ui/#iso:code:3166:{identifier}"
    }

    home_location = {
        "name":  city,
    }
    return country, home_location

PATIENT_ID_REGEX = re.compile('SEARCH-\d+')
def remove_location_patient_id(patient_id):
    # "SEARCH-1380-SAN" -> "SEARCH-1380"

    match = PATIENT_ID_REGEX.search(patient_id)

    if not match:
        return patient_id

    return match.group()

if __name__ == "__main__":
    data = create_data()
