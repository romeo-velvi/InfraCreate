import { BrowserModule } from '@angular/platform-browser';
import { ApplicationRef, APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, DoBootstrap, NgModule, Provider } from '@angular/core';

import { AppComponent } from './app.component';

import { AppRoutingModule } from './app-routing.module';

import { HomeComponent } from './pages/home/home.component';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { HowToUseComponent } from './pages/how-to-use/how-to-use.component';

import { ReteModule } from 'rete-angular-render-plugin';

import { ReteTheaterVisualizerComponent } from './visualizer-system/rete-theater-visualizer/rete-theater-visualizer.component';
import { ReteModuleVisualizerComponent } from './visualizer-system/rete-module-visualizer/rete-module-visualizer.component';

import { ReteModuleComposerComponent } from './composer-system/rete-module-composer/rete-module-composer.component';
import { ReteTheaterComposerComponent } from './composer-system/rete-theater-composer/rete-theater-composer.component';


import { HostComponent } from './rete-settings/nodes/rete-nodes/host/host.component';
import { SubnetComponent } from './rete-settings/nodes/rete-nodes/subnet/subnet.component';
import { NetworkComponent } from './rete-settings/nodes/rete-nodes/network/network.component';
import { MirroringModuleInstanceComponent } from './rete-settings/nodes/rete-modules/mirroringModuleInstance/mirroringModuleInstance.component';
import { TheaterInternalServiceModuleInstanceComponent } from './rete-settings/nodes/rete-modules/theaterInternalServiceModuleInstance/theaterInternalServiceModuleInstance.component';
import { TheaterModuleInstanceComponent } from './rete-settings/nodes/rete-modules/theaterModuleInstance/theaterModuleInstance.component';

import { VisualizerComponent } from './visualizer-system/visualizer/visualizer.component';
import { ComposerComponent } from './composer-system/composer/composer.component';

import { CommonModule, NgClass, NgStyle } from '@angular/common';

import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { initializeKeycloak } from './utility/app.init';
import { HttpClientModule } from '@angular/common/http';

import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxTypeaheadModule } from "ngx-typeahead";
import { NgxPopper } from 'angular-popper';


import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TokenService } from './services/token/token.service';
import { ModuleService } from './services/api/module.service';
import { TheaterService } from './services/api/theater.service';

import { OffcanvasComponent } from './components/offcanvas/offcanvas.component';
import { NavbarComponent } from './components/navbar/navbar.component';

import { NavbarElementComponent } from './pages/elements/navbar-element/navbar-element.component';
import { DataInputComponent } from './components/data-input/data-input.component';
import { ModalComponent } from './components/modal/modal.component';
import { UnderbarComponent } from './components/underbar/underbar.component';
import { DataInputV2Component } from './components/data-input-v2/data-input-v2.component';
import { TabnavComponent } from './components/tabnav/tabnav.component';
import { ParseService } from './services/application/parse/parse.service';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { DataItemComponent } from './components/data-item/data-item.component';
import { environment } from 'src/environments/environment';
import { DocsComponent } from './pages/docs/docs.component';
// import { ColorPickerModule } from 'ngx-color-picker';

const keycloakService = new KeycloakService();
let providerInitKeycloak: Provider = (!environment.mocked)
  ? {
    provide: APP_INITIALIZER,
    useFactory: initializeKeycloak,
    multi: true,
    deps: [KeycloakService],
    // provide: KeycloakService,
    // useValue: keycloakService,
  }
  : [];


@NgModule({
  declarations: [

    AppComponent,

    VisualizerComponent,
    ComposerComponent,

    ReteTheaterVisualizerComponent,
    ReteModuleVisualizerComponent,
    ReteModuleComposerComponent,
    ReteTheaterComposerComponent,

    HostComponent,
    SubnetComponent,
    NetworkComponent,
    MirroringModuleInstanceComponent,
    TheaterInternalServiceModuleInstanceComponent,
    TheaterModuleInstanceComponent,

    AppComponent,
    HomeComponent,
    AboutUsComponent,
    HowToUseComponent,
    NavbarElementComponent,

    VisualizerComponent,
    ComposerComponent,
    OffcanvasComponent,
    NavbarComponent,
    DataInputComponent,
    ModalComponent,
    UnderbarComponent,
    DataInputV2Component,
    TabnavComponent,
    DataItemComponent,
    DocsComponent
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

    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    providerInitKeycloak,
    TokenService,
    ModuleService,
    TheaterService,
    ParseService
  ],
  exports: [OffcanvasComponent, NavbarComponent, NavbarElementComponent, DataInputComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent],
  entryComponents: [
    MirroringModuleInstanceComponent,
    TheaterInternalServiceModuleInstanceComponent,
    TheaterModuleInstanceComponent,
    SubnetComponent,
    NetworkComponent,
    HostComponent
  ]
})

export class AppModule implements DoBootstrap {
  ngDoBootstrap(appRef: ApplicationRef) {
    if (!environment.mocked) { // se non è mockato
      keycloakService
        .init()
        .then(() => {
          appRef.bootstrap(AppComponent);
        })
        .catch((error) =>
          console.error('[ngDoBootstrap] init Keycloak failed', error)
        );
    }
  }
}

