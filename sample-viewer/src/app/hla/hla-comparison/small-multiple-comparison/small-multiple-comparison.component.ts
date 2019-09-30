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

  constructor(private hlaSvc: GetHlaDataService) {
  }

  ngOnChanges() {
    if (this.left_params) {
      this.hlaSvc.getFilteredHLA(this.left_params).subscribe((hlaData: HLAnested[]) => {
        this.left = hlaData;
        this.loci = this.left.map((d: HLAnested) => d.key)
      })
    }

    if (this.right_params) {
      this.hlaSvc.getFilteredHLA(this.right_params).subscribe((hlaData: HLAnested[]) => {
        this.right = hlaData;
      })
    }

    // console.log(this.left_params)
    // console.log(this.right_params)
    // console.log(this.left)
    // console.log(this.right)
    // console.log(this.loci)
  }
}
