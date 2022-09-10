import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { from } from 'rxjs';
import { DataRouteComposer, SubjectType } from 'src/app/models/appType';
import { ParseService } from 'src/app/services/application/parse/parse.service';
import { SpinnerService } from 'src/app/services/application/spinner/spinner.service';
import { StorageService } from 'src/app/services/application/storage/storage.service';
import { FlavorApplication, ModuleApplication, ModuleInstance, TheaterApplication } from 'src/app/services/modelsApplication/applicationModels';


/**
 * Componente che ha come scopo di switchare l'ambiente di costruzione moduli e teatri in base ai dati passati.
 */
@Component({
  selector: 'app-composer',
  templateUrl: './composer.component.html',
  styleUrls: ['./composer.component.sass']
})
export class ComposerComponent implements OnInit {

  /**
   * Variabile che ha come scopo prendere i dati passati come url-parameters
   * @type {DataRouteComposer} 
   */
  protected dataFromRouter: DataRouteComposer;
  // variabili istanziate come valori proveniente dalla dataFormRouter
  protected name: string;
  protected description: string;
  protected author: string;
  protected type: SubjectType;
  // variabili che indicano i tipi - moduli e teatro
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
   * Variabile che viene valorizzata con i flavor reperiti per poter essere utilizzata dalla componente di costruzione del moduli
   * @type {FlavorApplication}
   * @see {ReteModuleComposer}
   */
  protected flavor: FlavorApplication[] = [];

  /**
   * Variabile che viene valorizzata come dizionario di moduli utilizzata dalla componente di costruzione del teatro.
   * @type { [name: string]: ModuleInstance }
   * @see {ReteTheaterComposer}
   */
  protected modulesDict: { [name: string]: ModuleInstance };

  /**
   * Variabile che viene valorizzata nel momento in cui si presenta il caso di design da un file preso in input
   * @type {boolean} 
   */
  protected hasFile: boolean = false;

  /**
   * Variabile che indica il tipo di dato, preso di ritorno da un file
   * @type {TheaterApplication}
   * @type {ModuleApplication}
   */
  protected data: TheaterApplication | ModuleApplication;


  /**
   * Costruttore della componente ComposerComponent.
   * Si occupa di prendere i dati di route url e valorizzare le rispettive variabili e se sono presenti i dati di un file.
   * @param router 
   * @param parseService 
   * @param spinnerService 
   * @param storageService 
   */
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
    // se non è stato inizializzato il nome e ci sono dati nello storage
    if (!this.name && this.storageService.data) {
      this.hasFile = true;
      this.data = this.storageService.data;
      this.storageService.data = undefined; // consumo l'elemento
    }
    else {
      this.hasproblem = true;
    }

  }

  /**
   * Funzione richiamata all'inizializzazione della componente ComposerComponent.
   * Richiama le funzioni adeguate in base al tipo di componente Modulo o Teatro scelto per il design.
   * @see {initMODULE}
   * @see {initTHEATER}
   */
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


  /**
   * Funzione che esegue tutte le funzioni di inizializzazione, reperimento e filtraggio dati da poter essere passati alla componente di ModuleComposer.
   * Esegue anche le attività di spinner-loading.
   * @see {ReteModuleComposer}
   * @see {SpinnerService}
   * @see {parseService}
   */
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

  /**
   * Funzione che esegue tutte le funzioni di inizializzazione, reperimento e filtraggio dati da poter essere passati alla componente di ModuleComposer.
   * Esegue anche le attività di spinner-loading.
   * @see {ReteModuleComposer}
   * @see {SpinnerService}
   * @see {parseService}
   */
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

  /**
   * Funzione che esegue una redirezione alla pagine home
   */
  public gohome() {
    this.router.navigate(['/home']);
  }

}
