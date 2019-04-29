import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getKeys'
})
export class GetKeysPipe implements PipeTransform {

  transform(value: any): any {
    if ((typeof (value) === 'object') && !Array.isArray(value)) {
      return Object.keys(value);
    }
    else {
      return([]);
    }
  }

}
