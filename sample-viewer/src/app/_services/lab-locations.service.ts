import { Injectable } from '@angular/core';

import { Lab } from '../_models';

@Injectable({
  providedIn: 'root'
})
export class LabLocationsService {

  labs: Lab[] = [
    { 'id': 'KGH', 'label': 'Kenema Govt. Hospital', 'short_label': 'KGH', 'category': 'SLE', 'lab': 'KGH' },
    { 'id': 'TSRI-Andersen', 'short_label': 'TSRI: Andersen', 'label': 'TSRI: KGA', 'category': 'TSRI' },
    { 'id': 'TSRI-Sullivan', 'label': 'TSRI: Sullivan', 'short_label': 'TSRI: BS', 'category': 'TSRI' },
    { 'id': 'TSRI-Briney', 'label': 'TSRI: Briney', 'short_label': 'TSRI: BB', 'category': 'TSRI' },
    { 'id': 'Tulane-Garry', 'label': 'Tulane: Garry', 'short_label': 'Tulane: RG', 'category': 'Tulane' },
    { 'id': 'Tulane-Schieffelin', 'label': 'Tulane: Schieffelin', 'short_label': 'Tulane: JS', 'category': 'Tulane' },
    { 'id': 'MGH-Alter', 'label': 'MGH: Alter', 'short_label': 'MGH: GA', 'category': 'MGH' }
  ];

  constructor() { }

  getLabs = function(): Lab[] {
    return(this.labs);
  }
}
