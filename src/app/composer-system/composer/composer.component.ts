import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { from } from 'rxjs';
import { DataRouteComposer, SubjectType } from 'src/app/models/appType';
import { ParseService } from 'src/app/services/application/parse/parse.service';
import { SpinnerService } from 'src/app/services/application/spinner/spinner.service';
import { FlavorApplication, ModuleInstance } from 'src/app/services/modelsApplication/applicationModels';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-composer',
  templateUrl: './composer.component.html',
  styleUrls: ['./composer.component.sass']
})
export class ComposerComponent implements OnInit {

  // router var
  dataFromRouter: DataRouteComposer;
  // passed var  
  name: string;
  description: string;
  author: string;
  type: SubjectType;
  // type var
  MODULE = SubjectType.MODULE;
  THEATER = SubjectType.THEATER;

  //check var
  hasproblem: boolean = false;
  active: boolean = false;

  //data pass module
  flavor: FlavorApplication[] = [];

  //data pass theater
  modulesDict: { [name: string]: ModuleInstance };

  constructor(private router: Router, private parseService: ParseService, private spinnerService: SpinnerService) {
    this.dataFromRouter = this.router.getCurrentNavigation().extras.state as DataRouteComposer
    if (this.dataFromRouter) {
      this.name = this.dataFromRouter.name as string;
      this.description = this.dataFromRouter.description as string;
      this.author = this.dataFromRouter.author as string;
      this.type = this.dataFromRouter.type as SubjectType;
    }
    else {
      this.hasproblem = true;
    }

  }

  ngOnInit() {
    if (this.type === this.MODULE) {
      this.initMODULE();
    }
    else if (this.type === this.THEATER) {
      this.initTHEATER();
    }
    else {
      this.hasproblem = true;
    }

  }

  async initMODULE() {
    this.spinnerService.setSpinner(true, "Loading canvas element");
    from(
      this.parseService.parseFlavorForModuleComposer()
    )
      .subscribe(el => {
        this.flavor = el
        this.spinnerService.setSpinner(false);
        this.active = true;
      });
  }

  async initTHEATER() {
    this.spinnerService.setSpinner(true, "Getting Theater modules")
    from(
      this.parseService.parseModuleForTheaterComposer()
    )
      .subscribe(
        el => {
          this.modulesDict = el;
          this.spinnerService.setSpinner(false);
          this.active = true;
        }
      )
  }

  public gohome() {
    this.router.navigate(['/home']);
  }

}
