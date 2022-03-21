import { BrowserModule } from '@angular/platform-browser';
import { ApplicationRef, APP_INITIALIZER, DoBootstrap, NgModule } from '@angular/core';

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

import { CommonModule } from '@angular/common';import { AddComponent } from './rete/components/add-component';

import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { initializeKeycloak } from './utility/app.init';
import { HttpClientModule } from '@angular/common/http';

const keycloakService = new KeycloakService();

@NgModule({
  declarations: [

    AppComponent,
    ReteComponent,

    MyNodeComponent1,
    MyNodeComponent2,
    MyNodeComponent3,

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
  bootstrap: [AppComponent],
  entryComponents: [MyNodeComponent1, MyNodeComponent2, MyNodeComponent3]
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

