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
        "public_fields": ['derivedIndex', 'protocolVersion', 'protocolURL', 'freezingBuffer', 'species', 'dilutionFactor', 'sampleGroup', 'AVLinactivated', 'dateModified', 'sampleType', 'visitCode', 'patientID'],
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
        "public_fields": ['experimentIDs', 'publication.issueNumber', 'author.contactPoint.email', 'additionalType', 'sourceCode.publication.volumeNumber', 'includedInDataset', 'sourceCode.author.contactPoint.email', 'author.logo', 'publisher.address.addressCountry.url', 'sourceCode.version', 'publisher.address.streetAddress', 'sourceCode.publication.datePublished', 'publication.pageEnd', 'publisher.parentOrganization', 'publication.volumeNumber', 'sourceCode.author.contactPoint.contactType', 'author.email', 'sourceCode.author.email', 'sourceCode.publication.identifier', 'contentUrlIdentifier', 'author.alternateName', 'publisher.address.addressRegion', 'publication.pageStart', 'sourceCode.author.award', 'publisher.url', 'sameAs', 'sourceCode.author.address.streetAddress', 'sourceCode.author.address.addressCountry.url', 'sourceCode.identifier', 'author.contactPoint.contactType', 'sourceCode.author.description', 'sourceCode.citation', 'publication.datePublished', 'author.address.addressCountry.url', 'publisher.name', 'publisher.alternateName', 'publisher.address.addressCountry.alternateName', 'publisher.contactPoint.contactType', 'sourceCode.publication.name', 'sourceCode.author.address.addressCountry.identifier', 'measurementTechnique', 'publication.url', 'sourceCode.name', '@id', 'dateModified', 'sourceCode.author.name', 'sourceCode.author.parentOrganization', 'sourceCode.license', 'author.address.addressCountry.name', 'sourceCode.author.address.postalCode', 'keywords', 'sourceCode.author.address.addressRegion', 'dateCreated', 'sourceCode.publication.issueNumber', 'sourceCode.publication.pageStart', 'isBasedOn', 'author.award', 'description', 'publisher.contactPoint.url', 'sourceCode.author.address.addressCountry.name', 'sourceCode.author.alternateName', 'publisher.address.postalCode', 'sourceCode.description', 'publisher.logo', 'sourceCode.publication.journalName', 'sourceCode.author.url', 'sourceCode.datePublished', 'name', 'sourceCode.dateModified', 'publication.journalName', 'publisher.description', 'encodingFormat', 'identifier', 'author.address.addressLocality', 'author.address.addressCountry.alternateName', 'publisher.award', 'publisher.contactPoint.email', 'author.url', 'datePublished', 'author.contactPoint.url', 'sourceCode.author.contactPoint.url', 'contentUrl', 'publication.identifier', 'author.address.postalCode', 'sourceCode.publication.url', 'sourceCode.codeRepository', 'author.parentOrganization', 'sourceCode.programmingLanguage', 'author.address.addressCountry.identifier', 'sourceCode.@id', 'sourceCode.author.address.addressLocality', 'sourceCode.author.address.addressCountry.alternateName', 'publisher.address.addressCountry.identifier', 'contentUrlRepository', 'author.address.addressRegion', 'publication.name', 'author.name', 'publisher.address.addressCountry.name', 'sourceCode.author.logo', 'author.address.streetAddress', 'sourceCode.publication.pageEnd', 'publisher.address.addressLocality', 'publisher.email', 'author.description'],
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
        "public_fields": ['distribution.sourceCode.license', 'sourceCode.publication.volumeNumber', 'distribution.publication.pageEnd', 'funder.address.addressRegion', 'sourceCode.author.contactPoint.email', 'author.logo', 'sourceCode.version', 'publisher.address.streetAddress', 'distribution.experimentIDs', 'spatialCoverage.identifier', 'sourceCode.author.contactPoint.contactType', 'funder.description', 'distribution.author.parentOrganization', 'sourceCode.author.email', 'distribution.sourceCode.publication.volumeNumber', 'sourceCode.publication.identifier', 'funder.logo', 'publisher.address.addressRegion', 'distribution.sourceCode.author.address.postalCode', 'distribution.sourceCode.datePublished', 'distribution.sourceCode.publication.datePublished', 'distribution.sourceCode.author.address.addressLocality', 'funder.url', 'distribution.sourceCode.name', 'sameAs', 'sourceCode.author.address.streetAddress', 'distribution.author.address.addressCountry.name', 'citation.pageEnd', 'sourceCode.citation', 'author.address.addressCountry.url', 'distribution.sourceCode.author.alternateName', 'distribution.sourceCode.author.address.streetAddress', 'publisher.contactPoint.contactType', 'distribution.sameAs', 'citation.pageStart', 'sourceCode.author.address.addressCountry.identifier', 'distribution.publisher.contactPoint.email', 'distribution.sourceCode.publication.issueNumber', 'sourceCode.name', 'distribution.isBasedOn', 'dateModified', 'distribution.sourceCode.author.award', 'distribution.author.email', 'sourceCode.author.name', 'sourceCode.author.parentOrganization', 'sourceCode.license', 'temporalCoverage.lt', 'author.address.addressCountry.name', 'sourceCode.author.address.postalCode', 'distribution.author.logo', 'distribution.author.name', 'distribution.author.address.addressCountry.identifier', 'distribution.publication.pageStart', 'sourceCode.publication.pageStart', 'citation.datePublished', 'distribution.publisher.address.streetAddress', 'author.award', 'distribution.sourceCode.publication.url', 'distribution.publisher.address.addressCountry.alternateName', 'funder.address.addressCountry.url', 'publisher.contactPoint.url', 'distribution.description', 'citation.volumeNumber', 'distribution.publisher.alternateName', 'publisher.address.postalCode', 'sourceCode.description', 'sourceCode.publication.journalName', 'distribution.measurementTechnique', 'url', 'author.description', 'distribution.sourceCode.author.parentOrganization', 'sourceCode.datePublished', 'citation.url', 'name', 'funder.address.addressCountry.identifier', 'sourceCode.dateModified', 'publisher.description', 'author.address.addressCountry.alternateName', 'distribution.dateModified', 'distribution.publisher.description', 'distribution.sourceCode.author.contactPoint.contactType', 'author.url', 'author.contactPoint.url', 'funder.address.streetAddress', 'distribution.publisher.award', 'temporalCoverage.gte', 'temporalCoverage.gt', 'sourceCode.codeRepository', 'funder.award', 'spatialCoverage.alternateName', 'sourceCode.programmingLanguage', 'distribution.sourceCode.identifier', 'author.address.addressCountry.identifier', 'distribution.author.address.addressCountry.url', 'sourceCode.@id', 'distribution.contentUrl', 'distribution.publication.datePublished', 'sourceCode.author.address.addressCountry.alternateName', 'distribution.sourceCode.dateModified', 'publisher.address.addressCountry.name', 'author.name', 'variableMeasured', 'distribution.publication.identifier', 'distribution.datePublished', 'distribution.sourceCode.author.address.addressCountry.alternateName', 'author.address.streetAddress', 'distribution.publisher.name', 'distribution.@id', 'distribution.sourceCode.author.description', 'sourceCode.author.address.addressCountry.url', 'funder.parentOrganization', 'schemaVersion', 'distribution.sourceCode.publication.identifier', 'citation.issueNumber', 'distribution.author.address.addressCountry.alternateName', 'distribution.author.alternateName', 'author.contactPoint.email', 'distribution.sourceCode.author.address.addressRegion', 'citation.journalName', 'distribution.publisher.logo', 'distribution.author.address.addressRegion', 'distribution.publisher.address.addressCountry.name', 'distribution.sourceCode.publication.journalName', 'publisher.address.addressCountry.url', 'distribution.publication.issueNumber', 'distribution.sourceCode.citation', 'temporalCoverage.lte', 'sourceCode.publication.datePublished', 'funder.address.addressCountry.alternateName', 'publisher.parentOrganization', 'author.email', 'distribution.contentUrlRepository', 'distribution.sourceCode.author.url', 'distribution.publication.url', 'distribution.encodingFormat', 'funder.alternateName', 'author.alternateName', 'distribution.sourceCode.publication.pageStart', 'distribution.publisher.url', 'distribution.sourceCode.version', 'sourceCode.author.award', 'distribution.sourceCode.publication.pageEnd', 'distribution.name', 'publisher.url', 'distribution.sourceCode.author.address.addressCountry.name', 'funder.address.addressLocality', 'distribution.sourceCode.author.contactPoint.email', 'distribution.publisher.address.addressRegion', 'distribution.publisher.address.addressLocality', 'distribution.publication.name', 'author.contactPoint.contactType', 'distribution.publisher.parentOrganization', 'sourceCode.identifier', 'sourceCode.author.description', 'publisher.name', 'publisher.alternateName', 'publisher.address.addressCountry.alternateName', 'distribution.publication.journalName', 'distribution.additionalType', 'distribution.sourceCode.programmingLanguage', 'funder.address.addressCountry.name', 'distribution.sourceCode.@id', 'distribution.sourceCode.description', 'sourceCode.publication.name', 'distribution.dateCreated', 'distribution.publisher.address.addressCountry.url', 'measurementTechnique', 'spatialCoverage.url', 'includedInDataCatalog', 'funder.address.postalCode', '@id', 'distribution.publication.volumeNumber', 'publication', 'keywords', 'funder.contactPoint.url', 'distribution.publisher.address.postalCode', 'sourceCode.author.address.addressRegion', 'sourceCode.publication.issueNumber', 'distribution.author.address.postalCode', 'distribution.author.address.streetAddress', 'distribution.author.contactPoint.url', 'distribution.publisher.contactPoint.url', 'distribution.author.contactPoint.contactType', 'description', 'sourceCode.author.address.addressCountry.name', 'funder.contactPoint.contactType', 'distribution.sourceCode.author.contactPoint.url', 'sourceCode.author.alternateName', 'publisher.logo', 'funder.email', 'distribution.publisher.address.addressCountry.identifier', 'funder.contactPoint.email', 'distribution.publisher.contactPoint.contactType', 'sourceCode.author.url', 'distribution.contentUrlIdentifier', 'distribution.sourceCode.author.address.addressCountry.identifier', 'distribution.keywords', 'distribution.sourceCode.publication.name', 'citation.identifier', 'citation.name', 'distribution.author.award', 'identifier', 'author.address.addressLocality', 'distribution.identifier', 'publisher.award', 'publisher.contactPoint.email', 'distribution.sourceCode.author.address.addressCountry.url', 'datePublished', 'distribution.author.contactPoint.email', 'license', 'distribution.sourceCode.codeRepository', 'sourceCode.author.contactPoint.url', 'distribution.publisher.email', 'author.address.postalCode', 'distribution.sourceCode.author.email', 'sourceCode.publication.url', 'distribution.includedInDataset', 'distribution.sourceCode.author.name', 'distribution.author.url', 'sourceCode.author.address.addressLocality', 'dataDownloadIDs', 'publisher.address.addressCountry.identifier', 'distribution.sourceCode.author.logo', 'author.address.addressRegion', 'distribution.author.description', 'distribution.author.address.addressLocality', 'sourceCode.author.logo', 'sourceCode.publication.pageEnd', 'publisher.address.addressLocality', 'spatialCoverage.name', 'publisher.email', 'author.parentOrganization', 'funder.name'],
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
        "public_fields": ['publication.issueNumber', 'data.accelerometry.x', 'analysisCode.publication.volumeNumber', 'analysisCode.author.alternateName', 'data.oxygenSaturation', 'analysisCode.description', 'analysisCode.author.url', 'data.alanineAminotransferase', 'data.SNPdetected', 'analysisCode.author.description', 'publisher.address.streetAddress', 'publication.volumeNumber', 'analysisCode.publication.issueNumber', 'data.DRB1', 'GenBank_ID', 'publisher.address.addressRegion', 'analysisCode.publication.pageEnd', 'data.potassium', 'analysisCode.publication.datePublished', 'publication.pageStart', 'analysisCode.author.address.addressCountry.identifier', 'data.z', 'data.DRB4', 'publication.datePublished', 'data.DPB1', 'data.DQA1', 'data.AAsequence', 'data.SNP.SNP', 'data.aspatateAminotransferase', 'data.SNP.originalAA', 'analysisCode.author.address.addressRegion', 'publisher.contactPoint.contactType', 'data.accelerometry.z', 'data.meanArterialPressure.meanArterialPressure', 'batchID', 'analysisCode.programmingLanguage', 'publication.url', 'data.daysSinceAdmit', 'data.DNAsequence', 'dateModified', 'data.bodyTemperature.time', 'data.virus', 'analysisCode.author.name', 'data.DQB1', 'patientID', 'data.B', 'analysisCode.license', 'data.SNPlocation', 'analysisCode.citation', 'data.sodium', 'data.x', 'data.ECG.voltage', 'data.albumin', 'analysisCode.publication.url', 'data.systolicPressure', 'analysisCode.identifier', 'analysisCode.author.address.addressLocality', 'publisher.contactPoint.url', 'data.respiratoryRate.time', 'analysisCode.publication.name', 'publisher.address.postalCode', 'analysisCode.author.email', 'name', 'data.heartRate.time', 'publisher.description', 'data.skinTemperature', 'data.SNP.SNPlocation', 'data.SNP', 'data.systolicPressure.time', 'data.diastolicPressure.diastolicPressure', 'publication.identifier', 'data.creatinine', 'data.originalAA', 'analysisCode.author.parentOrganization', 'data.glucose', 'data.totalCarbonDioxide', 'data.diastolicPressure', 'experimentID', 'publisher.address.addressCountry.name', 'data.totalProtein', 'analysisCode.author.address.addressCountry.alternateName', 'analysisCode.author.address.postalCode', 'data.oxygenSaturation.oxygenSaturation', 'data.heartRate', 'data.time', 'publication.journalName', 'analysisCode.author.address.addressCountry.url', 'data.systolicPressure.systolicPressure', 'data.A', 'analysisCode.author.contactPoint.email', 'SRA_ID', 'analysisCode.author.award', 'data.accelerometry.time', 'publisher.address.addressCountry.url', 'data.bodyTemperature', 'data.DRB3', 'data.DPA1', 'data.bodyTemperature.bodyTemperature', 'data.C', 'publication.pageEnd', 'publisher.parentOrganization', 'data.chloride', 'experimentDate', 'analysisCode.@id', 'data.heartRate.heartRate', 'publisher.url', 'data.SNP.SNPdetected', 'data.oxygenSaturation.time', 'analysisCode.publication.identifier', 'data.y', 'data.ECG.time', 'publisher.name', 'publisher.alternateName', 'publisher.address.addressCountry.alternateName', 'analysisCode.version', 'data.totalBilirubin', 'data.mutatedAA', 'analysisCode.datePublished', 'analysisCode.publication.pageStart', 'measurementTechnique', 'analysisCode.codeRepository', 'analysisCode.author.logo', 'analysisCode.author.contactPoint.contactType', 'data.diastolicPressure.time', 'data.respiratoryRate.respiratoryRate', 'data.voltage', 'analysisCode.dateModified', 'data.isReferenceSeq', 'analysisCode.author.address.addressCountry.name', 'description', 'data.skinTemperature.time', 'data.timepoint', 'data.referenceSeq', 'data.calcium', 'publisher.logo', 'data.alkalinePhosphatase', 'data.meanArterialPressure.time', 'analysisCode.name', 'analysisCode.publication.journalName', 'publisher.award', 'publisher.contactPoint.email', 'analysisCode.author.address.streetAddress', 'data.SNP.mutatedAA', 'analysisCode.author.contactPoint.url', 'data.DRB5', 'data.accelerometry.y', 'data.meanArterialPressure', 'data.skinTemperature.skinTemperature', 'publisher.address.addressCountry.identifier', 'data.bloodUreaNitrogen', 'publication.name', 'data.respiratoryRate', 'publisher.address.addressLocality', 'publisher.email'],
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
        "public_fields": ['elisa.virus', 'symptoms.symptoms.noSymptoms', 'country.identifier', 'symptoms.symptoms.RUQtenderness', 'piccolo.piccolo.muscle_pain', 'symptoms.symptoms.confusion', 'symptoms.symptoms.facialSwelling', 'pregnant', 'piccolo.piccolo.RUQtenderness', 'piccolo.piccolo.bleeding_none', 'symptoms.symptoms.crepitations', 'symptoms.symptoms.seizures', 'piccolo.piccolo.eye_foreign_body_sensation', 'symptoms.symptoms.headache', 'rtpcr.RTPCRresult', 'infectionDate.lt', 'symptoms.symptoms.bleeding_sputum', 'medications.doseUnits', 'symptoms.symptoms.eye_foreign_body_sensation', 'rapidDiagostics.virus', 'sameAs', 'piccolo.piccolo.back_pain', 'symptoms.symptoms.disorientation', 'piccolo.piccolo.blurry_vision', 'piccolo.piccolo.light_sensitivity', 'piccolo.piccolo.dyspnea', 'piccolo.piccolo.dizziness', 'piccolo.piccolo.diarrhea', 'symptoms.symptoms.bleeding_nose', 'daysInHospital', 'outcome', 'dateModified', 'infectionYear', 'symptoms.symptoms.burning_eyes', 'piccolo.piccolo.splenomegaly', 'symptoms.symptoms.side_pain', 'symptoms.symptoms.bleeding_gums', 'piccolo.piccolo.disorientation', 'symptoms.symptoms.light_sensitivity', 'piccolo.piccolo.otherSymptoms', 'patientID', 'symptoms.timepoint', 'symptoms.symptoms.bleeding_other', 'weight', 'piccolo.piccolo.inflammation', 'piccolo.piccolo.lymphadenopathy', 'symptoms.symptoms.decreasedUrination', 'piccolo.piccolo.confusion', 'infectionDate.gte', 'piccolo.piccolo.convulsions', 'piccolo.piccolo.rash', 'piccolo.piccolo.hepatomegaly', 'symptoms.symptoms.hearing_loss', 'comaScore.motorResponse', 'symptoms.symptoms.cough', 'symptoms.symptoms.bleeding_hematoma', 'symptoms.symptoms.bleeding_vaginal', 'piccolo.piccolo.bleeding_hematoma', 'age', 'symptoms.symptoms.ringing_in_ears', 'symptoms.symptoms.rash', 'medications.doseDuration', 'medications.drug', 'symptoms.symptoms.hiccups', 'symptoms.symptoms.blurry_vision', 'symptoms.symptoms.bleeding_stools', 'piccolo.piccolo.conjunctivitis', 'symptoms.symptoms.otherSymptoms', 'symptoms.symptoms.fever', 'LassaHHDeaths', 'piccolo.piccolo.facialSwelling', 'symptoms.symptoms.shortnessBreath', 'piccolo.piccolo.bleeding_sputum', 'piccolo.piccolo.retrosternal_pain', 'medications.doseFrequency', 'piccolo.piccolo.abdominal_pain', 'symptoms.symptoms.splenomegaly', 'piccolo.piccolo.bleeding_vomit', 'piccolo.piccolo.other_pain', 'comaScore.daysSinceAdmit', 'piccolo.piccolo.fever', 'piccolo.piccolo.vomit', 'symptoms.symptoms.other_pain', 'rtpcr.virus', 'rtpcr.viralLoad', 'symptoms.symptoms.joint_pain', 'piccolo.piccolo.decreasedUrination', 'daysOnset', 'piccolo.piccolo.bleeding_nose', 'piccolo.piccolo.tremors', 'piccolo.piccolo.crepitations', 'gender', 'contactGroupIdentifier', 'country.alternateName', 'piccolo.piccolo.bleeding_stools', 'symptoms.symptoms.bleeding_injection', 'symptoms.symptoms.retrosternal_pain', 'symptoms.symptoms.hepatomegaly', 'elisa.ELISAresult', 'symptoms.symptoms.dizziness', 'piccolo.piccolo.rales', 'symptoms.symptoms.vision_loss', 'piccolo.piccolo.jointSwelling', 'piccolo.piccolo.side_pain', 'piccolo.piccolo.bleeding_injection', 'piccolo.piccolo.malaise', 'rtpcr.RTPCRvalue', 'piccolo.piccolo.bleeding_gums', 'symptoms.symptoms.abdominal_pain', 'elisa.timepoint', 'infectionDate.lte', 'symptoms.symptoms.lymphadenopathy', 'country.url', 'symptoms.symptoms.convulsions', 'symptoms.symptoms.soreThroat', 'symptoms.symptoms.dyspnea', 'LassaExposed', 'rapidDiagostics.RDTresult', 'medications.daysSinceAdmit', 'comaScore.verbalResponse', 'cohort', 'symptoms.symptoms.tremors', 'symptoms.symptoms.weakness', 'country.name', 'medications.drugRoute', 'symptoms.symptoms.jaundice', 'height', 'relatedTo', 'infectionDate.gt', 'symptoms.symptoms.jointSwelling', 'piccolo.piccolo.appetiteLoss', 'piccolo.piccolo.bleeding_urine', 'symptoms.symptoms.dry_eyes', 'piccolo.piccolo.shortnessBreath', 'piccolo.piccolo.ringing_in_ears', 'symptoms.symptoms.abdominalTenderness', 'symptoms.symptoms.bleeding_urine', 'symptoms.symptoms.inflammation', 'comaScore.glasgowComaScore', 'admittedLassaWard', 'symptoms.symptoms.bleeding_vomit', 'piccolo.piccolo.abdominalTenderness', 'piccolo.piccolo.bleeding_other', 'piccolo.piccolo.noSymptoms', 'piccolo.piccolo.hearing_loss', 'piccolo.piccolo.edema', 'piccolo.piccolo.bleeding_vaginal', 'piccolo.piccolo.burning_eyes', 'piccolo.piccolo.dry_eyes', 'comaScore.eyeOpening', 'symptoms.symptoms.appetiteLoss', 'piccolo.piccolo.cough', 'piccolo.piccolo.vision_loss', 'piccolo.piccolo.headache', 'elisa.assayType', 'symptoms.symptoms.eye_pain', 'medications.doseNumeric', 'symptoms.symptoms.back_pain', 'piccolo.piccolo.joint_pain', 'symptoms.symptoms.rales', 'piccolo.piccolo.hiccups', 'symptoms.symptoms.malaise', 'piccolo.piccolo.eye_pain', 'symptoms.symptoms.muscle_pain', 'symptoms.symptoms.bleeding_none', 'elisa.ELISAvalue', 'symptoms.symptoms.diarrhea', 'symptoms.daysSinceAdmit', 'piccolo.timepoint', 'piccolo.daysSinceAdmit', 'piccolo.piccolo.weakness', 'piccolo.piccolo.jaundice', 'symptoms.symptoms.edema', 'symptoms.symptoms.vomit', 'symptoms.symptoms.conjunctivitis', 'piccolo.piccolo.seizures', 'piccolo.piccolo.soreThroat'],
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
        "public_fields": ['dataset', 'keywords', 'funder.contactPoint.url', 'funder.address.addressRegion', 'publisher.address.addressCountry.url', 'alternateName', 'funder.address.addressCountry.url', 'temporalCoverage.lte', 'description', 'publisher.address.streetAddress', 'publisher.contactPoint.url', 'spatialCoverage.identifier', 'publisher.parentOrganization', 'funder.address.addressCountry.alternateName', 'funder.description', 'funder.contactPoint.contactType', 'publisher.address.postalCode', 'publisher.logo', 'funder.email', 'funder.alternateName', 'releaseVersion', 'funder.logo', 'publisher.address.addressRegion', 'url', 'funder.contactPoint.email', 'funder.address.addressCountry.identifier', 'name', 'publisher.description', 'identifier', 'publisher.url', 'funder.url', 'publisher.award', 'publisher.contactPoint.email', 'funder.address.addressLocality', 'datePublished', 'funder.address.streetAddress', 'sameAs', 'funder.parentOrganization', 'temporalCoverage.gte', 'temporalCoverage.gt', 'publisher.name', 'publisher.alternateName', 'publisher.address.addressCountry.alternateName', 'spatialCoverage.alternateName', 'funder.award', 'funder.address.addressCountry.name', 'publisher.contactPoint.contactType', 'publisher.address.addressCountry.identifier', 'spatialCoverage.url', 'publisher.address.addressCountry.name', 'funder.address.postalCode', '@id', 'dateModified', 'publisher.address.addressLocality', 'spatialCoverage.name', 'temporalCoverage.lt', 'publisher.email', 'schemaVersion', 'funder.name'],
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
