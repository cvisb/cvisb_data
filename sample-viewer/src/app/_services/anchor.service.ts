import { Injectable, Inject, PLATFORM_ID } from '@angular/core';

import { StripWhitespacePipe } from '../_pipes';

import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})

export class AnchorService {

  constructor(private stripPipe: StripWhitespacePipe, @Inject(PLATFORM_ID) private platformId: Object) { }

  clickAnchor(anchor_tag: string) {
    console.log(anchor_tag)
    if (isPlatformBrowser(this.platformId)) {
      anchor_tag = this.stripPipe.transform(anchor_tag);

      let anchor_div = document.querySelector("#" + anchor_tag);
      console.log(anchor_div)
      if (anchor_div) {
        anchor_div.scrollIntoView();
      }
    }
  }
}
