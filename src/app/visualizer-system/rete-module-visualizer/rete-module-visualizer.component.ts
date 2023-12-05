import { Component, AfterViewInit, ViewChild, ElementRef, Input, Output, ChangeDetectionStrategy, OnInit, TemplateRef, ChangeDetectorRef, NgZone } from '@angular/core';
import { NodeEditor, Node, Engine, Output as or, Input as ir } from 'rete';
import AreaPlugin from 'rete-area-plugin';
import { Router } from '@angular/router';
import { _Socket } from '../../rete-settings/sockets/socket';
import { NavbarItem, NavbarElement } from '../../components/navbar/navbarType';
import { UnderbarItem, UnderbarElement } from '../../components/underbar/underbarType';
import { TabnavElement } from '../../components/tabnav/tabnavType';
import { from } from 'rxjs';
import { SimpleModuleApplication, ModuleApplication, ReteConnection } from 'src/app/services/modelsApplication/applicationModels';
import { IndexNodeComponent, NodeComponents } from 'src/app/rete-settings/nodes/rete-nodes/export-rete-nodes';
import { ReteModuleVisualizerSettings } from 'src/app/rete-settings/settings/editor-settings/reteModuleVisualizerSettings';
import { SpinnerService } from 'src/app/services/application/spinner/spinner.service';
import { ReteDisplayNodeDataMV, ReteDisplayModuleDataMV } from 'src/app/rete-settings/settings/displayData';
import { AttachmentsService } from 'src/app/services/api/attachments.service';
import { environment } from 'src/environments/environment';
import { ExportService } from 'src/app/services/application/export/export.service';

/**
 * Componente che contiene la logica per la visualizzione dei moduli.
 * Si occupa dello scambio di informazioni e le interazioni tra le componenti che permettono il visual-designing dell'applicazione.
 */
@Component({
  selector: 'app-rete-module-visualizer',
  templateUrl: './rete-module-visualizer.component.html',
  styleUrls: ['./rete-module-visualizer.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class ReteModuleVisualizerComponent implements OnInit, AfterViewInit {

  //// input var

  /**
   * Variabile che contiene gli attributi del modulo.
   * @type {ModuleApplication}
   */
  @Input() module: ModuleApplication;
  /**
   * Variabile che contiene gli attributi del modulo (simple).
   * Questa è solitamente valorizzata con i dati portati dal teatro.
   * Questa componente lavora solo con la variabile "module". 
   * Per cui, se passata simpleModule, viene "castata" a module.
   * @type {ModuleApplication}
   * @see {module}
   */
  @Input() simpleModule?: SimpleModuleApplication;
  /**
   * Variabile utilizzata per eseguire lo switch tra visualizzazione semplificata e non.
   * @type {boolean}
   * @default {true}
   */
  @Input() isSimple: boolean = true;


  //// editor component

  /**
   * Variabile che indica l'elemento all'interno del DOM il canvas su cui verranno eseguite operazioni di visualizzazione del modulo.
   * @type {ElementRef}
   */
  @ViewChild('moduleVisualizer', { static: false }) el: ElementRef;
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
 * @see {NodeComponents}
 */
  protected components: any = NodeComponents; // type ComponentRete[]
  /**
 * Variabile che rappresenta il motore e la logica tra le interazioni dei singoli nodi.
 * @type {Engine}
 */
  protected engine: Engine = null;


  //// control var

  /**
   * Variabile che rappresenta il nodo selezionato
   * @type {Node}
   */
  protected nodeSelected: Node;


  //// display var

  /**
   * Variabile che ha lo scopo di salvare i dati per la visualizzazione degli attributi dei singoli nodi un canvas.
   * @type {{ [field: string]: string[] }[]}
   * @see {displayNodeData}
   */
  protected displayNdata: { [field: string]: string[] }[];
  /**
   * Variabile che ha lo scopo di salvare i dati per la visualizzazione degli attributi del modulo un canvas.
   * @type {{ [field: string]: string[] }[][]}
   * @see {displayNodeData}
   */
  protected displayMdata: { [field: string]: string[] }[][];
  /**
   * Variabile a cui è associata una funzione, che richiamata, restituisce i dati da mostrare dei singoli nodi.
   * @param node 
   * @returns {{ [field: string]: string[] }[]}
   * @see {ReteDisplayNodeDataMV}
   * @see {displayNdata}
   */
  protected displayNodeData = (node: Node): { [field: string]: string[] }[] => { let x = ReteDisplayNodeDataMV(node); return x; }
  /**
   * Variabile a cui è associata una funzione, che richiamata, restituisce i dati da mostrare del modulo.
   * @param module 
   * @returns {{ [field: string]: string[] }[]}
   * @see {ReteDisplayNodeDataMV}
   * @see {displayNdata}
   */
  protected displayModuleData = (module: ModuleApplication): { [field: string]: string[] }[][] => { let x = ReteDisplayModuleDataMV(module); return x; }


  //// variabili per input-research

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
  protected NodeNameList: string[] = [];


  //// navbar var

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
   * Variabile referece allo stato mocked dell'environment
   * @see {environment}
   */
  protected isMocked: boolean = environment.mocked;

  //// underbar var

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
   * Variabile utilizzata per l'hide-or-show della minimappa
   * @type {boolean}
   * @default {true}
   */
  protected ismapvisible: boolean = true;


  //// offcanvas node var

  /**
   * Variabile utilizzata per l'hide-or-show dell'offcanvas dei singoli nodi.
   * @type {boolean}
   */
  protected hideNodeInfo: boolean = false;
  /**
   * Variabile utilizzata per assegnare i valori per le tab principali dell'offcavanvas dei nodi.
   * @type {TabnavElement}
   */
  protected tabnavElementNode: TabnavElement;
  /**
   * Variabile che ha come riferimento un tag nel DOM di tipo templato nella quale vi è il contenuto di una tab.
   * In questo caso la tab riguardante i dati base dei nodi.
   * @type {TemplateRef}
   */
  @ViewChild('tab_node_data') tab_node_data?: TemplateRef<any>;
  /**
   * Variabile che ha come riferimento un tag nel DOM di tipo templato nella quale vi è il contenuto di una tab.
   * In questo caso la tab riguardante le porte del nodi.
   * @type {TemplateRef}
   */
  @ViewChild('tab_node_ports') tab_node_ports?: TemplateRef<any>;
  /**
   * Variabile che ha come riferimento un tag nel DOM di tipo templato nella quale vi è il contenuto di una tab.
   * In questo caso la tab riguardante la sezione "more" dei nodi.
   * @type {TemplateRef}
   */
  @ViewChild('tab_node_more') tab_node_more?: TemplateRef<any>;
  ///-> nav portas -> inside
  /**
   * Variabile utilizzata per assegnare i valori alla tab relative alle porte dei nodi.
   * @type {TabnavElement}
   * @see {tab_node_ports}
   */
  protected tabnavPorts: TabnavElement;
  /**
    * Variabile che ha come riferimento un tag nel DOM di tipo templato nella quale vi è il contenuto di una tab.
    * In questo caso la tab riguardante le porte input dei nodi.
    * @type {TemplateRef}
    */
  @ViewChild('tab_port_in') tab_port_in?: TemplateRef<any>;
  /**
    * Variabile che ha come riferimento un tag nel DOM di tipo templato nella quale vi è il contenuto di una tab.
    * In questo caso la tab riguardante le porte output dei nodi.
    * @type {TemplateRef}
    */
  @ViewChild('tab_port_out') tab_port_out?: TemplateRef<any>;


  //// offcanvas Module info

  /**
   * Variabile utilizzata per l'hide-or-show dell'offcanvas del modulo.
   * @type {boolean}
   */
  protected hideModuleInfo: boolean = false;
  /**
   * Variabile utilizzata per l'hide-or-show dell'offcanvas dei singoli nodi.
   * @type {boolean}
   */
  protected tabnavElementModule: TabnavElement;
  //-> nav data for basic tab
  /**
   * Variabile utilizzata per assegnare i valori per le tab principali dell'offcavanvas dei nodi.
   * @type {TabnavElement}
   */
  @ViewChild('tab_module_basic') tab_module_basic?: TemplateRef<any>;
  /**
    * Variabile che ha come riferimento un tag nel DOM di tipo templato nella quale vi è il contenuto di una tab.
    * In questo caso la tab riguardante i counter del modulo.
    * @type {TemplateRef}
    */
  @ViewChild('tab_module_counter') tab_module_counter?: TemplateRef<any>;
  /**
    * Variabile che ha come riferimento un tag nel DOM di tipo templato nella quale vi è il contenuto di una tab.
    * In questo caso la tab riguardante le capabilities del modulo.
    * @type {TemplateRef}
    */
  @ViewChild('tab_module_capabilities') tab_module_capabilities?: TemplateRef<any>;
  /**
    * Variabile che ha come riferimento un tag nel DOM di tipo templato nella quale vi è il contenuto di una tab.
    * In questo caso la tab riguardante le statistiche del modulo.
    * @type {TemplateRef}
    */
  @ViewChild('tab_module_statistics') tab_module_statistics?: TemplateRef<any>;
  ///-> nav for option
  /**
    * Variabile utilizzata per assegnare i valori per le tab secondaria "option" dell'offcanvas del modulo.
    * @type {TabnavElement}
    */
  protected tabnavOpt: TabnavElement;
  /**
    * Variabile che ha come riferimento un tag nel DOM di tipo templato nella quale vi è il contenuto di una tab.
    * In questo caso la tab riguardante le opzioni i/o.
    * @type {TemplateRef}
    */
  @ViewChild('tab_module_more') tab_module_more?: TemplateRef<any>;
  /**
   * Variabile che ha come riferimento un tag nel DOM di tipo templato nella quale vi è il contenuto di una tab.
   * In questo caso la tab riguardante le opzioni input del modulo.
   * @type {TemplateRef}
   */
  @ViewChild('tab_in_opt') tab_in_opt?: TemplateRef<any>;
  /**
   * Variabile che ha come riferimento un tag nel DOM di tipo templato nella quale vi è il contenuto di una tab.
   * In questo caso la tab riguardante le opzioni input del modulo.
   * @type {TemplateRef}
   */
  @ViewChild('tab_out_opt') tab_out_opt?: TemplateRef<any>;
  ///-> nav for interfaces
  /**
    * Variabile utilizzata per assegnare i valori per le tab secondaria "interfacce" dell'offcanvas del modulo.
    * @type {TabnavElement}
    */
  protected tabnavIF: TabnavElement;
  /**
   * Variabile che ha come riferimento un tag nel DOM di tipo templato nella quale vi è il contenuto di una tab.
   * In questo caso la tab riguardante le interfacce del modulo.
   * @type {TemplateRef}
   */
  @ViewChild('tab_module_interfaces') tab_module_interfaces?: TemplateRef<any>;
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
  //-> nav parameters
  /**
    * Variabile utilizzata per assegnare i valori per le tab secondaria "parameteres" dell'offcanvas del modulo.
    * @type {TabnavElement}
    */
  protected tabnavPAR: TabnavElement;
  /**
  * Variabile che ha come riferimento un tag nel DOM di tipo templato nella quale vi è il contenuto di una tab.
  * In questo caso la tab riguardante i parametri secondari del moduli.
  * @type {TemplateRef}
  */
  @ViewChild('tab_module_parameters') tab_module_parameters?: TemplateRef<any>;
  /**
* Variabile che ha come riferimento un tag nel DOM di tipo templato nella quale vi è il contenuto di una tab.
* In questo caso la tab riguardante i parametri anchor anchor del modulo.
* @type {TemplateRef}
*/
  @ViewChild('tab_anchor') tab_anchor?: TemplateRef<any>;
  /**
* Variabile che ha come riferimento un tag nel DOM di tipo templato nella quale vi è il contenuto di una tab.
* In questo caso la tab riguardante i parametri fixed del modulo.
* @type {TemplateRef}
*/
  @ViewChild('tab_fixed') tab_fixed?: TemplateRef<any>;
  /**
* Variabile che ha come riferimento un tag nel DOM di tipo templato nella quale vi è il contenuto di una tab.
* In questo caso la tab riguardante i parametri instanza del moduli.
* @type {TemplateRef}
*/
  @ViewChild('tab_instance') tab_instance?: TemplateRef<any>;
  /**
* Variabile che ha come riferimento un tag nel DOM di tipo templato nella quale vi è il contenuto di una tab.
* In questo caso la tab riguardante i parametri strutturali del modulo.
* @type {TemplateRef}
*/
  @ViewChild('tab_structural') tab_structural?: TemplateRef<any>;

  /**
   * Variabile che indica se l'offcanvas dei moduli è full screen
   */
  _isFullScreen: boolean = false;
  timetorealoadMap: boolean = true;
  get isFullScreen(): boolean {
    return this._isFullScreen;
  }
  set isFullScreen(b: boolean) {
    this._isFullScreen = b;
    this.timetorealoadMap = false;
    setTimeout(() => {
      this.timetorealoadMap = true;
      this.cdr.detectChanges();
    }, 100);
  };








  /**
   * Costruttore di ReteModuleVisualizer.
   * @param cdr 
   * @param router 
   * @param spinnerService 
   * @param attachmentsService 
   * @param exportService 
   */
  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router,
    private spinnerService: SpinnerService,
    private attachmentsService: AttachmentsService,
    private exportService: ExportService
  ) {
  }



  /**
   * Funzione richiamata all'inizializzazione della componente.
   * Si occupa di eseguire controlli per l'inizializzazione del modulo.
   * Si avvale di operazioni di spinner-loading.
   * Avvia la funzione di start quando ha terminato le precedenti operazioni.
   * @see {startApp}
   */
  async ngOnInit(): Promise<void> {
    this.spinnerService.setSpinner(true, "Loading theater elements");
    if (this.isSimple) {
      this.module = {
        imports: [],
        ...this.simpleModule,
        attachments: undefined,
        author: undefined,
        capabilities: undefined,
        catalog1: undefined,
        catalog2: undefined,
        catalog3: undefined,
        classification: undefined,
        configurationTemplate: undefined,
        detailProperties: undefined,
        input: undefined,
        output: undefined,
        mode: undefined,
        statistics: undefined,
        tags: undefined
      };
      this.cdr.detectChanges();
      this.startSimpleApp();
      this.spinnerService.setSpinner(false);
    }
    else {
      from(this.startApp())
        .subscribe(
          (el) => {
            this.spinnerService.setSpinner(false);
          }
        )
    }
  }




  /**
   * Funzone che si occupa dell'inizializzazione dell'editor, container e del drag&drop per la versione a visualizzazione semplificata.
   * Prende le configurazioni dell'editor per i plugin da utilizzare ed eventi da captare.
   * @see {ReteModuleVisualizerSettings} 
   * @see {addNodes}
   */
  async startSimpleApp(): Promise<void> {

    this.container = this.el.nativeElement;

    this.editor = new NodeEditor('InfraCreateEditor@0.2.0', this.container);

    this.engine = new Engine('InfraCreateEngine@0.2.0');

    var v = new ReteModuleVisualizerSettings(this.container, this.editor, this.components, this.engine);

    v.editorUSE_simple();

    this.editor.on("nodeselected", (node) => {
      this.nodeSelected = node;
    });

    // prevent connection creation
    this.editor.on('connectiondrop', io => {
      return null;
    });

    this.editor.on('connectionpick', io => {
      return false;
    });


    this.editor.on('zoom', ({ source }) => {
      return source !== 'dblclick';
    });


    this.editor.on('showcontextmenu', ({ node }) => { // prevent context menu for nodes -> no delete/copy
      return !node
    });

    this.components.map(c => {
      this.editor.register(c);
      this.engine.register(c);
    });

    await this.addNodes();

    // this.displayAllNodes();

    this.editor.view.resize();

    this.editor.trigger('process');

    AreaPlugin.zoomAt(this.editor, this.editor.nodes);

  }




  /**
   * Funzone che si occupa dell'inizializzazione dell'editor, container e del drag&drop.
   * Prende le configurazioni dell'editor per i plugin da utilizzare ed eventi da captare.
   * @see {ReteModuleComposerSettings} 
   * @see {addNodes}
   */
  async startApp(): Promise<void> {

    // this.module = await this.parseService.parseModuleForModuleVisualizer(1459);

    this.container = this.el.nativeElement;

    this.editor = new NodeEditor('InfraCreateEditor@0.2.0', this.container);

    this.engine = new Engine('InfraCreateEngine@0.2.0');

    var v = new ReteModuleVisualizerSettings(this.container, this.editor, this.components, this.engine);

    v.editorUSE();

    this.editor.on("nodeselected", (node) => {
      // this.zone.run(() => {
      this.nodeSelected = node;
      let list: Node[] = []
      node.getConnections().forEach(c => {
        c.input.node === undefined ? list.push(c.input.node) : list.push(c.output.node);
        // this.editor.selectNode(list.pop(),true);
        // list.pop().data.softSelct=true // -> inserire del codice nel nodo, che se softSelect è premuto, cambia colore sfondo
      })
      // this.nodeSelected = node;
      this.displayNdata = this.displayNodeData(node);
      this.cdr.detectChanges();
      // });
    });

    this.editor.on('rendernode', ({ el, node }) => {
      el.addEventListener('dblclick', () => {
        // this.zone.run(() => {
        this.isFullScreen = false;
        this.showhideNodeInfo(node);
        // })
      });
    });

    this.editor.on("connectioncreated", connection => {
      // this.zone.run(() => {
      let node = connection.output.node;
      this.editor.view.updateConnections({ node });
      // });
    });

    // prevent connection creation
    this.editor.on('connectiondrop', io => {
      return null;
    });

    this.editor.on('connectionpick', io => {
      return false;
    });


    this.editor.on('zoom', ({ source }) => {
      return source !== 'dblclick';
    });


    this.editor.on('showcontextmenu', ({ node }) => { // prevent context menu for nodes -> no delete/copy
      return !node
    });

    this.components.map(c => {
      this.editor.register(c);
      this.engine.register(c);
    });

    await this.addNodes();

    // this.displayAllNodes();

    this.editor.view.resize();

    this.editor.trigger('process');

    AreaPlugin.zoomAt(this.editor, this.editor.nodes);

  }




  // init func

  /**
   * Funzione richiamata subito dopo l'inizializzazione della componente
   * Si occupa di inizializzare le variabili per la navbar, le tab e l'underbar.
   * @see {initNavbar}
   * @see {initUnderbar}
   * @see {initTabModuleNavs}
   * @see {initTabNodeNavs}
   */
  ngAfterViewInit() {
    this.initNavbar();
    this.initUnderbar();
    this.initTabNodeNavs();
    this.initTabModuleNavs();
    this.cdr.detectChanges();
  }
  initNavbar() {
    this.navbarData = {
      type: "module",
      element: [
        { text: "Module info", id: 'mod_info' },
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
          { type: "separator", button: { iconClass: "bi bi-grip-vertical", tooltipText: "" }, id: 'separator' }
        ]
      },
      {
        element: [
          { type: "button", button: { iconClass: "bi bi-arrow-repeat", tooltipText: "restore context" }, id: 'restore' },
        ]
      },

    ]
  }
  initTabNodeNavs() {
    this.tabnavElementNode = {
      element: [
        { id: "id_prop", text: "Properties", template: this.tab_node_data },
        { id: "id_port", text: "Ports", template: this.tab_node_ports },
        { id: "id_more", text: "More", template: this.tab_node_more },
      ]
    }
    this.tabnavPorts = {
      element: [
        { id: "id_port_in", text: "Input Ports", template: this.tab_port_in },
        { id: "id_port_out", text: "Output Ports", template: this.tab_port_out }
      ]
    }
  }
  initTabModuleNavs() {
    this.tabnavElementModule = {
      element: [
        { id: "id_basic", text: "Properties", template: this.tab_module_basic },
        { id: "id_cnt", text: "Counter", template: this.tab_module_counter },
        { id: "id_if", text: "Interfaces", template: this.tab_module_interfaces },
        { id: "id_stat", text: "Statistics", template: this.tab_module_statistics },
        { id: "id_opt", text: "More", template: this.tab_module_more },
        { id: "id_cap", text: "Capabilities", template: this.tab_module_capabilities },
        { id: "id_par", text: "Parameters", template: this.tab_module_parameters },
      ]
    };
    this.tabnavOpt = {
      element: [
        { id: "id_in_opt", text: "Input", template: this.tab_in_opt },
        { id: "id_out_opt", text: "Output", template: this.tab_out_opt }
      ]
    };
    this.tabnavIF = {
      element: [
        { id: "if_cons", text: "Consumer", template: this.tab_if_cons },
        { id: "if_prod", text: "Producer", template: this.tab_if_prod }
      ]
    }
    this.tabnavPAR = {
      element: [
        { id: "anchor", text: "Anchor", template: this.tab_anchor },
        { id: "fixed", text: "Fixed", template: this.tab_fixed },
        { id: "instance", text: "Instance", template: this.tab_instance },
        { id: "structural", text: "Structural", template: this.tab_structural },
      ]
    }
  }




  //// navbar operation

  /**
   * Funzione che si occupa di gestire gli eventi di selection-item della navbar.
   * @param val 
   * @see {NavbarItem}
   * @see {showhideModuleInfo}
   * @see {goHome}
   */
  navItemSelected(val: NavbarItem) {
    switch (val.id) {
      case "mod_info":
        this.showhideModuleInfo();
        break;
      case "download":
        this.downloadJSONfunction();
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
  showhideModuleInfo() {
    this.displayMdata = this.displayModuleData(this.module);
    this.hideModuleInfo = !this.hideModuleInfo;
    this.cdr.detectChanges();
  }
  /**
   * Funzione che permette il download del modulo in:
   * - JSON, se si volgiono utilzzare i dati mockati.
   * - ZIP (tutti dati [yaml]), se siamo connessi al server.
   * @see {exportService}
   */
  async downloadZIPfunction() {
    this.spinnerService.setSpinner(true, "Creating module download");
    (await this.attachmentsService.getModuleAttachment(this.module.id, this.module.attachments[0]))
      .subscribe(
        () => {
          this.spinnerService.setSpinner(false);
        }
      )
  }
  /**
   * Funzione che permette il download dello YAML - TOSCA
   * @see {exportService}
   */
  downloadYAMLfunction() {
    this.spinnerService.setSpinner(true, "Downloading file");
    this.exportService.exportModuleToYAML(this.module, this.editor.toJSON());
    this.spinnerService.setSpinner(false);
  }
  /**
   * Funzione che permette il download dello JSON - APPLICATION
   * @see {exportService}
   */
  downloadJSONfunction() {
    this.spinnerService.setSpinner(true, "Downloading file");
    this.exportService.exportModuleToJSON(this.module, this.editor.toJSON());
    this.spinnerService.setSpinner(false);
  }
  /**
   * Funzione che come scopo ritornare alla home.
   * @see {router}
   */
  goHome() {
    this.router.navigateByUrl('/home');
  }


  /**
   * Funzione che ha lo scopo di switchare il valore di visualizzazione dell'offcanvas del nodo.
   */
  showhideNodeInfo(node: Node) {
    this.nodeSelected = node;
    this.hideNodeInfo = !this.hideNodeInfo;
    this.displayNdata = this.displayNodeData(node);
    this.displaceLeft();
    this.cdr.detectChanges();
  }




  //// operation underbar

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
   */
  underbarElementSelected(val: UnderbarItem) {
    switch (val.id) {
      case "restore":
        this.spinnerService.setSpinner(true, "Restoring nodes");
        this.editor.clear;
        from(this.addNodes()).subscribe(el => {
          this.spinnerService.setSpinner(false);
        })
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
        // console.log("search");
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
   * Eseguie il redo di un'operazione nell'editor
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
   * Funzione che permette di visualizzare tutti i nodi posizionati all'interno del canvas
   */
  displayAllNodes() {
    AreaPlugin.zoomAt(this.editor, this.editor.nodes);
  }
  /**
   * Funzione che permette, una volta inserito un nodo. 
   * Se presente sul canvas, di selezionarlo ed eseguire uno zoom sullo stesso.
   * @param nodeToFind 
   */
  findElement(nodeToFind: string) {
    this.nodetofind = nodeToFind;

    let elementfound = this.editor.nodes.find(n => n.data.name === this.nodetofind)
    let elementpick = new Array(elementfound); // deve necessariamente trovarsi in un array...

    AreaPlugin.zoomAt(this.editor, elementpick);
    this.editor.selectNode(elementpick[0]);
  }
  /**
   * Funzione che serve ad aggiornare il nome degli elementi nella ricerca.
   * @see {NodeNameList}
   */
  updateNameList() {
    this.NodeNameList = [];
    this.editor.nodes.forEach(
      (el) => {
        this.NodeNameList.push(el.data.name as string);
      }
    )
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




  ////// node func

  /**
   * Funzione che posiziona un nodo selezionato alla sinistra
   */
  displaceLeft() {
    AreaPlugin.zoomAt(this.editor, this.editor.selected.list);
    const { area, container } = this.editor.view; // read from Vue component data;
    area.translate(area.transform.x - 200, area.transform.y);
  }




  /**
   * Funzione richiamata quando si ha il caso in cui si è importato un modulo. 
   * Essa si occupa della creazione, connessione e sistemazione dei nodi salvati nel modulo importato.
   * Provvede anche l'inizializzazione delle variabile che hanno scopo di mostrare i dati del moduli (offcanvas).
   * @see {module}
   * @see {arrangeNodes}
   * @see {consumerInterface}
   * @see {producerInterface}
   * @see {importList}
   */
  public async addNodes(): Promise<void> {

    var nodes = [];

    await Promise.all(
      Object.entries(this.module.topology.elements).map(async ([key, value]) => {
        try {
          nodes[key] = await this.components[IndexNodeComponent[value.type]].createNode(value);
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
          console.warn("Problem ", e, " with: ", key, " with value: \n", value)
        }
      })
    );

    await Promise.all(
      Object.entries(this.module.topology.connection).map(([key, value]) => {
        let connection: ReteConnection = value;
        try {
          if (nodes[connection["to"]] !== undefined && nodes[connection["from"]] !== undefined) {
            // this.editor.connect(nodes[value["to"]].outputs.get(value["port_dst"]), nodes[value["from"]].inputs.get(value["port_src"]));
            this.editor.connect(nodes[connection["from"]].outputs.get(connection["port_src"]), nodes[connection["to"]].inputs.get(connection["port_dst"]));
          }
        } catch (e) {
          console.warn(
            "PROBLEM: ", e, "\ntry",
            " connect ",
            connection["from"], " port ", connection["port_src"], " data: ", nodes[connection["from"]],
            " to ",
            connection["to"], " port ", connection["port_dst"], " data: ", nodes[connection["to"]],
          );
        }
      })
    );

    this.arrangeNodes();

  }




  // angular opt

  /**
   * Questa funzione serve a non eseguire l'automatico sorting dei dati all'ng-for degli elementi (DOM).
   * @returns 
   */
  notSort() {
    return 0;
  }


}
