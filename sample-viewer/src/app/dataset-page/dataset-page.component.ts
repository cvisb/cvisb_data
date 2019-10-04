import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-dataset-page',
  templateUrl: './dataset-page.component.html',
  styleUrls: ['./dataset-page.component.scss']
})

export class DatasetPageComponent implements OnInit {
  dataset: any;

  constructor(private route: ActivatedRoute,
    private meta: Meta,
    private titleSvc: Title
  ) {
  }

  ngOnInit() {
    // fetch dataset data from resolver.
    this.dataset = this.route.snapshot.data['datasetData'];

    // Set page name
    if (this.route.snapshot.data['datasetData']) {
      this.titleSvc.setTitle(`${this.route.snapshot.data['datasetData']['name']} ${this.route.snapshot.data.title}`)
    }
  }


  // selectDataset($event: Event, selected: any) {
  //   $event.preventDefault();
  //   $event.stopPropagation();  // <- that will stop propagation on lower layers
  //
  //   this.mdSvc.sendMetadata(selected, 'Dataset');
  //   this.mdSvc.clickFile(true);
  // }

}
