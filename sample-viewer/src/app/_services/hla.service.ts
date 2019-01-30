import { Injectable } from '@angular/core';
import * as d3 from 'd3';
import { Observable, Subject, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HlaService {

  // color pallette function for alleles
  locusColors =  d3.scaleOrdinal()
    .domain(['A', 'B', 'C', 'DRB4', 'DRB3', 'DRB5', 'DQB1', 'DRB1', 'DQA1', 'DPB1', 'DPA1'])
    .range(['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff9600', '#ffca33', '#a65628', '#f781bf', '#999999', '#35978f', '#f46d43']);
  // yellow: '#ffff33'
  // modified yellow for dark background: #fee08b
  // original orange: '#ff7f00'

  public selectedLocusSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  public selectedLocusState$ = this.selectedLocusSubject.asObservable();

  public selectedAlleleSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  public selectedAlleleState$ = this.selectedAlleleSubject.asObservable();


  constructor() { }
}
