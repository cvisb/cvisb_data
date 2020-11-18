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
        # 2019-11-15: 16 fields
        "public_fields": ['dateModified', 'protocolVersion', 'visitCode', 'patientID', 'protocolURL', 'sampleGroup', 'samplingDate.lt', 'sampleType', 'freezingBuffer', 'derivedIndex', 'samplingDate.gt', 'samplingDate.lte', 'AVLinactivated', 'species', 'dilutionFactor', 'samplingDate.gte'],
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
        # 2019-11-15: 132 fields
        "public_fields": ['creator.address.addressCountry.identifier', 'sourceCode.creator.address.addressRegion', 'creator.parentOrganization', 'sourceCode.creator.logo', 'experimentIDs', 'creator.description', 'creator.@type', 'creator.identifier', 'publisher.address.streetAddress', 'includedInDataset', 'creator.name', 'citation.author.additionalName', 'citation.journalNameAbbrev', 'citation.issueNumber', 'sourceCode.citation.issueNumber', 'datePublished', 'creator.address.addressRegion', 'creator.address.addressCountry.alternateName', 'sourceCode.citation.name', 'isBasedOn', 'measurementTechnique', 'sourceCode.citation.pagination', 'identifier', 'sourceCode.programmingLanguage', 'sourceCode.creator.address.addressCountry.url', 'sourceCode.creator.address.addressLocality', 'sourceCode.creator.@type', 'sourceCode.creator.identifier', 'sourceCode.citation.author.givenName', 'sameAs', 'measurementCategory', '@id', 'citation.author.name', 'citation.datePublished', 'sourceCode.citation.volumeNumber', 'citation.issn', 'citation.identifier', 'sourceCode.creator.givenName', 'sourceCode.description', 'creator.url', 'publisher.url', 'publisher.address.addressCountry.identifier', 'contentUrl', 'creator.address.addressLocality', 'sourceCode.creator.name', 'publisher.contactPoint.contactType', 'citation.pageStart', 'creator.contactPoint.email', 'citation.journalName', 'publisher.logo', 'publisher.address.postalCode', 'sourceCode.codeRepository', 'sourceCode.citation.journalName', 'sourceCode.creator.additionalName', 'sourceCode.creator.url', 'sourceCode.citation.journalNameAbbrev', 'creator.email', 'dateCreated', 'publisher.name', 'publisher.address.addressLocality', 'sourceCode.citation.datePublished', 'citation.pageEnd', 'creator.contactPoint.url', 'url', 'citation.url', 'publisher.alternateName', 'creator.logo', 'sourceCode.license', 'sourceCode.creator.address.addressCountry.name', 'creator.address.streetAddress', 'name', 'citation.volumeNumber', 'encodingFormat', 'description', 'creator.alternateName', 'sourceCode.creator.contactPoint.contactType', 'sourceCode.@id', 'sourceCode.citation.pageStart', 'publisher.address.addressCountry.alternateName', 'sourceCode.citation.identifier', 'additionalType', 'sourceCode.creator.email', 'sourceCode.version', 'citation.pagination', 'citation.name', 'sourceCode.creator.address.postalCode', 'sourceCode.citation.author.familyName', 'variableMeasured', 'citation.@type', 'sourceCode.citation.pageEnd', 'publisher.description', 'sourceCode.citation.@type', 'creator.contactPoint.contactType', 'sourceCode.creator.address.addressCountry.alternateName', 'sourceCode.creator.contactPoint.email', 'sourceCode.creator.alternateName', 'sourceCode.creator.description', 'publisher.identifier', 'sourceCode.creator.address.addressCountry.identifier', 'sourceCode.datePublished', 'sourceCode.dateModified', 'sourceCode.citation.doi', 'publisher.address.addressCountry.name', 'dateModified', 'publisher.@type', 'sourceCode.identifier', 'creator.address.postalCode', 'sourceCode.citation.issn', 'citation.author.givenName', 'sourceCode.creator.parentOrganization', 'sourceCode.creator.familyName', 'citation.pmid', 'sourceCode.creator.address.streetAddress', 'sourceCode.citation.url', 'citation.author.familyName', 'sourceCode.citation.author.additionalName', 'creator.address.addressCountry.url', 'creator.address.addressCountry.name', 'publisher.address.addressRegion', 'sourceCode.citation.author.name', 'keywords', 'publisher.address.addressCountry.url', 'citation.doi', 'sourceCode.name', 'contentUrlRepository', 'publisher.parentOrganization', 'publisher.contactPoint.email', 'contentUrlIdentifier', 'publisher.email', 'sourceCode.citation.pmid', 'sourceCode.creator.contactPoint.url', 'publisher.contactPoint.url'],
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
        # 2019-11-15: 289 fields
        "public_fields": ['schemaVersion', 'distribution.creator.address.addressLocality', 'sourceCode.creator.address.addressRegion', 'sourceCode.creator.logo', 'temporalCoverage.gt', 'distribution.contentUrlIdentifier', 'distribution.citation.pageEnd', 'distribution.publisher.address.addressCountry.name', 'distribution.sourceCode.creator.email', 'citation.author.additionalName', 'citation.journalNameAbbrev', 'sourceCode.citation.pagination', 'datePublished', 'creator.address.addressRegion', 'measurementTechnique', 'measurementCategory', 'distribution.citation.identifier', 'distribution.citation.author.familyName', 'distribution.citation.journalNameAbbrev', 'citation.identifier', 'creator.address.addressLocality', 'funding.funder.alternateName', 'creator.contactPoint.email', 'citation.pageStart', 'publisher.logo', 'distribution.sourceCode.citation.identifier', 'distribution.sourceCode.creator.address.addressRegion', 'creator.email', 'spatialCoverage.name', 'creator.contactPoint.url', 'funding.funder.url', 'distribution.sourceCode.codeRepository', 'creator.alternateName', 'sourceCode.creator.contactPoint.contactType', 'distribution.creator.alternateName', 'funding.funder.address.addressRegion', 'sourceCode.citation.pageStart', 'distribution.sourceCode.citation.@type', 'distribution.publisher.address.addressCountry.identifier', 'variableMeasured', 'distribution.additionalType', 'distribution.datePublished', 'creator.contactPoint.contactType', 'distribution.sourceCode.license', 'distribution.sourceCode.citation.author.name', 'sourceCode.creator.description', 'publisher.identifier', 'distribution.sourceCode.creator.contactPoint.email', 'distribution.publisher.contactPoint.contactType', 'dateModified', 'sourceCode.citation.issn', 'funding.funder.logo', 'distribution.publisher.address.addressCountry.alternateName', 'distribution.sourceCode.creator.address.postalCode', 'distribution.sourceCode.citation.doi', 'distribution.isBasedOn', 'publisher.address.addressRegion', 'sourceCode.citation.author.name', 'distribution.creator.address.addressCountry.identifier', 'distribution.sourceCode.creator.@type', 'distribution.citation.@type', 'distribution.sourceCode.@id', 'description', 'distribution.creator.contactPoint.url', 'distribution.publisher.contactPoint.url', 'sourceCode.citation.pmid', 'distribution.variableMeasured', 'distribution.creator.url', 'distribution.citation.author.givenName', 'distribution.sourceCode.citation.author.additionalName', 'creator.@type', 'creator.identifier', 'funding.funder.email', 'creator.name', 'distribution.publisher.parentOrganization', 'distribution.creator.identifier', 'sourceCode.citation.issueNumber', 'citation.issueNumber', 'creator.address.addressCountry.alternateName', 'distribution.publisher.logo', 'sourceCode.creator.@type', 'sourceCode.creator.identifier', '@id', 'distribution.experimentIDs', 'citation.author.name', 'distribution.dateCreated', 'funding.funder.identifier', 'sourceCode.description', 'publisher.url', 'distribution.sourceCode.creator.additionalName', 'publisher.address.addressCountry.identifier', 'distribution.sourceCode.citation.pageStart', 'distribution.contentUrl', 'funding.funder.name', 'distribution.sourceCode.creator.address.addressLocality', 'citation.journalName', 'distribution.sourceCode.creator.address.addressCountry.identifier', 'distribution.publisher.identifier', 'sourceCode.creator.address.addressCountry.name', 'sourceCode.license', 'distribution.sourceCode.creator.logo', 'funding.funder.@type', 'distribution.citation.volumeNumber', 'distribution.sourceCode.creator.address.addressCountry.name', 'spatialCoverage.identifier', 'funding.funder.contactPoint.email', 'distribution.sourceCode.creator.identifier', 'citation.name', 'sourceCode.citation.author.familyName', 'distribution.creator.address.addressRegion', 'citation.@type', 'distribution.measurementCategory', 'sourceCode.citation.pageEnd', 'distribution.sourceCode.creator.contactPoint.url', 'sourceCode.citation.@type', 'distribution.sourceCode.creator.address.addressCountry.alternateName', 'distribution.sourceCode.citation.volumeNumber', 'sourceCode.creator.address.addressCountry.alternateName', 'sourceCode.creator.contactPoint.email', 'distribution.citation.datePublished', 'funding.funder.contactPoint.url', 'sourceCode.dateModified', 'funding.funder.parentOrganization', 'publisher.address.addressCountry.name', 'publisher.@type', 'sourceCode.identifier', 'distribution.sourceCode.citation.issn', 'distribution.sourceCode.creator.contactPoint.contactType', 'temporalCoverage.gte', 'sourceCode.creator.address.streetAddress', 'distribution.creator.parentOrganization', 'citation.author.familyName', 'publisher.address.addressCountry.url', 'distribution.publisher.address.postalCode', 'distribution.encodingFormat', 'sourceCode.name', 'distribution.description', 'distribution.sourceCode.creator.name', 'distribution.sourceCode.dateModified', 'distribution.creator.description', 'version', 'creator.address.addressCountry.identifier', 'distribution.sourceCode.citation.journalName', 'creator.description', 'distribution.creator.address.addressCountry.name', 'publisher.address.streetAddress', 'distribution.sourceCode.creator.url', 'sourceCode.citation.name', 'distribution.measurementTechnique', 'sourceCode.programmingLanguage', 'sourceCode.creator.address.addressCountry.url', 'distribution.sourceCode.identifier', 'sameAs', 'distribution.sourceCode.creator.givenName', 'distribution.publisher.@type', 'sourceCode.citation.volumeNumber', 'citation.datePublished', 'citation.issn', 'funding.identifier', 'sourceCode.creator.name', 'publisher.contactPoint.contactType', 'distribution.creator.name', 'distribution.sourceCode.programmingLanguage', 'funding.funder.address.addressLocality', 'funding.funder.address.addressCountry.identifier', 'distribution.creator.logo', 'sourceCode.codeRepository', 'sourceCode.creator.additionalName', 'sourceCode.creator.url', 'publisher.address.addressLocality', 'funding.funder.contactPoint.contactType', 'citation.pageEnd', 'funding.funder.address.addressCountry.alternateName', 'creator.address.streetAddress', 'citation.volumeNumber', 'publisher.address.addressCountry.alternateName', 'sourceCode.citation.identifier', 'distribution.sourceCode.description', 'sourceCode.creator.email', 'distribution.citation.journalName', 'distribution.publisher.url', 'funding.funder.address.streetAddress', 'sourceCode.version', 'distribution.citation.pageStart', 'publisher.description', 'distribution.sameAs', 'distribution.sourceCode.creator.address.addressCountry.url', 'sourceCode.creator.address.addressCountry.identifier', 'sourceCode.datePublished', 'distribution.citation.author.name', 'distribution.contentUrlRepository', 'creator.address.postalCode', 'distribution.url', 'citation.author.givenName', 'sourceCode.creator.familyName', 'distribution.creator.address.postalCode', 'citation.pmid', 'distribution.publisher.address.addressCountry.url', 'spatialCoverage.url', 'sourceCode.citation.url', 'distribution.includedInDataset', 'funding.funder.description', 'creator.address.addressCountry.url', 'creator.address.addressCountry.name', 'distribution.publisher.email', 'distribution.sourceCode.version', 'citation.doi', 'temporalCoverage.lte', 'distribution.creator.address.addressCountry.url', 'publisher.email', 'distribution.citation.name', 'distribution.keywords', 'publisher.contactPoint.url', 'distribution.sourceCode.creator.familyName', 'distribution.sourceCode.citation.author.familyName', 'license', 'distribution.publisher.address.addressRegion', 'creator.parentOrganization', 'distribution.citation.issn', 'includedInDataCatalog', 'distribution.identifier', 'distribution.publisher.name', 'funding.funder.address.addressCountry.url', 'funding.funder.address.postalCode', 'distribution.citation.issueNumber', 'dataDownloadIDs', 'distribution.sourceCode.creator.description', 'identifier', 'sourceCode.creator.address.addressLocality', 'sourceCode.citation.author.givenName', 'distribution.publisher.alternateName', 'distribution.citation.pmid', 'distribution.sourceCode.citation.name', 'distribution.dateModified', 'distribution.creator.@type', 'sourceCode.creator.givenName', 'creator.url', 'distribution.publisher.address.addressLocality', 'distribution.sourceCode.citation.author.givenName', 'distribution.creator.contactPoint.contactType', 'distribution.citation.author.additionalName', 'distribution.sourceCode.citation.url', 'distribution.publisher.description', 'publisher.address.postalCode', 'distribution.sourceCode.citation.pmid', 'spatialCoverage.alternateName', 'sourceCode.citation.journalName', 'temporalCoverage.lt', 'sourceCode.citation.journalNameAbbrev', 'distribution.sourceCode.creator.address.streetAddress', 'publisher.name', 'sourceCode.citation.datePublished', 'publisher.alternateName', 'url', 'citation.url', 'distribution.sourceCode.name', 'creator.logo', 'distribution.sourceCode.citation.pagination', 'name', 'distribution.publisher.contactPoint.email', 'sourceCode.@id', 'distribution.sourceCode.creator.alternateName', 'distribution.creator.address.streetAddress', 'distribution.sourceCode.citation.journalNameAbbrev', 'citation.pagination', 'distribution.creator.address.addressCountry.alternateName', 'sourceCode.creator.address.postalCode', 'distribution.name', 'distribution.sourceCode.citation.datePublished', 'distribution.sourceCode.datePublished', 'sourceCode.creator.alternateName', 'distribution.creator.email', 'distribution.sourceCode.citation.pageEnd', 'distribution.sourceCode.creator.parentOrganization', 'sourceCode.citation.doi', 'distribution.@id', 'sourceCode.creator.parentOrganization', 'distribution.publisher.address.streetAddress', 'distribution.creator.contactPoint.email', 'sourceCode.citation.author.additionalName', 'keywords', 'distribution.citation.pagination', 'publisher.parentOrganization', 'distribution.sourceCode.citation.issueNumber', 'publisher.contactPoint.email', 'distribution.citation.url', 'funding.funder.address.addressCountry.name', 'distribution.citation.doi', 'sourceCode.creator.contactPoint.url'],
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
        # 2019-11-15: 238 fields
        "public_fields": ['data.referenceSeq', 'creator.address.addressCountry.identifier', 'analysisCode.citation.issn', 'correction', 'sourceCitation.pageEnd', 'creator.description', 'data.ELISAresult', 'publisher.address.streetAddress', 'includedInDataset', 'analysisCode.programmingLanguage', 'sourceCitation.parentOrganization', 'data.citation.identifier', 'analysisCode.creator.name', 'citation.author.additionalName', 'citation.journalNameAbbrev', 'data.ELISAvalue', 'creator.address.addressRegion', 'measurementTechnique', 'analysisCode.dateModified', 'data.SNP.mutatedAA', 'measurementCategory', 'data.publisher.logo', 'citation.datePublished', 'analysisCode.citation.issueNumber', 'citation.issn', 'citation.identifier', 'sourceCitation.author.familyName', 'data.publisher.email', 'data.virus', 'data.valueCategory', 'analysisCode.creator.address.streetAddress', 'data.virusSegment', 'analysisCode.codeRepository', 'creator.address.addressLocality', 'sourceCitation.issueNumber', 'data.publisher.address.addressRegion', 'publisher.contactPoint.contactType', 'creator.contactPoint.email', 'citation.pageStart', 'publisher.logo', 'analysisCode.version', 'data.citation.issn', 'analysisCode.creator.@type', 'creator.email', 'data.citation.author.familyName', 'publisher.address.addressLocality', 'citation.pageEnd', 'creator.contactPoint.url', 'data.antigen', 'data.citation.datePublished', 'sourceCitation.contactPoint.contactType', 'experimentDate', 'creator.address.streetAddress', 'citation.volumeNumber', 'data.citation.url', 'analysisCode.creator.parentOrganization', 'data.publisher.identifier', 'creator.alternateName', 'sourceCitation.journalNameAbbrev', 'sraID', 'data.SNP.SNP', 'data.publisher.address.streetAddress', 'analysisCode.citation.pageEnd', 'publisher.address.addressCountry.alternateName', 'data.antigenSource', 'analysisCode.citation.journalNameAbbrev', 'genbankID', 'analysisCode.citation.@type', 'data.novel', 'analysisCode.citation.url', 'data.publisher.description', 'analysisCode.citation.datePublished', 'analysisCode.@id', 'sourceCitation.name', 'variableMeasured', 'publisher.description', 'experimentID', 'sourceCitation.email', 'analysisCode.creator.familyName', 'data.locus', 'creator.contactPoint.contactType', 'analysisCode.creator.description', 'sourceCitation.alternateName', 'analysisCode.citation.name', 'sourceCitation.address.streetAddress', 'publisher.identifier', 'analysisCode.creator.address.addressCountry.name', 'analysisCode.datePublished', 'sourceCitation.address.postalCode', 'analysisCode.citation.doi', 'dateModified', 'data.citation.@type', 'data.citation.author.name', 'data.assayType', 'creator.address.postalCode', 'sourceCitation.doi', 'citation.author.givenName', 'analysisCode.description', 'analysisCode.creator.address.addressCountry.alternateName', 'citation.pmid', 'data.controlType', 'sourceCitation.identifier', 'data.sampleDilution', 'creator.address.addressCountry.url', 'creator.address.addressCountry.name', 'publisher.address.addressRegion', 'data.alignedDNAsequence', 'data.citation.author.additionalName', 'data.citation.pmid', 'sourceCitation.pageStart', 'data.citation.journalNameAbbrev', 'citation.doi', 'data.publisher.address.addressCountry.alternateName', 'analysisCode.creator.givenName', 'publisher.email', 'description', 'analysisCode.identifier', 'analysisCode.citation.author.additionalName', 'sourceCitation.author.additionalName', 'sourceCitation.contactPoint.email', 'analysisCode.citation.author.familyName', 'publisher.contactPoint.url', 'data.timepoint', 'data.publisher.@type', 'creator.parentOrganization', 'data.allele', 'visitCode', 'analysisCode.creator.address.addressRegion', 'analysisCode.citation.pageStart', 'creator.@type', 'creator.identifier', 'sourceCitation.url', 'creator.name', 'analysisCode.creator.alternateName', 'data.outcome', 'citation.issueNumber', 'data.publisher.address.addressLocality', 'creator.address.addressCountry.alternateName', 'data.assayReadout', 'analysisCode.citation.journalName', 'data.publisher.address.addressCountry.identifier', 'analysisCode.citation.author.name', 'data.patientID', 'isControl', 'citation.author.name', 'data.citation.volumeNumber', 'data.citation.name', 'analysisCode.citation.volumeNumber', 'data.correction', 'data.SNP.originalAA', 'sourceCitation.address.addressLocality', 'analysisCode.creator.logo', 'creator.url', 'publisher.url', 'publisher.address.addressCountry.identifier', 'data.citation.pagination', 'sourceCitation.pagination', 'analysisCode.creator.url', 'data.citation.issueNumber', 'dataStatus', 'data.citation.doi', 'data.antigenVirus', 'data.publisher.parentOrganization', 'data.citation.pageEnd', 'citation.journalName', 'analysisCode.citation.pmid', 'analysisCode.creator.contactPoint.contactType', 'sourceCitation.@type', 'publisher.address.postalCode', 'sourceCitation.pmid', 'data.publisher.contactPoint.contactType', 'publisher.name', 'data.value', 'publisher.alternateName', 'sourceCitation.address.addressCountry.name', 'citation.url', 'data.valueCategoryNumeric', 'sourceCitation.address.addressCountry.identifier', 'creator.logo', 'name', 'analysisCode.license', 'data.publisher.address.addressCountry.name', 'sourceCitation.contactPoint.url', 'analysisCode.creator.address.addressCountry.url', 'patientID', 'data.publisher.address.addressCountry.url', 'analysisCode.creator.email', 'sourceCitation.issn', 'data.SNP.SNPdetected', 'citation.pagination', 'sourceCitation.author.name', 'data.publisher.contactPoint.email', 'citation.name', 'sourceCitation.journalName', 'sourceCitation.volumeNumber', 'analysisCode.creator.address.addressCountry.identifier', 'data.citation.author.givenName', 'citation.@type', 'sourceCitation.datePublished', 'batchID', 'sourceCitation.author.givenName', 'sourceCitation.address.addressCountry.url', 'analysisCode.citation.identifier', 'data.publisher.address.postalCode', 'data.citation.journalName', 'data.publisher.name', 'analysisCode.citation.pagination', 'data.cohort', 'data.publisher.contactPoint.url', 'data.publisher.alternateName', 'analysisCode.creator.contactPoint.url', 'publisher.address.addressCountry.name', 'sourceCitation.address.addressRegion', 'publisher.@type', 'sourceCitation.description', 'data.DNAsequence', 'data.AAsequence', 'data.isReferenceSeq', 'analysisCode.creator.address.addressLocality', 'analysisCode.name', 'analysisCode.citation.author.givenName', 'data.@type', 'sourceCitation.logo', 'analysisCode.creator.contactPoint.email', 'data.alignedAAsequence', 'citation.author.familyName', 'sourceCitation.address.addressCountry.alternateName', 'publisher.address.addressCountry.url', 'data.SNP.SNPlocation', 'data.dataStatus', 'publisher.parentOrganization', 'analysisCode.creator.identifier', 'publisher.contactPoint.email', 'analysisCode.creator.address.postalCode', 'data.publisher.url', 'data.citation.pageStart', 'analysisCode.creator.additionalName', 'releaseDate'],
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
        # 2019-11-15: 149 fields
        "public_fields": ['presentationWeek.lte', 'elisa.publisher.parentOrganization', 'elisa.publisher.url', 'elisa.publisher.name', 'outcome', 'correction', 'sourceCitation.pageEnd', 'elisa.publisher.description', 'publisher.address.streetAddress', 'sourceCitation.url', 'sourceCitation.parentOrganization', 'citation.author.additionalName', 'citation.journalNameAbbrev', 'citation.issueNumber', 'elisa.virus', 'presentationWeek.gte', 'elisa.citation.volumeNumber', 'presentationWeek.lt', 'gender', 'citation.author.name', 'citation.datePublished', 'admin2.alternateName', 'citation.issn', 'citation.identifier', 'sourceCitation.author.familyName', 'sourceCitation.address.addressLocality', 'country.url', 'publisher.url', 'elisa.ELISAresult', 'publisher.address.addressCountry.identifier', 'elisa.publisher.contactPoint.email', 'age', 'elisa.correction', 'sourceCitation.pagination', 'sourceCitation.issueNumber', 'admin2.administrativeUnit', 'dataStatus', 'elisa.citation.pmid', 'publisher.contactPoint.contactType', 'citation.pageStart', 'elisa.citation.@type', 'publisher.logo', 'citation.journalName', 'admin2.name', 'sourceCitation.@type', 'publisher.address.postalCode', 'elisa.publisher.address.addressRegion', 'elisa.citation.issn', 'sourceCitation.pmid', 'elisa.publisher.address.streetAddress', 'elisa.citation.pagination', 'publisher.name', 'publisher.address.addressLocality', 'elisa.dataStatus', 'publisher.alternateName', 'species', 'citation.pageEnd', 'citation.url', 'sourceCitation.address.addressCountry.identifier', 'sourceCitation.address.addressCountry.name', 'sourceCitation.contactPoint.contactType', 'elisa.publisher.address.addressCountry.alternateName', 'elisa.citation.identifier', 'citation.volumeNumber', 'sourceCitation.contactPoint.url', 'elisa.publisher.address.addressLocality', 'presentationWeek.gt', 'sourceCitation.journalNameAbbrev', 'patientID', 'elisa.citation.author.familyName', 'admin3.name', 'cohort', 'publisher.address.addressCountry.alternateName', 'elisa.citation.doi', 'elisa.citation.issueNumber', 'sourceCitation.issn', 'elisa.citation.pageEnd', 'citation.pagination', 'sourceCitation.author.name', 'elisa.publisher.contactPoint.url', 'citation.name', 'sourceCitation.journalName', 'admin2.identifier', 'sourceCitation.volumeNumber', 'sourceCitation.name', 'citation.@type', 'sourceCitation.datePublished', 'elisa.publisher.logo', 'admin3.identifier', 'publisher.description', 'sourceCitation.author.givenName', 'sourceCitation.email', 'infectionYear', 'elisa.publisher.@type', 'elisa.citation.name', 'sourceCitation.alternateName', 'sourceCitation.address.addressCountry.url', 'sourceCitation.address.streetAddress', 'elisa.@type', 'elisa.publisher.address.addressCountry.name', 'elisa.citation.datePublished', 'elisa.citation.journalNameAbbrev', 'publisher.identifier', 'admin3.administrativeUnit', 'admin3.administrativeType', 'elisa.publisher.address.addressCountry.url', 'sourceCitation.address.postalCode', 'publisher.address.addressCountry.name', 'dateModified', 'publisher.@type', 'sourceCitation.address.addressRegion', 'sourceCitation.description', 'country.identifier', 'elisa.publisher.identifier', 'elisa.ELISAvalue', 'sourceCitation.doi', 'elisa.timepoint', 'citation.author.givenName', 'elisa.assayType', 'elisa.publisher.contactPoint.contactType', 'elisa.citation.url', 'citation.pmid', 'sourceCitation.logo', 'elisa.citation.author.name', 'citation.author.familyName', 'sourceCitation.identifier', 'sourceCitation.address.addressCountry.alternateName', 'elisa.citation.pageStart', 'elisa.publisher.address.addressCountry.identifier', 'publisher.address.addressRegion', 'elisa.citation.journalName', 'country.name', 'sourceCitation.pageStart', 'publisher.address.addressCountry.url', 'elisa.citation.author.additionalName', 'admin3.alternateName', 'citation.doi', 'elisa.citation.author.givenName', 'elisa.publisher.address.postalCode', 'elisa.publisher.email', 'country.alternateName', 'publisher.parentOrganization', 'publisher.contactPoint.email', 'elisa.publisher.alternateName', 'admin2.administrativeType', 'publisher.email', 'sourceCitation.author.additionalName', 'sourceCitation.contactPoint.email', 'publisher.contactPoint.url'],
        "elasticsearch_private_index_body": {
            "settings": CVISB_DEFAULT_SETTINGS,
            "mappings": {
                "patient": {
                    'dynamic': 'true',
                    'dynamic_date_formats': ['yyyy-MM-dd'],
                    'dynamic_templates': [
                        #{
                        #    'infectionDateRange': {
                        #        'path_match': 'infectionDate',
                        #        'mapping': {
                        #            'dynamic': 'false',
                        #            'format': 'yyyy-MM-dd',
                        #            'type': 'date_range'
                        #        }
                        #    }
                        #},
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
        # 2019-11-15: 67 fields
        "public_fields": ['description', 'schemaVersion', 'funding.funder.address.addressRegion', 'publisher.address.addressCountry.alternateName', 'funding.funder.@type', 'funding.funder.address.streetAddress', 'publisher.address.streetAddress', 'temporalCoverage.gt', 'funding.funder.email', 'releaseNotes.description.endpoint', 'spatialCoverage.identifier', 'funding.funder.address.addressCountry.url', 'funding.funder.contactPoint.email', 'releaseNotes.description.note', 'funding.funder.address.postalCode', 'datePublished', 'publisher.description', 'identifier', 'releaseNotes.datePublished', 'alternateName', 'releaseNotes.overview', 'releaseVersion', 'sameAs', 'funding.funder.contactPoint.url', 'publisher.identifier', '@id', 'funding.funder.identifier', 'funding.funder.parentOrganization', 'publisher.address.addressCountry.name', 'dateModified', 'publisher.@type', 'funding.identifier', 'funding.funder.url', 'dataset', 'publisher.url', 'funding.funder.logo', 'publisher.address.addressCountry.identifier', 'funding.funder.name', 'temporalCoverage.gte', 'spatialCoverage.url', 'funding.funder.description', 'funding.funder.alternateName', 'publisher.contactPoint.contactType', 'publisher.address.addressRegion', 'releaseNotes.version', 'publisher.logo', 'keywords', 'publisher.address.postalCode', 'publisher.address.addressCountry.url', 'funding.funder.address.addressLocality', 'spatialCoverage.alternateName', 'funding.funder.address.addressCountry.identifier', 'temporalCoverage.lt', 'temporalCoverage.lte', 'publisher.name', 'publisher.parentOrganization', 'publisher.address.addressLocality', 'publisher.alternateName', 'spatialCoverage.name', 'url', 'publisher.contactPoint.email', 'funding.funder.contactPoint.contactType', 'publisher.email', 'funding.funder.address.addressCountry.alternateName', 'funding.funder.address.addressCountry.name', 'name', 'publisher.contactPoint.url'],
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
