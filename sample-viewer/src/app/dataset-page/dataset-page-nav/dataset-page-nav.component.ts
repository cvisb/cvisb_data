import { Component, OnInit, Input } from '@angular/core';

import { AnchorService } from '../../_services';

@Component({
  selector: 'app-dataset-page-nav',
  templateUrl: './dataset-page-nav.component.html',
  styleUrls: ['./dataset-page-nav.component.scss']
})
export class DatasetPageNavComponent implements OnInit {
  @Input() id: string;

  links: Object =
    {
      hla: [
        { key: "description", name: "overview" },
        { key: "sources", name: "sources" },
        { key: "summary", name: "data summary" },
        { key: "compare", name: "compare allelic frequencies" },
        { key: "files", name: "download data" },
      ],
      "lassa-virus-seq": [
        { key: "description", name: "overview" },
        { key: "alignments", name: "curated alignments" },
        { key: "sources", name: "sources" },
        { key: "files", name: "download data" },
      ],
      "sarscov2-virus-seq": [
        { key: "description", name: "overview" },
        { key: "sources", name: "sources" },
        { key: "files", name: "download data" },
      ],
      "ebola-virus-seq": [
        { key: "description", name: "overview" },
        { key: "alignments", name: "curated alignments" },
        { key: "sources", name: "sources" },
        { key: "files", name: "download data" },
      ],
      "systems-serology": [
        { key: "description", name: "overview" },
        { key: "files", name: "download data" },
      ]
    };

  constructor(private anchorSvc: AnchorService) { }

  ngOnInit() {
  }

  onAnchorClick(anchor_tag: string) {
    this.anchorSvc.clickAnchor(anchor_tag);
  }

}
