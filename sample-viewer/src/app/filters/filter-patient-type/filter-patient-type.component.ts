import { Component, OnInit, Input } from '@angular/core';

import { ESFacetTerms } from '../../_models';

@Component({
  selector: 'app-filter-patient-type',
  templateUrl: './filter-patient-type.component.html',
  styleUrls: ['./filter-patient-type.component.scss']
})
export class FilterPatientTypeComponent implements OnInit {
  plot_height: number = 90; // height of plots in pixels

  @Input() viruses: ESFacetTerms[];
  @Input() outcomes: ESFacetTerms[];
  @Input() all_cohorts: string[];
  @Input() all_outcomes: string[];
  @Input() endpoint: string;
  @Input() horizontal: boolean = false;
  @Input() filterable: boolean = true;

  constructor() { }

  ngOnInit() {
    if(this.outcomes && this.viruses) {
    this.outcomes = this.outcomes.sort((a: any, b: any) => b.value - a.value);
    this.viruses = this.viruses.sort((a: any, b: any) => b.value - a.value);
  }
}

}
