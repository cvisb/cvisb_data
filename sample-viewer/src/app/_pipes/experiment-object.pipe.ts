import { Pipe, PipeTransform } from '@angular/core';

import { ExperimentObject } from '../_models';

@Pipe({
  name: 'experimentObject'
})

// Current groups:
// - HLA sequencing
// - metagenome sequencing
// - virus sequencing
//       - Ebola virus sequencing
//       - Lassa virus sequencing
// - immune repetoire sequencing
//       - BCR sequencing
//       - TCR sequencing
// - Systems Serology
//        - ADCP
//        - ADNP
//        - ADCD
//        - NKD
// - Clinical Measurements
//       - metabolomics
//       - blood chemistry
//       - vitals
//       - sensor vitals
//       - rapid diagnostics
//       - RT-PCR
//       - ELISA
// - Clinical observations
//       - acute symptoms
//       - sequelae
//       - coma score
//       - medications

/*
dataset_id: Dataset:identifier
icon_id: id in icon_defs.svg
anchor_link:
datasetName: name for btns; should be short
 */
export class ExperimentObjectPipe implements PipeTransform {
  exptDict: ExperimentObject[] = [
    { "dataset_id": "hla", "icon_id": "hla", "datasetName": "HLA sequencing", "anchor_link": "HLA-sequencing", "variableMeasured": ["HLA genotype"], "measurementTechnique": ["Nucleic Acid Sequencing"], "measurementCategory": "HLA sequencing" },

    // { "dataset_id": "metagenome-seq", "datasetName": "metagenome sequencing", "anchor_link": "metagenome-sequencing", "variableMeasured": ["metagenome sequence"], "measurementTechnique": ["Nucleic Acid Sequencing"], "measurementCategory": "metagenome sequencing" },

    { "dataset_id": "ebola-virus-seq", "icon_id": "ebola-virus-seq", "datasetName": "Ebola virus sequencing", "anchor_link": "Ebola-virus-sequencing", "variableMeasured": ["Ebola virus sequence"], "measurementTechnique": ["Nucleic Acid Sequencing"], "measurementCategory": "virus sequencing"  },
    { "dataset_id": "lassa-virus-seq", "icon_id": "lassa-virus-seq", "datasetName": "Lassa virus sequencing", "anchor_link": "Lassa-virus-sequencing", "variableMeasured": ["Lassa virus sequence"], "measurementTechnique": ["Nucleic Acid Sequencing"], "measurementCategory": "virus sequencing"  },
    { "dataset_id": "sarscov2-virus-seq", "icon_id": "sarscov2-virus-seq", "datasetName": "SARS-CoV-2 virus sequencing", "anchor_link": "SARS-CoV-2-virus-sequencing", "variableMeasured": ["SARS-CoV-2 virus sequence"], "measurementTechnique": ["Nucleic Acid Sequencing"], "measurementCategory": "virus sequencing" },

    { "dataset_id": "bcr", "icon_id": "bcr", "datasetName": "BCR sequencing", "anchor_link": "BCR-sequencing", "variableMeasured": ["BCR sequence"], "measurementTechnique": ["Immune Repertoire Deep Sequencing"], "measurementCategory": "immune repertoire sequencing" },
    { "dataset_id": "tcr", "icon_id": "tcr", "datasetName": "TCR sequencing", "anchor_link": "TCR-sequencing", "variableMeasured": ["TCR sequence"], "measurementTechnique": ["Immune Repertoire Deep Sequencing"], "measurementCategory": "immune repertoire sequencing" },

    { "dataset_id": "systems-serology", "icon_id": "systems-serology", "datasetName": "Systems Serology", "anchor_link": "Systems-Serology", "variableMeasured": ["ADNP","ADCD","ADCP","ADNKA_CD107a","ADNKA_IFNg","ADNKA_MIP1b"], "measurementTechnique": ["serology"], "measurementCategory": "Systems Serology" },
    { "dataset_id": "systems-serology-32783920", "icon_id": "systems-serology", "datasetName": "Systems Serology", "anchor_link": "Systems-Serology", "variableMeasured": ["IgG1", "IgG2", "IgG3", "IgG4", "IgA1", "IgA2", "IgM", "FcRg2A", "FcRg2b", "FcRg3A", "SNA", "RCA", "ADCP", "ADNP", "ADCD", "NKD-CD107a", "NKD-MIP1b", "NT50"], "measurementTechnique": ["serology"], "measurementCategory": "Systems Serology" },

    // { "dataset_id": "metabolomics", "datasetName": "metabolomics", "anchor_link": "metabolomics", "variableMeasured": ["metabolomics"], "measurementTechnique": ["Metabolomics"], "measurementCategory": "clinical measurements"},
    { "dataset_id": "blood-chemistry-vhf", "icon_id": "blood-chemistry", "datasetName": "blood chemistry", "anchor_link": "blood-chemistry", "variableMeasured": ["blood chemistry"], "measurementTechnique": ["Blood Chemistry Measurement"], "measurementCategory": "clinical measurements" },
    { "dataset_id": "blood-counts-vhf", "icon_id": "blood-counts", "datasetName": "blood counts", "anchor_link": "blood-count", "variableMeasured": ["blood counts"], "measurementTechnique": ["Blood Cell Count"], "measurementCategory": "clinical measurements" },
    { "dataset_id": "vitals-vhf", "icon_id": "vitals", "datasetName": "vitals", "anchor_link": "vitals", "variableMeasured": ["vitals"], "measurementTechnique": ["Vital Signs Measurement"], "measurementCategory": "clinical measurements" },
    { "dataset_id": "sensor-vitals-vhf", "icon_id":"sensor-vitals", "datasetName": "sensor vitals", "anchor_link": "sensor-vitals", "variableMeasured": ["vitals"], "measurementTechnique": ["Sensor Vital Signs Measurement"], "measurementCategory": "clinical measurements" },
    { "dataset_id": "rapid-diagnostics-vhf", "icon_id": "rapid-diagnostics", "datasetName": "rapid diagnostics", "anchor_link": "rapid-diagnostics", "variableMeasured": ["virus level"], "measurementTechnique": ["Rapid Antigen Test"], "measurementCategory": "clinical measurements" },
    { "dataset_id": "rtpcr-32783920", "icon_id": "rtpcr", "datasetName": "RT-PCR", "anchor_link": "RT-PCR", "variableMeasured": ["virus level"], "measurementTechnique": ["Reverse Transcriptase-Polymerase Chain Reaction"], "measurementCategory": "clinical measurements" },
    { "dataset_id": "rtpcr-vhf", "icon_id": "rtpcr", "datasetName": "RT-PCR", "anchor_link": "RT-PCR", "variableMeasured": ["virus level"], "measurementTechnique": ["Reverse Transcriptase-Polymerase Chain Reaction"], "measurementCategory": "clinical measurements" },
    { "dataset_id": "ELISA", "icon_id": "elisa", "datasetName": "ELISA", "anchor_link": "ELISA", "variableMeasured": ["patient antibody response"], "measurementTechnique": ["ELISA"], "measurementCategory": "clinical measurements" },

    // { "dataset_id": "clinical-symptoms", "datasetName": "clinical observations", "anchor_link": "clinical-observations", "variableMeasured": ["acute symptoms", "sequelae", "medications"], "measurementTechnique": ["Clinical Observation"], "measurementCategory": "clinical observations" }
  ];

  transform(value: string, var2Search: string = "dataset_id"): any {
    let filtered: ExperimentObject[];

    if (var2Search === "measurementTechnique") {
      filtered = this.exptDict.filter(d => d[var2Search].includes(value));
    }
    else {
      filtered = this.exptDict.filter(d => d[var2Search] === value);
    }

    if (filtered.length === 1) {
      return (filtered[0]);
    }
    return { "measurementTechnique": null, "measurementCategory": null, "dataset_id": null, "anchor_link": null };
  }

}
