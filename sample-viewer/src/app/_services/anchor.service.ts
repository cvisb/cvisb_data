import { Injectable } from '@angular/core';

import { StripWhitespacePipe } from '../_pipes';


@Injectable({
  providedIn: 'root'
})

export class AnchorService {

  constructor(private stripPipe: StripWhitespacePipe) { }

  clickAnchor(anchor_tag: string) {
    console.log(anchor_tag)
    anchor_tag = this.stripPipe.transform(anchor_tag);

    let anchor_div = document.querySelector("#" + anchor_tag);
    console.log(anchor_div)
    if (anchor_div) {
      anchor_div.scrollIntoView();
    }
  }
}
