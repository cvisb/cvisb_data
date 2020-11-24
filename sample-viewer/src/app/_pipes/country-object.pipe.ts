import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'countryObject'
})
export class CountryObjectPipe implements PipeTransform {
  countryDict: Object[] = [
    {
      "name": "Sierra Leone",
      "identifier": "SL",
    },
    {
      "name": "Nigeria",
      "identifier": "NG",
    }, {
      "name": "Guinea",
      "identifier": "GN",
    }, {
      "name": "Cote d'Ivoire",
      "identifier": "CI",
    }, {
      "name": "Mali",
      "identifier": "ML",
    }, {
      "name": "Togo",
      "identifier": "TG",
    }, {
      "name": "United States",
      "identifier": "US",
    }, {
      "name": "Gabon",
      "identifier": "GA",
    }, {
      "name": "Ghana",
      "identifier": "GH",
    }, {
      "name": "Democratic Rep. Congo",
      "identifier": "CD",
    }, {
      "name": "Republic of the Congo",
      "identifier": "CG",
    }, {
      "name": "Liberia",
      "identifier": "LR",
    }, {
      "name": "Mexico",
      "identifier": "MX",
    }, {
      "name": "Jordan",
      "identifier": "JO",
    }, {
      "name": "Benin",
      "identifier": "BJ",
    }
  ]

  transform(value: string, var2Search: string = "identifier"): any {
    let filtered = this.countryDict.filter(d => d[var2Search] === value);
    if (filtered.length === 1) {
      return (filtered[0]);
    }
    return { "name": null, "identifier": null };
  }

}
