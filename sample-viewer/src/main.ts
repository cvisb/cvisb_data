import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

// import 'autotrack/lib/plugins/event-tracker';
// import 'autotrack/lib/plugins/outbound-link-tracker';
// import 'autotrack/lib/plugins/url-change-tracker';
// https://github.com/angular/angular-cli/issues/4451

if (environment.production) {
  enableProdMode();
}

  document.addEventListener("DOMContentLoaded", () => {
    platformBrowserDynamic()
      .bootstrapModule(AppModule)
      .catch(err => console.log(err));
  });
