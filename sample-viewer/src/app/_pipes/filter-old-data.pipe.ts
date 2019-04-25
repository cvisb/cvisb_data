import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterOldData'
})
export class FilterOldDataPipe implements PipeTransform {

  transform(oldData: any[], key: string, sampleID: string): any {
    let idx = oldData.findIndex(d => d.sampleID === sampleID);
    if (idx > -1) {
      return (oldData[idx][key])
    }
    return (null);
  }

}
