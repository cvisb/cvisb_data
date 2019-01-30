import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterLocus'
})
export class FilterLocusPipe implements PipeTransform {

  transform(alleles: string[], locus: string="A"): any {
     let filteredAlleles = alleles.filter(d => d && d.split('\*')[0] === locus);
     return(filteredAlleles.length > 0 ? filteredAlleles : ["unknown"]);
  }

}
