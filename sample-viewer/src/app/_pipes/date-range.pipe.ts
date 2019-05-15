import { Pipe, PipeTransform } from '@angular/core';

import { DatePipe } from '@angular/common';

@Pipe({
  name: 'dateRange'
})

export class DateRangePipe implements PipeTransform {
  constructor(private datePipe: DatePipe) {
  }

  transform(value: any, dateFormat: string = "d MMMM y"): any {
    let dateString: string;

    switch (typeof (value)) {
      case "string":
        dateString = this.datePipe.transform(value, dateFormat);
        break;
      case "object":
        let lower = this.datePipe.transform(value.gte, dateFormat);
        let upper = this.datePipe.transform(value.lte, dateFormat);

        dateString = lower === upper ? lower : `${lower}-${upper}`;
        break;
    }

    return dateString;
  }
}
