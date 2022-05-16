import { BrowserModule } from '@angular/platform-browser';
import { ApplicationRef, APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, DoBootstrap, NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { AppRoutingModule } from './app-routing.module';

import { HomeComponent } from './home/home.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { HowToUseComponent } from './how-to-use/how-to-use.component';
import { NavbarComponent } from './navbar/navbar.component';

import { ReteModule } from 'rete-angular-render-plugin';

import { ReteTheaterComponent } from './rete-theater/rete-theater.component';
import { ReteModuleComponent } from './rete-module/rete-module.component';
import { ReteComposerComponent } from './rete-composer/rete-composer.component'; 

import { NodeTheaterTemplate } from './rete-theater/components/node-theater-template/node-theater-template.component';
import { NodeModuleTemplate } from './rete-module/components/node-module-template/node-module-template.component';
import { NodeComposerTemplate } from './rete-composer/components/node-composer-template/node-composer-template.component';

import { ServerComposer } from './rete-composer/components/server-composer/server-composer.component';

import { VisualEditorComponent } from './visual-editor/visual-editor.component';
import { DesignerEditorComponent } from './designer-editor/designer-editor.component';

import { CommonModule, NgClass } from '@angular/common';

import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { initializeKeycloak } from './utility/app.init';
import { HttpClientModule } from '@angular/common/http';

import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxTypeaheadModule } from "ngx-typeahead";
import { NgxPopper } from 'angular-popper';


import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


const keycloakService = new KeycloakService();

@NgModule({
  declarations: [

    AppComponent,

    ReteTheaterComponent,
    ReteModuleComponent,
    ReteComposerComponent,

    NodeTheaterTemplate,
    NodeModuleTemplate,
    NodeComposerTemplate,

    ServerComposer,

    AppComponent,
    HomeComponent,
    AboutUsComponent,
    HowToUseComponent,
    NavbarComponent,

    VisualEditorComponent,
    DesignerEditorComponent,

  ],
  imports: [
    BrowserModule,

    AppRoutingModule,

    ReteModule,

    NgxPopper,

    CommonModule,

    KeycloakAngularModule,

    HttpClientModule,

    NgxSpinnerModule,
    NgxTypeaheadModule,
    
    BrowserAnimationsModule,

  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService],
      // provide: KeycloakService,
      // useValue: keycloakService,
    },
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent],
  entryComponents: [NodeTheaterTemplate, NodeModuleTemplate, NodeComposerTemplate, ServerComposer]
})

export class AppModule implements DoBootstrap {
  ngDoBootstrap(appRef: ApplicationRef) {
    keycloakService
      .init()
      .then(() => {
        console.log('[ngDoBootstrap] bootstrap app');
        appRef.bootstrap(AppComponent);
      })
      .catch((error) =>
        console.error('[ngDoBootstrap] init Keycloak failed', error)
      );
  }
}

