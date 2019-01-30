import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-filter-elisas',
  templateUrl: './filter-elisas.component.html',
  styleUrls: ['./filter-elisas.component.scss']
})

export class FilterElisasComponent implements OnInit {
  elisa_tests: string[] = ['IgG', 'IgM', 'Ag'];
  elisa_results: Object[] = [
    { result: 'positive', icon: 'control_point' },
    { result: 'negative', icon: 'remove_circle_outline' },
    { result: 'unknown', icon: 'help_outline' }
  ]
  constructor() { }

  ngOnInit() {
  }

}
