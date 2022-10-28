import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

// platformBrowserDynamic().bootstrapModule(AppModule)
//   .catch(err => console.error(err));

platformBrowserDynamic().bootstrapModule(AppModule)
  .then(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/ngsw-worker.js', {
          updateViaCache: 'none'
        })
        .then(
          (registration) => {
            console.log('Service worker registration succeeded:', registration);
            registration.update();
          }
          , 
          (error) => {
            console.error(`Service worker registration failed: ${error}`);
          }
        )
    }
  })
  .catch(err => console.log(err));