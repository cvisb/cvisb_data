import { Injectable } from '@angular/core';

import { StripWhitespacePipe } from '../_pipes';


@Injectable({
  providedIn: 'root'
})

export class AnchorService {

  constructor(private stripPipe: StripWhitespacePipe) { }

  clickAnchor(anchor_tag: string) {
    anchor_tag = this.stripPipe.transform(anchor_tag);

    let anchor_div = document.querySelector("#" + anchor_tag);
    if (anchor_div) {
      anchor_div.scrollIntoView();
    }
  }
}
