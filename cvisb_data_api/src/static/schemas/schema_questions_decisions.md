List of decisions / questions
# Patient
- [x] age: create a separate "age" property, or use the in-built birthYear (recognizing the calculation will be potentially inaccurate)? Went w/ age b/c age already calc'd and more relevant for modelling (?)
  * sticking w/ age; dates seem too problematic.
- [x] Could lump Ebola/Lassa into `healthCondition` -- meant to be `MedicalCondition` type w/ associated
  * sticking w/ `cohort`-- too complicated to make definitive diagnosis, etc.
- [ ] Should we make District/Chiefdom/Village more explicit than 3 separate Admin Areas?
- [x] Case type = index, sample only, contact, dead on arrival, other
  * decide to ignore for the moment and wrap into patient_type = control, survivor, contact, dead
- [ ] Any values we need to protect: ethnicity, location, dates, ...?
  * Is it going to be a problem having sample IDs with dates in them?
- [x] Which patient metadata to track with ever patient?
  * preliminarily decided w/ Matthais 2018-10-10
- [x] (cyrus) ELISA: ELISA_IgG_Ebola = true or ElISA = [{type: "IgG", antigen: "Ebola", value: true}, ...]
  * created subclass schema for ELISA, RDT, RT-PCR
- [ ] (experimentalists / cyrus) store all ELISA values over time, or any(positive)?
- [ ] What to do with Piccolo, PhysIQ data?
  * separate dataset?
- [ ] What to do with other random data, like caseType, ethnicity, date of last entry?
- [ ] nix death date?
- [ ] date of admission for survivors?  -- change to date of first sample?  Complicated for survivors who have G-num
- [ ] Able to get Patient/Survivor ID for contacts? (should be number matched?)

# Dataset
* How do versioning ?
* datePublished or dateCreated?
* generate DOI / identifier?
* include
  * license ?
  * citation ?
  * funder ?
  * list of patient/sample ids in dataset? or store in data files?
* rename DataDownload since derived?
* create a cvisb:SoftwareSourceCode?

# DataDownload
* - [x]  list of patient_ids, or list of Patients?
  * not decide for now; depends on UX for input and search mechanism.
  * temporarily: allow string[] or Patient[]
* want to search by patient ID, sample ID, or both?
* schema:Enumeration: encodeformat for BAM, etc.
* author/publisher only on dataset, not datadownload?
* keywords or additionalType?

# Sample
* Merge in patient data-- how?  Need all?
* Make patient_id = Patient?
* standardize format to Chunlei-esque

# Software
* Create own version of SoftwareSourceCode? Right now, just a filter, not extension.

# Experiment
## General
* include Patients in addition to Sample?

# General
* Date enforcement: specify yyyy-mm-dd, yyyy-mm, yyyy (range) allowed?
* Versioning for schema / datafiles? When/how?
* Labs: how named?
* HOW TO STITCH ALL THIS TOGETHER??
