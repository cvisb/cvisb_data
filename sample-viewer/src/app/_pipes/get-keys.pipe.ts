import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getKeys'
})
export class GetKeysPipe implements PipeTransform {
  columnOrder = ["location", "lab", "numAliquots"];

  transform(value: any): any {
    if ((typeof (value) === 'object') && !Array.isArray(value)) {
      let keys = Object.keys(value);
      keys.sort((a, b) => this.sortingFunc(a) - this.sortingFunc(b));
      return keys;
    }
    else {
      return([]);
    }
  }

  sortingFunc(a) {
    let idx = this.columnOrder.indexOf(a);
    // if not found, return dummy so sorts at the end
    if (idx < 0) {
      return (1000);
    }
    return (idx);
  }

}
