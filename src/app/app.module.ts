import { BrowserModule } from '@angular/platform-browser';
import { ApplicationRef, APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, DoBootstrap, NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { AppRoutingModule } from './app-routing.module';

import { HomeComponent } from './home/home.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { HowToUseComponent } from './how-to-use/how-to-use.component';
import { NavbarComponent } from './navbar/navbar.component';

import { ReteComponent } from './rete/rete.component';
import { ReteModule } from 'rete-angular-render-plugin';

import { NumberComponent } from './rete/controls/control1/number-control';

import { MyNodeComponent1 } from './rete/components/node1/node1.component';
import { MyNodeComponent2 } from './rete/components/node2/node2.component';
import { MyNodeComponent3 } from './rete/components/node3/node3.component';

import { VisualEditorComponent } from './visual-editor/visual-editor.component';

import { NgxPopper } from 'angular-popper';

import { CommonModule, NgClass } from '@angular/common';import { AddComponent } from './rete/components/add-component';

import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { initializeKeycloak } from './utility/app.init';
import { HttpClientModule } from '@angular/common/http';
import { NodeTemplate } from './rete/components/node-template/node-template.component';

import { NgxSpinnerModule } from 'ngx-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


const keycloakService = new KeycloakService();

@NgModule({
  declarations: [

    AppComponent,
    ReteComponent,

    MyNodeComponent1,
    MyNodeComponent2,
    MyNodeComponent3,
    NodeTemplate,

    NumberComponent,

    AppComponent,
    HomeComponent,
    AboutUsComponent,
    HowToUseComponent,
    NavbarComponent,
    VisualEditorComponent,

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
  entryComponents: [MyNodeComponent1, MyNodeComponent2, MyNodeComponent3, NodeTemplate]
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

