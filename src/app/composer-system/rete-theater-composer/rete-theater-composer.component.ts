import { Component, AfterViewInit, ViewChild, ElementRef, Input, ChangeDetectionStrategy, OnInit, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { NodeEditor, Node, Engine, Output as or, Input as ir } from 'rete';
import AreaPlugin from 'rete-area-plugin';
import { Router } from '@angular/router';
import { IndexModuleComponent, ModuleComponents, ModuleType1 } from 'src/app/rete-settings/nodes/rete-modules/export-rete-modules';
import { _Socket } from '../../rete-settings/sockets/socket';
import { ReteTheaterComposerSettings } from 'src/app/rete-settings/settings/editor-settings/reteTheaterComposerSettings';
import { NavbarItem, NavbarElement } from '../../components/navbar/navbarType';
import { UnderbarItem, UnderbarElement } from '../../components/underbar/underbarType';
import { DataInputElement, DataInputReturned, SelectOption } from '../../components/data-input/dataInputType';
import { ModalItem } from '../../components/modal/modalType';
import { TabnavElement } from '../../components/tabnav/tabnavType';
import { BehaviorSubject, from } from 'rxjs';
import { AreaApplication, ModuleInstance, ReteConnection, SimpleModuleApplication, TheaterApplication } from 'src/app/services/modelsApplication/applicationModels';
import { SpinnerService } from 'src/app/services/application/spinner/spinner.service';
import { SimpleAreaDTO } from 'src/app/services/modelsDTO/moduleDTO';
import { BlueprintFileDTO, DeployInstanceDTO, EntityNameMappingFileDTO, TagCatalogueDTO, TheatreStatusDTO } from 'src/app/services/modelsDTO/theaterDTO';
import { DataInputReturnedV2 } from 'src/app/components/data-input-v2/dataInputTypeV2';
import { ReteDisplayModuleInstanceTC, ReteDisplayModuleDataTC, ReteDisplayTheaterDataTC } from 'src/app/rete-settings/settings/displayData';
import { ExportService } from 'src/app/services/application/export/export.service';
import { ModalService } from 'src/app/services/application/modal/modal.service';
import { take } from 'rxjs/operators';


/**
 * Elemento che serve alla componente ReteTheaterComposerComponent per l'aggiunta delle aree
 * @see {ReteTheaterComposerComponent}
 */
export class AreaColorDTO extends SimpleAreaDTO {
  color: string;
}


/**
 * Componente che contiene la logica e la gestione della parte di costruzione dei moduli.
 * Si occupa dello scambio di informazioni e le interazioni tra le componenti che permettono il visual-designing dell'applicazione.
 */
@Component({
  selector: 'app-rete-theater-composer',
  templateUrl: './rete-theater-composer.component.html',
  styleUrls: ['./rete-theater-composer.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReteTheaterComposerComponent implements OnInit, AfterViewInit {

  // input data
  /**
   * Variabile in input che rappresenta il nome da assegnare al teatro.
   * @type {string}
   */
  @Input() TheaterName: string;
  /**
   * Variabile in input che rappresenta la descrizione da assegnare al teatro.
   * @type {string}
   */
  @Input() TheaterDescription: string;
  /**
   * Variabile in input che rappresenta la versione da assegnare al teatro.
   * @type {string}
   * @type {number}
   */
  @Input() TheaterVersion: string | number;
  /**
   * Variabile in input che rappresenta l'autore da assegnare al teatro.
   * @type {string}
   */
  @Input() TheaterAuthor: string;
  /**
   * Variabile in inpit che rappresenta un dizionario di moduli da usare nel drag&drop.
   * @type {[name: string]: ModuleInstance}
   */
  @Input() ModulesDict: { [name: string]: ModuleInstance };

  /**
   * Variabile che rappresenta sottoforma di variabili e attributi il teatro.
   * Esso può essere già fornito (come import di un file) per eseguire manipolazioni.
   * Oppure va creato e si valorizza nel corso del designing.
   * @type {ModuleApplication}
   */
  @Input() theater: TheaterApplication;

  /**
   * Variabile che indica se bisogna creare un teatro da zero, oppure, istanziarlo a seguito di un import di un file.
   * @type {boolean}
   * @see {module}
   * @see {ModuleType}
   */
  protected fromFile: boolean = false;

  /**
   * Variabile contenente una lista di elementi da inserire nel DOM per il drag&drop.
   * @see {ModulesDict}
   */
  protected moduleDD: ModuleInstance[] = [];

  /**
   * Variabile che contiene l'insieme dei dati da visualizzare di un modulo.
   * Per esattezza, contiene le informazini del modulo del suo tipo (e non la sua istanza -> dati nodo visualizzato nel canvas).
   * @type { { [field: string]: string[] }[][] }
   * @see {displayModuleData}
   */
  protected displayMdata: { [field: string]: string[] }[][];
  /**
   * Variabile funzione che produce l'insieme dei dati da visualizzare di un modulo.
   * Per esattezza, ritorna le informazini del modulo del suo tipo (e non la sua istanza -> dati nodo visualizzato nel canvas).
   * @see {displayMdata}
   */
  displayModuleData = (module: SimpleModuleApplication): { [field: string]: string[] }[][] => { let x = ReteDisplayModuleDataTC(module); return x; }


  /**
   * Variabile che indica l'elemento all'interno del DOM il canvas su cui verranno eseguite operazioni di costruzione e designing del teatro.
   * @type {ElementRef}
   */
  @ViewChild('theaterEditorComposer', { static: false }) el: ElementRef;
  /**
   * Variabile che rappresenta il nodo selezionato
   * @type {Node}
   */
  protected nodeSelected: Node;
  /**
   * Variabile che rappresenta, similmente al nodo, anche il modulo di appartenenza del nodo selezionato
   * @type {SimpleModuleApplication}
   * @see {nodeSelected}
   */
  protected moduleSelected: SimpleModuleApplication;

  /**
   * Variabile che rappresenta il container del canvas come NativeElement
   * @see {el}
   */
  protected container = null;
  /**
   * Variabile che rappresenta l'insieme di operazioni e lo stato del canvas. 
   * Viene associato al container per il reperimento dei dati.
   * @type {NodeEditor}
   * @see {container}
   */
  protected editor: NodeEditor = null;
  /**
   * Variabile che serve a produrre e renderizzare i singoli nodi.
   * Contiene delle istanze dei singoli tipi come array.
   * @type {[]}
   */
  protected components: any = ModuleComponents;
  /**
   * Variabile che rappresenta il motore e la logica tra le interazioni dei singoli nodi.
   * @type {Engine}
   */
  protected engine: Engine = null;

  /**
   * Variabile utilizzata per la sarch di un nodo presente sul canvas.
   * @type {string}
   * @see {NodeNameList}
   */
  protected nodetofind: string = '';
  /**
   * Variabile che serve ad immagazzinare i nomi dei nodi presenti sul canvas.
   * @type {string[]}
   */
  protected ModuleNameList: string[] = [];

  /**
   * Variabile utilizzata per l'hide-or-show della minimappa
   * @type {boolean}
   */
  protected ismapvisible: boolean = true;

  /**
   * Variabile utilizzata per assegnare i valori alla Navbar.
   * @type {NavbarElement}
   */
  protected navbarData: NavbarElement;
  /**
   * Variabile che ha come riferimento un tag nel DOM di tipo templato nella quale vi è la logica di visualizzazione dei download.
   * @type {TemplateRef}
   */
  @ViewChild('download') dropdown_download: TemplateRef<any>;
  /**
   * Variabile che indica l'hide-or-show della tendina di download
   * @type {boolean}
   * @default {false}
   */
  protected showbtn: boolean = false;


  /**
   * Variabile utilizzata per assegnare i valori all'underbar.
   * @type {UnderbarElement}
   */
  protected underbarData: UnderbarElement[] = [];
  /**
   * Variabile che ha come riferimento un tag nel DOM di tipo templato nella quale vi è segnato la logia del pulsante "mappa"
   * @type {TemplateRef}
   */
  @ViewChild('map_underbar') map_underbar: TemplateRef<any>;
  /**
   * Variabile che ha come riferimento un tag nel DOM di tipo templato nella quale vi è segnato la logia della sezione "search"
   * @type {TemplateRef}
   */
  @ViewChild('search_underbar') search_underbar: TemplateRef<any>;
  /**
   * Variabile che ha come riferimento un tag nel DOM di tipo templato nella quale vi è segnato la logia del pulsante "arrange"
   * @type {TemplateRef}
   */
  @ViewChild('arrange_underbar') arrange_underbar: TemplateRef<any>;


  /**
   * Variabile utilizzata per l'hide-or-show dell'offcanvas dei singoli moduli.
   * @type {boolean}
   */
  protected hideModuleInfo: boolean = false;
  /**
   * Variabile utilizzata per assegnare i valori per le tab principali dell'offcavanvas dei moduli.
   * @type {TabnavElement}
   */
  protected tabnavElementModule: TabnavElement;


  /**
   * Variabile che ha come riferimento un tag nel DOM di tipo templato nella quale vi è il contenuto di una tab.
   * In questo caso la tab riguardante le informazioni dell'istanza del moduli.
   * @type {TemplateRef}
   */
  @ViewChild('tab_module_instance') tab_module_instance?: TemplateRef<any>;
  /**
   * Variabile che ha come riferimento un tag nel DOM di tipo templato nella quale vi è il contenuto di una tab.
   * In questo caso la tab riguardante le informazioni del tipo di modulo (modulo root) di un nodo-modulo.
   * @type {TemplateRef}
   */
  @ViewChild('tab_module_root') tab_module_root?: TemplateRef<any>;
  /**
   * Variabile utilizzata per assegnare i valori per le tab principali dell'offcanvas del modulo.
   * @type {TabnavElement}
   */
  protected tabnavElementModuleRoot: TabnavElement;
  /**
   * Variabile che ha come riferimento un tag nel DOM di tipo templato nella quale vi è il contenuto di una tab.
   * In questo caso la tab riguardante le informazioni base del modulo.
   * @type {TemplateRef}
   */
  @ViewChild('tab_module_basic') tab_module_basic?: TemplateRef<any>;
  /**
   * Variabile che ha come riferimento un tag nel DOM di tipo templato nella quale vi è il contenuto di una tab.
   * In questo caso la tab riguardante le interfacce del modulo.
   * @type {TemplateRef}
   */
  @ViewChild('tab_module_interfaces') tab_module_interfaces?: TemplateRef<any>;
  /**
  * Variabile che ha come riferimento un tag nel DOM di tipo templato nella quale vi è il contenuto di una tab.
  * In questo caso la tab riguardante i counter del modulo.
  * @type {TemplateRef}
  */
  @ViewChild('tab_module_counter') tab_module_counter?: TemplateRef<any>;

  /**
  * Variabile che ha come riferimento un tag nel DOM di tipo templato nella quale vi è il contenuto di una tab.
  * In questo caso la tab riguardante i counter del modulo.
  * @type {TemplateRef}
  */
  @ViewChild('tab_module_topology') tab_module_topology?: TemplateRef<any>;
  /**
  * Variabile utilizzata per assegnare i valori per le tab secondaria "interfacce" dell'offcanvas del modulo.
  * @type {TabnavElement}
  */
  protected tabnavIF: TabnavElement;
  /**
   * Variabile che ha come riferimento un tag nel DOM di tipo templato nella quale vi è il contenuto di una tab.
   * In questo caso la tab riguardante le interfacce consumer modulo.
   * @type {TemplateRef}
   */
  @ViewChild('tab_if_cons') tab_if_cons?: TemplateRef<any>;
  /**
  * Variabile che ha come riferimento un tag nel DOM di tipo templato nella quale vi è il contenuto di una tab.
  * In questo caso la tab riguardante le interfacce producer modulo.
  * @type {TemplateRef}
  */
  @ViewChild('tab_if_prod') tab_if_prod?: TemplateRef<any>;

  /**
   * Variabile che indica lo stato show-hide dell'offcanvas del teatro
   * @type {boolean}
   * @default {false}
   */
  protected hideTheaterInfo: boolean = false;
  /**
  * Variabile utilizzata per assegnare i valori per le tab del teatro.
  * @type {TabnavElement}
  */
  protected tabnavElementTheater: TabnavElement;
  /**
  * Variabile che ha come riferimento un tag nel DOM di tipo templato nella quale vi è il contenuto di una tab.
  * In questo caso la tab riguardante le informazioni base del teatro.
  * @type {TemplateRef}
  */
  @ViewChild('tab_theater_basic') tab_theater_basic?: TemplateRef<any>;
  /**
  * Variabile che ha come riferimento un tag nel DOM di tipo templato nella quale vi è il contenuto di una tab.
  * In questo caso la tab riguardante le aree del teatro.
  * @type {TemplateRef}
  */
  @ViewChild('tab_theater_areas') tab_theater_areas?: TemplateRef<any>;
  /**
  * Variabile che ha come riferimento un tag nel DOM di tipo templato nella quale vi è il contenuto di una tab.
  * In questo caso la tab riguardante gli import del teatro.
  * @type {TemplateRef}
  */
  @ViewChild('tab_theater_imports') tab_theater_imports?: TemplateRef<any>;
  /**
  * Variabile che ha come riferimento un tag nel DOM di tipo templato nella quale vi è il contenuto di una tab.
  * In questo caso la tab riguardante la lista dei moduli da deployare del teatro.
  * @type {TemplateRef}
  */
  @ViewChild('tab_theater_deploy') tab_theater_deploy?: TemplateRef<any>;
  /**
  * Variabile che ha come riferimento un tag nel DOM di tipo templato nella quale vi è il contenuto di una tab.
  * In questo caso la tab riguardante il mapping del modulo.
  * @type {TemplateRef}
  * @future implementation
  */
  @ViewChild('tab_theater_map') tab_theater_map?: TemplateRef<any>;
  /**
  * Variabile che ha come riferimento un tag nel DOM di tipo templato nella quale vi è il contenuto di una tab.
  * In questo caso la tab riguardante le informazioni dei tag del teatro.
  * @type {TemplateRef}
  */
  @ViewChild('tab_theater_tags') tab_theater_tags?: TemplateRef<any>;


  /**
   * Variabile per l'hide-or-show dell'offcanvas in cui è presente il drag&drop.
   * @type {boolean}
   */
  protected hidedragdrop: boolean = false;
  /**
   * Variabile che fa riferimento ad un elemento a cui è eseguito il drag.
   * @type  {Node}
   */
  protected elementDragged: Node;
  /**
   * Variabile che ha come riferimento un tag nel DOM di tipo templato nella quale vi è il contenuto di una tab.
   * In particolare questa ha lo scopo di contenere gli elementi su cui poter eseguire il drag&drop sul canvas.
   * @type {TemplateRef}
   */
  @ViewChild('dragdrop_template') dragdrop_template?: TemplateRef<any>;

  /**
   * Variabile che gestisce l'hide-or-show della modale nella componente di creazione modulo.
   * @type {boolean}
   * @default {false}
   */
  protected isModalActive: boolean = false;
  /**
   * Variabile che serve per istanziare le opzioni della modale.
   * @type {ModalItem}
   * @see {ModalComponet}
   */
  protected dataModal: ModalItem;
  /**
   * Variabile che ha come riferimento un tag nel DOM di tipo templato nella quale vi è il contenuto di una tab.
   * In particolare questa ha lo scopo di contenere un messaggio da potr, su richiesta, essere visualizzato dalla modale.
   * @type {TemplateRef}
   */
  @ViewChild('data_message') data_message?: TemplateRef<any>;
  /**
   * Variabile che indica una stringa di messaggio da poter essere visionata nella modale.
   * @type {string}
   * @see {data_message}
   */
  protected modalMessage: string = "";


  /**
   * Variabile che ha lo scopo di salvare gli import del teatro.
   * @type {BehaviorSubject}
   */
  protected areaList: BehaviorSubject<AreaApplication[]> = new BehaviorSubject<AreaApplication[]>(null);
  /**
   * Variabile di appoggio per la selezione delle aree dei moduli.
   * @type {SelectOption}
   * @see {availableFlavor}
   */
  protected areaSelection: SelectOption[] = [];
  /**
 * Variabile che ha come riferimento un tag nel DOM di tipo templato.
 * In particolare consente la visualiazzione degli input per aggiungere un area.
 * @type {TemplateRef}
 * @see {availableFlavor}
 */
  @ViewChild('data_input_area') data_input_area?: TemplateRef<any>;
  /**
   * Variabile che contiene gli elementi del form da visualizzare quando si inserisce l'area.
   * @type {DataInputElement}
   * @see {data_input_area}
   */
  protected formAreaElement: DataInputElement = {
    element: [
      {
        id: "name",
        text: "Area name",
        type: "text",
        required: true,
      },
      {
        id: "description",
        text: "Area description",
        type: "textarea",
        required: false,
      },
      {
        id: "color",
        text: "Area color",
        type: "text",
        required: false
      },
    ]
  };

  /**
   * Variabile che ha lo scopo di salvare gli import del teatro.
   * @type {BehaviorSubject}
   */
  protected importList: BehaviorSubject<string[]> = new BehaviorSubject<string[]>(null);
  /**
   * Variabile che ha come riferimento un tag nel DOM di tipo templato.
   * Contiene le informazini da mostrare nella modale per l'inserimento di un nuovo import.
   * @type {TemplateRef}
   * @see {modal}
   */
  @ViewChild('data_input_import') data_input_import?: TemplateRef<any>;
  /**
  * Variabile che indica cosa visualizzare nella modale, per l'aggiunta di un import.
  * @type {DataInputElement}
  * @see {data_input_import}
  */
  protected formImportElement: DataInputElement = {
    element: [
      {
        id: "import",
        text: "Import from",
        type: "text",
        required: true
      }
    ]
  };

  /**
   * Variabile che ha lo scopo di salvare i tag del teatro.
   * @type {BehaviorSubject}
   */
  protected tagList: BehaviorSubject<TagCatalogueDTO[]> = new BehaviorSubject<TagCatalogueDTO[]>(null);
  /**
   * Variabile che ha come riferimento un tag nel DOM di tipo templato.
   * Contiene le informazini da mostrare nella modale per l'inserimento di un nuovo tag.
   * @type {TemplateRef}
   * @see {modal}
   */
  @ViewChild('data_input_tag') data_input_tag?: TemplateRef<any>;
  /**
    * Variabile che indica cosa visualizzare nella modale, per l'aggiunta di un import.
    * @type {DataInputElement}
    * @see {data_input_import}
    */
  protected formTagElement: DataInputElement = {
    element: [
      {
        id: "name",
        text: "Tag name",
        type: "text",
        required: true
      },
      {
        id: "description",
        text: "Tag description",
        type: "textarea",
        required: false,
      },
    ]
  };

  //deployment sequence
  protected deploymentList: BehaviorSubject<DeployInstanceDTO[]> = new BehaviorSubject<DeployInstanceDTO[]>(null);











  /**
   * Costruttore di ReteTheaterComponser.
   * Vengono inserite le subscribe ai subject per gestire gli eventi di modifiche delle varie strutture.
   *@param cdr 
   * @param router 
   * @param spinnerService 
   * @param exportService 
   * @param modalConfirmation 
   */
  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router,
    private spinnerService: SpinnerService,
    private exportService: ExportService,
    private modalConfirmation: ModalService
  ) {
    this.areaList.asObservable().subscribe((areas) => {
      let so: SelectOption[] = [];
      let sa: SimpleAreaDTO[] = [];
      if (areas) {
        areas.forEach((a) => {
          so.push({
            value: a.name,
            text: a.name
          });
          sa.push({
            area: a.name,
            description: a.description
          })
        });
      }
      this.areaSelection = so;
      if (this.theater)
        this.theater.properties.areas = sa;
    });
    this.importList.asObservable().subscribe((imp) => {
      if (this.theater)
        this.theater.blueprintFile.imports = imp ? imp : [];
    });
    this.tagList.asObservable().subscribe((tags) => {
      if (this.theater)
        this.theater.tags = tags ? tags : [];
    });
    this.deploymentList.asObservable().subscribe((dep) => {
      let x: { [index: string]: DeployInstanceDTO } = {}; let i = 0;
      if (dep) {
        dep.forEach(d => {
          x[++i] = d;
        });
      };
      if (this.theater) {
        this.theater.deploymentSequence = x;
      }
    });
  }




  /**
   * Funzione richiamata all'inizializzazione della componente.
   * Si occupa di eseguire controlli per l'inizializzazione del teatro (nuovo o da import file).
   * Si occupa anche di valorizzare i moduli per il drag&drop dati in ingresso.
   * Si avvale di operazioni di spinner-loading.
   * Avvia la funzione di start quando ha terminato le precedenti operazioni.
   * @see {startApp}
   */
  async ngOnInit() {
    this.spinnerService.setSpinner(true, "Loading theater composer")
    let stringdate = new Date;
    if (!this.theater)
      this.theater = {
        elements: {},
        connection: [],
        properties: {
          mode: '',
          tags: [],
          areas: [],
          author: this.TheaterAuthor,
          version: this.TheaterAuthor,
          description: this.TheaterDescription,
        },
        topology: undefined,
        author: this.TheaterAuthor,
        blueprintFile: new BlueprintFileDTO,
        blueprintUUID: '',
        createdBy: this.TheaterAuthor,
        createdDate: stringdate as unknown as string,
        deploymentSequence: {},
        description: this.TheaterDescription,
        entityNameMappingFile: new EntityNameMappingFileDTO,
        id: '',
        isLocked: false,
        lastModifiedBy: this.TheaterAuthor,
        lastModifiedDate: stringdate as unknown as string,
        lockAcquiredTimestamp: stringdate as unknown as string,
        lockLastUserAcquiring: this.TheaterAuthor,
        lockReleasedTimestamp: '',
        name: this.TheaterName,
        status: new TheatreStatusDTO,
        tags: [],
        uuid: '',
        version: this.TheaterVersion as string
      };
    else
      this.fromFile = true;
    Object.entries(this.ModulesDict).map(([key, value]) => {
      this.moduleDD.push(value);
    });
    from(this.startApp())
      .subscribe(el => {
        this.spinnerService.setSpinner(false);
      });
    this.cdr.detectChanges();
  }




  /**
   * Funzone che si occupa dell'inizializzazione dell'editor e container.
   * Prende le configurazioni dell'editor per i plugin da utilizzare ed eventi da captare.
   * Nel caso si ha un importing da un file del teatro, provvede ad inizializzare i valori dei nodi(moduli).
   * @see {ReteTheaterComposerSettings} 
   * @see {initModuleFromFile}
   */
  async startApp() {

    this.container = this.el.nativeElement;

    this.editor = new NodeEditor('InfraCreateEditor@0.2.0', this.container);

    this.engine = new Engine('InfraCreateEngine@0.2.0');

    const v = new ReteTheaterComposerSettings(this.container, this.editor, this.components, this.engine);
    v.editorUSE();

    // START EDITOR ON

    this.editor.on("nodeselected", (node) => {
      // this.zone.run(() => {
      this.touchNode(node);
      // });
    });


    this.editor.on('rendernode', ({ el, node }) => {
      el.addEventListener('dblclick', () => {
        // this.zone.run(() => {
        this.showhideModuleInfo(node);
        // })
      });
    });

    this.editor.on("connectioncreated", connection => {
      // this.zone.run(() => {
      let node = connection.output.node;
      this.editor.view.updateConnections({ node });
      // });
    });

    this.editor.on("nodecreate", (node) => {
      this.nodeCreate(node);
    });
    this.editor.on("noderemove", (node) => {
      this.nodeRemove(node);
    });

    this.editor.on('zoom', ({ source }) => {
      return source !== 'dblclick';
    });

    this.components.map(c => {
      this.editor.register(c);
      this.engine.register(c);
    });

    this.fromFile
      ? await this.initTheaterFromFile()
      : false;

    this.editor.view.resize();

    this.editor.trigger('process');

    AreaPlugin.zoomAt(this.editor, this.editor.nodes);

  }




  // init bar

  /**
   * Funzione richiamata subito dopo l'inizializzazione della componente
   * Si occupa di inizializzare le variabili per la navbar, le tab e l'underbar.
   * @see {initNavbar}
   * @see {initUnderbar}
   * @see {initTabTheaterNavs}
   * @see {initTabModuleNavs}
   */
  ngAfterViewInit() {
    this.initNavbar();
    this.initUnderbar();
    this.initTabModuleNavs();
    this.initTabTheaterNavs();
    this.cdr.detectChanges();
  }
  initNavbar() {
    this.navbarData = {
      type: "theater",
      element: [
        { text: "Theater info", id: 'info' },
        {
          text: "Download",
          id: "DD",
          template: this.dropdown_download,
        },
        { text: "Home", id: 'home' },
      ]
    }
  }
  initUnderbar() {
    this.underbarData = [
      {
        element: [
          { type: "button", button: { iconClass: "bi bi-layout-text-sidebar", tooltipText: "show sidebar" }, id: 'sidebar' }
        ]
      },
      {
        element: [
          { type: "separator", button: { iconClass: "bi bi-grip-vertical", tooltipText: "" }, id: 'separartor' }
        ]
      },
      {
        element: [
          { type: "button", button: { iconClass: "bi bi-arrow-counterclockwise", tooltipText: "undo" }, id: 'undo' },
          { type: "button", button: { iconClass: "bi bi-arrow-clockwise", tooltipText: "redo" }, id: 'redo' },
        ]
      },
      {
        element: [
          { type: "separator", button: { iconClass: "bi bi-grip-vertical", tooltipText: "" }, id: 'separartor' }
        ]
      },
      {
        element: [
          { type: "button", button: { iconClass: "bi bi-zoom-in", tooltipText: "zoom in" }, id: 'zoomin' },
          { type: "button", button: { iconClass: "bi bi-aspect-ratio", tooltipText: "display context" }, id: 'showall' },
          { type: "button", button: { iconClass: "bi bi-zoom-out", tooltipText: "zoom out" }, id: 'zoomout' },
        ]
      },
      {
        element: [
          { type: "separator", button: { iconClass: "bi bi-grip-vertical", tooltipText: "" }, id: 'separator' }
        ]
      },
      {
        element: [
          { type: "template", template: this.map_underbar, id: 'showmap' },
          { type: "template", template: this.arrange_underbar, id: 'arrange' }
        ]
      },
      {
        element: [
          { type: "separator", button: { iconClass: "bi bi-grip-vertical", tooltipText: "" }, id: 'separator' }
        ]
      },
      {
        element: [
          { type: "template", template: this.search_underbar, id: 'search' }
        ]
      },
      {
        element: [
          { type: "separator", button: { iconClass: "bi bi-grip-vertical", tooltipText: "show sidebar" }, id: 'separator' }
        ]
      },
      {
        element: [
          { type: "button", button: { iconClass: "bi bi-braces-asterisk", tooltipText: "load element from json" }, id: 'fromjson' }
        ]
      },
    ]
  }
  initTabTheaterNavs() {
    this.tabnavElementTheater = {
      element: [
        { id: "id_basic", text: "Properties", template: this.tab_theater_basic },
        { id: "id_areas", text: "Areas", template: this.tab_theater_areas },
        { id: "id_imp", text: "Imports", template: this.tab_theater_imports },
        { id: "id_seq", text: "Deployment", template: this.tab_theater_deploy },
        { id: "id_tab", text: "Tags", template: this.tab_theater_tags },
        // { id: "id_map", text: "Mapping", template: this.tab_theater_map }, // FUTURE IMPLEMENTATION
      ]
    }
  }
  initTabModuleNavs() {
    this.tabnavElementModule = {
      element: [
        { id: "id_instance", text: "Instance info", template: this.tab_module_instance },
        { id: "id_root", text: "Module info", template: this.tab_module_root },
      ]
    }
    this.tabnavElementModuleRoot = {
      element: [
        { id: "id_basic", text: "Properties", template: this.tab_module_basic },
        { id: "id_if", text: "Interfaces", template: this.tab_module_interfaces },
        { id: "id_cnt", text: "Counter", template: this.tab_module_counter },
        { id: "id_top", text: "Topology", template: this.tab_module_topology },
      ]
    }
    this.tabnavIF = {
      element: [
        { id: "if_cons", text: "Consumer", template: this.tab_if_cons },
        { id: "if_prod", text: "Producer", template: this.tab_if_prod }
      ]
    }
  }




  //// navbar operation

  /**
   * Funzione che si occupa di gestire gli eventi si selection-item della navbar.
   * @param val 
   * @see {NavbarItem}
   * @see {showhideModuleInfo}
   * @see {goHome}
   */
  navItemSelected(val: NavbarItem) {
    switch (val.id) {
      case "info":
        this.showhideTheaterInfo();
        break;
      case "download":
        this.downloadYAMLfunction();
        break;
      case "home":
        this.goHome();
        break;
      default:
        break;
    }
  }
  /**
   * Funzione che ha lo scopo di switchare il valore di visualizzazione dell'offcanvas del modulo.
   * @see {hideModuleInfo}
   */
  showhideModuleInfo(node: Node) {
    this.touchNode(node);
    this.hideModuleInfo = !this.hideModuleInfo;
    this.displaceLeft();
    this.cdr.detectChanges();
  }
  /**
   * Funzione che ha lo scopo di switchare il valore di visualizzazione dell'offcanvas del teatro.
   * @see {hideTheaterInfo}
   */
  showhideTheaterInfo() {
    this.hideTheaterInfo = !this.hideTheaterInfo;
  }
  /**
   * Funzione che permette il download dello YAML - TOSCA
   * @see {exportService}
   */
  downloadYAMLfunction() {
    this.spinnerService.setSpinner(true, "Downloading file");
    this.exportService.exportTheaterToYAML(this.theater, this.editor.toJSON());
    this.spinnerService.setSpinner(false);
  }
  /**
   * Funzione che permette il download dello JSON - APPLICATION
   * @see {exportService}
   */
  downloadJSONfunction() {
    this.spinnerService.setSpinner(true, "Downloading file");
    this.exportService.exportTheaterToJSON(this.theater, this.editor.toJSON());
    this.spinnerService.setSpinner(false);
  }
  /**
   * Funzione che come scopo ritornare alla home.
   * Ritorna se vi è stat conferma dalla modale.
   * @see {modalConfirmation}
   * @see {router}
   */
  goHome() {
    this.modalConfirmation.showConfirmationModal(("Do you really want go back home loseing all data ?"))
      .pipe(take(2)) // perchè il primo valore di reset è a null..
      .subscribe(
        v => {
          if (v) {
            this.router.navigateByUrl('/home');
          }
        }
      )
  }




  //// underbar operation

  /**
   * Funzione che si occupa di gestire gli eventi si selection-item dell'underbar.
   * @param val
   * @see {UnderbarItem}
   * @see {showDragDrop}
   * @see {undoEditor}
   * @see {redoEditor}
   * @see {makezoom}
   * @see {displayAllNodes}
   * @see {showMinimap}
   * @see {loadJson}
   */
  underbarElementSelected(val: UnderbarItem) {
    switch (val.id) {
      case "sidebar":
        this.showDragDrop();
        break;
      case "undo":
        this.undoEditor();
        break;
      case "redo":
        this.redoEditor();
        break;
      case "zoomin":
        this.makezoom(0.1);
        break;
      case "zoomout":
        this.makezoom(-0.1);
        break;
      case "showall":
        this.displayAllNodes();
        break;
      case "showmap":
        this.showMinimap();
        break;
      case "search":
        break;
      case "fromjson":
        this.loadJson();
        break;
      default:
        console.warn("problem with button pressed: ", val.id);
        break;
    }
  }
  /**
   * Esegue l'undo di un'operazione nell'editor
   */
  undoEditor() {
    this.editor.trigger("undo");
  }
  /**
   * Esegue il redo di un'operazione nell'editor
   */
  redoEditor() {
    this.editor.trigger("redo");
  }
  /**
   * Esegue operazione di zoom-in / zoom-out in base al valore passato come parametro
   * @param k 
   * @example
   * Se K>0 zoom-in se K<0 zoom-out 
   */
  makezoom(k: number) {
    // k is declarend in (click) ad +- 0.1
    const { area, container } = this.editor.view; // read from Vue component data;
    const rect = area.el.getBoundingClientRect();
    const ox = (rect.left - container.clientWidth / 2) * k;
    const oy = (rect.top - container.clientHeight / 2) * k;
    area.zoom(area.transform.k + k, ox, oy, 'wheel');
  }
  /**
   * Funzione che permette di visualizzare tutti i moduli posizionati all'interno del canvas
   */
  displayAllNodes() {
    AreaPlugin.zoomAt(this.editor, this.editor.nodes);
  }
  /**
   * Permette di caricare degli elementi all'interno del canvas. Se si posseggono i valori di un editor
   */
  loadJson() {
    let json = prompt("Insert json");
    json
      ? this.editor.fromJSON(JSON.parse(json))
      : false;
  }
  /**
   * Funzione che permette, una volta inserito un nodo. 
   * Se presente sul canvas, di selezionarlo ed eseguire uno zoom sullo stesso.
   * @param nodeToFind 
   */
  findElement(result: string) {
    this.nodetofind = result;

    let elementfound = this.editor.nodes.find(n => n.data.name === this.nodetofind)
    let elementpick = new Array(elementfound); // deve necessariamente trovarsi in un array...

    AreaPlugin.zoomAt(this.editor, elementpick);
    this.editor.selectNode(elementpick[0]);
  }
  /**
   * Funzione che permette, con buona approssimazione di sistemare i nodi in una struttura organizzata.
   */
  async arrangeNodes() {
    this.editor.nodes.forEach(
      async node => {
        await node.update()
        this.editor.trigger("arrange", { node: node });
      }
    );
  }
  /**
   * Funzione che esegue lo switch della variabile di conrollo dell'hide-or-show dell'offcanvas del drag&drop
   * @see {hidedragdrop}
   */
  showDragDrop(b: boolean = undefined) {
    if (b === undefined)
      this.hidedragdrop = !this.hidedragdrop;
    else
      this.hidedragdrop = b;
  }
  /**
   * Funzione che ha come scopo l'hide-or-show della mappa.
   * @see {ismapvisible}
   */
  showMinimap() {
    var z = document.getElementsByClassName("minimap")[0];
    z.removeAttribute("style");
    if (this.ismapvisible) {
      z.setAttribute("style", "visibility: hidden;");
    }
    else {
      z.setAttribute("style", "visibility: visible;");
    }
    this.ismapvisible = !this.ismapvisible
  }




  // canvas node operation

  /**
   * Funzione che seleziona il modulo passato come argomento.
   * @param node 
   */
  touchNode(node: Node) {
    this.nodeSelected = node;
    this.moduleSelected = this.ModulesDict[node.data.module as string].moduleInfo;
    this.displayMdata = this.displayModuleData(this.moduleSelected);
    this.cdr.detectChanges();
  }
  /**
   * Funzione che serve ad aggiornare il nome degli elementi nella ricerca.
   * @see {NodeNameList}
   */
  updateNameList() {
    this.ModuleNameList = [];
    this.editor.nodes.forEach(
      (el) => {
        this.ModuleNameList.push(el.data.name as string);
      }
    )
  }
  /**
   * Funzione che posiziona un modulo selezionato alla sinistra
   */
  displaceLeft() {
    AreaPlugin.zoomAt(this.editor, this.editor.selected.list);
    const { area, container } = this.editor.view; // read from Vue component data;
    area.translate(area.transform.x - 200, area.transform.y);
  }
  /**
   * Funzone che posiziona un modulo selezionato sulla destra
   */
  displaceRight() {
    AreaPlugin.zoomAt(this.editor, this.editor.selected.list);
    const { area, container } = this.editor.view; // read from Vue component data;
    area.translate(area.transform.x + 200, area.transform.y);
  }
  /**
   * Funzione richiamata appena l'editor triggera l'evento di creazione modulo.
   * Viene aggiornato la deployment sequence.
   * @param node 
   * @see {deploymentSequence}
   */
  nodeCreate(node: Node) {
    this.addDepSeq(node);
  }
  /**
   * Funzione richiamata appena l'editor triggera l'evento di cancellazione modulo.
   * Viene aggiornato la deployment sequence.
   * @param node 
   * @see {deploymentSequence}
   */
  nodeRemove(node: Node) {
    this.removeDepSeq(node);
  }




  // catch event to update node value

  /**
   * Funzione che esegue l'update di un modulo e le relative connessioni.
   * @param node 
   */
  updateModule(node: Node) {
    node.update();
    this.editor.view.updateConnections({ node });
    this.cdr.detectChanges();
  }
  /**
   * Funzione richiamata quando si esegue l'update di un nome di un modulo. Si occupa di:
   * - Controlla se il nuovo nome è unico.
   * - Aggiornare la deployment sequence con i nuovi dati.
   * @param val 
   * @param type 
   */
  updateModuleName(val: DataInputReturnedV2) {
    if (
      !val || //non c'è change
      !val.new_value || // non c'è alcun valore
      !val.old_value || // non c'è alcun valore
      val.new_value === this.nodeSelected.data.name // stiamo cambiando informazioni con offcanvas aperto
    ) return;
    let nameAlreadyTaken: boolean = false;
    this.editor.nodes.forEach(n => {
      if (n.data.name === val.new_value || n.data.name === val.new_value) {
        this.openModalWithMessage("A problem occurred while updating node name", "This name has already been taken");
        nameAlreadyTaken = true;
        return;
      }
    });
    if (nameAlreadyTaken) return;
    this.nodeSelected.data.name = val.new_value;
    this.nodeSelected.data.name = val.new_value;
    this.updateDepSeqName(val.old_value, val.new_value);
    this.updateModule(this.nodeSelected);
  }




  // area func
  /**
   * Funzione che viene richiamata quando si vuole creare un'area.
   * Mostra la modali di input, in base al tipo passato come argomento.
   * @param type 
   * @see {openModalWithTemplate}
   */
  addArea() {
    this.openModalWithTemplate("Insert Area", this.data_input_area);
  }
  /**
   * Funzione che esegue la rimozione di un'interfaccia se si è confermata l'interzione attraverso la modale.
   * Canella il riferimento dell'interfaccia nelle apposite strutture. 
   * Rimuove il riferimento della stessa all'interno nei nodi a cui era associata.
   * @param ifcName 
   * @param type 
   * @see {producerInterface}
   * @see {consumerInterface}
   * @see {openModalWithMessage}
   */
  removeArea(areaName: string) {
    this.modalConfirmation.showConfirmationModal(("Do you want remove area \"" + areaName + "\" ?"))
      .pipe(take(2)) // perchè il primo valore di reset è a null..
      .subscribe(
        v => {
          if (v) {
            let areas: AreaApplication[] = this.areaList.getValue() ? this.areaList.getValue() : [];
            var check = areas.findIndex(el => el.name === areaName);
            if (check < 0) { alert("area name does not exist"); return; }
            areas.splice(check, 1);
            // rimuove quest'area da tutti i nodi
            this.editor.nodes.forEach(n => {
              if (n.data.area === areaName) {
                n.data.area = "";
                n.update();
              }
            });
            this.areaList.next(areas);
            this.cdr.detectChanges();
          }
        }
      )
  }
  /**
   * Funzione che ha lo scopo di validazione dell'area.
   * Controlla che gli attributi della nuova area siano uniche.
   * Se il controllo va a buon fine, li aggiunge all'apposita strutture. 
   * @param val 
   * @param type  
   * @see {openModalWithMessage}
   * @see {areaList}
   */
  validateArea(val: DataInputReturned) {
    this.closeModal();
    if (!val || !val.isValid || !val.element) return;
    let areas: AreaApplication[] = this.areaList.getValue() ? this.areaList.getValue() : [];
    var nameAlreadyExists: boolean = areas.findIndex(el => el.name === val.element["name"].value) >= 0 ? true : false;
    if (nameAlreadyExists) {
      this.openModalWithMessage("A problem occurred while inserting area", "This area already exists");
    }
    else {
      if (val.element["name"]) {
        areas.push({
          name: val.element["name"].value,
          description: val.element["description"] ? val.element["description"].value : "",
          color: val.element["color"] ? val.element["color"].value : "white",
          deleted: false,
          id: '',
          uuid: '',
          theater: undefined,
        });
      }
    }
    this.areaList.next(areas);
    this.cdr.detectChanges();
  }
  /**
   * Funzione che si occupa dell'update del nome di un'area. Si occupa di:
   * - Controllare che il nuovo nome sia unico.
   * - Aggiornare le areaa.
   * - Aggiornare il riferimento da un modulo ad esso associato, se presente. 
   * @param val 
   * @param ifcName 
   * @param type 
   * @see {consumerInterface}
   * @see {producerInterface}
   * @see {openModalWithMessage}
   */
  updateAreaName(val: DataInputReturnedV2, areaName: string) {
    if (!val || !val.new_value || !val.old_value) return;
    let areas: AreaApplication[] = this.areaList.getValue() ? this.areaList.getValue() : [];
    let nameAlreadyExists: boolean = areas.findIndex(el => el.name === val.new_value) >= 0 ? true : false;
    if (nameAlreadyExists) {
      this.openModalWithMessage("A problem occurred while updating area", "This area already exists");
      return;
    }
    var actualIndexArea = areas.findIndex(el => el.name === areaName);
    if (actualIndexArea < 0) {
      this.openModalWithMessage("A problem occurred while updating area", "Can't find selected area");
      return;
    }
    areas[actualIndexArea].name = val.new_value;
    this.areaList.next(areas);
    this.editor.nodes.forEach(n => {
      if (n.data.area === val.old_value) {
        n.data.area = val.new_value;
        this.updateModule(n);
      }
    })
    this.cdr.detectChanges();
  }
  updateAreaColor(val: DataInputReturnedV2, areaName: string) {
    //TODO -> future implementation
  }
  updateAreaDescription(val: DataInputReturnedV2, areaName: string) {
    let areas: AreaApplication[] = this.areaList.getValue() ? this.areaList.getValue() : [];
    var actualIndexArea = areas.findIndex(el => el.name === areaName);
    if (actualIndexArea < 0) {
      this.openModalWithMessage("A problem occurred while updating area", "Can't find selected area");
      return;
    }
    areas[actualIndexArea].description = val.new_value;
    this.areaList.next(areas);
    this.cdr.detectChanges();
  }



  // import func

  /**
   * Funzione richiamata al momento dell'aggiunta di un import.
   * Mostra la modale contenente i dati di input.
   * @see {openModalWithTemplate}
   */
  addImport() {
    this.openModalWithTemplate("Insert Import", this.data_input_import);
  }
  /**
   * Funzione richiamata quando si sta cercando di eliminare un import, una volta confermata l'intenzione attraverso la modale.
   * Aggiorna degli import.
   * @param importName 
   * @see {modalConfirmation}
   */
  removeImport(importName: string) {
    this.modalConfirmation.showConfirmationModal(("Do you want remove import \n" + importName + "\n ?"))
      .pipe(take(2)) // perchè il primo valore di reset è a null..
      .subscribe(
        v => {
          if (v) {
            let imports: string[] = this.importList.getValue() ? this.importList.getValue() : [];
            var check = imports.findIndex(el => el === importName);
            if (check < 0) { alert("import does not exist"); return; }
            imports.splice(check, 1);
            this.importList.next(imports);
            this.cdr.detectChanges();
          }
        }
      )
  }
  /**
   * Funzione richiamata per la validazione di una nuova interfaccia. 
   * Controlla che non ci siano import simili e la aggiunge alla lista degli import
   * @param val 
   * @see {openModalWithMessage}
   */
  validateImport(val: DataInputReturned) {
    this.closeModal();
    if (!val || !val.isValid || !val.element) return;
    let imports: string[] = this.importList.getValue() ? this.importList.getValue() : [];
    var importAlreadyAdded: boolean = imports.findIndex(el => el === val.element["import"].value) >= 0 ? true : false;
    if (importAlreadyAdded) {
      this.openModalWithMessage("A problem occurred while inserting import", "This import already exsists");
      return;
    }
    if (val.element["import"]) {
      imports.push(val.element["import"].value);
    }
    this.importList.next(imports);
    this.cdr.detectChanges();
  }
  /**
   * Funzine che viene richiamata all'aggiornamento di un import.
   * @param val 
   * @param imp  
   */
  updateImport(val: DataInputReturnedV2, imp: string) {
    let impor: string[] = this.importList.getValue() ? this.importList.getValue() : [];
    var check = impor.findIndex(el => el === imp);
    if (check < 0) { alert("import does not exist"); return; }
    impor[check] = val.new_value;
    this.importList.next(impor);
    this.cdr.detectChanges();
  }




  // tags func

  addTag() {
    this.openModalWithTemplate("Insert tag", this.data_input_tag);
  }
  removeTag(tagName: string) {
    this.modalConfirmation.showConfirmationModal(("Do you want remove tah \"" + tagName + "\" ?"))
      .pipe(take(2)) // perchè il primo valore di reset è a null..
      .subscribe(
        v => {
          if (v) {
            let tags: TagCatalogueDTO[] = this.tagList.getValue() ? this.tagList.getValue() : [];
            var check = tags.findIndex(el => el.name === tagName);
            if (check < 0) { alert("tag does not exist"); return; }
            tags.splice(check, 1);
            this.tagList.next(tags);
            this.cdr.detectChanges();
          }
        }
      )
  }
  validateTag(val: DataInputReturned) {
    this.closeModal();
    if (!val || !val.isValid || !val.element) return;
    let tags: TagCatalogueDTO[] = this.tagList.getValue() ? this.tagList.getValue() : [];
    var tagAlreadyAdded: boolean = tags.findIndex(el => el.name === val.element["name"].value) >= 0 ? true : false;
    if (tagAlreadyAdded) {
      this.openModalWithMessage("A problem occurred while inserting tag", "This tag already exsists");
      return;
    }
    if (val.element["name"]) {
      tags.push(
        {
          name: val.element["name"].value,
          description: val.element["description"].value,
          id: null
        }
      );
    }
    this.tagList.next(tags);
    this.cdr.detectChanges();
  }
  updateTag(val: DataInputReturnedV2, imp: string) {
    let tags: TagCatalogueDTO[] = this.tagList.getValue() ? this.tagList.getValue() : [];
    var check = tags.findIndex(el => el.name === imp);
    if (check < 0) { alert("import does not exist"); return; }
    tags[check] = val.new_value;
    this.tagList.next(tags);
    this.cdr.detectChanges();
  }
  updateTagName(val: DataInputReturnedV2, tagName: string) {
    if (!val || !val.new_value || !val.old_value) return;
    let tags: TagCatalogueDTO[] = this.tagList.getValue() ? this.tagList.getValue() : [];
    let nameAlreadyExists: boolean = tags.findIndex(el => el.name === val.new_value) >= 0 ? true : false;
    if (nameAlreadyExists) {
      this.openModalWithMessage("A problem occurred while updating tag", "This tag already exists");
      return;
    }
    var actualIndexTag = tags.findIndex(el => el.name === tagName);
    if (actualIndexTag < 0) {
      this.openModalWithMessage("A problem occurred while updating tag", "Can't find selected tag");
      return;
    }
    tags[actualIndexTag].name = val.new_value;
    this.tagList.next(tags);
    this.cdr.detectChanges();
  }
  updateTagDescription(val: DataInputReturnedV2, tagName: string) {
    let tags: TagCatalogueDTO[] = this.tagList.getValue() ? this.tagList.getValue() : [];
    var actualIndexTag = tags.findIndex(el => el.name === tagName);
    if (actualIndexTag < 0) {
      this.openModalWithMessage("A problem occurred while updating tag", "Can't find selected tag");
      return;
    }
    tags[actualIndexTag].description = val.new_value;
    this.tagList.next(tags);
    this.cdr.detectChanges();
  }




  // deploy seq func

  addDepSeq(node: Node) {
    this.touchNode(node);
    let dep: DeployInstanceDTO[] = this.deploymentList.getValue() ? this.deploymentList.getValue() : [];
    let v: DeployInstanceDTO = {
      moduleInstanceConfigurationUUID: null,
      moduleInstanceUUID: null,
      moduleInstanceName: this.nodeSelected.data.name as unknown as string,
      moduleUUID: this.moduleSelected.uuid,
    }
    dep.push(v);
    this.deploymentList.next(dep);
    this.cdr.detectChanges();
  }
  removeDepSeq(node: Node) {
    let dep: DeployInstanceDTO[] = this.deploymentList.getValue() ? this.deploymentList.getValue() : [];
    let index = dep.findIndex(d => d.moduleInstanceName === node.data.name);
    dep.splice(index, 1);
    this.deploymentList.next(dep);
    this.cdr.detectChanges();
  }
  updateDepSeqName(oldNodeName: string, newNodeName: string) {
    let dep: DeployInstanceDTO[] = this.deploymentList.getValue() ? this.deploymentList.getValue() : [];
    let index = dep.findIndex(d => d.moduleInstanceName === oldNodeName);
    if (index < 0) return;
    dep[index].moduleInstanceName = newNodeName;
    this.deploymentList.next(dep);
    this.cdr.detectChanges();
  }




  // modal func

  /**
   * Funzione che si occupa di settare a true la variabile di show modal
   * @see {isModalActive}
   */
  showModal() {
    this.isModalActive = true;
  }
  /**
   * Funzione che si occupa di settare a false la variabile di show modal .
   * @see {isModalActive}
   */
  closeModal() {
    this.isModalActive = false;
  }
  /**
   * Funzione che si occupa di mostrare la modale contenente un oggetto Template passato come argomento
   * @param title 
   * @param template 
   * @see {showModal}
   */
  openModalWithTemplate(title: string, template: TemplateRef<any>) {
    this.dataModal = {
      title: title,
      template: template,
      buttons: [],
      backgroundColor: "#0000005e",
    };
    this.showModal();
    this.cdr.detectChanges();
  }
  /**
   * Funzione che si occupa di mostrare la modale contenente un messaggio passato come argomento
   * @param title 
   * @param message 
   * @see {showModal}
   */
  openModalWithMessage(title: string, message: string) {
    this.modalMessage = message;
    this.dataModal = {
      title: title,
      template: this.data_message,
      buttons: [
        { id: "ok", text: "Ok", type: 'primary' }
      ],
      backgroundColor: "#0000005e",
    };
    this.showModal();
    this.cdr.detectChanges();
  }




  //// drag

  /**
   * Funzione che viene richiamata quando è eseguito il drag di un modulo dall'offcanvas.
   * Salva gli elementi selezionati per il drag.
   * @param event 
   * @param type 
   * @see {elementDragged}
   */
  async onDrag(event: any, node: ModuleInstance) {
    event.preventDefault();
    document.getElementById('dragnode').classList.add('grabbing');
    let for_rete = { ...node.rete }; // bisogna instanziare una nuova variabile per prevenire cambiamenti
    this.elementDragged = await ModuleComponents[IndexModuleComponent[ModuleType1[node.type]]].createNode(for_rete)
  }
  /**
   * Funzione richiamata al drop dell'elemento sul canvas di lavoro.
   * Crea un modulo un una posizione approssimativa nel canvas dove il mouse si è fermato.
   * @see {elementDragged}
   */
  async onDrop() {
    document.getElementById('dragnode').classList.remove('grabbing');
    this.elementDragged.position = [this.editor.view.area.mouse.x + 200, this.editor.view.area.mouse.y + 100];
    this.editor.addNode(this.elementDragged)
  }
  dragPreventDefault(event: any) {
    event.preventDefault();
  }
  dropPreventDefault(event: any) {
    event.stopPropagation();
    event.preventDefault();
  }
  /**
   * Funzione richiamata al doppio-click di un elemento nell'offcanvas del drag&drop. 
   * Crea un modulo nell'offcanvas aventi i valori dell'elemento selezionato.
   * @param type 
   * @see {elementDragged}
   */
  async onElementDBclick(node: ModuleInstance) {
    let for_rete = { ...node.rete }; // bisogna instanziare una nuova variabile per prevenire cambiamenti
    this.elementDragged = await ModuleComponents[IndexModuleComponent[ModuleType1[node.type]]].createNode(for_rete)
    this.elementDragged.position = [this.editor.view.area.mouse.x + 100, this.editor.view.area.mouse.y + 100];
    this.editor.addNode(this.elementDragged)
  }




  /**
   * Funzione richiamata quando si ha il caso in cui si è importato un teatro. Essa si occupa di:
   * - Creazione, connessione e sistemazione dei moduli salvati nel modulo importato.
   * - Prende informazioni sulle aree, import, deloyment e tags e le inserisce.
   * @see {module}
   * @see {arrangeNodes}
   * @see {consumerInterface}
   * @see {producerInterface}
   * @see {importList}
   */
  public async initTheaterFromFile() {

    var nodes = [];

    await Promise.all(
      Object.entries(this.theater.topology.elements).map(async ([key, value]) => {
        try {
          nodes[key] = await this.components[IndexModuleComponent[ModuleType1[value.type]]].createNode(value.rete);
        }
        catch (e) {
          console.warn("Problem with: ", key, " with value: \n", value)
        }
      })
    );

    await Promise.all(
      Object.entries(nodes).map(([key, value]) => {
        try {
          this.editor.addNode(value);
        }
        catch (e) {
          console.warn("Problem with: ", key, " with value: \n", value)
        }
      })
    );

    await Promise.all(
      Object.entries(this.theater.topology.connection).map(([key, value]) => {
        let connection: ReteConnection = value;
        try {
          if (nodes[connection["to"]] !== undefined && nodes[connection["from"]] !== undefined) {
            this.editor.connect(nodes[connection["to"]].outputs.get(connection["port_dst"]), nodes[connection["from"]].inputs.get(connection["port_src"]));
          }
        } catch (e) {
          console.warn(
            "PROBLEM: ", e, "\ntry",
            " fomr (output)",
            connection["from"], " port ", connection["port_src"], " data: ", nodes[connection["from"]],
            " to (input)",
            connection["to"], " port ", connection["port_dst"], " data: ", nodes[connection["to"]],
          );
        }
      })
    );

    this.arrangeNodes();

    //parsefile section

    let areas: AreaApplication[] = [];
    this.theater.properties.areas?.forEach(a => {
      areas.push({
        name: a.area,
        description: a.description,
        color: '',
        deleted: false,
        id: '',
        uuid: '',
        theater: undefined,
      })
    });
    this.areaList.next(areas);

    let imports: string[] = [];
    this.theater.blueprintFile.imports?.forEach(i => {
      imports.push(i)
    });
    this.importList.next(imports);

    let tags: TagCatalogueDTO[] = []; // essendo che ci sono 2 tag in posizioni differenti.
    if (this.theater.tags.length > 0)
      this.theater.tags?.forEach(t => {
        tags.push({
          name: t.name,
          description: t.description,
          id: t.id
        })
      });
    else
      this.theater.properties.tags.forEach(t => {
        tags.push({
          name: t.tag,
          description: "",
          id: null
        })
      })
    this.tagList.next(tags);


    let deploymentSequence: DeployInstanceDTO[] = [];
    Object.entries(this.theater.deploymentSequence!).map(([key, value]) => {
      deploymentSequence.push({
        moduleInstanceConfigurationUUID: value.moduleInstanceConfigurationUUID,
        moduleInstanceUUID: value.moduleInstanceUUID,
        moduleInstanceName: value.moduleInstanceName,
        moduleUUID: value.moduleUUID,
      })
    })
    this.deploymentList.next(deploymentSequence);


  }



}
