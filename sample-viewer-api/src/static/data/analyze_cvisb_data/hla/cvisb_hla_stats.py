from biothings_client import get_client
import requests

"""
Note: R can also be invoked in Jupyter notebooks using the R magic function:
# install/load required packages
# pip install rpy2
# pip install tzlocal
%load_ext rpy2.ipython

# then use `%R` followed by any R function / call.
%R X=c(1,4,5,7); sd(X); mean(X)
"""
import rpy2.robjects as robjects



# [ Setup access to CViSB API ]  ---------------------------------------------------------------------------
"""
Generate client as a handle into the CViSB API
Based off of https://biothings-clientpy.readthedocs.io/en/latest/doc/API.html

*NOTE for CViSB users*: this will only query/return variables that are public-facing.
That means that internal private ids (like G-numbers) will not be accessible.

examples:
# Returns experimental data for patient ID G13-958672
client.experiment.query("__all__", patientID="G13-958672")
"""
class CViSBClient(object):
    def __init__(self, url="https://data.cvisb.org/api"):
        self.url = url
        for entity in eval(requests.get(url+'//').json()['error'].split(':')[1].strip()):
            _client = get_client(entity, url=self.url)
            _client._query_endpoint = '/{}/query/'.format(entity)
            setattr(self, entity, _client)
client = CViSBClient()

# [ Pull HLA experimental data ]  ----------------------------------------------------------------------------------------------------
hla = client.experiment.query('measurementTechnique:"HLA sequencing"')['hits']
vs = client.experiment.query('measurementCategory:"virus sequencing" AND data.virus:Ebola', fields="data.DNAsequence", size = 1000)['hits']

seq = [list(o['data'][0]['DNAsequence']) for o in vs]


x = pd.DataFrame(seq)

freq_table = x.apply(lambda x: x.value_counts())

freq_table.head()


freq_table[0]


def summarizeAlignment(column):



import pandas as pd
x = pd.DataFrame(hla).experimentID

# [ Anlayze HLA data ]  ----------------------------------------------------------------------------------------------------
# Load R script containing analysis code.
robjects.r.source("/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/clean_hla/cvisb_hla_analysis.R")

# Pull out and call the relevant R-function
calc_hla_stats = robjects.globalenv['calc_hla_stats']

y = calc_hla_stats([1,2,3])

y
