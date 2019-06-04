import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterByAltID'
})
export class FilterByAltIDPipe implements PipeTransform {

  transform(arr: any[], id: string, returnVar: string): any {
    let filteredArr = arr.filter(d => d.alternateIdentifier.includes(id));
    console.log(filteredArr)
    return (filteredArr.length === 1 ? filteredArr[0][returnVar] : null);
  }

}
