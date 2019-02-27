import pandas as pd

roster_file = "/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/2019-01-31_patients_PRIVATE.csv"
new_id_file = "/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/Survivor Scrambled ID Master_27FEB19_PRIVATE.xlsx"

# import new IDs from John
ids = pd.read_excel(new_id_file, converters={'Study Specific #':str})

ids.head()
