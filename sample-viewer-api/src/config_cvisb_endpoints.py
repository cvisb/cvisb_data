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
        "public_fields": ['species', 'AVLinactivated', 'visitCode', 'samplingDate', 'sampleType', 'dilutionFactor', 'derivedIndex', 'freezingBuffer', 'dateModified', 'sampleGroup', 'protocolVersion', 'protocolURL'],
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
        "public_fields": ['citation.journalName', 'sourceCode.identifier', 'citation.name', 'sourceCode.author.givenName', 'citation.journalNameAbbrev', 'citation.pagination',
'sourceCode.@id', 'publisher.url', 'sourceCode.author.familyName', 'publisher.email', 'experimentIDs', 'citation.author.name', 
'sourceCode.author.address.addressCountry.identifier', 'author.email', 'sourceCode.version', 'author.address.streetAddress', 
'sourceCode.author.email', 'sourceCode.citation.author.familyName', 'sourceCode.author.parentOrganization', 
'publisher.address.addressCountry.url', 'sourceCode.author.additionalName', 'sameAs', 'publisher.address.postalCode', 
'sourceCode.author.url', 'sourceCode.citation.pagination', 'sourceCode.citation.journalNameAbbrev', 'sourceCode.license', 'measurementTechnique', 'citation.issn', 
'author.address.addressCountry.url', 'sourceCode.citation.journalName', 'sourceCode.citation.pmid', '@id', 'publisher.alternateName', 
'datePublished', 'sourceCode.author.address.addressRegion', 'publisher.address.addressLocality', 'contentUrlIdentifier', 
'sourceCode.author.address.addressLocality', 'sourceCode.citation.datePublished', 'sourceCode.programmingLanguage', 
'sourceCode.citation.author.givenName', 'publisher.contactPoint.url', 'sourceCode.citation.name', 'name', 'sourceCode.author.description', 
'citation.url', 'sourceCode.citation.author.additionalName', 'author.address.postalCode', 'author.address.addressCountry.alternateName', 
'sourceCode.citation.identifier', 'author.address.addressCountry.name', 'sourceCode.citation.issueNumber', 'publisher.address.addressCountry.name', 
'sourceCode.author.contactPoint.email', 'keywords', 'sourceCode.author.address.streetAddress', 'description', 'author.contactPoint.contactType', 
'encodingFormat', 'contentUrlRepository', 'citation.pageStart', 'citation.pmid', 'sourceCode.citation.volumeNumber', 'sourceCode.citation.issn', 
'citation.identifier', 'author.address.addressRegion', 'includedInDataset', 'sourceCode.citation.pageEnd', 'author.parentOrganization', 'author.url', 
'sourceCode.citation.doi', 'dateCreated', 'author.address.addressCountry.identifier', 'publisher.contactPoint.contactType', 'citation.volumeNumber', 
'publisher.parentOrganization', 'sourceCode.datePublished', 'publisher.contactPoint.email', 'publisher.name', 'sourceCode.author.logo', 
'publisher.address.addressCountry.identifier', 'citation.pageEnd', 'contentUrl', 'publisher.address.addressRegion', 'citation.author.familyName', 
'citation.author.additionalName', 'citation.issueNumber', 'author.name', 'publisher.logo', 'publisher.address.addressCountry.alternateName', 
'sourceCode.citation.url', 'author.alternateName', 'sourceCode.citation.author.name', 'sourceCode.author.address.postalCode', 'author.address.addressLocality', 
'sourceCode.codeRepository', 'sourceCode.dateModified', 'sourceCode.author.alternateName', 'sourceCode.author.address.addressCountry.url', 
'sourceCode.citation.pageStart', 'additionalType', 'publisher.description', 'author.contactPoint.url', 'publisher.address.streetAddress', 
'citation.doi', 'citation.author.givenName', 'sourceCode.author.address.addressCountry.name', 'sourceCode.author.name', 'author.description', 
'author.logo', 'citation.datePublished', 'sourceCode.author.contactPoint.url', 'sourceCode.author.contactPoint.contactType', 
'sourceCode.author.address.addressCountry.alternateName', 'isBasedOn', 'sourceCode.name', 'dateModified', 'sourceCode.description', 
'author.contactPoint.email', 'identifier'],
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
        "public_fields": ['funding.funder.address.addressLocality', 'distribution.description', 'distribution.citation.identifier', 'distribution.author.address.addressCountry.identifier', 'distribution.citation.issueNumber', 'schemaVersion', 'citation.journalName', 'sourceCode.identifier', 'funding.funder.address.addressCountry.identifier', 'citation.name', 'distribution.sourceCode.author.familyName', 'distribution.includedInDataset', 'variableMeasured', 'funding.funder.address.addressCountry.alternateName', 'distribution.publisher.address.addressLocality', 'funding.funder.address.addressCountry.name', 'funding.funder.address.streetAddress', 'distribution.author.description', 'spatialCoverage.name', 'sourceCode.author.email', 'distribution.citation.PMID', 'distribution.sourceCode.author.contactPoint.email', 'distribution.publisher.address.streetAddress', 'distribution.publisher.alternateName', 'distribution.sourceCode.citation.author.givenName', 'sameAs', 'publisher.address.postalCode', 'distribution.datePublished', 'sourceCode.author.url', 'sourceCode.citation.journalNameAbbrev', 'measurementTechnique', 'distribution.author.address.addressLocality', 'distribution.sourceCode.citation.issn', 'distribution.sourceCode.citation.pageEnd', 'sourceCode.license', 'sourceCode.citation.PMID', 'publisher.alternateName', 'funding.funder.address.addressRegion', 'distribution.publisher.address.postalCode', 'publisher.address.addressLocality', 'sourceCode.author.address.addressRegion', 'distribution.sourceCode.citation.author.name', 'distribution.citation.datePublished', 'sourceCode.citation.datePublished', 'distribution.citation.issn', 'sourceCode.programmingLanguage', 'publisher.contactPoint.url', 'name', 'distribution.sourceCode.citation.name', 'sourceCode.citation.author.additionalName', 'author.address.addressCountry.alternateName', 'sourceCode.citation.identifier', 'distribution.publisher.address.addressRegion', 'distribution.sourceCode.citation.issueNumber', 'sourceCode.citation.issueNumber', 'distribution.citation.pageEnd', 'keywords', 'distribution.author.address.addressCountry.name', 'distribution.sourceCode.author.address.streetAddress', 'distribution.sourceCode.version', 'distribution.sameAs', 'distribution.author.alternateName', 'distribution.sourceCode.citation.pageStart', 'distribution.sourceCode.citation.journalNameAbbrev', 'distribution.sourceCode.author.contactPoint.url', 'citation.PMID', 'sourceCode.citation.volumeNumber', 'sourceCode.citation.issn', 'funding.funder.description', 'author.address.addressRegion', 'temporalCoverage.lte', 'distribution.sourceCode.citation.journalName', 'distribution.author.parentOrganization', 'sourceCode.citation.pageEnd', 'distribution.author.contactPoint.url', 'distribution.sourceCode.citation.author.additionalName', 'distribution.encodingFormat', 'spatialCoverage.url', 'distribution.author.email', 'funding.funder.logo', 'distribution.name', 'citation.volumeNumber', 'distribution.sourceCode.author.alternateName', 'funding.funder.url', 'publisher.parentOrganization', 'sourceCode.datePublished', 'funding.funder.alternateName', 'publisher.name', 'distribution.citation.volumeNumber', 'distribution.sourceCode.author.name', 'publisher.address.addressRegion', 'distribution.author.name', 'author.name', 'distribution.citation.author.additionalName', 'citation.issueNumber', 'distribution.dateCreated', 'sourceCode.author.address.postalCode', 'distribution.sourceCode.citation.datePublished', 'sourceCode.codeRepository', 'distribution.publisher.description', 'funding.funder.contactPoint.url', 'distribution.publisher.email', 'sourceCode.author.address.addressCountry.name', 'publisher.description', 'author.contactPoint.url', 'sourceCode.author.description', 'sourceCode.citation.pageStart', 'distribution.sourceCode.@id', 'citation.DOI', 'author.description', 'distribution.sourceCode.dateModified', 'sourceCode.author.address.addressCountry.alternateName', 'distribution.sourceCode.author.logo', 'distribution.citation.DOI', 'distribution.sourceCode.datePublished', 'distribution.isBasedOn', 'dateModified', 'sourceCode.description', 'distribution.publisher.address.addressCountry.alternateName', 'temporalCoverage.lt', 'funding.funder.address.addressCountry.url', 'distribution.contentUrlIdentifier', 'sourceCode.author.givenName', 'citation.journalNameAbbrev', 'distribution.publisher.contactPoint.contactType', 'distribution.sourceCode.codeRepository', 'sourceCode.@id', 'publisher.url', 'sourceCode.author.familyName', 'publisher.email', 'distribution.additionalType', 'distribution.sourceCode.name', 'distribution.publisher.address.addressCountry.url', 'distribution.publisher.url', 'sourceCode.author.address.addressCountry.identifier', 'sourceCode.version', 'author.email', 'citation.author.name', 'distribution.citation.journalName', 'url', 'temporalCoverage.gte', 'temporalCoverage.gt', 'distribution.sourceCode.author.description', 'author.address.streetAddress', 'distribution.publisher.address.addressCountry.name', 'distribution.author.url', 'distribution.citation.author.givenName', 'distribution.sourceCode.description', 'distribution.citation.url', 'distribution.sourceCode.author.address.addressCountry.name', 'sourceCode.citation.author.familyName', 'distribution.sourceCode.identifier', 'publisher.address.addressCountry.url', 'distribution.citation.journalNameAbbrev', 'distribution.sourceCode.citation.url', 'sourceCode.author.parentOrganization', 'sourceCode.author.additionalName', 'citation.issn', 'author.address.addressCountry.url', 'distribution.author.address.postalCode', 'sourceCode.citation.journalName', '@id', 'spatialCoverage.identifier', 'funding.funder.contactPoint.contactType', 'distribution.publisher.parentOrganization', 'distribution.sourceCode.author.address.addressCountry.url', 'datePublished', 'distribution.sourceCode.author.givenName', 'dataDownloadIDs', 'sourceCode.author.address.addressLocality', 'license', 'distribution.publisher.name', 'distribution.publisher.contactPoint.url', 'distribution.sourceCode.author.url', 'sourceCode.citation.author.givenName', 'distribution.sourceCode.author.address.addressRegion', 'distribution.author.address.addressCountry.alternateName', 'distribution.dateModified', 'distribution.experimentIDs', 'sourceCode.citation.name', 'citation.url', 'distribution.author.address.addressCountry.url', 'author.address.postalCode', 'distribution.identifier', 'distribution.contentUrlRepository', 'author.address.addressCountry.name', 'distribution.sourceCode.citation.identifier', 'funding.identifier', 'distribution.sourceCode.author.contactPoint.contactType', 'publisher.address.addressCountry.name', 'sourceCode.author.contactPoint.email', 'sourceCode.author.address.streetAddress', 'funding.funder.parentOrganization', 'distribution.sourceCode.author.address.addressLocality', 'description', 'distribution.sourceCode.author.additionalName', 'author.contactPoint.contactType', 'distribution.citation.author.name', 'distribution.publisher.logo', 'citation.pageStart', 'distribution.publisher.address.addressCountry.identifier', 'citation.identifier', 'distribution.author.address.streetAddress', 'distribution.sourceCode.author.address.postalCode', 'distribution.citation.pageStart', 'distribution.sourceCode.author.address.addressCountry.alternateName', 'distribution.author.address.addressRegion', 'distribution.sourceCode.citation.author.familyName', 'author.parentOrganization', 'author.url', 'distribution.author.contactPoint.email', 'sourceCode.citation.DOI', 'distribution.contentUrl', 'funding.funder.address.postalCode', 'author.address.addressCountry.identifier', 'publisher.contactPoint.contactType', 'distribution.citation.author.familyName', 'distribution.author.contactPoint.contactType', 'distribution.sourceCode.citation.volumeNumber', 'funding.funder.email', 'publisher.contactPoint.email', 'sourceCode.author.logo', 'publisher.address.addressCountry.identifier', 'citation.pageEnd', 'includedInDataCatalog', 'funding.funder.name', 'citation.author.familyName', 'distribution.author.logo', 'citation.author.additionalName', 'distribution.measurementTechnique', 'publisher.logo', 'publisher.address.addressCountry.alternateName', 'sourceCode.citation.url', 'author.alternateName', 'sourceCode.citation.author.name', 'distribution.sourceCode.license', 'author.address.addressLocality', 'sourceCode.dateModified', 'spatialCoverage.alternateName', 'sourceCode.author.alternateName', 'distribution.sourceCode.programmingLanguage', 'sourceCode.author.address.addressCountry.url', 'distribution.publisher.contactPoint.email', 'publisher.address.streetAddress', 'sourceCode.author.name', 'sourceCode.author.contactPoint.url', 'sourceCode.author.contactPoint.contactType', 'distribution.keywords', 'citation.author.givenName', 'author.logo', 'distribution.sourceCode.author.email', 'distribution.@id', 'citation.datePublished', 'distribution.sourceCode.citation.PMID', 'distribution.sourceCode.author.parentOrganization', 'distribution.citation.name', 'distribution.sourceCode.citation.DOI', 'sourceCode.name', 'author.contactPoint.email', 'identifier', 'funding.funder.contactPoint.email', 'distribution.sourceCode.author.address.addressCountry.identifier'],
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
        "public_fields": ['data.virus', 'data.DNAsequence', 'data.referenceSeq', 'data.isReferenceSeq', 'data.AAsequence', 'data.SNP', 'citation.pagination', 'citation.journalName', 'analysisCode.author.parentOrganization', 'citation.name', 'citation.journalNameAbbrev', 'publisher.url', 'analysisCode.citation.identifier', 'publisher.email', 'sraID', 'citation.author.name', 'analysisCode.author.address.postalCode', 'analysisCode.citation.doi', 'analysisCode.author.alternateName', 'analysisCode.author.address.addressLocality', 'analysisCode.citation.author.givenName', 'batchID', 'analysisCode.dateModified', 'experimentDate', 'publisher.address.addressCountry.url', 'analysisCode.author.contactPoint.url', 'analysisCode.author.address.addressCountry.identifier', 'analysisCode.citation.name', 'analysisCode.citation.journalNameAbbrev', 'analysisCode.license', 'analysisCode.citation.url', 'publisher.address.postalCode', 'measurementTechnique', 'citation.issn', 'analysisCode.author.description', 'analysisCode.citation.volumeNumber', 'analysisCode.citation.pageEnd', 'genbankID', 'publisher.alternateName', 'analysisCode.author.logo', 'publisher.address.addressLocality', 'analysisCode.author.address.addressCountry.url', 'analysisCode.pagination', 'analysisCode.author.name', 'analysisCode.author.address.addressCountry.alternateName', 'analysisCode.author.additionalName', 'publisher.contactPoint.url', 'analysisCode.citation.journalName', 'name', 'citation.url', 'analysisCode.datePublished', 'analysisCode.citation.pageStart', 'analysisCode.citation.author.name', 'publisher.address.addressCountry.name', 'analysisCode.author.givenName', 'description', 'citation.pageStart', 'citation.pmid', 'analysisCode.programmingLanguage', 'citation.identifier', 'analysisCode.@id', 'patientID', 'analysisCode.author.address.streetAddress', 'analysisCode.citation.pmid', 'analysisCode.version', 'publisher.contactPoint.contactType', 'citation.volumeNumber', 'analysisCode.citation.issn', 'publisher.parentOrganization', 'analysisCode.author.url', 'publisher.contactPoint.email', 'analysisCode.author.address.addressRegion', 'publisher.name', 'publisher.address.addressCountry.identifier', 'citation.pageEnd', 'publisher.address.addressRegion', 'analysisCode.author.familyName', 'experimentID', 'citation.author.familyName', 'citation.author.additionalName', 'citation.issueNumber', 'publisher.logo', 'publisher.address.addressCountry.alternateName', 'analysisCode.identifier', 'analysisCode.citation.author.additionalName', 'analysisCode.citation.author.familyName', 'analysisCode.citation.datePublished', 'analysisCode.author.contactPoint.contactType', 'publisher.description', 'publisher.address.streetAddress', 'analysisCode.author.email', 'citation.doi', 'citation.author.givenName', 'analysisCode.name', 'analysisCode.author.contactPoint.email', 'analysisCode.author.address.addressCountry.name', 'citation.datePublished', 'analysisCode.citation.issueNumber', 'analysisCode.codeRepository', 'dateModified', 'analysisCode.description'],
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
        "public_fields": ['presentationWeek.gte', 'elisa.virus', 'elisa.timepoint', 'admin3.administrativeUnit', 'elisa.ELISAresult', 'admin2.administrativeUnit', 'elisa.assayType', 'admin3.name', 'admin2.name', 'elisa.ELISAvalue', 'admin3.administrativeType', 'admin2.identifier', 'presentationWeek.lte', 'country.name', 'country.alternateName', 'admin3.alternateName', 'admin3.identifier', 'gender', 'cohort', 'patientID', 'country.url', 'outcome', 'admin2.alternateName', 'country.identifier', 'presentationWeek.gt', 'dateModified', 'admin2.administrativeType', 'presentationWeek.lt', 'age', 'infectionYear'],
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
        "public_fields": ['schemaVersion', 'funding.identifier', 'funding.funder.address.addressCountry.url', 'publisher.address.addressCountry.name', 'keywords', 'funding.funder.parentOrganization', 'funding.funder.address.addressCountry.identifier', 'description', 'funding.funder.address.addressCountry.alternateName', 'publisher.url', 'publisher.email', 'funding.funder.address.addressCountry.name', 'funding.funder.address.streetAddress', 'funding.funder.description', 'temporalCoverage.lte', 'url', 'temporalCoverage.gte', 'temporalCoverage.gt', 'spatialCoverage.name', 'funding.funder.address.postalCode', 'publisher.contactPoint.contactType', 'spatialCoverage.url', 'funding.funder.logo', 'publisher.address.addressCountry.url', 'funding.funder.url', 'publisher.parentOrganization', 'funding.funder.alternateName', 'funding.funder.email', 'publisher.contactPoint.email', 'sameAs', 'publisher.address.postalCode', 'publisher.name', 'publisher.address.addressCountry.identifier', 'publisher.address.addressRegion', 'funding.funder.name', '@id', 'publisher.logo', 'spatialCoverage.identifier', 'publisher.address.addressCountry.alternateName', 'publisher.alternateName', 'funding.funder.contactPoint.contactType', 'funding.funder.address.addressRegion', 'datePublished', 'publisher.address.addressLocality', 'spatialCoverage.alternateName', 'funding.funder.contactPoint.url', 'funding.funder.address.addressLocality', 'publisher.description', 'publisher.address.streetAddress', 'alternateName', 'funding.funder.contactPoint.email', 'publisher.contactPoint.url', 'name', 'dataset', 'releaseVersion', 'dateModified', 'identifier', 'temporalCoverage.lt'],
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
