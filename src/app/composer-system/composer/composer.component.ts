import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { from } from 'rxjs';
import { DataRouteComposer, SubjectType } from 'src/app/models/appType';
import { ParseService } from 'src/app/services/application/parse/parse.service';
import { SpinnerService } from 'src/app/services/application/spinner/spinner.service';
import { StorageService } from 'src/app/services/application/storage/storage.service';
import { FlavorApplication, ModuleApplication, ModuleInstance, TheaterApplication } from 'src/app/services/modelsApplication/applicationModels';
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

  // data into ss
  hasFile: boolean = false;
  data: TheaterApplication | ModuleApplication;

  constructor(
    private router: Router,
    private parseService: ParseService,
    private spinnerService: SpinnerService,
    private storageService: StorageService
  ) {
    this.dataFromRouter = this.router.getCurrentNavigation().extras.state as DataRouteComposer
    if (this.dataFromRouter) {
      this.name = this.dataFromRouter.name as string;
      this.description = this.dataFromRouter.description as string;
      this.author = this.dataFromRouter.author as string;
      this.type = this.dataFromRouter.type as SubjectType;
    }
    else if (!this.name && storageService.data) {
      this.hasFile = true;
      this.data = storageService.data;
      storageService.data = undefined; // consumo l'elemento
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
    if (this.hasFile) {
      this.data = this.data as ModuleApplication;
      // controllo un campo per vedere se è stato passato correttamente il file in json->ModuleApplication
      try {
        let t = this.data.topology.elements;
      } catch {
        this.hasproblem = true;
        this.spinnerService.setSpinner(false);
        return;
      }
    }
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
    if (this.hasFile) {
      this.data = this.data as TheaterApplication;
      // controllo un campo per vedere se è stato passato correttamente il file in json->TheaterApplication
      try {
        let t = this.data.topology.elements;
      } catch {
        this.spinnerService.setSpinner(false);
        this.hasproblem = true;
        return;
      }
    }
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
