SETTINGS = {
    'index': {
        'number_of_shards': '10',
        'auto_expand_replicas': '0-all',
        'number_of_replicas': '0'
    }
}

SAMPLE_MAPPINGS = {
    'sample': {
        'dynamic': 'true',
        'dynamic_date_formats': ['yyyy-MM-dd']
    }
}

EXPERIMENT_MAPPINGS = {
    'experiment': {
        'dynamic': 'true',
        'dynamic_date_formats': ['yyyy-MM-dd']
    }
}

DATASET_MAPPINGS = {
    'dataset': {
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

DATADOWNLOAD_MAPPINGS = {
    'datadownload': {
        'dynamic': 'true',
        'dynamic_date_formats': ['yyyy-MM-dd']
    }
}

PATIENT_MAPPINGS = {
    'patient': {
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
            {
                'infectionYearRange': {
                    'path_match': 'infectionYear',
                    'mapping': {
                        'dynamic': 'false',
                        'format': 'yyyy-MM-dd',
                        'type': 'date_range'
                    }
                }
            },
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

DATACATALOG_MAPPINGS = {
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
