CVISB_DEFAULT_SETTINGS = {
    'index': {
        'number_of_shards': '10',
        'auto_expand_replicas': '0-all',
        'number_of_replicas': '0'
    }
}

CVISB_ENDPOINTS = {
    "sample": {
        "cache_key": "Sample",
        "private_index": "sample_metadata_current",
        "public_index": "sample_metadata_public_current",
        "public_fields":['location.numAliquots', 'location.freezerID', 'location.lab', 'sampleGroup', 'alternateIdentifier', 'dilutionFactor', 'derivedIndex', 'protocolURL', 'updatedBy', 'sampleLabel', 'location.freezerBoxCell', 'protocolVersion', 'sampleType', 'AVLinactivated', 'privatePatientID', 'visitCode', 'isolationDate', 'description', 'species', 'location.updatedBy', 'location.freezerRack', 'dateModified', 'freezingBuffer', 'location.freezerBox', 'sampleID', 'name', 'location.dateModified', 'patientID'], 
        "elasticsearch_public_index_body": {
            "settings": CVISB_DEFAULT_SETTINGS,
            "mappings": {
                "sample": {
                    "dynamic": "true",
                    "dynamic_date_formats": ["yyyy-MM-dd"]
                }
            }
        },
        "elasticsearch_private_index_body": {
            "settings": CVISB_DEFAULT_SETTINGS,
            "mappings": {
                "sample": {
                    "dynamic": "true",
                    "dynamic_date_formats": ["yyyy-MM-dd"]
                }
            }
        }
    },
    "datadownload": {
        "cache_key": "DataDownload",
        "private_index": "datadownload_metadata_current",
        "public_index": "datadownload_metadata_public_current",
        "public_fields":['publisher.name', 'publisher.address.addressCountry.url', 'sourceCode.@id', 'sourceCode.author.address.addressCountry.identifier', 'sourceCode.author.contactPoint.contactType', 'publisher.address.addressLocality', 'author.address.addressCountry.identifier', 'sourceCode.author.parentOrganization', 'publisher.contactPoint.email', 'publisher.email', 'citation.name', 'author.logo', 'citation.url', 'sourceCode.author.address.addressCountry.alternateName', 'citation.issueNumber', 'datePublished', 'sourceCode.author.additionalName', 'sourceCode.citation.url', 'dateModified', 'sourceCode.author.logo', 'sameAs', 'sourceCode.author.address.addressRegion', 'publisher.logo', 'measurementTechnique', 'author.alternateName', 'sourceCode.author.name', 'isBasedOn', 'sourceCode.citation.author.name', 'sourceCode.citation.doi', 'author.contactPoint.contactType', 'dateCreated', '@id', 'sourceCode.datePublished', 'sourceCode.identifier', 'sourceCode.programmingLanguage', 'citation.datePublished', 'updatedBy', 'citation.author.name', 'publisher.url', 'author.contactPoint.url', 'publisher.address.addressCountry.name', 'experimentIDs', 'contentUrlRepository', 'encodingFormat', 'sourceCode.author.contactPoint.url', 'description', 'sourceCode.version', 'sourceCode.citation.pageStart', 'publisher.alternateName', 'publisher.description', 'sourceCode.citation.pmid', 'sourceCode.author.contactPoint.email', 'sourceCode.citation.name', 'name', 'sourceCode.citation.pageEnd', 'sourceCode.license', 'sourceCode.citation.journalNameAbbrev', 'sourceCode.author.alternateName', 'sourceCode.author.address.addressCountry.url', 'author.contactPoint.email', 'publisher.address.addressRegion', 'identifier', 'citation.journalName', 'citation.pageStart', 'citation.pageEnd', 'citation.author.familyName', 'publisher.address.addressCountry.alternateName', 'citation.pmid', 'sourceCode.citation.volumeNumber', 'citation.author.givenName', 'citation.issn', 'contentUrlIdentifier', 'citation.pagination', 'publisher.address.postalCode', 'author.address.streetAddress', 'publisher.parentOrganization', 'sourceCode.dateModified', 'sourceCode.citation.journalName', 'citation.author.additionalName', 'sourceCode.citation.issueNumber', 'author.address.addressCountry.name', 'author.address.addressCountry.alternateName', 'publisher.address.addressCountry.identifier', 'publisher.contactPoint.url', 'sourceCode.author.givenName', 'author.address.addressCountry.url', 'sourceCode.citation.author.additionalName', 'citation.identifier', 'author.email', 'sourceCode.author.address.addressCountry.name', 'sourceCode.author.email', 'author.url', 'sourceCode.description', 'sourceCode.author.description', 'author.address.addressLocality', 'keywords', 'author.parentOrganization', 'sourceCode.author.address.addressLocality', 'sourceCode.author.address.postalCode', 'publisher.address.streetAddress', 'sourceCode.codeRepository', 'citation.journalNameAbbrev', 'sourceCode.citation.datePublished', 'sourceCode.citation.issn', 'sourceCode.name', 'contentUrl', 'citation.doi', 'sourceCode.author.address.streetAddress', 'includedInDataset', 'sourceCode.author.url', 'sourceCode.citation.identifier', 'sourceCode.citation.pagination', 'author.address.postalCode', 'additionalType', 'sourceCode.author.familyName', 'sourceCode.citation.author.givenName', 'sourceCode.citation.author.familyName', 'author.name', 'author.description', 'citation.volumeNumber', 'author.address.addressRegion', 'publisher.contactPoint.contactType'], 
        "elasticsearch_public_index_body": {
            "settings": CVISB_DEFAULT_SETTINGS,
            "mappings": {
                "datadownload": {
                    "dynamic": "true",
                    "dynamic_date_formats": ["yyyy-MM-dd"]
                }
            }
        },
        "elasticsearch_private_index_body": {
            "settings": CVISB_DEFAULT_SETTINGS,
            "mappings": {
                "datadownload": {
                    "dynamic": "true",
                    "dynamic_date_formats": ["yyyy-MM-dd"]
                }
            }
        }
    },
    "dataset": {
        "cache_key": "Dataset",
        "private_index": 'dataset_metadata_current',
        "public_index": 'dataset_metadata_public_current',
        "public_fields": ['distribution.sourceCode.citation.journalNameAbbrev', 'funding.funder.address.addressCountry.identifier', 'publisher.address.addressCountry.url', 'schemaVersion', 'distribution.sourceCode.citation.identifier', 'distribution.publisher.address.addressCountry.alternateName', 'distribution.sourceCode.version', 'author.address.addressCountry.identifier', 'sourceCode.author.parentOrganization', 'publisher.email', 'author.logo', 'citation.url', 'funding.funder.contactPoint.url', 'funding.funder.url', 'distribution.sourceCode.author.address.postalCode', 'citation.issueNumber', 'distribution.sourceCode.author.address.addressCountry.alternateName', 'sourceCode.author.additionalName', 'sourceCode.citation.url', 'dateModified', 'sameAs', 'sourceCode.author.address.addressRegion', 'publisher.logo', 'measurementTechnique', 'distribution.citation.pmid', 'distribution.sourceCode.author.parentOrganization', 'sourceCode.citation.author.name', 'funding.funder.address.addressCountry.name', 'sourceCode.citation.doi', 'distribution.includedInDataset', 'distribution.citation.author.name', 'distribution.sourceCode.author.familyName', 'sourceCode.datePublished', 'spatialCoverage.name', 'distribution.sourceCode.citation.author.familyName', 'sourceCode.programmingLanguage', 'updatedBy', 'citation.datePublished', 'citation.author.name', 'distribution.author.address.addressCountry.identifier', 'author.contactPoint.url', 'distribution.citation.pageEnd', 'distribution.author.contactPoint.url', 'distribution.citation.author.additionalName', 'funding.funder.contactPoint.email', 'sourceCode.author.contactPoint.url', 'sourceCode.version', 'distribution.author.description', 'publisher.alternateName', 'distribution.sourceCode.author.email', 'sourceCode.citation.pageStart', 'sourceCode.citation.pmid', 'distribution.dateModified', 'name', 'distribution.citation.datePublished', 'sourceCode.author.contactPoint.email', 'sourceCode.citation.name', 'sourceCode.citation.journalNameAbbrev', 'funding.funder.address.addressCountry.url', 'distribution.citation.volumeNumber', 'author.contactPoint.email', 'distribution.author.address.postalCode', 'sourceCode.author.contactPoint.contactType', 'sourceCode.author.address.addressCountry.url', 'funding.identifier', 'funding.funder.address.streetAddress', 'distribution.sourceCode.author.description', 'distribution.sourceCode.author.address.addressCountry.url', 'distribution.citation.journalNameAbbrev', 'citation.pageStart', 'publisher.address.addressCountry.alternateName', 'distribution.sourceCode.citation.issueNumber', 'distribution.publisher.parentOrganization', 'citation.author.familyName', 'distribution.sourceCode.author.address.addressLocality', 'spatialCoverage.url', 'sourceCode.citation.volumeNumber', 'distribution.sourceCode.author.url', 'funding.funder.parentOrganization', 'funding.funder.email', 'spatialCoverage.identifier', 'distribution.sourceCode.citation.journalName', 'distribution.sourceCode.author.logo', 'url', 'funding.funder.alternateName', 'includedInDataCatalog', 'publisher.parentOrganization', 'distribution.sourceCode.author.address.addressCountry.identifier', 'distribution.author.address.streetAddress', 'author.address.addressCountry.alternateName', 'publisher.address.addressCountry.identifier', 'distribution.sourceCode.author.additionalName', 'funding.funder.address.addressLocality', 'distribution.sourceCode.author.contactPoint.contactType', 'sourceCode.citation.author.additionalName', 'distribution.sourceCode.identifier', 'distribution.sourceCode.citation.author.name', 'sourceCode.author.address.addressCountry.name', 'distribution.publisher.address.addressLocality', 'author.url', 'sourceCode.description', 'author.address.addressLocality', 'distribution.publisher.address.postalCode', 'author.parentOrganization', 'distribution.sourceCode.citation.pagination', 'temporalCoverage.gt', 'distribution.author.url', 'temporalCoverage.gte', 'publisher.address.streetAddress', 'distribution.additionalType', 'distribution.identifier', 'distribution.publisher.contactPoint.contactType', 'distribution.sourceCode.dateModified', 'sourceCode.name', 'distribution.sourceCode.citation.author.additionalName', 'temporalCoverage.lt', 'distribution.measurementTechnique', 'distribution.author.contactPoint.email', 'sourceCode.author.url', 'distribution.citation.doi', 'sourceCode.citation.pagination', 'citation.volumeNumber', 'distribution.datePublished', 'distribution.publisher.address.addressCountry.identifier', 'sourceCode.citation.author.givenName', 'distribution.citation.url', 'author.name', 'distribution.sourceCode.citation.doi', 'author.description', 'distribution.sourceCode.author.contactPoint.url', 'author.address.addressRegion', 'distribution.citation.issn', 'distribution.publisher.contactPoint.email', 'publisher.contactPoint.contactType', 'publisher.url', 'distribution.encodingFormat', 'distribution.citation.author.familyName', 'sourceCode.citation.identifier', 'publisher.name', 'citation.doi', 'distribution.publisher.address.addressCountry.url', 'funding.funder.address.postalCode', 'sourceCode.@id', 'sourceCode.author.address.addressCountry.identifier', 'distribution.publisher.alternateName', 'distribution.citation.identifier', 'distribution.citation.name', 'distribution.author.name', 'distribution.author.contactPoint.contactType', 'publisher.address.addressLocality', 'distribution.publisher.address.streetAddress', 'distribution.sourceCode.name', 'distribution.publisher.description', 'publisher.contactPoint.email', 'distribution.sourceCode.description', 'distribution.citation.journalName', 'distribution.author.address.addressRegion', 'dataDownloadIDs', 'distribution.sourceCode.citation.pageEnd', 'distribution.publisher.address.addressRegion', 'sourceCode.author.address.addressCountry.alternateName', 'citation.name', 'funding.funder.logo', 'distribution.publisher.email', 'sourceCode.author.logo', 'funding.funder.contactPoint.contactType', 'distribution.dateCreated', 'sourceCode.author.name', 'author.alternateName', 'distribution.sourceCode.citation.url', 'distribution.experimentIDs', 'distribution.updatedBy', 'funding.funder.name', 'distribution.sourceCode.author.contactPoint.email', 'author.contactPoint.contactType', 'distribution.author.parentOrganization', 'distribution.publisher.url', 'license', 'distribution.sourceCode.citation.volumeNumber', 'funding.funder.address.addressRegion', '@id', 'sourceCode.identifier', 'distribution.sourceCode.programmingLanguage', 'publisher.address.addressCountry.name', 'distribution.sourceCode.license', 'temporalCoverage.lte', 'distribution.publisher.contactPoint.url', 'distribution.sameAs', 'description', 'distribution.sourceCode.author.name', 'publisher.description', 'distribution.sourceCode.author.address.addressRegion', 'distribution.name', 'sourceCode.citation.pageEnd', 'funding.funder.description', 'distribution.sourceCode.author.address.addressCountry.name', 'sourceCode.license', 'sourceCode.author.alternateName', 'distribution.author.address.addressCountry.name', 'distribution.author.alternateName', 'distribution.author.address.addressCountry.alternateName', 'distribution.sourceCode.citation.author.givenName', 'publisher.address.addressRegion', 'identifier', 'distribution.sourceCode.citation.datePublished', 'distribution.isBasedOn', 'distribution.author.address.addressLocality', 'distribution.publisher.logo', 'citation.journalName', 'citation.pageEnd', 'distribution.publisher.name', 'citation.pmid', 'distribution.contentUrl', 'distribution.sourceCode.citation.pmid', 'citation.author.givenName', 'distribution.sourceCode.author.alternateName', 'citation.issn', 'publisher.address.postalCode', 'sourceCode.dateModified', 'citation.pagination', 'author.address.streetAddress', 'variableMeasured', 'distribution.citation.pagination', 'distribution.citation.pageStart', 'sourceCode.citation.journalName', 'citation.author.additionalName', 'sourceCode.citation.issueNumber', 'author.address.addressCountry.name', 'publisher.contactPoint.url', 'distribution.author.logo', 'distribution.sourceCode.citation.pageStart', 'distribution.citation.issueNumber', 'sourceCode.author.givenName', 'author.address.addressCountry.url', 'distribution.citation.author.givenName', 'sourceCode.citation.author.familyName', 'citation.identifier', 'author.email', 'distribution.description', 'distribution.@id', 'distribution.sourceCode.codeRepository', 'sourceCode.author.email', 'distribution.author.email', 'distribution.contentUrlIdentifier', 'sourceCode.author.description', 'distribution.sourceCode.author.givenName', 'distribution.sourceCode.citation.issn', 'keywords', 'distribution.sourceCode.author.address.streetAddress', 'sourceCode.author.address.addressLocality', 'sourceCode.author.address.postalCode', 'citation.journalNameAbbrev', 'distribution.author.address.addressCountry.url', 'sourceCode.citation.datePublished', 'sourceCode.citation.issn', 'distribution.sourceCode.datePublished', 'sourceCode.author.address.streetAddress', 'distribution.sourceCode.@id', 'author.address.postalCode', 'funding.funder.address.addressCountry.alternateName', 'distribution.keywords', 'distribution.publisher.address.addressCountry.name', 'spatialCoverage.alternateName', 'sourceCode.author.familyName', 'distribution.contentUrlRepository', 'distribution.sourceCode.citation.name', 'datePublished', 'sourceCode.codeRepository'],
        "elasticsearch_private_index_body": {
            "settings": CVISB_DEFAULT_SETTINGS,
            "mappings": {
                "dataset": {
                    "dynamic": "true",
                    "dynamic_date_formats": ["yyyy-MM-dd"],
                    "dynamic_templates": [
                        {
                            "temporalCoverageDateRange": {
                                "path_match": "temporalCoverage",
                                "mapping": {
                                    "dynamic": "false",
                                    "format": "yyyy-MM-dd",
                                    "type": "date_range"
                                }
                            }
                        }
                    ]
                }
            }
        },
        "elasticsearch_public_index_body": {
            "settings": CVISB_DEFAULT_SETTINGS,
            "mappings": {
                "dataset": {
                    "dynamic": "true",
                    "dynamic_date_formats": ["yyyy-MM-dd"],
                    "dynamic_templates": [
                        {
                            "temporalCoverageDateRange": {
                                "path_match": "temporalCoverage",
                                "mapping": {
                                    "dynamic": "false",
                                    "format": "yyyy-MM-dd",
                                    "type": "date_range"
                                }
                            }
                        }
                    ]
                }
            }
        }
    },
    "experiment": {
        "cache_key": "Experiment",
        "private_index": 'experiment_metadata_current',
        "public_index": 'experiment_metadata_public_current',
        "public_fields":['data.virus', 'data.DNAsequence', 'data.referenceSeq', 'data.isReferenceSeq', 'data.AAsequence', 'data.SNP', 'data.allele', 'data.cohort', 'data.locus', 'data.novel', 'data.outcome', 'data.patientID',
'analysisCode.citation.name', 'publisher.name', 'analysisCode.author.address.addressCountry.url', 'analysisCode.version', 'publisher.address.addressCountry.url', 'analysisCode.programmingLanguage', 'analysisCode.author.additionalName', 'analysisCode.citation.pageStart', 'publisher.address.addressLocality', 'analysisCode.author.logo', 'analysisCode.name', 'analysisCode.author.address.addressCountry.identifier', 'publisher.contactPoint.email', 'publisher.email', 'citation.name', 'analysisCode.author.address.streetAddress', 'analysisCode.author.address.addressRegion', 'citation.url', 'analysisCode.citation.url', 'analysisCode.author.url', 'analysisCode.author.address.addressCountry.alternateName', 'analysisCode.citation.issueNumber', 'batchID', 'citation.issueNumber', 'analysisCode.citation.doi', 'analysisCode.author.alternateName', 'analysisCode.author.contactPoint.contactType', 'dateModified', 'analysisCode.citation.pagination', 'publisher.logo', 'measurementTechnique', 'sraID', 'patientID', 'analysisCode.@id', 'analysisCode.citation.journalName', 'analysisCode.citation.volumeNumber', 'analysisCode.identifier', 'updatedBy', 'citation.datePublished', 'citation.author.name', 'analysisCode.author.givenName', 'analysisCode.author.familyName', 'publisher.address.addressCountry.name', 'analysisCode.citation.author.name', 'privatePatientID', 'genbankID', 'analysisCode.datePublished', 'description', 'publisher.alternateName', 'publisher.description', 'name', 'analysisCode.author.address.addressLocality', 'analysisCode.author.parentOrganization', 'analysisCode.citation.journalNameAbbrev', 'publisher.address.addressRegion', 'citation.journalName', 'citation.pageStart', 'citation.pageEnd', 'analysisCode.citation.author.familyName', 'publisher.address.addressCountry.alternateName', 'citation.author.familyName', 'citation.pmid', 'analysisCode.citation.author.givenName', 'citation.author.givenName', 'citation.issn', 'analysisCode.author.address.postalCode', 'publisher.address.postalCode', 'citation.pagination', 'publisher.parentOrganization', 'analysisCode.citation.datePublished', 'analysisCode.citation.pageEnd', 'analysisCode.dateModified', 'citation.author.additionalName', 'publisher.address.addressCountry.identifier', 'publisher.contactPoint.url', 'analysisCode.citation.author.additionalName', 'sampleID', 'analysisCode.author.name', 'citation.identifier', 'experimentID', 'experimentDate', 'publisher.contactPoint.contactType', 'publisher.address.streetAddress', 'citation.journalNameAbbrev', 'analysisCode.citation.pmid', 'analysisCode.author.contactPoint.url', 'analysisCode.codeRepository', 'citation.doi', 'analysisCode.author.address.addressCountry.name', 'analysisCode.description', 'analysisCode.author.description', 'analysisCode.citation.identifier', 'analysisCode.author.email', 'analysisCode.license', 'analysisCode.citation.issn', 'citation.volumeNumber', 'analysisCode.author.contactPoint.email', 'publisher.url'], 
        "elasticsearch_private_index_body": {
            "settings": CVISB_DEFAULT_SETTINGS,
            "mappings": {
                "experiment": {
                    "dynamic": "true",
                    "dynamic_date_formats": ["yyyy-MM-dd"]
                }
            }
        },
        "elasticsearch_public_index_body": {
            "settings": CVISB_DEFAULT_SETTINGS,
            "mappings": {
                "experiment": {
                    "dynamic": "true",
                    "dynamic_date_formats": ["yyyy-MM-dd"]
                }
            }
        }
    },
    "patient": {
        "cache_key": "Patient",
        "public_index": 'patient_metadata_public_current',
        "private_index": 'patient_metadata_current',
        "public_fields": ['exposureType', 'presentationWeek.gt', 'infectionDate.lt', 'symptoms.symptoms.other_symptoms', 'updateNotes.updatedBy', 'gender', 'symptoms.symptoms.bleeding_other', 'ethnicity', 'cohort', 'symptoms.daysSinceAdmit', 'country.alternateName', 'symptoms.symptoms.lymphadenopathy', 'gID', 'dateModified', 'homeLocation.administrativeUnit', 'pregnant', 'patientID', 'medications.doseDuration', 'symptoms.symptoms.bleeding_vomit', 'rtpcr.virus', 'symptoms.symptoms.tremors', 'age', 'symptoms.symptoms.confusion', 'medications.doseUnits', 'relatedTo', 'symptoms.symptoms.blurry_vision', 'admittedLassaWard', 'presentationWeek.lt', 'hasSurvivorData', 'survivorEnrollmentDate', 'symptoms.symptoms.convulsions', 'rtpcr.RTPCRvalue', 'updatedBy', 'homeLocation.alternateName', 'sID', 'updateNotes.dateModified', 'comaScore.daysSinceAdmit', 'medications.doseFrequency', 'symptoms.symptoms.hearing_loss', 'dischargeDate', 'updateNotes.notes', 'symptoms.symptoms.splenomegaly', 'admin2.name', 'country.url', 'symptoms.symptoms.eye_foreign_body_sensation', 'symptoms.symptoms.bleeding_stools', 'admin2.identifier', 'medications.daysSinceAdmit', 'symptoms.symptoms.joint_pain', 'admin2.alternateName', 'symptoms.symptoms.vomit', 'medications.dateAdministered', 'country.name', 'symptoms.symptoms.edema', 'infectionDate.gte', 'symptoms.symptoms.eye_pain', 'symptoms.symptoms.dry_eyes', 'symptoms.symptoms.abdominal_tenderness', 'symptoms.symptoms.weakness', 'symptoms.symptoms.RUQtenderness', 'homeLocation.name', 'infectionYear', 'symptoms.symptoms.rash', 'symptoms.symptoms.retrosternal_pain', 'deathDate', 'symptoms.symptoms.joint_swelling', 'comaScore.eyeOpening', 'symptoms.symptoms.side_pain', 'comaScore.verbalResponse', 'outcome', 'daysOnset', 'admin2.administrativeType', 'symptoms.symptoms.malaise', 'symptoms.symptoms.seizures', 'height', 'symptoms.symptoms.abdominal_pain', 'symptoms.symptoms.bleeding_injection', 'symptoms.symptoms.decreased_urination', 'admin2.administrativeUnit', 'admin3.alternateName', 'symptoms.symptoms.conjunctivitis', 'presentationWeek.lte', 'symptoms.symptoms.vision_loss', 'daysInHospital', 'symptoms.symptoms.bleeding_nose', 'symptoms.symptoms.dizziness', 'symptoms.symptoms.bleeding_urine', 'symptoms.symptoms.burning_eyes', 'admin3.administrativeType', 'weight', 'symptoms.symptoms.jaundice', 'homeLocation.administrativeType', 'updateNotes.updatedVariables', 'symptoms.symptoms.no_symptoms', 'admitDate', 'relatedToPrivate', 'comaScore.glasgowComaScore', 'medications.drugRoute', 'symptoms.symptoms.bleeding_vaginal', 'symptoms.symptoms.sore_throat', 'infectionDate.lte', 'rtpcr.RTPCRresult', 'occupation', 'symptoms.symptoms.diarrhea', 'evalDate', 'symptoms.symptoms.hiccups', 'symptoms.symptoms.bleeding_gums', 'symptoms.symptoms.disorientation', 'symptoms.symptoms.bleeding_sputum', 'comaScore.motorResponse', 'admin3.administrativeUnit', 'contactGroupIdentifier', 'symptoms.symptoms.rales', 'symptoms.symptoms.crepitations', 'symptoms.symptoms.facial_swelling', 'species', 'symptoms.symptoms.light_sensitivity', 'symptoms.symptoms.muscle_pain', 'symptoms.symptoms.hepatomegaly', 'LassaExposed', 'symptoms.symptoms.bleeding_hematoma', 'symptoms.symptoms.cough', 'medications.doseNumeric', 'symptoms.symptoms.other_pain', 'rtpcr.viralLoad', 'alternateIdentifier', 'symptoms.symptoms.dyspnea', 'symptoms.symptoms.ringing_in_ears', 'admin3.identifier', 'rapidDiagostics.virus', 'infectionDate.gt', 'presentationWeek.gte', 'contactSurvivorRelationship', 'symptoms.symptoms.fever', 'symptoms.symptoms.appetite_loss', 'symptoms.symptoms.shortness_breath', 'symptoms.symptoms.inflammation', 'LassaHHDeaths', 'survivorEvalDates', 'symptoms.symptoms.headache', 'symptoms.symptoms.bleeding_none', 'medications.drug', 'admin3.name', 'homeLocation.identifier', 'country.identifier', 'symptoms.timepoint', 'hasPatientData', 'symptoms.symptoms.back_pain', 'rapidDiagostics.RDTresult'], 
        "elasticsearch_private_index_body": {
            "settings": CVISB_DEFAULT_SETTINGS,
            "mappings": {
                "patient": {
                    'dynamic': 'true',
                    'dynamic_date_formats': ['yyyy-MM-dd'],
                    'dynamic_templates': [
                        {
                            'infectionDateRange': {
                                'path_match': 'infectionDate',
                                'mapping': {
                                    'dynamic': 'false',
                                    'format': 'yyyy-MM-dd',
                                    'type': 'date_range'
                                }
                            }
                        },
                        #{
                        #    'infectionYearRange': {
                        #        'path_match': 'infectionYear',
                        #        'mapping': {
                        #            'dynamic': 'false',
                        #            'format': 'yyyy-MM-dd',
                        #            'type': 'date_range'
                        #        }
                        #    }
                        #},
                        {
                            'elisaNested': {
                                'path_match': 'elisa',
                                'mapping': {
                                    'dynamic': 'true',
                                    'type': 'nested'
                                }
                            }
                        }
                    ]
                }
            }
        },
        "elasticsearch_public_index_body": {
            "settings": CVISB_DEFAULT_SETTINGS,
            "mappings": {
                "patient": {
                    'dynamic': 'true',
                    'dynamic_date_formats': ['yyyy-MM-dd'],
                    'dynamic_templates': [
                        {
                            'infectionDateRange': {
                                'path_match': 'infectionDate',
                                'mapping': {
                                    'dynamic': 'false',
                                    'format': 'yyyy-MM-dd',
                                    'type': 'date_range'
                                }
                            }
                        },
                        #{
                        #    'infectionYearRange': {
                        #        'path_match': 'infectionYear',
                        #        'mapping': {
                        #            'dynamic': 'false',
                        #            'format': 'yyyy-MM-dd',
                        #            'type': 'date_range'
                        #        }
                        #    }
                        #},
                        {
                            'elisaNested': {
                                'path_match': 'elisa',
                                'mapping': {
                                    'dynamic': 'true',
                                    'type': 'nested'
                                }
                            }
                        }
                    ]
                }
            }
        }
    },
    "datacatalog": {
        "cache_key": "DataCatalog",
        "private_index": 'datacatalog_metadata_current',
        "public_index": 'datacatalog_metadata_public_current',
        "public_fields": ['funding.funder.address.addressCountry.identifier', 'funding.identifier', 'publisher.name', 'publisher.address.addressRegion', 'funding.funder.address.streetAddress', 'identifier', 'publisher.address.addressCountry.url', 'funding.funder.address.postalCode', 'schemaVersion', 'dataset', 'publisher.address.addressCountry.alternateName', 'funding.funder.parentOrganization', 'spatialCoverage.url', 'publisher.address.addressLocality', 'funding.funder.email', 'publisher.contactPoint.email', 'publisher.email', 'spatialCoverage.identifier', 'funding.funder.contactPoint.url', 'url', 'publisher.address.postalCode', 'publisher.parentOrganization', 'funding.funder.alternateName', 'funding.funder.url', 'funding.funder.logo', 'dateModified', 'funding.funder.contactPoint.contactType', 'publisher.address.addressCountry.identifier', 'sameAs', 'publisher.contactPoint.url', 'funding.funder.address.addressLocality', 'publisher.logo', 'funding.funder.address.addressCountry.name', 'funding.funder.name', 'keywords', 'funding.funder.address.addressRegion', '@id', 'temporalCoverage.gt', 'alternateName', 'temporalCoverage.gte', 'spatialCoverage.name', 'publisher.address.streetAddress', 'releaseVersion', 'updatedBy', 'publisher.url', 'temporalCoverage.lt', 'publisher.address.addressCountry.name', 'temporalCoverage.lte', 'funding.funder.contactPoint.email', 'funding.funder.address.addressCountry.alternateName', 'description', 'publisher.alternateName', 'publisher.description', 'spatialCoverage.alternateName', 'funding.funder.description', 'name', 'funding.funder.address.addressCountry.url', 'datePublished', 'publisher.contactPoint.contactType'],
        "elasticsearch_private_index_body": {
            "settings": CVISB_DEFAULT_SETTINGS,
            "mappings": {
                'datacatalog': {
                    'dynamic': 'true',
                    'dynamic_date_formats': ['yyyy-MM-dd'],
                    'dynamic_templates': [
                        {
                            'temporalCoverageDateRange': {
                                'path_match': 'temporalCoverage',
                                'mapping': {
                                    'dynamic': 'false',
                                    'format': 'yyyy-MM-dd',
                                    'type': 'date_range'
                                }
                            }
                        }
                    ]
                }
            }
        },
        "elasticsearch_public_index_body": {
            "settings": CVISB_DEFAULT_SETTINGS,
            "mappings": {
                'datacatalog': {
                    'dynamic': 'true',
                    'dynamic_date_formats': ['yyyy-MM-dd'],
                    'dynamic_templates': [
                        {
                            'temporalCoverageDateRange': {
                                'path_match': 'temporalCoverage',
                                'mapping': {
                                    'dynamic': 'false',
                                    'format': 'yyyy-MM-dd',
                                    'type': 'date_range'
                                }
                            }
                        }
                    ]
                }
            }
        }
    }
}
