# Imports all chrome lighthouse performance .jsons in a folder and organizes into a tidy dataset.

import pandas as pd
import json
import datetime as datetime
import os
def extractJSON(filename, date, versionComment, server):
    exportCols = ['index', 'description', 'displayValue', 'numericValue', 'score', 'overview']
    with open(filename, encoding='utf-8') as json_file:
        data = json.load(json_file)
    url = data['requestedUrl']
    df = pd.DataFrame(data['audits'])
    df = df.transpose().reset_index()

    overview = []
    for key in data['categories']:
        res = {}
        res['numericValue'] = data['categories'][key]['score']
        try:
            res['description'] = data['categories'][key]['description']
        except:
            pass
        res['index'] = data['categories'][key]['title']
        res['overview'] = True
        overview.append(res)
    overview = pd.DataFrame(overview)

    numericDF = df.loc[~df.numericValue.isnull(), exportCols]
    numericDF = pd.concat([numericDF, overview], ignore_index=True)
    numericDF['url'] = url
    numericDF['page'] = url.replace("https://dev.cvisb.org/", "").replace("https://data.cvisb.org/", "")
    numericDF['date'] = date
    numericDF['server'] = server
    if(versionComment is not None):
        numericDF['version'] = versionComment
    return(numericDF)

def extractAuditData(directory, versionComment=None, date=datetime.datetime.now().strftime("%Y-%m-%d"), server="prod"):
    files = os.listdir(directory)
    all_results = pd.DataFrame()
    export_filename = f"{directory}/chrome-audit-performance_{date}_{directory.split('/')[-1]}.csv"

    for filename in files:
        if(filename.endswith(".json")):
            result = extractJSON(f"{directory}/{filename}", date, versionComment, server)
            # concat
            all_results = pd.concat([all_results, result], ignore_index=True)
    all_results.to_csv(export_filename, index=False)
    return(all_results)


def extractCompilationData(str, export_filename, compiler = "es2015"):
    chunks = str.split("\n")

    chunks = pd.DataFrame(chunks, columns=["raw"])

    df = chunks.raw.str.split(" ", 50, expand=True)
    df['js_file'] = df[2].apply(lambda x: x.split("-"))

    df["js_file"]
    df['chunk'] = df.apply(getChunk, axis=1)
    df['module'] = df["js_file"].apply(lambda x: x[0])
    df['size'] = df[4]
    df['size_units'] = df[5]
    df['compiler'] = df["js_file"].apply(getCompiler)

    res = df.loc[(df.compiler == compiler) | (df.compiler.isnull()), ['chunk', 'module', 'size', 'size_units', 'compiler']].sort_values("chunk")

    res.to_csv(export_filename, index=False)
    return(res)

def getCompiler(js_file_arr):
    try:
        return(js_file_arr[1].split(".")[0])
    except:
        pass


def getChunk(row):
    str = row.js_file[0]
    if(len(str) < 3):
        return("chunk " + str.zfill(2))
    else:
        return(f"chunk {row[1].replace('{', '').replace('}', '').zfill(2)}")

extractAuditData("/Users/laurahughes/GitHub/cvisb_data/notes/performance/2019-10-25_dev_loggedin", "Angular 8 upgrade", "2019-10-25", "dev")
extractAuditData("/Users/laurahughes/GitHub/cvisb_data/notes/performance/2019-10-25_prod_loggedin", "prod version 0.1; Angular 6.1.10", "2019-10-25")
extractAuditData("/Users/laurahughes/GitHub/cvisb_data/notes/performance/2019-12-03_prod_loggedin", "prod version 0.2; Angular 8 upgrade", "2019-12-03")
extractAuditData("/Users/laurahughes/GitHub/cvisb_data/notes/performance/2019-12-03_dev_loggedin", "dev version 0.2+ minor fixes; Angular 8 upgrade", "2019-12-03", "dev")
extractAuditData("/Users/laurahughes/GitHub/cvisb_data/notes/performance/2020-02-12_dev_loggedin", "dev version 0.3; Angular 8", "2020-02-12", "dev")
extractAuditData("/Users/laurahughes/GitHub/cvisb_data/notes/performance/2020-02-12_prod_loggedin", "prod version 0.3; Angular 8", "2020-02-12", "prod")
extractAuditData("/Users/laurahughes/GitHub/cvisb_data/notes/performance/2020-02-12_prod_loggedin", "prod version 0.4; Angular 9", "2020-02-12", "prod")


compilation20200212 = """chunk {0} 0-es2015.de05392e9a04ac37609d.js () 31.6 kB  [rendered]
chunk {0} 0-es5.de05392e9a04ac37609d.js () 32.3 kB  [rendered]
chunk {6} 6-es2015.40289e921df966fe1f66.js () 13.8 kB  [rendered]
chunk {6} 6-es5.40289e921df966fe1f66.js () 15.1 kB  [rendered]
chunk {3} 3-es2015.59142471aff4676c8436.js () 11.3 kB  [rendered]
chunk {3} 3-es5.59142471aff4676c8436.js () 13.1 kB  [rendered]
chunk {5} 5-es2015.e309b5204a328e318765.js () 10.9 kB  [rendered]
chunk {5} 5-es5.e309b5204a328e318765.js () 13.4 kB  [rendered]
chunk {8} 8-es2015.dc6d691870e83f31b6da.js () 25 kB  [rendered]
chunk {8} 8-es5.dc6d691870e83f31b6da.js () 25.6 kB  [rendered]
chunk {9} common-es2015.7dd76a510c106084fa20.js (common) 18.6 kB  [rendered]
chunk {9} common-es5.7dd76a510c106084fa20.js (common) 19.3 kB  [rendered]
chunk {12} runtime-es2015.18733f6eca2ac7926543.js (runtime) 3.01 kB [entry] [rendered]
chunk {12} runtime-es5.18733f6eca2ac7926543.js (runtime) 3 kB [entry] [rendered]
chunk {17} 17-es2015.3ecc4b2ccd44466cea1a.js () 3.83 kB  [rendered]
chunk {17} 17-es5.3ecc4b2ccd44466cea1a.js () 3.87 kB  [rendered]
chunk {1} 1-es2015.fb7ece0ff1a3c931c1bf.js () 47.8 kB  [rendered]
chunk {1} 1-es5.fb7ece0ff1a3c931c1bf.js () 51.5 kB  [rendered]
chunk {24} 24-es2015.8c4720bd0e861e566d3c.js () 14.4 kB  [rendered]
chunk {24} 24-es5.8c4720bd0e861e566d3c.js () 15 kB  [rendered]
chunk {29} 29-es2015.7bd3c7dd124d5d1dd6ba.js () 2.19 kB  [rendered]
chunk {29} 29-es5.7bd3c7dd124d5d1dd6ba.js () 2.25 kB  [rendered]
chunk {34} 34-es2015.6513589e7b65c9f31bd5.js () 3.78 kB  [rendered]
chunk {34} 34-es5.6513589e7b65c9f31bd5.js () 3.81 kB  [rendered]
chunk {28} 28-es2015.6660c292732c3e1dd0bf.js () 20.3 kB  [rendered]
chunk {28} 28-es5.6660c292732c3e1dd0bf.js () 20.5 kB  [rendered]
chunk {35} 35-es2015.cbc840ef8a97fcac7cb5.js () 29.7 kB  [rendered]
chunk {35} 35-es5.cbc840ef8a97fcac7cb5.js () 29.7 kB  [rendered]
chunk {2} 2-es2015.7742a836f08c6745a648.js () 40.9 kB  [rendered]
chunk {2} 2-es5.7742a836f08c6745a648.js () 40.9 kB  [rendered]
chunk {4} 4-es2015.1e5a090f1aa41bcd21fe.js () 78.4 kB  [rendered]
chunk {4} 4-es5.1e5a090f1aa41bcd21fe.js () 85.1 kB  [rendered]
chunk {7} 7-es2015.da3e4ce5575b8fa65f12.js () 111 kB  [rendered]
chunk {7} 7-es5.da3e4ce5575b8fa65f12.js () 120 kB  [rendered]
chunk {10} 10-es2015.e8824fb8e6a62305b071.js () 98.7 kB  [rendered]
chunk {10} 10-es5.e8824fb8e6a62305b071.js () 99.3 kB  [rendered]
chunk {11} 11-es2015.c25bfc991ba14800a861.js () 38 kB  [rendered]
chunk {11} 11-es5.c25bfc991ba14800a861.js () 38.2 kB  [rendered]
chunk {14} 14-es2015.2471b64f4db8079bf1c3.js () 44 kB  [rendered]
chunk {14} 14-es5.2471b64f4db8079bf1c3.js () 45.5 kB  [rendered]
chunk {13} 13-es2015.f37e5d54a3354fd1377e.js () 87.9 kB  [rendered]
chunk {13} 13-es5.f37e5d54a3354fd1377e.js () 88.1 kB  [rendered]
chunk {15} 15-es2015.a786527c63fe0145ada7.js () 202 kB  [rendered]
chunk {15} 15-es5.a786527c63fe0145ada7.js () 203 kB  [rendered]
chunk {16} 16-es2015.e6d278f048c2a929dc54.js () 51.4 kB  [rendered]
chunk {16} 16-es5.e6d278f048c2a929dc54.js () 52.1 kB  [rendered]
chunk {18} main-es2015.0969f3268ecc18977574.js (main) 1.23 MB [initial] [rendered]
chunk {18} main-es5.0969f3268ecc18977574.js (main) 1.27 MB [initial] [rendered]
chunk {19} polyfills-es2015.b66d5b89354962735b85.js (polyfills) 36.6 kB [initial] [rendered]
chunk {20} polyfills-es5.5ea9160c3cf05e508000.js (polyfills-es5) 122 kB [initial] [rendered]
chunk {22} 22-es2015.d6c72c811debe2d96d20.js () 43.7 kB  [rendered]
chunk {22} 22-es5.d6c72c811debe2d96d20.js () 44.4 kB  [rendered]
chunk {23} 23-es2015.46129ee22090acb03ab9.js () 355 kB  [rendered]
chunk {23} 23-es5.46129ee22090acb03ab9.js () 361 kB  [rendered]
chunk {25} 25-es2015.8df1ee97d31e5e962488.js () 204 kB  [rendered]
chunk {25} 25-es5.8df1ee97d31e5e962488.js () 207 kB  [rendered]
chunk {26} 26-es2015.5553ece84a44dfd653df.js () 36.6 kB  [rendered]
chunk {26} 26-es5.5553ece84a44dfd653df.js () 36.9 kB  [rendered]
chunk {27} 27-es2015.5e2d9d59dd7a05367f10.js () 49 kB  [rendered]
chunk {27} 27-es5.5e2d9d59dd7a05367f10.js () 49.3 kB  [rendered]
chunk {30} 30-es2015.0d860b31f681225b5902.js () 96 kB  [rendered]
chunk {30} 30-es5.0d860b31f681225b5902.js () 97.2 kB  [rendered]
chunk {31} 31-es2015.dc14d1c9eb302784fa08.js () 47.7 kB  [rendered]
chunk {31} 31-es5.dc14d1c9eb302784fa08.js () 47.8 kB  [rendered]
chunk {32} 32-es2015.4e40666ba62c48adaf1d.js () 108 kB  [rendered]
chunk {32} 32-es5.4e40666ba62c48adaf1d.js () 108 kB  [rendered]
chunk {33} 33-es2015.ab567a6a1bca74023094.js () 124 kB  [rendered]
chunk {33} 33-es5.ab567a6a1bca74023094.js () 124 kB  [rendered]
chunk {21} styles.e41d91830c208ab6d957.css (styles) 56.4 kB [initial] [rendered]"""

compilation20191203 ="""chunk {13} polyfills-es2015.7fe73f9f4f4623128707.js (polyfills) 36.6 kB [initial] [rendered]
chunk {14} polyfills-es5.c82493fe8874487f5c6b.js (polyfills-es5) 122 kB [initial] [rendered]
chunk {0} 0-es2015.b29a0e778722359bb453.js () 40.9 kB  [rendered]
chunk {0} 0-es5.b29a0e778722359bb453.js () 40.9 kB  [rendered]
chunk {1} 1-es2015.9b48a8396c2be473b511.js () 30.7 kB  [rendered]
chunk {1} 1-es5.9b48a8396c2be473b511.js () 30.7 kB  [rendered]
chunk {2} 2-es2015.57f1d8027174d7c4184f.js () 145 kB  [rendered]
chunk {2} 2-es5.57f1d8027174d7c4184f.js () 153 kB  [rendered]
chunk {3} 3-es2015.1e3c6311b04c19934cf7.js () 48.1 kB  [rendered]
chunk {3} 3-es5.1e3c6311b04c19934cf7.js () 48.7 kB  [rendered]
chunk {4} common-es2015.9405f5e3cef59c5f301f.js (common) 10.9 kB  [rendered]
chunk {4} common-es5.9405f5e3cef59c5f301f.js (common) 11 kB  [rendered]
chunk {5} 5-es2015.8f831c28b9b94b880775.js () 98.7 kB  [rendered]
chunk {5} 5-es5.8f831c28b9b94b880775.js () 99.3 kB  [rendered]
chunk {6} 6-es2015.1a7fd61612dc9cd97d22.js () 68.6 kB  [rendered]
chunk {6} 6-es5.1a7fd61612dc9cd97d22.js () 68.8 kB  [rendered]
chunk {7} runtime-es2015.55efc00f2f906c63e3d4.js (runtime) 2.78 kB [entry] [rendered]
chunk {7} runtime-es5.55efc00f2f906c63e3d4.js (runtime) 2.78 kB [entry] [rendered]
chunk {8} 8-es2015.05c6b983703ced9c2a84.js () 176 kB  [rendered]
chunk {8} 8-es5.05c6b983703ced9c2a84.js () 176 kB  [rendered]
chunk {9} 9-es2015.132470c2ba7e40d65803.js () 369 kB  [rendered]
chunk {9} 9-es5.132470c2ba7e40d65803.js () 371 kB  [rendered]
chunk {10} 10-es2015.518a40eb77e7d03282ee.js () 51.4 kB  [rendered]
chunk {10} 10-es5.518a40eb77e7d03282ee.js () 52.1 kB  [rendered]
chunk {11} 11-es2015.cea667d2e3916fade9d4.js () 4.48 kB  [rendered]
chunk {11} 11-es5.cea667d2e3916fade9d4.js () 4.51 kB  [rendered]
chunk {12} main-es2015.a4d878b1cf36043c765a.js (main) 1.64 MB [initial] [rendered]
chunk {12} main-es5.a4d878b1cf36043c765a.js (main) 1.72 MB [initial] [rendered]
chunk {16} 16-es2015.d2fa3998c0454f7d8db4.js () 428 kB  [rendered]
chunk {16} 16-es5.d2fa3998c0454f7d8db4.js () 429 kB  [rendered]
chunk {17} 17-es2015.3536bf562410a7f573a4.js () 581 kB  [rendered]
chunk {17} 17-es5.3536bf562410a7f573a4.js () 582 kB  [rendered]
chunk {18} 18-es2015.8025b56a2835cb7dc448.js () 71.8 kB  [rendered]
chunk {18} 18-es5.8025b56a2835cb7dc448.js () 72.1 kB  [rendered]
chunk {19} 19-es2015.f28093ae7e18e5ce4c1f.js () 65 kB  [rendered]
chunk {19} 19-es5.f28093ae7e18e5ce4c1f.js () 65.3 kB  [rendered]
chunk {20} 20-es2015.c052c023c0042107893c.js () 62.3 kB  [rendered]
chunk {20} 20-es5.c052c023c0042107893c.js () 62.3 kB  [rendered]
chunk {21} 21-es2015.ad2bb3192ea197a09fe5.js () 187 kB  [rendered]
chunk {21} 21-es5.ad2bb3192ea197a09fe5.js () 188 kB  [rendered]
chunk {22} 22-es2015.3ad58e63f9526250b3df.js () 73.1 kB  [rendered]
chunk {22} 22-es5.3ad58e63f9526250b3df.js () 73.2 kB  [rendered]
chunk {23} 23-es2015.c35b1b25638c13e53ec7.js () 153 kB  [rendered]
chunk {23} 23-es5.c35b1b25638c13e53ec7.js () 153 kB  [rendered]
chunk {24} 24-es2015.a19f4885f9889e398c64.js () 149 kB  [rendered]
chunk {24} 24-es5.a19f4885f9889e398c64.js () 149 kB  [rendered]
chunk {25} 25-es2015.21b1a86cbcc7d2668b57.js () 4.41 kB  [rendered]
chunk {25} 25-es5.21b1a86cbcc7d2668b57.js () 4.44 kB  [rendered]
chunk {26} 26-es2015.1de41b2edb2bd0a2d21f.js () 58 kB  [rendered]
chunk {26} 26-es5.1de41b2edb2bd0a2d21f.js () 58.1 kB  [rendered]
chunk {15} styles.19a799310b1a1b10b47f.css (styles) 61.3 kB [initial] [rendered]"""



extractCompilationData(compilation20191203, "/Users/laurahughes/GitHub/cvisb_data/notes/performance/2019-12-03_prod_loggedin/compilation_2019-12-03.csv")
extractCompilationData(compilation20200212, "/Users/laurahughes/GitHub/cvisb_data/notes/performance/2020-02-12_prod_loggedin/compilation_2020-02-12.csv")


# decoding the various module .js chunks

mods = ['admin',
 'app',
 'choropleth',
 'data-quality',
 'dataset',
 'dataset-page',
 'dataset-summary',
 'delete-data',
 'dot-plot',
 'download-btn',
 'download-data',
 'embed-json',
 'epidemiology',
 'file-list',
 'filters',
  "font-awesome",
 'format-citation',
 'format-publisher',
 'hla',
 'home',
 'material',
 'patient',
 'patient-page',
 'patient-timepoints',
 'piccolo',
 'pipes',
 'provenance',
 'sample',
 'systems-serology',
 'summary-stats',
 'svg-icon',
 'upload',
 'upload-patients',
 'upload-samples',
 'viral-seq']

 ng-select?
 forms? reactiveforms?

datasetMods = ["dataset", "dataset-summary", "choropleth", "app", "dot-plot", "filters", "svg-icon", "admin"]
hlaMods = ["dataset-page", "allele-circle-packing", "hla", "dataset-summary", "choropleth", "app", "dot-plot", "filters", "svg-icon", "file-list", "embed-json", "format-citation", "format-publisher", "admin"]
seroMods = ["dataset-page", 'systems-serology', "dataset-summary", "choropleth", "app", "dot-plot", "filters", "svg-icon", "file-list", "embed-json", "format-citation", "format-publisher", "admin"]
viralseqMods = ["dataset-page", 'viral-seq', "dataset-summary", "choropleth", "app", "dot-plot", "filters", "svg-icon", "file-list", "embed-json", "format-citation", "format-publisher", "admin"]


homeMods = []

patientMods = ["patient", "filters", "download-btn", "svg-icon", "pipes", "patient-timepoints", "app", "font-awesome"]
indivPatientMods = ["patientPage", "svg-icon", "pipes", "patient-timepoints", "format-citation", "file-list", "allele-circle-packing", "provenance", "app", "font-awesome"]


dataset =   [1,3,5,6,7,8,10,22]
sero =      [0,1,2,3,4,5,6,7,8,10,11,13,34]
hla =       [0,1,2,3,4,5,6,7,8,10,11,13,16,30]
viralseq =  [0,1,2,3,4,5,6,7,8,10,11,13,17]


home = [0,14,31]

patient = [0,1,2,3,4,5,6,7,8,14,15,32]
indiv_patient = [0,1,2,3,4,11,14,16,25]

samples = [0,1,2,3,4,5,6,7,15,33]

upload = []
upload_data = []
upload_samples = []
upload_patient = []
upload_delete = []

set(patient) - set(samples) - set(dataset)

set(indiv_patient) - set(hla)
set(patientMods) - set(indivPatientMods)
