# library(devtools)
# # devtools::install_github("biothings/BioThingsClient.R")
library(BioThingsClient.R)
# 
# 
x = BioThingsClient.R::biothings_clients
# # from biothings_client import get_client
# # import requests
# # 
# # class CViSBClient(object):
# #   def __init__(self, url="https://data.cvisb.org/api"):
# #   self.url = url
# # for entity in eval(requests.get(url+'//').json()['error'].split(':')[1].strip()):
# #   _client = get_client(entity, url=self.url)
# # _client._query_endpoint = '/{}/query/'.format(entity)
# # setattr(self, entity, _client)

gene_client <- BioThingsClient("gene")

library(httr)
library(jsonlite)

get_cvisb = function(endpoint, query_string, extra_opts=NULL, return_request=FALSE) {
  if(is.null(extra_opts)){
    url = sprintf('https://data.cvisb.org/api/%s/query?q=%s', endpoint, query_string)
  } else {
    url = sprintf('https://data.cvisb.org/api/%s/query?q=%s&%s', endpoint, query_string, stringr::str_replace(extra_opts, " ", "%20"))
  }
  
  request = httr::GET(url)
  
  if(request$status_code == 200) {
    # Read content as text
    resp_txt <- content(request, as = "text", encoding = "UTF-8")
    response = jsonlite::fromJSON(resp_txt, flatten = TRUE)
    
    df = response[['hits']] %>% 
      as_data_frame()
  }
  
  if(return_request){
    print('inner')
    return(list("df" = df, "request"=request))  
  }
  return(df)  
}

