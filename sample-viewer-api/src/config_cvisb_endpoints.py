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
        "public_fields": ["AVLinactivated", "dateModified", "derivedIndex", "dilutionFactor", "freezingBuffer", "patientID", "protocolURL", "protocolVersion", "sampleGroup", "sampleType", "samplingDate.gt", "samplingDate.gte", "samplingDate.lt", "samplingDate.lte", "species", "visitCode"],
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
        # 2019-11-15: 131 fields
        "public_fields": ["@id","additionalType","author.@type","author.address.addressCountry.alternateName","author.address.addressCountry.identifier","author.address.addressCountry.name","author.address.addressCountry.url","author.address.addressLocality","author.address.addressRegion","author.address.postalCode","author.address.streetAddress","author.alternateName","author.contactPoint.contactType","author.contactPoint.email","author.contactPoint.url","author.description","author.email","author.identifier","author.logo","author.name","author.parentOrganization","author.url","citation.@type","citation.author.additionalName","citation.author.familyName","citation.author.givenName","citation.author.name","citation.datePublished","citation.doi","citation.identifier","citation.issn","citation.issueNumber","citation.journalName","citation.journalNameAbbrev","citation.name","citation.pageEnd","citation.pageStart","citation.pagination","citation.pmid","citation.url","citation.volumeNumber","contentUrl","contentUrlIdentifier","contentUrlRepository","dateCreated","dateModified","datePublished","description","encodingFormat","experimentIDs","identifier","includedInDataset","isBasedOn","keywords","measurementCategory","measurementTechnique","name","publisher.@type","publisher.address.addressCountry.alternateName","publisher.address.addressCountry.identifier","publisher.address.addressCountry.name","publisher.address.addressCountry.url","publisher.address.addressLocality","publisher.address.addressRegion","publisher.address.postalCode","publisher.address.streetAddress","publisher.alternateName","publisher.contactPoint.contactType","publisher.contactPoint.email","publisher.contactPoint.url","publisher.description","publisher.email","publisher.identifier","publisher.logo","publisher.name","publisher.parentOrganization","publisher.url","sameAs","sourceCode.@id","sourceCode.author.@type","sourceCode.author.additionalName","sourceCode.author.address.addressCountry.alternateName","sourceCode.author.address.addressCountry.identifier","sourceCode.author.address.addressCountry.name","sourceCode.author.address.addressCountry.url","sourceCode.author.address.addressLocality","sourceCode.author.address.addressRegion","sourceCode.author.address.postalCode","sourceCode.author.address.streetAddress","sourceCode.author.alternateName","sourceCode.author.contactPoint.contactType","sourceCode.author.contactPoint.email","sourceCode.author.contactPoint.url","sourceCode.author.description","sourceCode.author.email","sourceCode.author.familyName","sourceCode.author.givenName","sourceCode.author.identifier","sourceCode.author.logo","sourceCode.author.name","sourceCode.author.parentOrganization","sourceCode.author.url","sourceCode.citation.@type","sourceCode.citation.author.additionalName","sourceCode.citation.author.familyName","sourceCode.citation.author.givenName","sourceCode.citation.author.name","sourceCode.citation.datePublished","sourceCode.citation.doi","sourceCode.citation.identifier","sourceCode.citation.issn","sourceCode.citation.issueNumber","sourceCode.citation.journalName","sourceCode.citation.journalNameAbbrev","sourceCode.citation.name","sourceCode.citation.pageEnd","sourceCode.citation.pageStart","sourceCode.citation.pagination","sourceCode.citation.pmid","sourceCode.citation.url","sourceCode.citation.volumeNumber","sourceCode.codeRepository","sourceCode.dateModified","sourceCode.datePublished","sourceCode.description","sourceCode.identifier","sourceCode.license","sourceCode.name","sourceCode.programmingLanguage","sourceCode.version","url"],
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
        # 2019-11-15: 287 fields
        "public_fields": ["@id","author.@type","author.address.addressCountry.alternateName","author.address.addressCountry.identifier","author.address.addressCountry.name","author.address.addressCountry.url","author.address.addressLocality","author.address.addressRegion","author.address.postalCode","author.address.streetAddress","author.alternateName","author.contactPoint.contactType","author.contactPoint.email","author.contactPoint.url","author.description","author.email","author.identifier","author.logo","author.name","author.parentOrganization","author.url","citation.@type","citation.author.additionalName","citation.author.familyName","citation.author.givenName","citation.author.name","citation.datePublished","citation.doi","citation.identifier","citation.issn","citation.issueNumber","citation.journalName","citation.journalNameAbbrev","citation.name","citation.pageEnd","citation.pageStart","citation.pagination","citation.pmid","citation.url","citation.volumeNumber","dataDownloadIDs","dateModified","datePublished","description","distribution.@id","distribution.additionalType","distribution.author.@type","distribution.author.address.addressCountry.alternateName","distribution.author.address.addressCountry.identifier","distribution.author.address.addressCountry.name","distribution.author.address.addressCountry.url","distribution.author.address.addressLocality","distribution.author.address.addressRegion","distribution.author.address.postalCode","distribution.author.address.streetAddress","distribution.author.alternateName","distribution.author.contactPoint.contactType","distribution.author.contactPoint.email","distribution.author.contactPoint.url","distribution.author.description","distribution.author.email","distribution.author.identifier","distribution.author.logo","distribution.author.name","distribution.author.parentOrganization","distribution.author.url","distribution.citation.@type","distribution.citation.author.additionalName","distribution.citation.author.familyName","distribution.citation.author.givenName","distribution.citation.author.name","distribution.citation.datePublished","distribution.citation.doi","distribution.citation.identifier","distribution.citation.issn","distribution.citation.issueNumber","distribution.citation.journalName","distribution.citation.journalNameAbbrev","distribution.citation.name","distribution.citation.pageEnd","distribution.citation.pageStart","distribution.citation.pagination","distribution.citation.pmid","distribution.citation.url","distribution.citation.volumeNumber","distribution.contentUrl","distribution.contentUrlIdentifier","distribution.contentUrlRepository","distribution.dateCreated","distribution.dateModified","distribution.datePublished","distribution.description","distribution.encodingFormat","distribution.experimentIDs","distribution.identifier","distribution.includedInDataset","distribution.isBasedOn","distribution.keywords","distribution.measurementCategory","distribution.measurementTechnique","distribution.name","distribution.publisher.@type","distribution.publisher.address.addressCountry.alternateName","distribution.publisher.address.addressCountry.identifier","distribution.publisher.address.addressCountry.name","distribution.publisher.address.addressCountry.url","distribution.publisher.address.addressLocality","distribution.publisher.address.addressRegion","distribution.publisher.address.postalCode","distribution.publisher.address.streetAddress","distribution.publisher.alternateName","distribution.publisher.contactPoint.contactType","distribution.publisher.contactPoint.email","distribution.publisher.contactPoint.url","distribution.publisher.description","distribution.publisher.email","distribution.publisher.identifier","distribution.publisher.logo","distribution.publisher.name","distribution.publisher.parentOrganization","distribution.publisher.url","distribution.sameAs","distribution.sourceCode.@id","distribution.sourceCode.author.@type","distribution.sourceCode.author.additionalName","distribution.sourceCode.author.address.addressCountry.alternateName","distribution.sourceCode.author.address.addressCountry.identifier","distribution.sourceCode.author.address.addressCountry.name","distribution.sourceCode.author.address.addressCountry.url","distribution.sourceCode.author.address.addressLocality","distribution.sourceCode.author.address.addressRegion","distribution.sourceCode.author.address.postalCode","distribution.sourceCode.author.address.streetAddress","distribution.sourceCode.author.alternateName","distribution.sourceCode.author.contactPoint.contactType","distribution.sourceCode.author.contactPoint.email","distribution.sourceCode.author.contactPoint.url","distribution.sourceCode.author.description","distribution.sourceCode.author.email","distribution.sourceCode.author.familyName","distribution.sourceCode.author.givenName","distribution.sourceCode.author.identifier","distribution.sourceCode.author.logo","distribution.sourceCode.author.name","distribution.sourceCode.author.parentOrganization","distribution.sourceCode.author.url","distribution.sourceCode.citation.@type","distribution.sourceCode.citation.author.additionalName","distribution.sourceCode.citation.author.familyName","distribution.sourceCode.citation.author.givenName","distribution.sourceCode.citation.author.name","distribution.sourceCode.citation.datePublished","distribution.sourceCode.citation.doi","distribution.sourceCode.citation.identifier","distribution.sourceCode.citation.issn","distribution.sourceCode.citation.issueNumber","distribution.sourceCode.citation.journalName","distribution.sourceCode.citation.journalNameAbbrev","distribution.sourceCode.citation.name","distribution.sourceCode.citation.pageEnd","distribution.sourceCode.citation.pageStart","distribution.sourceCode.citation.pagination","distribution.sourceCode.citation.pmid","distribution.sourceCode.citation.url","distribution.sourceCode.citation.volumeNumber","distribution.sourceCode.codeRepository","distribution.sourceCode.dateModified","distribution.sourceCode.datePublished","distribution.sourceCode.description","distribution.sourceCode.identifier","distribution.sourceCode.license","distribution.sourceCode.name","distribution.sourceCode.programmingLanguage","distribution.sourceCode.version","distribution.url","funding.funder.@type","funding.funder.address.addressCountry.alternateName","funding.funder.address.addressCountry.identifier","funding.funder.address.addressCountry.name","funding.funder.address.addressCountry.url","funding.funder.address.addressLocality","funding.funder.address.addressRegion","funding.funder.address.postalCode","funding.funder.address.streetAddress","funding.funder.alternateName","funding.funder.contactPoint.contactType","funding.funder.contactPoint.email","funding.funder.contactPoint.url","funding.funder.description","funding.funder.email","funding.funder.identifier","funding.funder.logo","funding.funder.name","funding.funder.parentOrganization","funding.funder.url","funding.identifier","identifier","includedInDataCatalog","keywords","license","measurementCategory","measurementTechnique","name","publisher.@type","publisher.address.addressCountry.alternateName","publisher.address.addressCountry.identifier","publisher.address.addressCountry.name","publisher.address.addressCountry.url","publisher.address.addressLocality","publisher.address.addressRegion","publisher.address.postalCode","publisher.address.streetAddress","publisher.alternateName","publisher.contactPoint.contactType","publisher.contactPoint.email","publisher.contactPoint.url","publisher.description","publisher.email","publisher.identifier","publisher.logo","publisher.name","publisher.parentOrganization","publisher.url","sameAs","schemaVersion","sourceCode.@id","sourceCode.author.@type","sourceCode.author.additionalName","sourceCode.author.address.addressCountry.alternateName","sourceCode.author.address.addressCountry.identifier","sourceCode.author.address.addressCountry.name","sourceCode.author.address.addressCountry.url","sourceCode.author.address.addressLocality","sourceCode.author.address.addressRegion","sourceCode.author.address.postalCode","sourceCode.author.address.streetAddress","sourceCode.author.alternateName","sourceCode.author.contactPoint.contactType","sourceCode.author.contactPoint.email","sourceCode.author.contactPoint.url","sourceCode.author.description","sourceCode.author.email","sourceCode.author.familyName","sourceCode.author.givenName","sourceCode.author.identifier","sourceCode.author.logo","sourceCode.author.name","sourceCode.author.parentOrganization","sourceCode.author.url","sourceCode.citation.@type","sourceCode.citation.author.additionalName","sourceCode.citation.author.familyName","sourceCode.citation.author.givenName","sourceCode.citation.author.name","sourceCode.citation.datePublished","sourceCode.citation.doi","sourceCode.citation.identifier","sourceCode.citation.issn","sourceCode.citation.issueNumber","sourceCode.citation.journalName","sourceCode.citation.journalNameAbbrev","sourceCode.citation.name","sourceCode.citation.pageEnd","sourceCode.citation.pageStart","sourceCode.citation.pagination","sourceCode.citation.pmid","sourceCode.citation.url","sourceCode.citation.volumeNumber","sourceCode.codeRepository","sourceCode.dateModified","sourceCode.datePublished","sourceCode.description","sourceCode.identifier","sourceCode.license","sourceCode.name","sourceCode.programmingLanguage","sourceCode.version","spatialCoverage.alternateName","spatialCoverage.identifier","spatialCoverage.name","spatialCoverage.url","temporalCoverage.gt","temporalCoverage.gte","temporalCoverage.lt","temporalCoverage.lte","url","variableMeasured"],
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
        # 2019-11-15: 241 fields
        "public_fields": ["analysisCode.@id","analysisCode.author.@type","analysisCode.author.additionalName","analysisCode.author.address.addressCountry.alternateName","analysisCode.author.address.addressCountry.identifier","analysisCode.author.address.addressCountry.name","analysisCode.author.address.addressCountry.url","analysisCode.author.address.addressLocality","analysisCode.author.address.addressRegion","analysisCode.author.address.postalCode","analysisCode.author.address.streetAddress","analysisCode.author.alternateName","analysisCode.author.contactPoint.contactType","analysisCode.author.contactPoint.email","analysisCode.author.contactPoint.url","analysisCode.author.description","analysisCode.author.email","analysisCode.author.familyName","analysisCode.author.givenName","analysisCode.author.identifier","analysisCode.author.logo","analysisCode.author.name","analysisCode.author.parentOrganization","analysisCode.author.url","analysisCode.citation.@type","analysisCode.citation.author.additionalName","analysisCode.citation.author.familyName","analysisCode.citation.author.givenName","analysisCode.citation.author.name","analysisCode.citation.datePublished","analysisCode.citation.doi","analysisCode.citation.identifier","analysisCode.citation.issn","analysisCode.citation.issueNumber","analysisCode.citation.journalName","analysisCode.citation.journalNameAbbrev","analysisCode.citation.name","analysisCode.citation.pageEnd","analysisCode.citation.pageStart","analysisCode.citation.pagination","analysisCode.citation.pmid","analysisCode.citation.url","analysisCode.citation.volumeNumber","analysisCode.codeRepository","analysisCode.dateModified","analysisCode.datePublished","analysisCode.description","analysisCode.identifier","analysisCode.license","analysisCode.name","analysisCode.programmingLanguage","analysisCode.version","author.@type","author.address.addressCountry.alternateName","author.address.addressCountry.identifier","author.address.addressCountry.name","author.address.addressCountry.url","author.address.addressLocality","author.address.addressRegion","author.address.postalCode","author.address.streetAddress","author.alternateName","author.contactPoint.contactType","author.contactPoint.email","author.contactPoint.url","author.description","author.email","author.identifier","author.logo","author.name","author.parentOrganization","author.url","batchID","citation.@type","citation.author.additionalName","citation.author.familyName","citation.author.givenName","citation.author.name","citation.datePublished","citation.doi","citation.identifier","citation.issn","citation.issueNumber","citation.journalName","citation.journalNameAbbrev","citation.name","citation.pageEnd","citation.pageStart","citation.pagination","citation.pmid","citation.url","citation.volumeNumber","correction","data.@type","data.A","data.AAsequence","data.B","data.C","data.DNAsequence","data.DPA1","data.DPB1","data.DQA1","data.DQB1","data.DRB1","data.DRB3","data.DRB4","data.DRB5","data.ELISAresult","data.ELISAvalue","data.SNP.SNP","data.SNP.SNPdetected","data.SNP.SNPlocation","data.SNP.mutatedAA","data.SNP.originalAA","data.alignedAAsequence","data.alignedDNAsequence","data.antigen","data.antigenSource","data.antigenVirus","data.assayReadout","data.assayType","data.citation.@type","data.citation.author.additionalName","data.citation.author.familyName","data.citation.author.givenName","data.citation.author.name","data.citation.datePublished","data.citation.doi","data.citation.identifier","data.citation.issn","data.citation.issueNumber","data.citation.journalName","data.citation.journalNameAbbrev","data.citation.name","data.citation.pageEnd","data.citation.pageStart","data.citation.pagination","data.citation.pmid","data.citation.url","data.citation.volumeNumber","data.correction","data.dataStatus","data.isReferenceSeq","data.publisher.@type","data.publisher.address.addressCountry.alternateName","data.publisher.address.addressCountry.identifier","data.publisher.address.addressCountry.name","data.publisher.address.addressCountry.url","data.publisher.address.addressLocality","data.publisher.address.addressRegion","data.publisher.address.postalCode","data.publisher.address.streetAddress","data.publisher.alternateName","data.publisher.contactPoint.contactType","data.publisher.contactPoint.email","data.publisher.contactPoint.url","data.publisher.description","data.publisher.email","data.publisher.identifier","data.publisher.logo","data.publisher.name","data.publisher.parentOrganization","data.publisher.url","data.referenceSeq","data.sampleDilution","data.timepoint","data.value","data.valueCategory","data.valueCategoryNumeric","data.virus","data.virusSegment","dataStatus","dateModified","description","experimentDate","experimentID","genbankID","includedInDataset","isControl","measurementCategory","measurementTechnique","name","patientID","publisher.@type","publisher.address.addressCountry.alternateName","publisher.address.addressCountry.identifier","publisher.address.addressCountry.name","publisher.address.addressCountry.url","publisher.address.addressLocality","publisher.address.addressRegion","publisher.address.postalCode","publisher.address.streetAddress","publisher.alternateName","publisher.contactPoint.contactType","publisher.contactPoint.email","publisher.contactPoint.url","publisher.description","publisher.email","publisher.identifier","publisher.logo","publisher.name","publisher.parentOrganization","publisher.url","releaseDate","sourceCitation.@type","sourceCitation.address.addressCountry.alternateName","sourceCitation.address.addressCountry.identifier","sourceCitation.address.addressCountry.name","sourceCitation.address.addressCountry.url","sourceCitation.address.addressLocality","sourceCitation.address.addressRegion","sourceCitation.address.postalCode","sourceCitation.address.streetAddress","sourceCitation.alternateName","sourceCitation.author.additionalName","sourceCitation.author.familyName","sourceCitation.author.givenName","sourceCitation.author.name","sourceCitation.contactPoint.contactType","sourceCitation.contactPoint.email","sourceCitation.contactPoint.url","sourceCitation.datePublished","sourceCitation.description","sourceCitation.doi","sourceCitation.email","sourceCitation.identifier","sourceCitation.issn","sourceCitation.issueNumber","sourceCitation.journalName","sourceCitation.journalNameAbbrev","sourceCitation.logo","sourceCitation.name","sourceCitation.pageEnd","sourceCitation.pageStart","sourceCitation.pagination","sourceCitation.parentOrganization","sourceCitation.pmid","sourceCitation.url","sourceCitation.volumeNumber","sraID","visitCode"],
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
        "public_fields": ["admin2.administrativeType","admin2.administrativeUnit","admin2.alternateName","admin2.identifier","admin2.name","admin3.administrativeType","admin3.administrativeUnit","admin3.alternateName","admin3.identifier","admin3.name","age","citation.@type","citation.author.additionalName","citation.author.familyName","citation.author.givenName","citation.author.name","citation.datePublished","citation.doi","citation.identifier","citation.issn","citation.issueNumber","citation.journalName","citation.journalNameAbbrev","citation.name","citation.pageEnd","citation.pageStart","citation.pagination","citation.pmid","citation.url","citation.volumeNumber","cohort","correction","country.alternateName","country.identifier","country.name","country.url","dataStatus","dateModified","elisa.@type","elisa.ELISAresult","elisa.ELISAvalue","elisa.assayType","elisa.citation.@type","elisa.citation.author.additionalName","elisa.citation.author.familyName","elisa.citation.author.givenName","elisa.citation.author.name","elisa.citation.datePublished","elisa.citation.doi","elisa.citation.identifier","elisa.citation.issn","elisa.citation.issueNumber","elisa.citation.journalName","elisa.citation.journalNameAbbrev","elisa.citation.name","elisa.citation.pageEnd","elisa.citation.pageStart","elisa.citation.pagination","elisa.citation.pmid","elisa.citation.url","elisa.citation.volumeNumber","elisa.correction","elisa.dataStatus","elisa.publisher.@type","elisa.publisher.address.addressCountry.alternateName","elisa.publisher.address.addressCountry.identifier","elisa.publisher.address.addressCountry.name","elisa.publisher.address.addressCountry.url","elisa.publisher.address.addressLocality","elisa.publisher.address.addressRegion","elisa.publisher.address.postalCode","elisa.publisher.address.streetAddress","elisa.publisher.alternateName","elisa.publisher.contactPoint.contactType","elisa.publisher.contactPoint.email","elisa.publisher.contactPoint.url","elisa.publisher.description","elisa.publisher.email","elisa.publisher.identifier","elisa.publisher.logo","elisa.publisher.name","elisa.publisher.parentOrganization","elisa.publisher.url","elisa.timepoint","elisa.virus","gender","infectionYear","outcome","patientID","presentationWeek.gt","presentationWeek.gte","presentationWeek.lt","presentationWeek.lte","publisher.@type","publisher.address.addressCountry.alternateName","publisher.address.addressCountry.identifier","publisher.address.addressCountry.name","publisher.address.addressCountry.url","publisher.address.addressLocality","publisher.address.addressRegion","publisher.address.postalCode","publisher.address.streetAddress","publisher.alternateName","publisher.contactPoint.contactType","publisher.contactPoint.email","publisher.contactPoint.url","publisher.description","publisher.email","publisher.identifier","publisher.logo","publisher.name","publisher.parentOrganization","publisher.url","sourceCitation.@type","sourceCitation.address.addressCountry.alternateName","sourceCitation.address.addressCountry.identifier","sourceCitation.address.addressCountry.name","sourceCitation.address.addressCountry.url","sourceCitation.address.addressLocality","sourceCitation.address.addressRegion","sourceCitation.address.postalCode","sourceCitation.address.streetAddress","sourceCitation.alternateName","sourceCitation.author.additionalName","sourceCitation.author.familyName","sourceCitation.author.givenName","sourceCitation.author.name","sourceCitation.contactPoint.contactType","sourceCitation.contactPoint.email","sourceCitation.contactPoint.url","sourceCitation.datePublished","sourceCitation.description","sourceCitation.doi","sourceCitation.email","sourceCitation.identifier","sourceCitation.issn","sourceCitation.issueNumber","sourceCitation.journalName","sourceCitation.journalNameAbbrev","sourceCitation.logo","sourceCitation.name","sourceCitation.pageEnd","sourceCitation.pageStart","sourceCitation.pagination","sourceCitation.parentOrganization","sourceCitation.pmid","sourceCitation.url","sourceCitation.volumeNumber","species"],
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
        # 2019-11-15: 67 fields
        "public_fields": ["@id", "alternateName", "dataset", "dateModified", "datePublished", "description", "funding.funder.@type", "funding.funder.address.addressCountry.alternateName", "funding.funder.address.addressCountry.identifier", "funding.funder.address.addressCountry.name", "funding.funder.address.addressCountry.url", "funding.funder.address.addressLocality", "funding.funder.address.addressRegion", "funding.funder.address.postalCode", "funding.funder.address.streetAddress", "funding.funder.alternateName", "funding.funder.contactPoint.contactType", "funding.funder.contactPoint.email", "funding.funder.contactPoint.url", "funding.funder.description", "funding.funder.email", "funding.funder.identifier", "funding.funder.logo", "funding.funder.name", "funding.funder.parentOrganization", "funding.funder.url", "funding.identifier", "identifier", "keywords", "name", "publisher.@type", "publisher.address.addressCountry.alternateName", "publisher.address.addressCountry.identifier", "publisher.address.addressCountry.name", "publisher.address.addressCountry.url", "publisher.address.addressLocality", "publisher.address.addressRegion", "publisher.address.postalCode", "publisher.address.streetAddress", "publisher.alternateName", "publisher.contactPoint.contactType", "publisher.contactPoint.email", "publisher.contactPoint.url", "publisher.description", "publisher.email", "publisher.identifier", "publisher.logo", "publisher.name", "publisher.parentOrganization", "publisher.url", "releaseNotes.datePublished", "releaseNotes.description.description", "releaseNotes.description.endpoint", "releaseNotes.overview", "releaseNotes.version", "releaseVersion", "sameAs", "schemaVersion", "spatialCoverage.alternateName", "spatialCoverage.identifier", "spatialCoverage.name", "spatialCoverage.url", "temporalCoverage.gt", "temporalCoverage.gte", "temporalCoverage.lt", "temporalCoverage.lte", "url"],
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
