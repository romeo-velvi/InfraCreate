import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { HowToUseComponent } from './pages/how-to-use/how-to-use.component';
import { VisualizerComponent } from './visualizer-system/visualizer/visualizer.component';
import { ComposerComponent } from './composer-system/composer/composer.component';
import { AuthGuard } from './utility/app.guard';
import { environment } from 'src/environments/environment';

const routes: Routes = [
  {
    path: "",
    component: HomeComponent,
  },
  {
    path: "home",
    component: HomeComponent,
  },
  {
    path: "about-us",
    component: AboutUsComponent,
  },
  {
    path: "how-to-use",
    component: HowToUseComponent,
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
const routesMocked: Routes = [
  {
    path: "",
    component: HomeComponent,
  },
  {
    path: "home",
    component: HomeComponent,
  },
  {
    path: "about-us",
    component: AboutUsComponent,
  },
  {
    path: "how-to-use",
    component: HowToUseComponent,
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

const routesSwitch = (): Routes => {
  if (environment.mocked)
    return routesMocked
  else
    return routes
}

@NgModule({
  imports: [RouterModule.forRoot(routesSwitch())],
  exports: [RouterModule]
})
export class AppRoutingModule { }
