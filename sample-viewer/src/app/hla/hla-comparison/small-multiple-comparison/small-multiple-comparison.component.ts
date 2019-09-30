import { Component, OnChanges, Input } from '@angular/core';

import { GetHlaDataService } from '../../../_services';
import { CohortSelectOptions, HLAnested } from '../../../_models';

@Component({
  selector: 'app-small-multiple-comparison',
  templateUrl: './small-multiple-comparison.component.html',
  styleUrls: ['./small-multiple-comparison.component.scss']
})
export class SmallMultipleComparisonComponent implements OnChanges {
  @Input() left_params: CohortSelectOptions;
  @Input() right_params: CohortSelectOptions;

  left: HLAnested[];
  right: HLAnested[];
  loci: string[];
  loading: boolean = false;

  constructor(private hlaSvc: GetHlaDataService) {
    this.hlaSvc.loadingState$.subscribe(loading => {
      this.loading = loading;
    })
  }

  ngOnChanges() {
    if (this.left_params && this.right_params) {
      this.hlaSvc.getLRFiltered(this.left_params, this.right_params).subscribe((hlaData: HLAnested[]) => {
        this.left = hlaData['left'].sort((a,b) => a.key > b.key ? -1 : 1);
        this.right = hlaData['right'].sort((a,b) => a.key > b.key ? -1 : 1);
        this.loci = this.left.map((d: HLAnested) => d.key);
      })
    }
  }
}
