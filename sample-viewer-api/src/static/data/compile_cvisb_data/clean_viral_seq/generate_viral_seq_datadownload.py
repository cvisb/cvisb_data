import pandas as pd
import os
import json

# [Import helper functions]  ----------------------------------------------------------------------------------------------------
os.chdir("/Users/laurahughes/GitHub/cvisb_data/sample-viewer-api/src/static/data/")
# Helper functions for cleanup...
import helpers


def get_viralseq_downloads(dateModified, downloads, experiments, version, datasetVirus):

    # Combine together curated lassa sequence, curated ebola sequence, and all the individual raw files (contained in downloads, a DataFrame)
    lasv = get_lasv_curated(dateModified, "0.1", experiments, datasetVirus)

    # Make sure arrays are arrays
    downloads['measurementTechnique'] = downloads.measurementTechnique.apply(helpers.listify)
    downloads['citation'] = downloads.citation.apply(helpers.listify)
    ds = downloads.to_dict(orient="records")

    ds.append(lasv)

    return(pd.DataFrame(ds))


""" Summary, curated file containing all the experiment IDs from the experiments.
"""


def get_lasv_curated(dateModified, version, experiments, datasetVirus="Lassa"):
    ds = {}

    lasv_filename = "LASV_NP-GP_2019-09-11.fasta"

 # Filter out only the experiments which are "curated" and for that particular virus
    expts = experiments[(experiments.cohort == datasetVirus) & experiments.inAlignment]

    # --- static variables ---
    # identifiers
    ds['@context'] = "http://schema.org/"
    ds["@type"] = "DataDownload"
    ds["name"] = lasv_filename
    ds["identifier"] = lasv_filename
    ds["description"] = "Sequences with lower quality (manual curation, 8 removed) and incomplete sequences (<95% of (GP+NP) or (Z+L) ORFs length, 289 removed) are excluded from the curated alignment. Remaining sequences are trimmed to their coding regions, codon aligned using mafft and inspected manually. ORFs are arranged in sense orientation as follows: S segment: NP -NNNNNN- GP; L segment: L -NNNNNN- Z. A maximum likelihood (ML) phylogeny is reconstructed with RAxML using the general time-reversible (GTR) nucleotide substitution model, gamma-distributed rates among sites and bootstrap resampling with 500 replicates."
    ds["contentUrl"] = "https://raw.githubusercontent.com/cvisb/curated-alignments/master/lassa/LASV_NP-GP_2019-09-11.fasta"
    ds["url"] = "https://github.com/cvisb/curated-alignments"

    if(datasetVirus == "Ebola"):
        ds["includedInDataset"] = "ebola-viral-seq"
        ds["variableMeasured"] = ["Ebola virus sequence"]
        ds["keywords"] = ["viral sequencing", "Ebola", "Ebola virus", "EBOV"]
    elif(datasetVirus == "Lassa"):
        ds["includedInDataset"] = "lassa-viral-seq"
        ds["variableMeasured"] = ["Lassa virus sequence"]
        ds["keywords"] = ["viral sequencing", "Lassa", "Lassa virus", "LASV"]

    # properties
    ds["measurementCategory"] = "viral sequencing"
    ds["additionalType"] = "curated data"
    ds["encodingFormat"] = "text/fasta"

    # credit
    ds['author'] = [helpers.getLabAuthor("KGA")]
    ds['publisher'] = [helpers.cvisb]

    # --- possibly variable, each time ---
    ds["version"] = version
    ds["dateModified"] = dateModified

    # pulled from experiments
    ds['citation'] = helpers.getUnique(expts, "citation")
    # Flatten citations from list of lists to list
    # ds['citation'] = ds.citation.apply(lambda l: [item for sublist in l for item in sublist])
    ds["measurementTechnique"] = helpers.getUnique(
        expts, "measurementTechnique")
    ds["experimentIDs"] = helpers.getUnique(expts, "experimentID")

    return(pd.DataFrame([ds]))
