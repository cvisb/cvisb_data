import pandas as pd
sample_dir = "/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/input_data/cvisb_random_rosters/"



# Kristian list of previously sequenced EBOV/LASV people -----------
# from ~ July 2018

kfile = sample_dir + 'Previously Sequenced EBOV and LASV_Kristian_PRIVATE.xlsx'

kdata = pd.read_excel(kfile)

# Should be 525 EBOV, 77 LASV
kdata.head()

kdf = pd.melt(kdata, value_vars=['Ebola', 'Lassa'])
kdf.head()
kdf.rename(columns={'variable': 'cohort', 'value': 'patientID'}, inplace = True)
kdf.dropna(subset=['patientID'], inplace=True)

kdf['source'] = 'prev_sequenced_kristian'
kdf.shape


# Matthias list of DNA/RNA samples
# Should be 14 EBOV, 100 LASV
mfile = sample_dir + "DNA and RNA sample List_Matthias_PRIVATE.xlsx"
mdata1 = pd.read_excel(mfile, sheetname=0, skiprows=1)


mdata1.columns

mdata1 = pd.melt(mdata1, value_vars=['Viral RNA (from Serum/Plasma)','Genomic DNA (from buffycoats)']).drop(['variable'], axis=1).rename(columns={'value': 'patientID'})
mdata1['cohort'] = 'Lassa'

# Second tab: Lassa batch 2
mdata2 = pd.read_excel(mfile, sheetname=1, skiprows=1)

mdata2.columns

mdata2 = pd.melt(mdata2, value_vars=['Viral RNA (from Serum/Plasma)','Genomic DNA (from buffycoats)']).drop(['variable'], axis=1).rename(columns={'value': 'patientID'})
mdata2['cohort'] = 'Lassa'

# Third tab: Ebola
mdata3 = pd.read_excel(mfile, sheetname=2, skiprows=1)

mdata3 = pd.melt(mdata3, value_vars=['Viral RNA (from Serum/Plasma)','Genomic DNA (from buffycoats)']).drop(['variable'], axis=1).rename(columns={'value': 'patientID'})
mdata3['cohort'] = 'Ebola'

mdf = pd.concat([mdata1, mdata2, mdata3])

mdf.dropna(subset=['patientID'], inplace=True)
mdf.cohort.value_counts()

mdf['source'] = 'dna-rna_matthias'


# Matthias's inventory of all samples and what they want.
wishlist_file = sample_dir + "2019 Jan Trip - Samples Needed_Matthias_PRIVATE.xlsx"

wishlist = pd.read_excel(wishlist_file, sheetname=1)

wishlist.head()
# Anyone who has had HLA typed.  Includes G and S numbers
# Ignoring b/c already contained in Karthik's master list.
wl1 = wishlist[['Outcome', 'Status ', 'ID', 'Alt ID']]

# G-numbers for patients that are HLA typed
wl2 = wishlist[['Patients that were HLA typed']].copy()
wl2.rename(columns = {'Patients that were HLA typed': 'patientID'}, inplace=True)
wl2['source'] = 'HLA_matthias'

# G-numbers for patients that could be HLA typed
wl3 = wishlist[['gDNA in Freezer']].copy()
wl3.rename(columns = {'gDNA in Freezer': 'patientID'}, inplace=True)
wl3['source'] = 'gDNA_matthias'

# G-numbers for Ebola patients that have been viral sequenced
wl4 = wishlist[['Ebola Patients Sequenced (good)']].copy()
wl4.rename(columns = {'Ebola Patients Sequenced (good)': 'patientID'}, inplace=True)
wl4['cohort'] = 'Ebola'
wl4['source'] = 'viral_seq_matthias'

# G-numbers for Lassa patients that have been viral sequenced
wl5 = wishlist[['Lassa Patients Sequenced']].copy()
wl5.rename(columns = {'Lassa Patients Sequenced': 'patientID'}, inplace=True)
wl5['cohort'] = 'Lassa'
wl5['source'] = 'viral_seq_matthias'

# G-numbers for vRNA in the freezer
wl6 = wishlist[['vRNA samples in freezer']].copy()
wl6.rename(columns = {'vRNA samples in freezer': 'patientID'}, inplace=True)
wl6['source'] = 'vRNA_matthias'

wl = pd.concat([wl2, wl3, wl4, wl5, wl6])
wl.dropna(subset=["patientID"], inplace=True)

wl['source'] = 'inventoryJan2019_matthias'

# Karthik's list of previously sequenced Lassa patients
lsv_file = sample_dir + "survival_dataset_lasv_01312019_Karthik_PRIVATE.csv"

lsv = pd.read_csv(lsv_file)


def cleanOutcome(outcome):
    # Need to fix DEAD to Dead
    if(outcome.lower().strip() == "discharged"):
        return("survivor")
    elif(outcome.lower().strip() == "died"):
        return("dead")
    else:
        return(outcome.lower().strip())

lsv.head()
lsv.country.value_counts()

# Clean outcome status
lsv['outcome'] = lsv['outcome'].apply(lambda x: cleanOutcome(x))
lsv['cohort'] = 'Lassa'
lsv.rename(columns={'sample_id': 'patientID'}, inplace=True)
lsv = lsv[['patientID', 'country', 'outcome', 'cohort']]
lsv['source'] = 'LASV_prevSeq_karthik'

# Brian's list of current samples
# n = 118
bfile = sample_dir + "Collection Date Summary_Brian_PRIVATE.xlsx"
bdata = pd.read_excel(bfile)

bdata.head()

bdata['alternateIdentifier'] = bdata["Alternative Patient ID"].apply(lambda x: str(x).replace("This should be ", ""))
bdata.rename(columns={'Original Patient ID': 'patientID'}, inplace=True)
bdf = bdata[['patientID', 'alternateIdentifier']].copy()
bdf['source'] = 'roster_brian'
