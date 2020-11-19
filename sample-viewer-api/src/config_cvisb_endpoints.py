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
        # 2020-11-18: 16 fields
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
        # 2020-11-18: 164 fields
        "public_fields": ["@id","additionalType","citation.@type","citation.address.addressCountry.alternateName","citation.address.addressCountry.identifier","citation.address.addressCountry.name","citation.address.addressCountry.url","citation.address.addressLocality","citation.address.addressRegion","citation.address.postalCode","citation.address.streetAddress","citation.alternateName","citation.author.additionalName","citation.author.familyName","citation.author.givenName","citation.author.name","citation.contactPoint.contactType","citation.contactPoint.email","citation.contactPoint.url","citation.datePublished","citation.description","citation.doi","citation.email","citation.identifier","citation.issn","citation.issueNumber","citation.journalName","citation.journalNameAbbrev","citation.logo","citation.name","citation.pageEnd","citation.pageStart","citation.pagination","citation.parentOrganization","citation.pmid","citation.url","citation.volumeNumber","contentUrl","contentUrlIdentifier","contentUrlRepository","creator.@type","creator.address.addressCountry.alternateName","creator.address.addressCountry.identifier","creator.address.addressCountry.name","creator.address.addressCountry.url","creator.address.addressLocality","creator.address.addressRegion","creator.address.postalCode","creator.address.streetAddress","creator.alternateName","creator.contactPoint.contactType","creator.contactPoint.email","creator.contactPoint.url","creator.description","creator.email","creator.identifier","creator.logo","creator.name","creator.parentOrganization","creator.url","dateCreated","dateModified","datePublished","description","encodingFormat","experimentIDs","identifier","includedInDataset","isBasedOn","keywords","measurementCategory","measurementTechnique","name","publisher.@type","publisher.address.addressCountry.alternateName","publisher.address.addressCountry.identifier","publisher.address.addressCountry.name","publisher.address.addressCountry.url","publisher.address.addressLocality","publisher.address.addressRegion","publisher.address.postalCode","publisher.address.streetAddress","publisher.alternateName","publisher.contactPoint.contactType","publisher.contactPoint.email","publisher.contactPoint.url","publisher.description","publisher.email","publisher.identifier","publisher.logo","publisher.name","publisher.parentOrganization","publisher.url","sameAs","sourceCode.@id","sourceCode.citation.@type","sourceCode.citation.address.addressCountry.alternateName","sourceCode.citation.address.addressCountry.identifier","sourceCode.citation.address.addressCountry.name","sourceCode.citation.address.addressCountry.url","sourceCode.citation.address.addressLocality","sourceCode.citation.address.addressRegion","sourceCode.citation.address.postalCode","sourceCode.citation.address.streetAddress","sourceCode.citation.alternateName","sourceCode.citation.author.additionalName","sourceCode.citation.author.familyName","sourceCode.citation.author.givenName","sourceCode.citation.author.name","sourceCode.citation.contactPoint.contactType","sourceCode.citation.contactPoint.email","sourceCode.citation.contactPoint.url","sourceCode.citation.datePublished","sourceCode.citation.description","sourceCode.citation.doi","sourceCode.citation.email","sourceCode.citation.identifier","sourceCode.citation.issn","sourceCode.citation.issueNumber","sourceCode.citation.journalName","sourceCode.citation.journalNameAbbrev","sourceCode.citation.logo","sourceCode.citation.name","sourceCode.citation.pageEnd","sourceCode.citation.pageStart","sourceCode.citation.pagination","sourceCode.citation.parentOrganization","sourceCode.citation.pmid","sourceCode.citation.url","sourceCode.citation.volumeNumber","sourceCode.codeRepository","sourceCode.creator.@type","sourceCode.creator.additionalName","sourceCode.creator.address.addressCountry.alternateName","sourceCode.creator.address.addressCountry.identifier","sourceCode.creator.address.addressCountry.name","sourceCode.creator.address.addressCountry.url","sourceCode.creator.address.addressLocality","sourceCode.creator.address.addressRegion","sourceCode.creator.address.postalCode","sourceCode.creator.address.streetAddress","sourceCode.creator.alternateName","sourceCode.creator.contactPoint.contactType","sourceCode.creator.contactPoint.email","sourceCode.creator.contactPoint.url","sourceCode.creator.description","sourceCode.creator.email","sourceCode.creator.familyName","sourceCode.creator.givenName","sourceCode.creator.identifier","sourceCode.creator.logo","sourceCode.creator.name","sourceCode.creator.parentOrganization","sourceCode.creator.url","sourceCode.dateModified","sourceCode.datePublished","sourceCode.description","sourceCode.identifier","sourceCode.license","sourceCode.name","sourceCode.programmingLanguage","sourceCode.version","url","variableMeasured"],
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
        # 2020-11-18: 353 fields
        "public_fields": ["@id","citation.@type","citation.address.addressCountry.alternateName","citation.address.addressCountry.identifier","citation.address.addressCountry.name","citation.address.addressCountry.url","citation.address.addressLocality","citation.address.addressRegion","citation.address.postalCode","citation.address.streetAddress","citation.alternateName","citation.author.additionalName","citation.author.familyName","citation.author.givenName","citation.author.name","citation.contactPoint.contactType","citation.contactPoint.email","citation.contactPoint.url","citation.datePublished","citation.description","citation.doi","citation.email","citation.identifier","citation.issn","citation.issueNumber","citation.journalName","citation.journalNameAbbrev","citation.logo","citation.name","citation.pageEnd","citation.pageStart","citation.pagination","citation.parentOrganization","citation.pmid","citation.url","citation.volumeNumber","creator.@type","creator.address.addressCountry.alternateName","creator.address.addressCountry.identifier","creator.address.addressCountry.name","creator.address.addressCountry.url","creator.address.addressLocality","creator.address.addressRegion","creator.address.postalCode","creator.address.streetAddress","creator.alternateName","creator.contactPoint.contactType","creator.contactPoint.email","creator.contactPoint.url","creator.description","creator.email","creator.identifier","creator.logo","creator.name","creator.parentOrganization","creator.url","dataDownloadIDs","dateModified","datePublished","description","distribution.@id","distribution.additionalType","distribution.citation.@type","distribution.citation.address.addressCountry.alternateName","distribution.citation.address.addressCountry.identifier","distribution.citation.address.addressCountry.name","distribution.citation.address.addressCountry.url","distribution.citation.address.addressLocality","distribution.citation.address.addressRegion","distribution.citation.address.postalCode","distribution.citation.address.streetAddress","distribution.citation.alternateName","distribution.citation.author.additionalName","distribution.citation.author.familyName","distribution.citation.author.givenName","distribution.citation.author.name","distribution.citation.contactPoint.contactType","distribution.citation.contactPoint.email","distribution.citation.contactPoint.url","distribution.citation.datePublished","distribution.citation.description","distribution.citation.doi","distribution.citation.email","distribution.citation.identifier","distribution.citation.issn","distribution.citation.issueNumber","distribution.citation.journalName","distribution.citation.journalNameAbbrev","distribution.citation.logo","distribution.citation.name","distribution.citation.pageEnd","distribution.citation.pageStart","distribution.citation.pagination","distribution.citation.parentOrganization","distribution.citation.pmid","distribution.citation.url","distribution.citation.volumeNumber","distribution.contentUrl","distribution.contentUrlIdentifier","distribution.contentUrlRepository","distribution.creator.@type","distribution.creator.address.addressCountry.alternateName","distribution.creator.address.addressCountry.identifier","distribution.creator.address.addressCountry.name","distribution.creator.address.addressCountry.url","distribution.creator.address.addressLocality","distribution.creator.address.addressRegion","distribution.creator.address.postalCode","distribution.creator.address.streetAddress","distribution.creator.alternateName","distribution.creator.contactPoint.contactType","distribution.creator.contactPoint.email","distribution.creator.contactPoint.url","distribution.creator.description","distribution.creator.email","distribution.creator.identifier","distribution.creator.logo","distribution.creator.name","distribution.creator.parentOrganization","distribution.creator.url","distribution.dateCreated","distribution.dateModified","distribution.datePublished","distribution.description","distribution.encodingFormat","distribution.experimentIDs","distribution.identifier","distribution.includedInDataset","distribution.isBasedOn","distribution.keywords","distribution.measurementCategory","distribution.measurementTechnique","distribution.name","distribution.publisher.@type","distribution.publisher.address.addressCountry.alternateName","distribution.publisher.address.addressCountry.identifier","distribution.publisher.address.addressCountry.name","distribution.publisher.address.addressCountry.url","distribution.publisher.address.addressLocality","distribution.publisher.address.addressRegion","distribution.publisher.address.postalCode","distribution.publisher.address.streetAddress","distribution.publisher.alternateName","distribution.publisher.contactPoint.contactType","distribution.publisher.contactPoint.email","distribution.publisher.contactPoint.url","distribution.publisher.description","distribution.publisher.email","distribution.publisher.identifier","distribution.publisher.logo","distribution.publisher.name","distribution.publisher.parentOrganization","distribution.publisher.url","distribution.sameAs","distribution.sourceCode.@id","distribution.sourceCode.citation.@type","distribution.sourceCode.citation.address.addressCountry.alternateName","distribution.sourceCode.citation.address.addressCountry.identifier","distribution.sourceCode.citation.address.addressCountry.name","distribution.sourceCode.citation.address.addressCountry.url","distribution.sourceCode.citation.address.addressLocality","distribution.sourceCode.citation.address.addressRegion","distribution.sourceCode.citation.address.postalCode","distribution.sourceCode.citation.address.streetAddress","distribution.sourceCode.citation.alternateName","distribution.sourceCode.citation.author.additionalName","distribution.sourceCode.citation.author.familyName","distribution.sourceCode.citation.author.givenName","distribution.sourceCode.citation.author.name","distribution.sourceCode.citation.contactPoint.contactType","distribution.sourceCode.citation.contactPoint.email","distribution.sourceCode.citation.contactPoint.url","distribution.sourceCode.citation.datePublished","distribution.sourceCode.citation.description","distribution.sourceCode.citation.doi","distribution.sourceCode.citation.email","distribution.sourceCode.citation.identifier","distribution.sourceCode.citation.issn","distribution.sourceCode.citation.issueNumber","distribution.sourceCode.citation.journalName","distribution.sourceCode.citation.journalNameAbbrev","distribution.sourceCode.citation.logo","distribution.sourceCode.citation.name","distribution.sourceCode.citation.pageEnd","distribution.sourceCode.citation.pageStart","distribution.sourceCode.citation.pagination","distribution.sourceCode.citation.parentOrganization","distribution.sourceCode.citation.pmid","distribution.sourceCode.citation.url","distribution.sourceCode.citation.volumeNumber","distribution.sourceCode.codeRepository","distribution.sourceCode.creator.@type","distribution.sourceCode.creator.additionalName","distribution.sourceCode.creator.address.addressCountry.alternateName","distribution.sourceCode.creator.address.addressCountry.identifier","distribution.sourceCode.creator.address.addressCountry.name","distribution.sourceCode.creator.address.addressCountry.url","distribution.sourceCode.creator.address.addressLocality","distribution.sourceCode.creator.address.addressRegion","distribution.sourceCode.creator.address.postalCode","distribution.sourceCode.creator.address.streetAddress","distribution.sourceCode.creator.alternateName","distribution.sourceCode.creator.contactPoint.contactType","distribution.sourceCode.creator.contactPoint.email","distribution.sourceCode.creator.contactPoint.url","distribution.sourceCode.creator.description","distribution.sourceCode.creator.email","distribution.sourceCode.creator.familyName","distribution.sourceCode.creator.givenName","distribution.sourceCode.creator.identifier","distribution.sourceCode.creator.logo","distribution.sourceCode.creator.name","distribution.sourceCode.creator.parentOrganization","distribution.sourceCode.creator.url","distribution.sourceCode.dateModified","distribution.sourceCode.datePublished","distribution.sourceCode.description","distribution.sourceCode.identifier","distribution.sourceCode.license","distribution.sourceCode.name","distribution.sourceCode.programmingLanguage","distribution.sourceCode.version","distribution.url","distribution.variableMeasured","funding.funder.@type","funding.funder.address.addressCountry.alternateName","funding.funder.address.addressCountry.identifier","funding.funder.address.addressCountry.name","funding.funder.address.addressCountry.url","funding.funder.address.addressLocality","funding.funder.address.addressRegion","funding.funder.address.postalCode","funding.funder.address.streetAddress","funding.funder.alternateName","funding.funder.contactPoint.contactType","funding.funder.contactPoint.email","funding.funder.contactPoint.url","funding.funder.description","funding.funder.email","funding.funder.identifier","funding.funder.logo","funding.funder.name","funding.funder.parentOrganization","funding.funder.url","funding.identifier","identifier","includedInDataCatalog","keywords","license","measurementCategory","measurementTechnique","name","publisher.@type","publisher.address.addressCountry.alternateName","publisher.address.addressCountry.identifier","publisher.address.addressCountry.name","publisher.address.addressCountry.url","publisher.address.addressLocality","publisher.address.addressRegion","publisher.address.postalCode","publisher.address.streetAddress","publisher.alternateName","publisher.contactPoint.contactType","publisher.contactPoint.email","publisher.contactPoint.url","publisher.description","publisher.email","publisher.identifier","publisher.logo","publisher.name","publisher.parentOrganization","publisher.url","sameAs","schemaVersion","sourceCode.@id","sourceCode.citation.@type","sourceCode.citation.address.addressCountry.alternateName","sourceCode.citation.address.addressCountry.identifier","sourceCode.citation.address.addressCountry.name","sourceCode.citation.address.addressCountry.url","sourceCode.citation.address.addressLocality","sourceCode.citation.address.addressRegion","sourceCode.citation.address.postalCode","sourceCode.citation.address.streetAddress","sourceCode.citation.alternateName","sourceCode.citation.author.additionalName","sourceCode.citation.author.familyName","sourceCode.citation.author.givenName","sourceCode.citation.author.name","sourceCode.citation.contactPoint.contactType","sourceCode.citation.contactPoint.email","sourceCode.citation.contactPoint.url","sourceCode.citation.datePublished","sourceCode.citation.description","sourceCode.citation.doi","sourceCode.citation.email","sourceCode.citation.identifier","sourceCode.citation.issn","sourceCode.citation.issueNumber","sourceCode.citation.journalName","sourceCode.citation.journalNameAbbrev","sourceCode.citation.logo","sourceCode.citation.name","sourceCode.citation.pageEnd","sourceCode.citation.pageStart","sourceCode.citation.pagination","sourceCode.citation.parentOrganization","sourceCode.citation.pmid","sourceCode.citation.url","sourceCode.citation.volumeNumber","sourceCode.codeRepository","sourceCode.creator.@type","sourceCode.creator.additionalName","sourceCode.creator.address.addressCountry.alternateName","sourceCode.creator.address.addressCountry.identifier","sourceCode.creator.address.addressCountry.name","sourceCode.creator.address.addressCountry.url","sourceCode.creator.address.addressLocality","sourceCode.creator.address.addressRegion","sourceCode.creator.address.postalCode","sourceCode.creator.address.streetAddress","sourceCode.creator.alternateName","sourceCode.creator.contactPoint.contactType","sourceCode.creator.contactPoint.email","sourceCode.creator.contactPoint.url","sourceCode.creator.description","sourceCode.creator.email","sourceCode.creator.familyName","sourceCode.creator.givenName","sourceCode.creator.identifier","sourceCode.creator.logo","sourceCode.creator.name","sourceCode.creator.parentOrganization","sourceCode.creator.url","sourceCode.dateModified","sourceCode.datePublished","sourceCode.description","sourceCode.identifier","sourceCode.license","sourceCode.name","sourceCode.programmingLanguage","sourceCode.version","spatialCoverage.alternateName","spatialCoverage.identifier","spatialCoverage.name","spatialCoverage.url","temporalCoverage.gt","temporalCoverage.gte","temporalCoverage.lt","temporalCoverage.lte","url","variableMeasured","version"],
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
        # 2020-11-18: 251 fields
        "public_fields": ["analysisCode.@id","analysisCode.citation.@type","analysisCode.citation.address.addressCountry.alternateName","analysisCode.citation.address.addressCountry.identifier","analysisCode.citation.address.addressCountry.name","analysisCode.citation.address.addressCountry.url","analysisCode.citation.address.addressLocality","analysisCode.citation.address.addressRegion","analysisCode.citation.address.postalCode","analysisCode.citation.address.streetAddress","analysisCode.citation.alternateName","analysisCode.citation.author.additionalName","analysisCode.citation.author.familyName","analysisCode.citation.author.givenName","analysisCode.citation.author.name","analysisCode.citation.contactPoint.contactType","analysisCode.citation.contactPoint.email","analysisCode.citation.contactPoint.url","analysisCode.citation.datePublished","analysisCode.citation.description","analysisCode.citation.doi","analysisCode.citation.email","analysisCode.citation.identifier","analysisCode.citation.issn","analysisCode.citation.issueNumber","analysisCode.citation.journalName","analysisCode.citation.journalNameAbbrev","analysisCode.citation.logo","analysisCode.citation.name","analysisCode.citation.pageEnd","analysisCode.citation.pageStart","analysisCode.citation.pagination","analysisCode.citation.parentOrganization","analysisCode.citation.pmid","analysisCode.citation.url","analysisCode.citation.volumeNumber","analysisCode.codeRepository","analysisCode.creator.@type","analysisCode.creator.additionalName","analysisCode.creator.address.addressCountry.alternateName","analysisCode.creator.address.addressCountry.identifier","analysisCode.creator.address.addressCountry.name","analysisCode.creator.address.addressCountry.url","analysisCode.creator.address.addressLocality","analysisCode.creator.address.addressRegion","analysisCode.creator.address.postalCode","analysisCode.creator.address.streetAddress","analysisCode.creator.alternateName","analysisCode.creator.contactPoint.contactType","analysisCode.creator.contactPoint.email","analysisCode.creator.contactPoint.url","analysisCode.creator.description","analysisCode.creator.email","analysisCode.creator.familyName","analysisCode.creator.givenName","analysisCode.creator.identifier","analysisCode.creator.logo","analysisCode.creator.name","analysisCode.creator.parentOrganization","analysisCode.creator.url","analysisCode.dateModified","analysisCode.datePublished","analysisCode.description","analysisCode.identifier","analysisCode.license","analysisCode.name","analysisCode.programmingLanguage","analysisCode.version","batchID","citation.@type","citation.address.addressCountry.alternateName","citation.address.addressCountry.identifier","citation.address.addressCountry.name","citation.address.addressCountry.url","citation.address.addressLocality","citation.address.addressRegion","citation.address.postalCode","citation.address.streetAddress","citation.alternateName","citation.author.additionalName","citation.author.familyName","citation.author.givenName","citation.author.name","citation.contactPoint.contactType","citation.contactPoint.email","citation.contactPoint.url","citation.datePublished","citation.description","citation.doi","citation.email","citation.identifier","citation.issn","citation.issueNumber","citation.journalName","citation.journalNameAbbrev","citation.logo","citation.name","citation.pageEnd","citation.pageStart","citation.pagination","citation.parentOrganization","citation.pmid","citation.url","citation.volumeNumber","correction","creator.@type","creator.address.addressCountry.alternateName","creator.address.addressCountry.identifier","creator.address.addressCountry.name","creator.address.addressCountry.url","creator.address.addressLocality","creator.address.addressRegion","creator.address.postalCode","creator.address.streetAddress","creator.alternateName","creator.contactPoint.contactType","creator.contactPoint.email","creator.contactPoint.url","creator.description","creator.email","creator.identifier","creator.logo","creator.name","creator.parentOrganization","creator.url","data.@type","data.AAsequence","data.DNAsequence","data.ELISAresult","data.ELISAvalue","data.SNP.SNP","data.SNP.SNPdetected","data.SNP.SNPlocation","data.SNP.mutatedAA","data.SNP.originalAA","data.alignedAAsequence","data.alignedDNAsequence","data.allele","data.antigen","data.antigenSource","data.antigenVirus","data.assayReadout","data.assayType","data.citation.@type","data.citation.address.addressCountry.alternateName","data.citation.address.addressCountry.identifier","data.citation.address.addressCountry.name","data.citation.address.addressCountry.url","data.citation.address.addressLocality","data.citation.address.addressRegion","data.citation.address.postalCode","data.citation.address.streetAddress","data.citation.alternateName","data.citation.author.additionalName","data.citation.author.familyName","data.citation.author.givenName","data.citation.author.name","data.citation.contactPoint.contactType","data.citation.contactPoint.email","data.citation.contactPoint.url","data.citation.datePublished","data.citation.description","data.citation.doi","data.citation.email","data.citation.identifier","data.citation.issn","data.citation.issueNumber","data.citation.journalName","data.citation.journalNameAbbrev","data.citation.logo","data.citation.name","data.citation.pageEnd","data.citation.pageStart","data.citation.pagination","data.citation.parentOrganization","data.citation.pmid","data.citation.url","data.citation.volumeNumber","data.cohort","data.controlType","data.correction","data.dataStatus","data.isReferenceSeq","data.locus","data.novel","data.outcome","data.patientID","data.publisher.@type","data.publisher.address.addressCountry.alternateName","data.publisher.address.addressCountry.identifier","data.publisher.address.addressCountry.name","data.publisher.address.addressCountry.url","data.publisher.address.addressLocality","data.publisher.address.addressRegion","data.publisher.address.postalCode","data.publisher.address.streetAddress","data.publisher.alternateName","data.publisher.contactPoint.contactType","data.publisher.contactPoint.email","data.publisher.contactPoint.url","data.publisher.description","data.publisher.email","data.publisher.identifier","data.publisher.logo","data.publisher.name","data.publisher.parentOrganization","data.publisher.url","data.referenceSeq","data.sampleDilution","data.timepoint","data.value","data.valueCategory","data.valueCategoryNumeric","data.virus","data.virusSegment","dataStatus","dateModified","description","experimentDate","experimentID","genbankID","includedInDataset","isControl","measurementCategory","measurementTechnique","name","patientID","publisher.@type","publisher.address.addressCountry.alternateName","publisher.address.addressCountry.identifier","publisher.address.addressCountry.name","publisher.address.addressCountry.url","publisher.address.addressLocality","publisher.address.addressRegion","publisher.address.postalCode","publisher.address.streetAddress","publisher.alternateName","publisher.contactPoint.contactType","publisher.contactPoint.email","publisher.contactPoint.url","publisher.description","publisher.email","publisher.identifier","publisher.logo","publisher.name","publisher.parentOrganization","publisher.url","releaseDate","sraID","variableMeasured","visitCode"],
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
        # 2020-11-18: 153 fields
        "public_fields": ["age","citation.@type","citation.address.addressCountry.alternateName","citation.address.addressCountry.identifier","citation.address.addressCountry.name","citation.address.addressCountry.url","citation.address.addressLocality","citation.address.addressRegion","citation.address.postalCode","citation.address.streetAddress","citation.alternateName","citation.author.additionalName","citation.author.familyName","citation.author.givenName","citation.author.name","citation.contactPoint.contactType","citation.contactPoint.email","citation.contactPoint.url","citation.datePublished","citation.description","citation.doi","citation.email","citation.identifier","citation.issn","citation.issueNumber","citation.journalName","citation.journalNameAbbrev","citation.logo","citation.name","citation.pageEnd","citation.pageStart","citation.pagination","citation.parentOrganization","citation.pmid","citation.url","citation.volumeNumber","cohort","correction","country.alternateName","country.identifier","country.name","country.url","dataStatus","dateModified","elisa.@type","elisa.ELISAresult","elisa.ELISAvalue","elisa.assayType","elisa.citation.@type","elisa.citation.address.addressCountry.alternateName","elisa.citation.address.addressCountry.identifier","elisa.citation.address.addressCountry.name","elisa.citation.address.addressCountry.url","elisa.citation.address.addressLocality","elisa.citation.address.addressRegion","elisa.citation.address.postalCode","elisa.citation.address.streetAddress","elisa.citation.alternateName","elisa.citation.author.additionalName","elisa.citation.author.familyName","elisa.citation.author.givenName","elisa.citation.author.name","elisa.citation.contactPoint.contactType","elisa.citation.contactPoint.email","elisa.citation.contactPoint.url","elisa.citation.datePublished","elisa.citation.description","elisa.citation.doi","elisa.citation.email","elisa.citation.identifier","elisa.citation.issn","elisa.citation.issueNumber","elisa.citation.journalName","elisa.citation.journalNameAbbrev","elisa.citation.logo","elisa.citation.name","elisa.citation.pageEnd","elisa.citation.pageStart","elisa.citation.pagination","elisa.citation.parentOrganization","elisa.citation.pmid","elisa.citation.url","elisa.citation.volumeNumber","elisa.correction","elisa.dataStatus","elisa.publisher.@type","elisa.publisher.address.addressCountry.alternateName","elisa.publisher.address.addressCountry.identifier","elisa.publisher.address.addressCountry.name","elisa.publisher.address.addressCountry.url","elisa.publisher.address.addressLocality","elisa.publisher.address.addressRegion","elisa.publisher.address.postalCode","elisa.publisher.address.streetAddress","elisa.publisher.alternateName","elisa.publisher.contactPoint.contactType","elisa.publisher.contactPoint.email","elisa.publisher.contactPoint.url","elisa.publisher.description","elisa.publisher.email","elisa.publisher.identifier","elisa.publisher.logo","elisa.publisher.name","elisa.publisher.parentOrganization","elisa.publisher.url","elisa.timepoint","elisa.virus","gender","infectionYear","location.administrativeType","location.administrativeUnit","location.alternateName","location.identifier","location.locationType","location.name","medications.@type","medications.doseDuration","medications.doseFrequency","medications.doseNumeric","medications.doseUnits","medications.drugRoute","medications.isDrugAdministered","medications.name","outcome","patientID","presentationWeek.gt","presentationWeek.gte","presentationWeek.lt","presentationWeek.lte","publisher.@type","publisher.address.addressCountry.alternateName","publisher.address.addressCountry.identifier","publisher.address.addressCountry.name","publisher.address.addressCountry.url","publisher.address.addressLocality","publisher.address.addressRegion","publisher.address.postalCode","publisher.address.streetAddress","publisher.alternateName","publisher.contactPoint.contactType","publisher.contactPoint.email","publisher.contactPoint.url","publisher.description","publisher.email","publisher.identifier","publisher.logo","publisher.name","publisher.parentOrganization","publisher.url","species","symptoms.@type","symptoms.acuteRespiratoryDistressSyndrome","version"],
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
        # 2020-11-18: 67 fields
        "public_fields": ["@id", "alternateName", "dataset", "dateModified", "datePublished", "description", "funding.funder.@type", "funding.funder.address.addressCountry.alternateName", "funding.funder.address.addressCountry.identifier", "funding.funder.address.addressCountry.name", "funding.funder.address.addressCountry.url", "funding.funder.address.addressLocality", "funding.funder.address.addressRegion", "funding.funder.address.postalCode", "funding.funder.address.streetAddress", "funding.funder.alternateName", "funding.funder.contactPoint.contactType", "funding.funder.contactPoint.email", "funding.funder.contactPoint.url", "funding.funder.description", "funding.funder.email", "funding.funder.identifier", "funding.funder.logo", "funding.funder.name", "funding.funder.parentOrganization", "funding.funder.url", "funding.identifier", "identifier", "keywords", "name", "publisher.@type", "publisher.address.addressCountry.alternateName", "publisher.address.addressCountry.identifier", "publisher.address.addressCountry.name", "publisher.address.addressCountry.url", "publisher.address.addressLocality", "publisher.address.addressRegion", "publisher.address.postalCode", "publisher.address.streetAddress", "publisher.alternateName", "publisher.contactPoint.contactType", "publisher.contactPoint.email", "publisher.contactPoint.url", "publisher.description", "publisher.email", "publisher.identifier", "publisher.logo", "publisher.name", "publisher.parentOrganization", "publisher.url", "releaseNotes.abstract", "releaseNotes.datePublished", "releaseNotes.description.category", "releaseNotes.description.note", "releaseNotes.version", "releaseVersion", "sameAs", "schemaVersion", "spatialCoverage.alternateName", "spatialCoverage.identifier", "spatialCoverage.name", "spatialCoverage.url", "temporalCoverage.gt", "temporalCoverage.gte", "temporalCoverage.lt", "temporalCoverage.lte", "url"],
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
