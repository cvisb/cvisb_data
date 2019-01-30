import { Component, Input } from '@angular/core';

@Component({
  selector: 'svg-icon',
  templateUrl: './svg-icon.component.html',
  styleUrls: ['./svg-icon.component.scss']
})

// based on https://github.com/RubenVermeulen/ng-svg-sprite-icon-system
// https://medium.com/@rubenvermeulen/using-an-svg-sprite-icon-system-in-angular-9d4056357b60
export class SvgIconComponent {

  @Input() icon: string;
}
