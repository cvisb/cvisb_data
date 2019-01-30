// Structural directive to embed json-ld object as a <script> tag within the body of the document.
import { Directive, Renderer2, Inject, Input, OnDestroy, PLATFORM_ID } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { isPlatformServer, isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[embedJsonld]'
})
export class EmbedJsonldDirective implements OnDestroy {
  script_element: any;

  // NOTE: `embedJsonld` must match the HTML: `*embedJsonld="jsonObj"`
  @Input() set embedJsonld(jsonObj: Object) {
    let jsonType = jsonObj['@type'];

    this._document.getElementsByTagName("script")
    this.script_element = this.renderer.createElement('script');

    if (isPlatformServer(this.platformId)) {
      // NOTE: insertion needs to occur on server-side ONLY-- or else you get two copies.
      // NOTE: since insertion has to happen server-side to get picked up by Google Dataset Search, it'll be hidden on local client-side rendering (for testing).
      // Server-side appending will occur only on initial page load
      // console.log('appending ' + jsonType + " server-side")

      this.script_element.type = `application/ld+json`;
      this.script_element.text = JSON.stringify(jsonObj);
      this.script_element.title = `schemaorg ${jsonType}`;
      this.script_element.id = `${jsonType}-${jsonObj['name']}`
      // this.script_element.id = `schemaorg-client`;
      // console.log('appending ' + jsonType + " client-side")
      this.renderer.appendChild(this._document.head, this.script_element);
    }
    // else {
    //   // console.log('appending ' + jsonType + " client-side")
    //   this.script_element.type = `application/ld+json`;
    //   this.script_element.text = JSON.stringify(jsonObj);
    //   this.script_element.title = `schemaorg ${jsonType}`;
    //   this.script_element.id = `${jsonType}-${jsonObj['name']}`
    //   this.renderer.appendChild(this._document.head, this.script_element);
    // }
  }

  constructor(
    private renderer: Renderer2,
    @Inject(DOCUMENT) private _document,
    @Inject(PLATFORM_ID) private platformId: Object  // Whether to be rendered server-side or client-side
  ) {
  }

  // Clean up past additions to the
  ngOnDestroy(): void {
    // console.log('on destroy')
    // NOTE: should also happen server-side
    if (this.script_element) {
      this.renderer.removeChild(this._document.head, this.script_element);
    }
  }

}
