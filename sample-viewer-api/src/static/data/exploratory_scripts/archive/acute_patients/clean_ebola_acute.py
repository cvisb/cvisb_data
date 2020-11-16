import pandas as pd


ebv_file = "/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/input_data/patient_rosters/EbolaEra_AcuteMetadata_Merged_20190509.tsv"

ebv = pd.read_table(ebv_file)

ebv.head()
