
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { from } from 'rxjs';
import { DataRouteVisualizer, SubjectType } from 'src/app/models/appType';
import { ParseService } from 'src/app/services/application/parse/parse.service';
import { SpinnerService } from 'src/app/services/application/spinner/spinner.service';
import { ModuleApplication, TheaterApplication } from 'src/app/services/modelsApplication/applicationModels';


@Component({
  selector: 'app-displayer',
  templateUrl: './visualizer.component.html',
  styleUrls: ['./visualizer.component.sass'],
})

export class VisualizerComponent implements OnInit {

  /**
   * Variabile che ha come scopo prendere i dati passati come url-parameters
   * @type {DataRouteComposer} 
   */
  dataFromRouter: DataRouteVisualizer;
  // variabili istanziate come valori proveniente dalla dataFormRouter
  protected id: string | number;
  protected type: SubjectType;

  // type var
  protected MODULE = SubjectType.MODULE;
  protected THEATER = SubjectType.THEATER;


  /**
   * Variabile che viene valorizzata a true se si è verificato un errore.
   * @type {boolean}
   * @default false
   */
  protected hasproblem: boolean = false;

  /**
   * Variabile che indica lo stato di reperimento dei dati prima di visualizzare le componenti di costruzione
   * @type  {boolean}
   * @default false
   */
  protected active: boolean = false;

  /**
   * Variabile che memorizza il modulo ricavato dal parser.
   * @type {ModuleApplication}
   * @see {parseService}
   */
  protected module: ModuleApplication;

  /**
   * Variabile che memorizza il modulo ricavato dal parser.
   * @type {TheaterApplication}
   * @see {parseService}
   */
  protected theater: TheaterApplication;

  /**
   * Costruttore di VisualizerComponent.
   * Si occupa di prendere i dati di route url e valorizzare le rispettive variabili.
   * @param router 
   * @param parseService 
   * @param spinnerService 
   */
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

  /**
   * Funzione richiamata all'inizializzazione della componente.
   * Richiama le funzioni adeguate in base al tipo di componente Modulo o Teatro scelto per la visualizzazione.
   * @see {initMODULE}
   * @see {initTHEATER}
   */
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


  /**
   * Funzione che esegue tutte le funzioni di inizializzazione, reperimento e filtraggio dati da poter essere passati alla componente di TheaterVisualizer.
   * Esegue anche le attività di spinner-loading.
   * @see {ReteModuleComposer}
   * @see {SpinnerService}
   * @see {parseService}
   */
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

  /**
   * Funzione che esegue tutte le funzioni di inizializzazione, reperimento e filtraggio dati da poter essere passati alla componente di TheaterVisualizer.
   * Esegue anche le attività di spinner-loading.
   * @see {ReteTheaterComposer}
   * @see {SpinnerService}
   * @see {parseService}
   */
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

  /**
   * Funzione che esegue una redirezione alla pagine home
   */
  public gohome() {
    this.router.navigate(['/home']);
  }

}


