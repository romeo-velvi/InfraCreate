import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { HowToUseComponent } from './pages/how-to-use/how-to-use.component';
import { VisualizerComponent } from './visualizer-system/visualizer/visualizer.component';
import { ComposerComponent } from './composer-system/composer/composer.component';
import { AuthGuard } from './utility/app.guard';
import { environment } from 'src/environments/environment';
import { DocsComponent } from './pages/docs/docs.component';

const routesGuard: Routes = [
  {
    path: "",
    component: HomeComponent,
  },
  {
    path: "home",
    component: HomeComponent,
  },
  {
    path: "how-to-use",
    component: HowToUseComponent,
  },
  {
    path: "documentation",
    component: DocsComponent,
  },
  {
    path: "visualizer",
    component: VisualizerComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "composer",
    component: ComposerComponent,
    canActivate: [AuthGuard]

  },
  {
    path: "**",
    component: HomeComponent,
  },
];

const routesSimple: Routes = [
  {
    path: "",
    component: HomeComponent,
  },
  {
    path: "home",
    component: HomeComponent,
  },
  {
    path: "how-to-use",
    component: HowToUseComponent,
  },
  {
    path: "documentation",
    component: DocsComponent,
  },
  {
    path: "visualizer",
    component: VisualizerComponent,
  },
  {
    path: "composer",
    component: ComposerComponent,
  },
  {
    path: "**",
    component: HomeComponent,
  },
];

let ROUTES: Routes = environment.mocked ? routesSimple : routesGuard;

@NgModule({
  imports: [RouterModule.forRoot(ROUTES)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
