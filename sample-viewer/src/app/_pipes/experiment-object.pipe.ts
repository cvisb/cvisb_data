import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'experimentObject'
})
export class ExperimentObjectPipe implements PipeTransform {
  exptDict: Object[] = [
    { "name": "HLA sequencing", "identifier": "hla", "link": "HLA-sequencing" },
    { "name": "viral sequencing", "identifier": "viralseq", "link": "viral-sequencing" },
    { "name": "metagenome sequencing", "identifier": "metagenomeseq", "link": "metagenome-sequencing" },
    { "name": "BCR sequencing", "identifier": "bcr", "link": "BCR-sequencing" },
    { "name": "TCR sequencing", "identifier": "tcr", "link": "TCR-sequencing" },
    { "name": "Systems Serology", "identifier": "systemsserology", "link": "Systems-Serology" },
    { "name": "metabolomics", "identifier": "metabolomics", "link": "metabolomics" }
  ];

  transform(value: string, var2Search: string = "name"): any {
    let filtered = this.exptDict.filter(d => d[var2Search] === value);
    if (filtered.length === 1) {
      return (filtered[0]);
    }
    return { "name": null, "identifier": null };
  }

}
