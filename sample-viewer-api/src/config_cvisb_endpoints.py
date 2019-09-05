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
        "public_fields": ['derivedIndex', 'sampleGroup', 'species', 'protocolURL', 'sampleType', 'protocolVersion', 'visitCode', 'dateModified', 'freezingBuffer', 'AVLinactivated', 'dilutionFactor', 'samplingDate'],
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
        "public_fields": ['dateCreated', 'publisher.address.addressCountry.alternateName', 'citation.author.familyName', 'sourceCode.citation.journalNameAbbrev', 'dateModified', 'citation.author.givenName', 'sourceCode.author.email', 'sourceCode.author.alternateName', 'citation.author.name', 'sourceCode.author.address.addressCountry.alternateName', 'sourceCode.codeRepository', 'sourceCode.author.parentOrganization', 'citation.datePublished', 'sourceCode.author.contactPoint.url', 'author.address.postalCode', 'sourceCode.author.contactPoint.contactType', 'sourceCode.author.address.addressRegion', 'sourceCode.author.logo', 'publisher.description', 'author.url', 'name', 'publisher.contactPoint.url', 'author.contactPoint.contactType', 'citation.DOI', 'author.address.addressCountry.alternateName', 'citation.issn', 'author.contactPoint.email', 'publisher.address.addressRegion', 'sourceCode.@id', 'publisher.address.addressCountry.url', 'sourceCode.author.url', 'sourceCode.description', 'sourceCode.citation.issn', 'author.name', 'sourceCode.license', 'sourceCode.datePublished', 'author.address.addressRegion', 'sourceCode.identifier', 'author.address.addressCountry.name', 'sourceCode.citation.DOI', 'sourceCode.citation.author.additionalName', 'contentUrlRepository', 'sourceCode.author.address.streetAddress', 'publisher.address.postalCode', 'sourceCode.author.name', 'measurementTechnique', 'includedInDataset', 'description', 'citation.url', 'author.logo', 'sourceCode.author.familyName', 'sourceCode.citation.journalName', 'sourceCode.name', 'publisher.address.streetAddress', 'citation.author.additionalName', 'publisher.address.addressCountry.name', 'publisher.email', 'citation.identifier', 'sourceCode.programmingLanguage', 'sourceCode.citation.author.name', 'sourceCode.citation.PMID', 'additionalType', 'author.address.addressLocality', 'publisher.url', 'author.description', 'contentUrlIdentifier', 'experimentIDs', 'author.contactPoint.url', 'keywords', 'contentUrl', 'identifier', 'citation.pageStart', 'sourceCode.author.contactPoint.email', 'citation.issueNumber', 'sourceCode.citation.datePublished', 'author.address.addressCountry.identifier', 'publisher.address.addressLocality', 'sourceCode.author.givenName', 'publisher.name', 'publisher.parentOrganization', 'sourceCode.author.additionalName', 'sourceCode.author.address.addressLocality', 'sourceCode.citation.url', 'publisher.alternateName', 'citation.volumeNumber', 'author.email', 'publisher.logo', 'author.alternateName', 'sourceCode.citation.volumeNumber', 'citation.journalName', 'sourceCode.author.address.addressCountry.url', 'sourceCode.citation.author.familyName', 'isBasedOn', 'author.parentOrganization', 'sourceCode.citation.name', 'encodingFormat', 'publisher.contactPoint.contactType', 'sourceCode.author.address.addressCountry.name', '@id', 'sourceCode.citation.pageStart', 'sourceCode.dateModified', 'sourceCode.citation.author.givenName', 'citation.journalNameAbbrev', 'sourceCode.citation.issueNumber', 'sourceCode.author.description', 'sourceCode.author.address.postalCode', 'sourceCode.citation.pageEnd', 'citation.name', 'publisher.address.addressCountry.identifier', 'sourceCode.citation.identifier', 'datePublished', 'sourceCode.version', 'citation.PMID', 'citation.pageEnd', 'sourceCode.author.address.addressCountry.identifier', 'publisher.contactPoint.email', 'author.address.addressCountry.url', 'author.address.streetAddress', 'sameAs'],
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
        "public_fields": ['sourceCode.citation.journalNameAbbrev', 'citation.author.familyName', 'dateModified', 'distribution.sourceCode.citation.author.familyName', 'distribution.author.url', 'citation.author.givenName', 'spatialCoverage.name', 'temporalCoverage.lt', 'license', 'sourceCode.author.alternateName', 'sourceCode.author.address.addressCountry.alternateName', 'distribution.author.address.addressLocality', 'dataDownloadIDs', 'distribution.sourceCode.author.givenName', 'distribution.sameAs', 'distribution.sourceCode.author.address.addressCountry.alternateName', 'sourceCode.author.parentOrganization', 'distribution.sourceCode.citation.pageEnd', 'distribution.sourceCode.author.alternateName', 'distribution.sourceCode.codeRepository', 'sourceCode.author.contactPoint.url', 'distribution.sourceCode.citation.issn', 'funding.funder.address.addressCountry.identifier', 'distribution.citation.author.additionalName', 'sourceCode.author.contactPoint.contactType', 'distribution.sourceCode.identifier', 'sourceCode.author.address.addressRegion', 'publisher.description', 'author.url', 'name', 'publisher.contactPoint.url', 'author.contactPoint.contactType', 'distribution.sourceCode.author.name', 'author.contactPoint.email', 'sourceCode.author.url', 'citation.issn', 'publisher.address.addressCountry.url', 'author.name', 'distribution.experimentIDs', 'distribution.sourceCode.author.familyName', 'distribution.sourceCode.citation.identifier', 'sourceCode.datePublished', 'distribution.sourceCode.name', 'distribution.sourceCode.citation.pageStart', 'funding.funder.description', 'distribution.dateCreated', 'distribution.sourceCode.author.url', 'distribution.sourceCode.datePublished', 'sourceCode.citation.author.additionalName', 'distribution.sourceCode.citation.author.givenName', 'distribution.publisher.name', 'sourceCode.author.address.streetAddress', 'author.address.addressCountry.url', 'publisher.address.postalCode', 'distribution.publisher.address.streetAddress', 'distribution.publisher.contactPoint.url', 'distribution.author.alternateName', 'distribution.citation.PMID', 'funding.funder.address.addressLocality', 'funding.funder.email', 'distribution.sourceCode.@id', 'distribution.sourceCode.version', 'sourceCode.author.name', 'measurementTechnique', 'distribution.sourceCode.author.address.addressRegion', 'distribution.author.logo', 'sourceCode.citation.journalName', 'author.logo', 'distribution.citation.DOI', 'distribution.citation.journalNameAbbrev', 'distribution.publisher.address.addressCountry.identifier', 'publisher.address.streetAddress', 'distribution.sourceCode.dateModified', 'citation.author.additionalName', 'distribution.author.address.postalCode', 'funding.funder.logo', 'publisher.email', 'distribution.sourceCode.citation.DOI', 'sourceCode.programmingLanguage', 'sourceCode.citation.author.name', 'citation.identifier', 'spatialCoverage.alternateName', 'sourceCode.citation.PMID', 'funding.identifier', 'distribution.publisher.address.addressCountry.name', 'author.description', 'distribution.name', 'distribution.author.parentOrganization', 'author.contactPoint.url', 'distribution.sourceCode.author.address.addressLocality', 'distribution.publisher.contactPoint.contactType', 'temporalCoverage.lte', 'sourceCode.author.contactPoint.email', 'citation.issueNumber', 'sourceCode.citation.datePublished', 'funding.funder.address.streetAddress', 'sourceCode.citation.url', 'publisher.name', 'distribution.citation.url', 'sourceCode.author.address.addressLocality', 'publisher.alternateName', 'author.email', 'distribution.sourceCode.author.address.addressCountry.url', 'distribution.publisher.address.postalCode', 'sourceCode.citation.volumeNumber', 'sourceCode.author.address.addressCountry.url', 'sourceCode.citation.author.familyName', 'citation.journalName', 'distribution.publisher.logo', 'distribution.citation.pageStart', 'distribution.sourceCode.author.contactPoint.url', 'distribution.description', 'url', 'sourceCode.author.address.addressCountry.name', 'distribution.isBasedOn', 'distribution.sourceCode.programmingLanguage', 'sourceCode.dateModified', 'sourceCode.citation.author.givenName', 'distribution.sourceCode.author.parentOrganization', 'distribution.sourceCode.citation.PMID', 'distribution.citation.pageEnd', 'distribution.sourceCode.author.address.addressCountry.name', 'sourceCode.author.description', 'distribution.publisher.email', 'sourceCode.author.address.postalCode', 'funding.funder.contactPoint.url', 'citation.name', 'schemaVersion', 'publisher.address.addressCountry.identifier', 'distribution.publisher.address.addressCountry.alternateName', 'sourceCode.version', 'funding.funder.parentOrganization', 'citation.PMID', 'distribution.citation.identifier', 'funding.funder.name', 'distribution.publisher.contactPoint.email', 'distribution.sourceCode.license', 'distribution.additionalType', 'distribution.author.address.addressRegion', 'distribution.citation.author.name', 'distribution.sourceCode.author.contactPoint.contactType', 'publisher.address.addressCountry.alternateName', 'distribution.contentUrlRepository', 'distribution.publisher.address.addressLocality', 'distribution.author.address.addressCountry.name', 'spatialCoverage.identifier', 'distribution.author.contactPoint.email', 'sourceCode.author.email', 'distribution.citation.author.familyName', 'includedInDataCatalog', 'distribution.@id', 'distribution.publisher.parentOrganization', 'sourceCode.codeRepository', 'distribution.measurementTechnique', 'distribution.sourceCode.citation.journalNameAbbrev', 'distribution.sourceCode.author.address.streetAddress', 'distribution.sourceCode.citation.journalName', 'citation.author.name', 'citation.datePublished', 'author.address.postalCode', 'distribution.author.description', 'sourceCode.author.logo', 'distribution.citation.issueNumber', 'author.address.addressCountry.alternateName', 'publisher.address.addressRegion', 'distribution.sourceCode.citation.name', 'distribution.sourceCode.citation.author.name', 'distribution.citation.name', 'sourceCode.@id', 'sourceCode.description', 'distribution.contentUrlIdentifier', 'sourceCode.citation.issn', 'citation.DOI', 'sourceCode.license', 'funding.funder.address.addressRegion', 'distribution.citation.volumeNumber', 'spatialCoverage.url', 'author.address.addressRegion', 'distribution.author.address.addressCountry.url', 'distribution.sourceCode.citation.issueNumber', 'sourceCode.identifier', 'author.address.addressCountry.name', 'distribution.dateModified', 'sourceCode.citation.DOI', 'distribution.includedInDataset', 'distribution.keywords', 'funding.funder.contactPoint.contactType', 'funding.funder.address.addressCountry.alternateName', 'funding.funder.address.addressCountry.name', 'description', 'distribution.author.address.addressCountry.alternateName', 'sourceCode.author.familyName', 'citation.url', 'sourceCode.name', 'distribution.citation.author.givenName', 'funding.funder.address.addressCountry.url', 'distribution.author.name', 'distribution.publisher.address.addressRegion', 'publisher.address.addressCountry.name', 'distribution.sourceCode.description', 'temporalCoverage.gt', 'author.address.addressLocality', 'distribution.citation.journalName', 'publisher.url', 'distribution.citation.datePublished', 'distribution.author.contactPoint.url', 'distribution.citation.issn', 'distribution.sourceCode.author.additionalName', 'keywords', 'distribution.sourceCode.citation.volumeNumber', 'identifier', 'distribution.author.address.streetAddress', 'citation.pageStart', 'variableMeasured', 'author.address.addressCountry.identifier', 'distribution.sourceCode.author.email', 'publisher.address.addressLocality', 'distribution.publisher.url', 'funding.funder.address.postalCode', 'distribution.sourceCode.author.contactPoint.email', 'sourceCode.author.givenName', 'publisher.parentOrganization', 'sourceCode.author.additionalName', 'funding.funder.contactPoint.email', 'distribution.sourceCode.author.address.postalCode', 'distribution.author.contactPoint.contactType', 'publisher.logo', 'distribution.sourceCode.citation.datePublished', 'distribution.publisher.alternateName', 'citation.volumeNumber', 'temporalCoverage.gte', 'distribution.publisher.description', 'author.alternateName', 'distribution.sourceCode.author.address.addressCountry.identifier', 'author.parentOrganization', 'distribution.sourceCode.citation.author.additionalName', 'sourceCode.citation.name', 'distribution.publisher.address.addressCountry.url', 'distribution.author.email', 'publisher.contactPoint.contactType', 'distribution.author.address.addressCountry.identifier', 'funding.funder.alternateName', 'distribution.encodingFormat', 'distribution.sourceCode.citation.url', 'sourceCode.citation.pageStart', 'sourceCode.citation.issueNumber', 'distribution.sourceCode.author.description', 'citation.journalNameAbbrev', 'sourceCode.citation.pageEnd', 'distribution.sourceCode.author.logo', 'sourceCode.citation.identifier', 'datePublished', 'distribution.identifier', 'distribution.datePublished', 'distribution.contentUrl', 'citation.pageEnd', 'sourceCode.author.address.addressCountry.identifier', 'funding.funder.url', 'publisher.contactPoint.email', '@id', 'author.address.streetAddress', 'sameAs'], 
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
        "public_fields": ['analysisCode.citation.journalNameAbbrev', 'publisher.address.addressCountry.alternateName', 'citation.author.familyName', 'experimentDate', 'genbankID', 'dateModified', 'citation.author.givenName', 'analysisCode.author.contactPoint.url', 'analysisCode.author.address.addressCountry.url', 'citation.author.name', 'citation.datePublished', 'publisher.description', 'analysisCode.programmingLanguage', 'name', 'publisher.contactPoint.url', 'publisher.address.addressRegion', 'citation.DOI', 'analysisCode.author.address.postalCode', 'citation.issn', 'analysisCode.name', 'publisher.address.addressCountry.url', 'experimentID', 'analysisCode.author.name', 'analysisCode.citation.DOI', 'analysisCode.author.address.streetAddress', 'analysisCode.author.description', 'analysisCode.author.contactPoint.email', 'publisher.address.postalCode', 'measurementTechnique', 'analysisCode.author.email', 'analysisCode.author.additionalName', 'analysisCode.author.contactPoint.contactType', 'description', 'citation.url', 'analysisCode.citation.pageEnd', 'publisher.address.streetAddress', 'citation.author.additionalName', 'publisher.address.addressCountry.name', 'sraID', 'publisher.email', 'citation.identifier', 'analysisCode.author.address.addressCountry.alternateName', 'analysisCode.citation.PMID', 'publisher.url', 'analysisCode.author.address.addressCountry.identifier', 'analysisCode.author.parentOrganization', 'patientID', 'analysisCode.license', 'analysisCode.citation.author.familyName', 'analysisCode.citation.issn', 'citation.pageStart', 'citation.issueNumber', 'analysisCode.author.address.addressCountry.name', 'analysisCode.version', 'publisher.address.addressLocality', 'analysisCode.description', 'analysisCode.citation.author.additionalName', 'publisher.name', 'publisher.parentOrganization', 'analysisCode.citation.identifier', 'publisher.alternateName', 'citation.volumeNumber', 'publisher.logo', 'analysisCode.codeRepository', 'analysisCode.citation.author.givenName', 'analysisCode.citation.author.name', 'analysisCode.author.url', 'analysisCode.citation.volumeNumber', 'citation.journalName', 'analysisCode.identifier', 'analysisCode.citation.issueNumber', 'analysisCode.citation.datePublished', 'analysisCode.author.address.addressRegion', 'analysisCode.citation.name', 'analysisCode.dateModified', 'publisher.contactPoint.contactType', 'analysisCode.author.givenName', 'analysisCode.citation.url', 'citation.journalNameAbbrev', 'analysisCode.author.alternateName', 'citation.name', 'publisher.address.addressCountry.identifier', 'analysisCode.author.address.addressLocality', 'analysisCode.author.logo', 'citation.PMID', 'citation.pageEnd', 'analysisCode.@id', 'batchID', 'analysisCode.citation.pageStart', 'publisher.contactPoint.email', 'analysisCode.datePublished', 'analysisCode.author.familyName', 'analysisCode.citation.journalName'],
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
        "public_fields": ['presentationWeek.gt', 'admin2.identifier', 'admin2.administrativeUnit', 'admin2.alternateName', 'country.name', 'country.identifier', 'age', 'elisa.assayType', 'cohort', 'dateModified', 'admin2.name', 'infectionYear', 'admin2.administrativeType', 'outcome', 'patientID', 'presentationWeek.lt', 'country.alternateName', 'elisa.ELISAvalue', 'presentationWeek.lte', 'elisa.virus', 'presentationWeek.gte', 'gender', 'elisa.timepoint', 'admin3.administrativeType', 'elisa.ELISAresult', 'country.url', 'admin3.identifier', 'admin3.name', 'admin3.alternateName', 'admin3.administrativeUnit'], 
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
        "public_fields": ['temporalCoverage.gt', 'spatialCoverage.alternateName', 'publisher.address.addressCountry.alternateName', 'funding.identifier', 'publisher.url', 'dateModified', 'spatialCoverage.name', 'temporalCoverage.lt', 'keywords', 'spatialCoverage.identifier', 'identifier', 'temporalCoverage.lte', 'funding.funder.address.streetAddress', 'funding.funder.address.postalCode', 'funding.funder.address.addressCountry.identifier', 'publisher.address.addressLocality', 'releaseVersion', 'publisher.name', 'publisher.parentOrganization', 'publisher.description', 'funding.funder.contactPoint.email', 'name', 'publisher.alternateName', 'publisher.address.addressRegion', 'publisher.logo', 'publisher.contactPoint.url', 'sameAs', 'temporalCoverage.gte', 'funding.funder.name', 'publisher.address.addressCountry.url', 'funding.funder.address.addressRegion', 'alternateName', 'spatialCoverage.url', 'funding.funder.description', 'funding.funder.logo', 'url', 'publisher.contactPoint.contactType', 'funding.funder.alternateName', 'funding.funder.contactPoint.contactType', 'publisher.address.postalCode', 'funding.funder.address.addressLocality', 'funding.funder.email', 'dataset', 'funding.funder.contactPoint.url', 'funding.funder.address.addressCountry.alternateName', 'schemaVersion', 'publisher.address.addressCountry.identifier', 'description', 'datePublished', 'funding.funder.address.addressCountry.name', 'funding.funder.parentOrganization', 'funding.funder.url', 'publisher.address.streetAddress', 'funding.funder.address.addressCountry.url', 'publisher.contactPoint.email', '@id', 'publisher.address.addressCountry.name', 'publisher.email'],
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
