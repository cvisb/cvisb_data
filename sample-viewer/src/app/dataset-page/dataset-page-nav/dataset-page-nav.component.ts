import { Component, OnInit, Input } from '@angular/core';

import { AnchorService } from '../../_services';

@Component({
  selector: 'app-dataset-page-nav',
  templateUrl: './dataset-page-nav.component.html',
  styleUrls: ['./dataset-page-nav.component.scss']
})
export class DatasetPageNavComponent implements OnInit {
  @Input() id: string;
  isCustom: boolean;

  links: Object =
    {
      default: [
        { key: "description", name: "overview" },
        { key: "sources", name: "sources" },
      ],
      hla: [
        { key: "description", name: "overview" },
        { key: "sources", name: "sources" },
        { key: "summary", name: "data summary" },
        { key: "compare", name: "compare allelic frequencies" },
      ],
      "lassa-virus-seq": [
        { key: "description", name: "overview" },
        { key: "alignments", name: "curated alignments" },
        { key: "sources", name: "sources" },
      ],
      "ebola-virus-seq": [
        { key: "description", name: "overview" },
        { key: "alignments", name: "curated alignments" },
        { key: "sources", name: "sources" },
      ]
    };

  constructor(private anchorSvc: AnchorService) { }

  ngOnInit() {
    this.isCustom = Object.keys(this.links).includes(this.id);
  }

  onAnchorClick(anchor_tag: string) {
    this.anchorSvc.clickAnchor(anchor_tag);
  }

}
