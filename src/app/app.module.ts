import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';

import { AppRoutingModule } from './app-routing.module';

import { HomeComponent } from './home/home.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { HowToUseComponent } from './how-to-use/how-to-use.component';
import { NavbarComponent } from './navbar/navbar.component';

import { ReteComponent } from './rete/rete.component';
import { ReteModule } from 'rete-angular-render-plugin';
import { NumberComponent } from './rete/controls/number-control';
import { MyNodeComponent } from './rete/components/node/node.component';
import { MyNodeComponent2 } from './rete/components/node2/node2.component';
import { VisualEditorComponent } from './visual-editor/visual-editor.component';
import { NgxPopper } from 'angular-popper';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    ReteComponent,
    NumberComponent,
    MyNodeComponent,
    MyNodeComponent2,

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

  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [NumberComponent, MyNodeComponent, MyNodeComponent2]
})
export class AppModule {}

