import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'experimentObject'
})
export class ExperimentObjectPipe implements PipeTransform {
  exptDict: Object[] = [
    { "name": "HLA sequencing", "identifier": "hla" },
    { "name": "viral sequencing", "identifier": "viralseq" },
    { "name": "metagenome sequencing", "identifier": "metagenomeseq" },
    { "name": "BCR sequencing", "identifier": "bcr" },
    { "name": "TCR sequencing", "identifier": "tcr" },
    { "name": "Systems Serology", "identifier": "systemsserology" },
    { "name": "metabolomics", "identifier": "metabolomics" }
  ];

  transform(value: string, var2Search: string = "name"): any {
    let filtered = this.exptDict.filter(d => d[var2Search] === value);
    if (filtered.length === 1) {
      return (filtered[0]);
    }
    return { "name": null, "identifier": null };
  }

}
