import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-aligned-sequences-filters',
  templateUrl: './aligned-sequences-filters.component.html',
  styleUrls: ['./aligned-sequences-filters.component.scss']
})

export class AlignedSequencesFiltersComponent implements OnInit {
  outcomes: string[] = ["survivor", "dead", "contact", "control", "unknown"];
  @Input() publications: string[] = ["Andersen Cell 2015", "Kafetzopoulou Science 2019", "Siddle NEJM 2018"];
  @Input() countries: Object[] = [
    { id: "SL", label: "Sierra Leone" },
    { id: "NG", label: "Nigeria" },
    { id: "LR", label: "Liberia" },
    { id: "GN", label: "Guinea" },
  ];

// https://dev.cvisb.org/api/experiment/query?q=measurementTechnique:%20%22viral%20sequencing%22&size=0&facets=publication.DOI.keyword,%20data.virus.keyword

  constructor() { }

  ngOnInit() {
  }

}
