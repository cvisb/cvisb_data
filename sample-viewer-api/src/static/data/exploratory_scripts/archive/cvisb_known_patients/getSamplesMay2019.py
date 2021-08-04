# Verified and checked shipments of samples, as of May 2019.
import pandas as pd

import os
os.chdir("/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/")
# Helper functions for cleanup...
import helpers



cols2save = ['patientID', 'country', 'source']



# [clean pbmc]  ----------------------------------------------------------------------------------------------------
file1 = "/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/input_data/sample_rosters/CViSB PBMC Samples_MP.xlsx"

pbmc = pd.read_excel(file1)
pbmc['source'] = "PBMCSamples_May2019"
pbmc['country'] = "Sierra Leone"
pbmc['patientID'] = pbmc.privatePatientID.apply(helpers.interpretID)


pbmc = pbmc[cols2save]
pbmc.shape

# [clean pbmc-dna]  ----------------------------------------------------------------------------------------------------
file2 = "/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/input_data/sample_rosters/CViSB PBMC-DNA Samples_MP.xlsx"

pbmcdna = pd.read_excel(file2)
pbmcdna['source'] = "PBMC-DNASamples_May2019"
pbmcdna['country'] = "Sierra Leone"
pbmcdna['patientID'] = pbmcdna.privatePatientID.apply(helpers.interpretID)


pbmcdna = pbmcdna[cols2save]
pbmcdna.shape

# [clean pbmc-rna]  ----------------------------------------------------------------------------------------------------
file3 = "/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/input_data/sample_rosters/CViSB PCMC-RNA Samples_MP.xlsx"

pbmcrna = pd.read_excel(file3)
pbmcrna['source'] = "PBMC-RNASamples_May2019"
pbmcrna['country'] = "Sierra Leone"
pbmcrna['patientID'] = pbmcrna.privatePatientID.apply(helpers.interpretID)


pbmcrna = pbmcrna[cols2save]
pbmcrna.shape

# [clean plasma]  ----------------------------------------------------------------------------------------------------
file4 = "/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/input_data/sample_rosters/CViSB Plasma Samples_MP.xlsx"

plasma = pd.read_excel(file4)
plasma['source'] = "PlasmaSamples_May2019"
plasma['country'] = "Sierra Leone"
plasma['patientID'] = plasma.privatePatientID.apply(helpers.interpretID)


plasma = plasma[cols2save]
plasma.shape

# [clean Garry plasma]  ----------------------------------------------------------------------------------------------------
file5 = "/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/input_data/sample_rosters/CViSB sheet for garry plasma_MP.xlsx"

tulane = pd.read_excel(file5)
tulane.head()
tulane['source'] = "Plasma-TulaneSamples_May2019"
tulane['country'] = "Sierra Leone"
tulane['patientID'] = tulane["Corrected ID"].apply(helpers.interpretID)


tulane = tulane[cols2save]
tulane.shape


# [concat!]  ----------------------------------------------------------------------------------------------------

samples = pd.concat([pbmc, pbmcdna, pbmcrna, plasma, tulane])

samples.sample(10)
