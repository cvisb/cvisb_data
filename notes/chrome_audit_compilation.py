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
