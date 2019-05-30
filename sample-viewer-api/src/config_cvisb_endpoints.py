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
        "index": 'sample_metadata_current',
        "private_index": "sample_metadata_current",
        "public_index": "sample_metadata_public_current",
        "public_permitted_search_fields": ['AVLinactivated', 'protocolURL', 'derivedIndex', 'freezingBuffer', 'species', 'dateModified', 'dilutionFactor', 'patientID', 'sampleType', 'protocolVersion', 'visitCode', 'sampleGroup'],
        "public_excluded_return_fields": ['location.*', 'description', 'alternateIdentifier', 'updatedBy', 'privatePatientID', 'sampleLabel', 'isolationDate', 'sampleID', 'name'],
        "private_fields": ['location.*', 'description', 'alternateIdentifier', 'updatedBy', 'privatePatientID', 'sampleLabel', 'isolationDate', 'sampleID', 'name'],
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
        "index": 'datadownload_metadata_current',
        "private_index": "datadownload_metadata_current",
        "public_index": "datadownload_metadata_public_current",
        "public_permitted_search_fields": ['measurementTechnique', 'publication.*', 'dateCreated', 'sameAs', 'dateModified', 'sourceCode.*', 'contentUrlRepository', 'datePublished', 'includedInDataset', 'keywords', 'contentUrlIdentifier', 'contentUrl', 'name', 'description', 'identifier', '@id', 'encodingFormat', 'experimentIDs', 'author.*', 'additionalType', 'isBasedOn', 'publisher.*'],
        "public_excluded_return_fields": ['updatedBy'],
        "private_fields": ['updatedBy'],
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
        "index": 'dataset_metadata_current',
        "private_index": 'dataset_metadata_current',
        "public_index": 'dataset_metadata_public_current',
        "public_permitted_search_fields": ['variableMeasured', 'measurementTechnique', 'publication.*', 'sameAs', 'spatialCoverage.*', 'dateModified', 'sourceCode.*', 'license', 'funder.*', 'datePublished', 'url', 'schemaVersion', 'keywords', 'name', 'includedInDataCatalog', 'description', 'citation', 'identifier', '@id', 'author.*', 'dataDownloadIDs', 'temporalCoverage.*', 'publisher.*'],
        "public_excluded_return_fields": ['updatedBy'],
        "private_fields": ['updatedBy'],
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
        "index": 'experiment_metadata_current',
        "private_index": 'experiment_metadata_current',
        "public_index": 'experiment_metadata_public_current',
        "public_permitted_search_fields": ['experimentID', 'description', 'measurementTechnique', 'publication.*', 'SRA_ID', 'dateModified', 'GenBank_ID', 'analysisCode.*', 'patientID', 'publisher.*', 'name', 'batchID', 'experimentDate', 'data.*'],
        "public_excluded_return_fields": ['sampleID', 'privatePatientID', 'updatedBy'],
        "private_fields": ['sampleID', 'privatePatientID', 'updatedBy'],
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
        "index": 'patient_metadata_current',
        "public_index": 'patient_metadata_public_current',
        "private_index": 'patient_metadata_current',
        "public_permitted_search_fields": ['daysInHospital', 'symptoms.*', 'associatedSamples', 'age', 'relatedTo', 'gender', 'sameAs', 'infectionYear', 'dateModified', 'rtpcr.*', 'availableData.*', 'patientID', 'daysOnset', 'outcome', 'cohort', 'elisa.*', 'country.*', 'rapidDiagostics.*', 'contactGroupIdentifier'],
        "public_excluded_return_fields": ['updatedBy', 'alternateIdentifier', 'homeLocation.*', 'contactSurvivorRelationship', 'infectionDate.*', 'evalDate', 'admitDate', 'updateNotes.*', 'dischargeDate', 'relatedToPrivate', 'sID', 'exposureType', 'gID'],
        "private_fields": ['updatedBy', 'alternateIdentifier', 'homeLocation.*', 'contactSurvivorRelationship', 'infectionDate.*', 'evalDate', 'admitDate', 'updateNotes.*', 'dischargeDate', 'relatedToPrivate', 'sID', 'exposureType', 'gID'],
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
        "index": 'datacatalog_metadata_current',
        "private_index": 'datacatalog_metadata_current',
        "public_index": 'datacatalog_metadata_public_current',
        "public_permitted_search_fields": ['dataset', 'schemaVersion', 'description', 'keywords', 'identifier', '@id', 'alternateName', 'sameAs', 'temporalCoverage.*', 'spatialCoverage.*', 'dateModified', 'funder.*', 'publisher.*', 'name', 'datePublished', 'url'],
        "public_excluded_return_fields": ['updatedBy'],
        "private_fields": ['updatedBy'],
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
