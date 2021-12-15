import { NgModule } from '@angular/core';
import { ServerModule, ServerTransferStateModule } from '@angular/platform-server';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';

// activate cookie for server-side rendering
// from https://github.com/angular/angular/issues/15730#issuecomment-572992686
import * as xhr2 from 'xhr2';
import { XhrFactory } from '@angular/common';

export class ServerXhr implements XhrFactory {
  build(): XMLHttpRequest {
    xhr2.prototype._restrictedHeaders.cookie = false;
    return new xhr2.XMLHttpRequest();
  }
}

@NgModule({
  imports: [
    AppModule,
    ServerModule,
    ServerTransferStateModule
  ],
  bootstrap: [ AppComponent ],
  providers: [{ provide: XhrFactory, useClass: ServerXhr }]
})
export class AppServerModule {}
