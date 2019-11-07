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
        { key: "description", name: "about HLA" },
        { key: "sources", name: "sources" },
        { key: "summary", name: "data overview" },
        { key: "compare", name: "compare allelic frequencies" },
        { key: "files", name: "view files / metadata" },
      ],
      "lassa-viral-seq": [
        { key: "description", name: "about Viral Sequencing" },
        { key: "alignments", name: "curated alignments" },
        { key: "sources", name: "sources" },
        { key: "files", name: "download data" },
      ],
      "ebola-viral-seq": [
        { key: "description", name: "about Viral Sequencing" },
        { key: "alignments", name: "curated alignments" },
        { key: "sources", name: "sources" },
        { key: "files", name: "view files / metadata" },
      ],
      "systems-serology": [
        { key: "description", name: "about Systems Serology" },
        { key: "summary", name: "summary" },
        { key: "files", name: "view files / metadata" },
      ]
    };

  constructor(private anchorSvc: AnchorService) { }

  ngOnInit() {
  }

  onAnchorClick(anchor_tag: string) {
    this.anchorSvc.clickAnchor(anchor_tag);
  }

}
