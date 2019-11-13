import { Pipe, PipeTransform } from '@angular/core';

import { ExperimentObject } from '../_models';

@Pipe({
  name: 'experimentObject'
})

// Current groups:
// - HLA sequencing
// - metagenome sequencing
// - viral sequencing
//       - Ebola viral sequencing
//       - Lassa viral sequencing
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


export class ExperimentObjectPipe implements PipeTransform {
  exptDict: ExperimentObject[] = [
    { "measurementTechnique": ["HLA sequencing"], "measurementCategory": "HLA sequencing", "dataset_id": "hla", "dataset_name": "HLA sequencing", "anchor_link": "HLA-sequencing" },

    { "measurementTechnique": ["metagenome sequencing"], "measurementCategory": "metagenome sequencing", "dataset_id": "metagenome-seq", "dataset_name": "metagenome sequencing", "anchor_link": "metagenome-sequencing" },

    { "measurementTechnique": ["Ebola viral sequencing"], "measurementCategory": "viral sequencing", "dataset_id": "ebola-viral-seq", "dataset_name": "Ebola viral sequencing", "anchor_link": "Ebola-viral-sequencing" },
    { "measurementTechnique": ["Lassa viral sequencing"], "measurementCategory": "viral sequencing", "dataset_id": "lassa-viral-seq", "dataset_name": "Lassa viral sequencing", "anchor_link": "Lassa-viral-sequencing" },

    { "measurementTechnique": ["BCR sequencing"], "measurementCategory": "immune repertoire sequencing", "dataset_id": "bcr", "dataset_name": "BCR sequencing", "anchor_link": "BCR-sequencing" },
    { "measurementTechnique": ["TCR sequencing"], "measurementCategory": "immune repertoire sequencing", "dataset_id": "tcr", "dataset_name": "TCR sequencing", "anchor_link": "TCR-sequencing" },

    { "measurementTechnique": ["ADNP","ADCD","ADCP","ADNKA_CD107a","ADNKA_IFNg","ADNKA_MIP1b"], "measurementCategory": "Systems Serology", "dataset_id": "systems-serology", "dataset_name": "Systems Serology", "anchor_link": "Systems-Serology" },

    { "measurementTechnique": ["metabolomics"], "measurementCategory": "clinical measurements", "dataset_id": "metabolomics", "dataset_name": "metabolomics", "anchor_link": "metabolomics" },
    { "measurementTechnique": ["blood chemistry"], "measurementCategory": "clinical measurements", "dataset_id": "blood-chemistry", "dataset_name": "blood chemistry", "anchor_link": "blood-chemistry" },
    { "measurementTechnique": ["vitals"], "measurementCategory": "clinical measurements", "dataset_id": "vitals", "dataset_name": "vitals", "anchor_link": "vitals" },
    { "measurementTechnique": ["sensor vitals"], "measurementCategory": "clinical measurements", "dataset_id": "sensor-vitals", "dataset_name": "sensor vitals", "anchor_link": "sensor-vitals" },
    { "measurementTechnique": ["rapid diagnostics"], "measurementCategory": "clinical measurements", "dataset_id": "rapid-diagnostics", "dataset_name": "rapid diagnostics", "anchor_link": "rapid-diagnostics" },
    { "measurementTechnique": ["RT-PCR"], "measurementCategory": "clinical measurements", "dataset_id": "RT-PCR", "dataset_name": "RT-PCR", "anchor_link": "RT-PCR" },
    { "measurementTechnique": ["ELISA"], "measurementCategory": "clinical measurements", "dataset_id": "ELISA", "dataset_name": "ELISA", "anchor_link": "ELISA" },

    { "measurementTechnique": ["acute symptoms", "sequelae", "coma score", "medications"], "measurementCategory": "clinical observations", "dataset_id": "clinical-symptoms", "dataset_name": "clinical observations", "anchor_link": "clinical-observations" }
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
