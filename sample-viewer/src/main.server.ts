export { AppServerModule } from './app/app.server.module';
import { environment } from './environments/environment';
import { enableProdMode } from '@angular/core';

if (environment.production) {
  enableProdMode();
}

export { renderModule, renderModuleFactory } from '@angular/platform-server';
