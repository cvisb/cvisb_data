# CViSB data compilation script

## Overview
CViSB data is collected from a variety of sources; these must be combined and standardized to the [CViSB schema](https://data.cvisb.org/schema).

## Inputs
Note: things that should exist but don't currently are listed in parentheses.
### KGH Clinical data
- Acute Lassa patients
- (Acute Ebola patients)
- Ebola survivors + household contacts
- (Lassa survivors + household contacts)
- Acute Lassa/Ebola patient roster
- Survivor patient roster
  #### KGH clinical data outputs:
  - Patient objects
  - Experiment:sequelae objects
  - (Experiment:acuteSymptoms objects)
  - (Experiment:comaScore objects)
  - (Experiment:medications objects)
  - (Experiment:ELISA objects)
  - (Experiment:BloodChemistry objects)
  - (Experiment:Vitals objects)
  - (Experiment:RapidDiagnostics objects)
  - (Experiment:RT-PCR objects)
  - (Dataset:ClinicalMeasurements objects)
  - (DataDownload:ClinicalMeasurements objects)
  - (Dataset:ClinicalObservations objects)
  - (DataDownload:ClinicalObservations objects)

### Lassa/Ebola virus sequencing data: mainly from publications
- Lassa metadata file
- Lassa aligned sequences
- Lassa raw sequences
- Lassa translated amino acid sequences
- Ebola metadata file
- Ebola aligned sequences
- Ebola raw sequences
- Ebola translated amino acid sequences
#### virus sequencing outputs:
  - patients who aren't in KGH registry
  - sample objects, for the patients not in the KGH registry
  - Experiment:(lassa/ebola-)virus-seq objects
  - Dataset:(lassa/ebola-)virus-seq object
  - DataDownload objects

### HLA data
- HLA genotype calls
#### HLA outputs:
  - patients who aren't in KGH registry
  - sample objects, for the patients not in the KGH registry
  - Experiment:HLA objects
  - Dataset:hla object
  - DataDownload objects


## Outputs
1. A dictionary of form:
 ```
 {"patient": <patients>, "sample": <samples>, "dataset": <datasets>, "datadownload": <data downloads>, "experiment": <experiments>}
 ```
2. A series of .jsons to upload to data.cvisb.org: (default; option -s True)
* patients.json --> /patient
* samples.json --> /sample
* experiments.json --> /experiment
* dataset.json --> /dataset
* datadownload.json --> /datadownload

3. A series of the same .jsons, with a sample of size e (when option -e > 0)


## Usage
* `python compile_cvisb_data.py`: imports all files, saves 6 separate .jsons
* `python compile_cvisb_data.py -t patients hla lassa-virus-seq -s False -e 5`:  only runs compilation for patient data (from Tulane), HLA data (from Andersen lab), Lassa virus sequencing data (from Andersen lab), doesn't save the full .jsons, but does save a sample of 5 records for each data type as a .json
