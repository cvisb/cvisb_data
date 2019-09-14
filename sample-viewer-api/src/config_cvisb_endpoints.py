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
        "public_fields": ['AVLinactivated', 'sampleType', 'visitCode', 'sampleGroup', 'freezingBuffer', 'dateModified', 'patientID', 'protocolURL', 'derivedIndex', 'species', 'dilutionFactor', 'protocolVersion'],
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
        "public_fields": ['sourceCode.citation.journalNameAbbrev', 'description', 'publisher.contactPoint.email', 'publisher.address.postalCode', 'sourceCode.programmingLanguage', 'sourceCode.author.alternateName', 'publisher.contactPoint.url', 'citation.pageEnd', 'sourceCode.citation.identifier', 'citation.url', 'isBasedOn', 'citation.issueNumber', 'sourceCode.datePublished', 'sourceCode.dateModified', 'sourceCode.author.givenName', 'sourceCode.description', 'sourceCode.author.contactPoint.email', 'citation.journalNameAbbrev', 'sourceCode.author.address.addressRegion', 'sourceCode.citation.pageEnd', 'author.address.postalCode', 'sourceCode.author.logo', 'sourceCode.author.email', 'citation.datePublished', 'sourceCode.citation.volumeNumber', 'author.address.addressLocality', 'sourceCode.citation.author.additionalName', 'sourceCode.author.familyName', 'author.email', 'sourceCode.author.parentOrganization', 'sourceCode.citation.pageStart', 'keywords', 'citation.pmid', 'citation.author.givenName', 'author.name', 'publisher.name', 'sourceCode.author.name', 'name', 'sourceCode.citation.url', 'sourceCode.author.description', 'dateModified', 'sourceCode.citation.author.givenName', 'sourceCode.author.address.streetAddress', 'sourceCode.name', 'author.alternateName', 'author.address.addressCountry.url', 'author.address.streetAddress', 'author.parentOrganization', 'sourceCode.citation.pmid', 'contentUrlRepository', 'sourceCode.citation.author.name', 'measurementTechnique', 'sourceCode.author.address.addressCountry.url', 'author.description', 'publisher.description', 'author.address.addressRegion', 'publisher.address.addressLocality', 'citation.author.additionalName', 'citation.identifier', 'publisher.logo', 'publisher.address.addressRegion', 'citation.journalName', 'datePublished', 'publisher.address.addressCountry.name', 'publisher.email', 'sourceCode.author.contactPoint.contactType', 'includedInDataset', 'publisher.address.addressCountry.identifier', 'sourceCode.author.address.addressCountry.alternateName', 'publisher.alternateName', 'citation.volumeNumber', 'additionalType', 'dateCreated', 'sourceCode.author.additionalName', 'citation.author.familyName', 'citation.pagination', 'author.url', 'sourceCode.author.address.addressLocality', 'author.contactPoint.url', 'sourceCode.codeRepository', 'sourceCode.citation.author.familyName', 'contentUrlIdentifier', 'author.address.addressCountry.alternateName', 'author.contactPoint.email', 'citation.issn', 'publisher.url', 'encodingFormat', 'publisher.address.streetAddress', 'sourceCode.author.address.addressCountry.name', 'author.address.addressCountry.name', 'sourceCode.citation.pagination', 'sourceCode.author.address.postalCode', 'sourceCode.citation.name', 'sourceCode.version', 'sourceCode.identifier', 'sourceCode.author.contactPoint.url', 'sourceCode.author.address.addressCountry.identifier', 'citation.author.name', 'publisher.address.addressCountry.alternateName', 'sourceCode.author.url', 'sourceCode.@id', 'sourceCode.citation.issn', 'sourceCode.license', 'sourceCode.citation.issueNumber', 'author.address.addressCountry.identifier', 'publisher.contactPoint.contactType', 'citation.doi', 'contentUrl', 'citation.name', '@id', 'publisher.address.addressCountry.url', 'sourceCode.citation.datePublished', 'sourceCode.citation.journalName', 'identifier', 'author.logo', 'experimentIDs', 'author.contactPoint.contactType', 'sourceCode.citation.doi', 'sameAs', 'publisher.parentOrganization', 'citation.pageStart'],
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
        "public_fields": ['description', 'publisher.contactPoint.email', 'publisher.address.postalCode', 'dataDownloadIDs', 'distribution.citation.datePublished', 'distribution.sourceCode.version', 'publisher.contactPoint.url', 'distribution.publisher.address.addressCountry.url', 'distribution.sourceCode.author.email', 'sourceCode.author.alternateName', 'sourceCode.datePublished', 'sourceCode.dateModified', 'sourceCode.author.givenName', 'citation.url', 'sourceCode.author.address.addressRegion', 'distribution.sourceCode.author.givenName', 'author.address.postalCode', 'sourceCode.author.logo', 'sourceCode.citation.pageEnd', 'sourceCode.citation.volumeNumber', 'distribution.name', 'spatialCoverage.name', 'distribution.author.url', 'funding.funder.contactPoint.contactType', 'temporalCoverage.lt', 'distribution.sourceCode.citation.url', 'distribution.@id', 'author.email', 'author.name', 'temporalCoverage.lte', 'distribution.sourceCode.citation.pageStart', 'sourceCode.author.name', 'distribution.publisher.parentOrganization', 'distribution.sourceCode.author.contactPoint.contactType', 'distribution.author.contactPoint.url', 'sourceCode.author.description', 'distribution.citation.volumeNumber', 'sourceCode.citation.author.givenName', 'distribution.sourceCode.author.alternateName', 'funding.funder.parentOrganization', 'distribution.author.address.postalCode', 'distribution.citation.issn', 'distribution.sourceCode.identifier', 'funding.funder.address.streetAddress', 'distribution.sourceCode.author.url', 'distribution.sourceCode.author.address.streetAddress', 'distribution.sourceCode.codeRepository', 'distribution.sourceCode.citation.author.additionalName', 'distribution.description', 'distribution.author.contactPoint.contactType', 'distribution.sourceCode.author.name', 'funding.funder.address.addressCountry.alternateName', 'funding.funder.address.addressCountry.identifier', 'distribution.publisher.address.addressRegion', 'distribution.sourceCode.license', 'distribution.dateModified', 'citation.author.additionalName', 'publisher.logo', 'distribution.citation.url', 'distribution.sourceCode.author.familyName', 'publisher.address.addressRegion', 'citation.journalName', 'includedInDataCatalog', 'distribution.citation.doi', 'distribution.measurementTechnique', 'funding.funder.email', 'publisher.email', 'distribution.sourceCode.citation.volumeNumber', 'sourceCode.author.address.addressCountry.alternateName', 'publisher.alternateName', 'distribution.sourceCode.dateModified', 'citation.volumeNumber', 'distribution.experimentIDs', 'schemaVersion', 'citation.author.familyName', 'citation.pagination', 'distribution.publisher.description', 'distribution.sourceCode.datePublished', 'license', 'sourceCode.codeRepository', 'distribution.author.address.addressCountry.url', 'distribution.sourceCode.programmingLanguage', 'publisher.address.streetAddress', 'citation.issn', 'distribution.sourceCode.author.additionalName', 'sourceCode.author.address.addressCountry.name', 'author.address.addressCountry.name', 'distribution.citation.author.familyName', 'sourceCode.citation.pagination', 'sourceCode.author.address.postalCode', 'funding.funder.alternateName', 'distribution.publisher.url', 'sourceCode.citation.name', 'spatialCoverage.alternateName', 'distribution.publisher.address.addressCountry.alternateName', 'sourceCode.version', 'temporalCoverage.gte', 'sourceCode.identifier', 'sourceCode.author.contactPoint.url', 'publisher.address.addressCountry.alternateName', 'spatialCoverage.url', 'distribution.author.address.addressLocality', 'distribution.publisher.address.addressLocality', 'distribution.sourceCode.author.address.addressCountry.identifier', 'sourceCode.author.url', 'distribution.publisher.address.addressCountry.name', 'distribution.publisher.contactPoint.contactType', 'spatialCoverage.identifier', 'distribution.publisher.contactPoint.email', 'distribution.sourceCode.@id', 'distribution.publisher.alternateName', 'author.address.addressCountry.identifier', 'distribution.citation.identifier', 'citation.doi', 'citation.name', 'distribution.publisher.name', '@id', 'publisher.address.addressCountry.url', 'distribution.publisher.contactPoint.url', 'funding.funder.address.addressCountry.name', 'distribution.author.description', 'author.logo', 'author.contactPoint.contactType', 'distribution.author.address.addressCountry.identifier', 'distribution.publisher.email', 'sourceCode.citation.doi', 'sameAs', 'publisher.parentOrganization', 'distribution.sourceCode.citation.name', 'distribution.sourceCode.citation.journalName', 'sourceCode.license', 'sourceCode.citation.journalNameAbbrev', 'distribution.contentUrlIdentifier', 'distribution.sourceCode.author.address.addressCountry.url', 'sourceCode.citation.pmid', 'funding.funder.logo', 'funding.funder.description', 'distribution.sourceCode.citation.pmid', 'distribution.author.address.addressRegion', 'sourceCode.programmingLanguage', 'distribution.sourceCode.author.address.postalCode', 'sourceCode.citation.identifier', 'distribution.citation.author.name', 'citation.pageEnd', 'distribution.author.address.streetAddress', 'citation.issueNumber', 'distribution.additionalType', 'distribution.sourceCode.author.address.addressLocality', 'distribution.citation.pagination', 'sourceCode.description', 'citation.pageStart', 'distribution.citation.issueNumber', 'distribution.citation.author.givenName', 'sourceCode.author.contactPoint.email', 'citation.journalNameAbbrev', 'distribution.sourceCode.author.address.addressCountry.name', 'temporalCoverage.gt', 'funding.funder.contactPoint.email', 'url', 'variableMeasured', 'sourceCode.author.email', 'distribution.author.contactPoint.email', 'citation.datePublished', 'distribution.author.parentOrganization', 'funding.funder.address.postalCode', 'distribution.sourceCode.citation.issn', 'funding.funder.address.addressCountry.url', 'distribution.dateCreated', 'distribution.sourceCode.description', 'author.address.addressLocality', 'distribution.includedInDataset', 'distribution.citation.pmid', 'sourceCode.citation.author.additionalName', 'sourceCode.author.familyName', 'sourceCode.author.parentOrganization', 'sourceCode.citation.pageStart', 'keywords', 'publisher.name', 'distribution.sourceCode.citation.doi', 'distribution.sourceCode.author.address.addressCountry.alternateName', 'citation.author.givenName', 'distribution.sourceCode.author.parentOrganization', 'citation.pmid', 'name', 'distribution.sourceCode.citation.author.familyName', 'sourceCode.citation.url', 'dateModified', 'distribution.sourceCode.author.description', 'distribution.contentUrlRepository', 'sourceCode.author.address.streetAddress', 'distribution.publisher.logo', 'sourceCode.name', 'distribution.citation.journalNameAbbrev', 'author.alternateName', 'distribution.citation.author.additionalName', 'author.address.addressCountry.url', 'distribution.publisher.address.addressCountry.identifier', 'funding.funder.address.addressRegion', 'author.address.streetAddress', 'author.parentOrganization', 'sourceCode.citation.author.name', 'sourceCode.author.address.addressCountry.url', 'measurementTechnique', 'author.description', 'publisher.description', 'distribution.citation.pageStart', 'author.address.addressRegion', 'publisher.address.addressLocality', 'distribution.citation.pageEnd', 'distribution.citation.journalName', 'distribution.keywords', 'citation.identifier', 'distribution.identifier', 'datePublished', 'funding.funder.address.addressLocality', 'publisher.address.addressCountry.name', 'distribution.sourceCode.name', 'distribution.author.email', 'sourceCode.author.contactPoint.contactType', 'distribution.sourceCode.citation.datePublished', 'publisher.address.addressCountry.identifier', 'distribution.isBasedOn', 'distribution.author.logo', 'distribution.sourceCode.author.contactPoint.url', 'distribution.publisher.address.postalCode', 'funding.funder.contactPoint.url', 'distribution.publisher.address.streetAddress', 'distribution.datePublished', 'distribution.sourceCode.citation.issueNumber', 'sourceCode.author.additionalName', 'author.url', 'funding.funder.url', 'sourceCode.author.address.addressLocality', 'author.contactPoint.url', 'distribution.sourceCode.author.logo', 'funding.identifier', 'sourceCode.citation.author.familyName', 'author.address.addressCountry.alternateName', 'distribution.sourceCode.author.contactPoint.email', 'distribution.sourceCode.citation.pagination', 'author.contactPoint.email', 'publisher.url', 'distribution.sourceCode.citation.journalNameAbbrev', 'distribution.encodingFormat', 'distribution.author.address.addressCountry.alternateName', 'distribution.sourceCode.citation.identifier', 'funding.funder.name', 'sourceCode.author.address.addressCountry.identifier', 'citation.author.name', 'sourceCode.@id', 'distribution.sourceCode.author.address.addressRegion', 'distribution.contentUrl', 'distribution.sameAs', 'distribution.citation.name', 'sourceCode.citation.issueNumber', 'publisher.contactPoint.contactType', 'distribution.sourceCode.citation.author.givenName', 'sourceCode.citation.issn', 'sourceCode.citation.datePublished', 'sourceCode.citation.journalName', 'identifier', 'distribution.sourceCode.citation.pageEnd', 'distribution.author.name', 'distribution.author.alternateName', 'distribution.author.address.addressCountry.name', 'distribution.sourceCode.citation.author.name'], 
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
        "public_fields": ['data.virus', 'data.DNAsequence', 'data.referenceSeq', 'data.isReferenceSeq', 'data.AAsequence', 'data.SNP', 'data.allele', 'data.cohort', 'data.locus', 'data.novel', 'data.outcome', 'data.patientID', 'description', 'publisher.contactPoint.email', 'publisher.address.postalCode', 'analysisCode.author.familyName', 'analysisCode.author.address.streetAddress', 'publisher.contactPoint.url', 'citation.pageEnd', 'analysisCode.citation.issn', 'citation.url', 'citation.issueNumber', 'analysisCode.citation.issueNumber', 'citation.journalNameAbbrev', 'analysisCode.author.contactPoint.email', 'citation.datePublished', 'analysisCode.datePublished', 'analysisCode.citation.author.name', 'analysisCode.license', 'analysisCode.author.additionalName', 'publisher.name', 'citation.author.givenName', 'citation.pmid', 'analysisCode.author.description', 'name', 'analysisCode.identifier', 'analysisCode.author.url', 'analysisCode.citation.url', 'dateModified', 'analysisCode.author.address.addressLocality', 'analysisCode.author.address.addressCountry.url', 'analysisCode.citation.name', 'analysisCode.version', 'analysisCode.author.parentOrganization', 'analysisCode.citation.identifier', 'batchID', 'analysisCode.citation.author.familyName', 'analysisCode.citation.volumeNumber', 'analysisCode.author.address.postalCode', 'analysisCode.citation.datePublished', 'measurementTechnique', 'publisher.description', 'analysisCode.dateModified', 'analysisCode.programmingLanguage', 'publisher.address.addressLocality', 'analysisCode.citation.pageStart', 'analysisCode.author.contactPoint.url', 'citation.author.additionalName', 'publisher.logo', 'citation.identifier', 'analysisCode.citation.doi', 'publisher.address.addressRegion', 'citation.journalName', 'analysisCode.citation.journalNameAbbrev', 'publisher.address.addressCountry.name', 'analysisCode.citation.pageEnd', 'publisher.email', 'analysisCode.citation.pmid', 'publisher.address.addressCountry.identifier', 'publisher.alternateName', 'citation.volumeNumber', 'analysisCode.author.contactPoint.contactType', 'experimentDate', 'citation.author.familyName', 'citation.pagination', 'analysisCode.author.address.addressCountry.name', 'analysisCode.citation.author.givenName', 'analysisCode.description', 'analysisCode.author.address.addressCountry.identifier', 'analysisCode.@id', 'publisher.url', 'publisher.address.streetAddress', 'citation.issn', 'analysisCode.citation.journalName', 'genbankID', 'analysisCode.codeRepository', 'analysisCode.author.email', 'publisher.address.addressCountry.alternateName', 'citation.author.name', 'analysisCode.author.name', 'analysisCode.author.givenName', 'experimentID', 'analysisCode.citation.pagination', 'analysisCode.name', 'publisher.contactPoint.contactType', 'citation.doi', 'citation.name', 'analysisCode.citation.author.additionalName', 'analysisCode.author.logo', 'publisher.address.addressCountry.url', 'analysisCode.author.address.addressRegion', 'analysisCode.author.alternateName', 'patientID', 'analysisCode.author.address.addressCountry.alternateName', 'sraID', 'publisher.parentOrganization', 'citation.pageStart'],
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
        "public_fields": ['elisa.ELISAresult', 'elisa.assayType', 'elisa.timepoint', 'elisa.virus', 'presentationWeek.lt', 'gender', 'admin3.alternateName', 'dateModified', 'cohort', 'admin2.administrativeType', 'infectionYear', 'country.identifier', 'country.url', 'country.name', 'presentationWeek.lte', 'species', 'country.alternateName', 'admin3.administrativeUnit', 'admin2.administrativeUnit', 'admin3.name', 'admin2.alternateName', 'patientID', 'admin2.identifier', 'presentationWeek.gte', 'outcome', 'age', 'admin2.name', 'admin3.identifier', 'presentationWeek.gt', 'admin3.administrativeType'],
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
        "public_fields":['description', 'publisher.contactPoint.email', 'publisher.logo', 'publisher.address.postalCode', 'funding.funder.description', 'publisher.contactPoint.url', 'publisher.address.addressRegion', 'datePublished', 'funding.funder.address.addressLocality', 'funding.funder.logo', 'publisher.address.addressCountry.name', 'funding.funder.email', 'publisher.email', 'publisher.address.addressCountry.identifier', 'temporalCoverage.gt', 'publisher.alternateName', 'funding.funder.contactPoint.email', 'funding.funder.contactPoint.url', 'url', 'funding.funder.address.postalCode', 'dataset', 'schemaVersion', 'funding.funder.url', 'spatialCoverage.name', 'funding.funder.contactPoint.contactType', 'temporalCoverage.lt', 'funding.identifier', 'keywords', 'publisher.name', 'temporalCoverage.lte', 'publisher.url', 'publisher.address.streetAddress', 'name', 'funding.funder.alternateName', 'dateModified', 'spatialCoverage.alternateName', 'temporalCoverage.gte', 'funding.funder.name', 'publisher.address.addressCountry.alternateName', 'spatialCoverage.url', 'releaseVersion', 'spatialCoverage.identifier', 'funding.funder.parentOrganization', 'alternateName', 'funding.funder.address.addressRegion', 'publisher.contactPoint.contactType', 'funding.funder.address.streetAddress', '@id', 'publisher.address.addressCountry.url', 'publisher.description', 'identifier', 'funding.funder.address.addressCountry.name', 'funding.funder.address.addressCountry.alternateName', 'funding.funder.address.addressCountry.identifier', 'publisher.address.addressLocality', 'sameAs', 'publisher.parentOrganization', 'funding.funder.address.addressCountry.url'], 
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
