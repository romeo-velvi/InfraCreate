
import { Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { from } from 'rxjs';
import { DataRouteVisualizer, SubjectType } from 'src/app/models/appType';
import { ParseService } from 'src/app/services/application/parse/parse.service';
import { SpinnerService } from 'src/app/services/application/spinner/spinner.service';
import { ModuleApplication, TheaterApplication } from 'src/app/services/modelsApplication/applicationModels';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-displayer',
  templateUrl: './visualizer.component.html',
  styleUrls: ['./visualizer.component.sass'],
})

export class VisualizerComponent implements OnInit {

  // data passed
  dataFromRouter: DataRouteVisualizer;
  id: string | number;
  type: SubjectType;

  // component var
  fetcher: any;
  parser: any;
  parsed_modules: any;
  parsed_theater: any;
  // ACTUAL
  parsedModule?: ModuleApplication;
  parsedTheater?: TheaterApplication;

  // type var
  MODULE = SubjectType.MODULE;
  THEATER = SubjectType.THEATER;


  //check var
  hasproblem: boolean = false;
  active: boolean = false;

  //data pass module
  module: ModuleApplication;

  //data pass theater
  theater: TheaterApplication;

  constructor(
    private router: Router,
    private parseService: ParseService,
    private spinnerService: SpinnerService,
  ) {

    this.dataFromRouter = this.router.getCurrentNavigation().extras.state as DataRouteVisualizer
    if (this.dataFromRouter) {
      this.id = this.dataFromRouter.id;
      this.type = this.dataFromRouter.type;
    }
    else {
      this.hasproblem = true;
    }

  }

  async ngOnInit() {

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
    this.spinnerService.setSpinner(true, "Loading module canvas");
    from(
      this.parseService.parseModuleForModuleVisualizer(this.id ? this.id : 1459)
    )
      .subscribe(el => {
        if (el) {
          this.module = el
          this.spinnerService.setSpinner(false);
          this.active = true;
        }
        else {
          this.spinnerService.setSpinner(false);
          this.hasproblem = true;
        }
      });
  }

  async initTHEATER() {
    this.spinnerService.setSpinner(true, "Loading theater canvas");
    from(
      this.parseService.parseTheaterForTheaterVisualizer(this.id ? this.id : 502)
    )
      .subscribe(el => {
        if (el) {
          this.theater = el
          this.spinnerService.setSpinner(false);
          this.active = true;
        }
        else {
          this.spinnerService.setSpinner(false);
          this.hasproblem = true;
        }
      });
  }


  public gohome() {
    this.router.navigate(['/home']);
  }

}


