import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { HowToUseComponent } from './how-to-use/how-to-use.component';
import { VisualEditorComponent } from './visual-editor/visual-editor.component';
import { AuthGuard } from './utility/app.guard';

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
    path: "Application",
    component: VisualEditorComponent, canActivate: [AuthGuard]
  },
  {
    path: "application",
    component: VisualEditorComponent, canActivate: [AuthGuard],
  },
  {
    path: "**",
    component: HomeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
