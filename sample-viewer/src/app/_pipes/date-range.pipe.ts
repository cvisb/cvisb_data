import { Pipe, PipeTransform } from '@angular/core';

import { DatePipe } from '@angular/common';

@Pipe({
  name: 'dateRange'
})

export class DateRangePipe extends DatePipe implements PipeTransform {
  constructor(dateFormat: string){
       super(dateFormat);
   }

  transform(value: any, dateFormat: string = "d MMMM y"): any {
    let dateString: string;

    switch (typeof (value)) {
      case "string":
        dateString = super.transform(value, dateFormat);
        break;
      case "object":
        let lower = super.transform(value.gte, dateFormat);
        let upper = super.transform(value.lte, dateFormat);

        dateString = lower === upper ? lower : `${lower}-${upper}`;
        break;
    }

    return dateString;
  }
}
