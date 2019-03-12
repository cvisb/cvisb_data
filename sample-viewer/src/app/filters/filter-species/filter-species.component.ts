import { Component, OnInit } from '@angular/core';

import { RequestParametersService } from '../../_services';


@Component({
  selector: 'app-filter-species',
  templateUrl: './filter-species.component.html',
  styleUrls: ['./filter-species.component.scss']
})
export class FilterSpeciesComponent implements OnInit {
  humanOff: boolean = true;
  ratOff: boolean = true;
  monkeyOff: boolean = true;
  unknownOff: boolean = true;

  constructor(private requestSvc: RequestParametersService) { }

  ngOnInit() {
  }

  filterSpecies(species: string) {
    switch (species) {
      case ("human"):
        this.humanOff = !this.humanOff;
        break;

      case ("rodent"):
        this.ratOff = !this.ratOff;
        break;

      case ("monkey"):
        this.monkeyOff = !this.monkeyOff;
        break;
      case ("unknown"):
        this.unknownOff = !this.unknownOff;
        break;
      default:
        break;
    }

    this.requestSvc.updateParams("sample", { field: "species", value: species });
  }

}
