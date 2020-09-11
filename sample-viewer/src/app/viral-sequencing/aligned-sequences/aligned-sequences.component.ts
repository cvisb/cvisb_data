import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-aligned-sequences',
  templateUrl: './aligned-sequences.component.html',
  styleUrls: ['./aligned-sequences.component.scss']
})

export class AlignedSequencesComponent implements OnInit {
  @Input() virusName: string;

  constructor() { }

  ngOnInit() {
  }

  downloadAlignment(){
    console.log(this.virusName);
  }

}
