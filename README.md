# Center for Viral Systems Biology Data Portal
The mission of the Center for Viral Systems Biology is to identify the immunological, genetic, microbial and physiological factors that play essential roles in determining outcomes from viral infections. As part of our research, we are committed to sharing our data where appropriate on our [data portal](https://data.cvisb.org).


## Website and API
The front-end of the data portal is built off of Angular and Angular Universal; code is available in the [sample_viewer](https://github.com/cvisb/cvisb_data/tree/master/sample-viewer) folder. The backend is built off of [BioThings SDK](https://biothingsapi.readthedocs.io/en/latest/) and Elasticsearch; code is contained in the [sample_viewer_api](https://github.com/cvisb/cvisb_data/tree/master/sample-viewer-api) folder.

## Terms and Disclaimer
Please note that the data in the portal is still based on work in progress and should be considered preliminary. If you intend to include any of these data in publications, please let us know – otherwise please feel free to download and use without restrictions. We have shared this data with the hope that people will download and use it, as well as scrutinize it so we can improve our methods and analyses. Please contact us if you have any questions or comments (info@cvisb.org). [Full Terms of Use](https://data.cvisb.org/terms)

## Citing CViSB data and data portal
[How to cite CViSB data](https://data.cvisb.org/citation)

## Launching CViSB data portal
* Angular front-end can be generated using `npm run build:ssr && npm run serve:ssr` [prod version] or `npm run build:dev && npm run serve:ssr` [dev version]
* Also requires a Tornado instance serving the data API.
