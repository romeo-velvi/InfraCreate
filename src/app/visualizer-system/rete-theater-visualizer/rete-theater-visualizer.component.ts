import { Component, AfterViewInit, ViewChild, ElementRef, Input, Output, ChangeDetectionStrategy, OnInit, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { NodeEditor, Node, Engine, Output as or, Input as ir } from 'rete';
import AreaPlugin from 'rete-area-plugin';
import { Router } from '@angular/router';
import { _Socket } from '../../rete-settings/sockets/socket';
import { NavbarItem, NavbarElement } from '../../components/navbar/navbarType';
import { UnderbarItem, UnderbarElement } from '../../components/underbar/underbarType';
import { TabnavElement } from '../../components/tabnav/tabnavType';
import { from } from 'rxjs';
import { SimpleModuleApplication, ReteConnection, TheaterApplication } from 'src/app/services/modelsApplication/applicationModels';
import { ReteTheaterVisualizerSettings } from 'src/app/rete-settings/settings/editor-settings/reteTheaterVisualizerSettings';
import { IndexModuleComponent, ModuleComponents } from 'src/app/rete-settings/nodes/rete-modules/export-rete-modules';
import { SpinnerService } from 'src/app/services/application/spinner/spinner.service';
import { ReteDisplayModuleDataTV, ReteDisplayTheaterDataTV } from 'src/app/rete-settings/settings/displayData';
import { AttachmentsService } from 'src/app/services/api/attachments.service';
import { environment } from 'src/environments/environment';
import { ExportService } from 'src/app/services/application/export/export.service';
import { ModuleType1 } from 'src/app/models/appType';

/**
 * Componente che contiene la logica e la gestione della parte di costruzione dei moduli.
 * Si occupa dello scambio di informazioni e le interazioni tra le componenti che permettono il visual-designing dell'applicazione.
 */
@Component({
  selector: 'app-rete-theater-visualizer',
  templateUrl: './rete-theater-visualizer.component.html',
  styleUrls: ['./rete-theater-visualizer.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReteTheaterVisualizerComponent implements OnInit, AfterViewInit {

  /**
   * Variabile che contiene gli attributi del teatro.
   * @type {TheaterApplication}
   */
  @Input() theater: TheaterApplication;
  /**
   * Variabile utilizzata per eseguire lo switch tra visualizzazione semplificata e non.
   * @type {boolean}
   * @default {true}
   */
  @Input() isSimple: boolean = true;


  //// selection var

  /**
   * Variabile che rappresenta il nodo (rete-node) selezionato
   * @type {Node}
  */
  protected nodeSelected: Node;
  /**
   * Variabile che rappresenta, similmente al nodo, anche il modulo di appartenenza del nodo selezionato
   * @type {SimpleModuleApplication}
   * @see {nodeSelected}
   */
  protected moduleSelected: SimpleModuleApplication;


  //// display var

  /**
   * Variabile che ha lo scopo di salvare i dati per la visualizzazione degli attributi del modulo un canvas.
   * @type {{ [field: string]: string[] }[][]}
   * @see {displayNodeData}
   */
  protected displayMdata: { [field: string]: string[] }[][];
  /**
   * Variabile che ha lo scopo di salvare i dati per la visualizzazione degli attributi dei teatro sul canvas.
   * @type {{ [field: string]: string[] }[][]}
   * @see {displayMdata}
   */
  protected displayTdata: { [field: string]: string[] }[][];
  /**
   * Variabile a cui è associata una funzione, che richiamata, restituisce i dati da mostrare del modulo.
   * @param module 
   * @returns {{ [field: string]: string[] }[]}
   * @see {ReteDisplayNodeDataTV}
   * @see {displayNdata}
   */
  protected displayModuleData = (module: SimpleModuleApplication): { [field: string]: string[] }[][] => { let x = ReteDisplayModuleDataTV(module); return x; }
  /**
   * Variabile a cui è associata una funzione, che richiamata, restituisce i dati da mostrare del teatro.
   * @param theater 
   * @returns {{ [field: string]: string[] }[]}
   * @see {ReteDisplayTheaterDataTV}
   * @see {displayTdata}
   */
  protected displayTheaterData = (theater: TheaterApplication): { [field: string]: string[] }[][] => { let x = ReteDisplayTheaterDataTV(theater); return x; }


  // node editor data

  /**
   * Variabile che indica l'elemento all'interno del DOM il canvas su cui verranno eseguite operazioni di visualizzazione del teatro.
   * @type {ElementRef}
   */
  @ViewChild('theaterVisualizer', { static: false }) el: ElementRef;
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
   * Variabile che serve a produrre e renderizzare i singoli moduli (rete-node).
   * Contiene delle istanze dei singoli tipi come array.
   * @type {[]}
   */
  protected components: any = ModuleComponents;
  /**
   * Variabile che rappresenta il motore e la logica tra le interazioni dei singoli moduli (rete-node).
   * @type {Engine}
   */
  protected engine: Engine = null;


  //// find var

  /**
   * Variabile utilizzata per la sarch di un modulo presente sul canvas.
   * @type {string}
   * @see {NodeNameList}
   */
  protected nodetofind: string = '';
  /**
   * Variabile che serve ad immagazzinare i nomi dei moduli presenti sul canvas.
   * @type {string[]}
   */
  protected ModuleNameList: string[] = [];


  //// navbar var

  /**
   * Variabile utilizzata per assegnare i valori alla Navbar.
   * @type {NavbarElement}
   */
  protected navbarData: NavbarElement;


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
   */
  protected ismapvisible: boolean = true;


  //// offcanvas theater var

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


  //// offcanvas module var

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
   * Costruttore di ReteTheaterVisualizer.
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
    this.spinnerService.setSpinner(true, "Loading canvas");
    if (this.isSimple) {
      // this.theater = {
      //   ...this.simpleTheater,
      //   ....TODO
      // }  
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

    var v = new ReteTheaterVisualizerSettings(this.container, this.editor, this.components, this.engine);

    v.editorUSE_simple();
    this.editor.on("nodeselected", (node) => {
      this.nodeSelected = node;
    });
    this.editor.on("connectioncreated", connection => {
      let node = connection.output.node;
      this.editor.view.updateConnections({ node });
    });
    // prevent connection creation
    this.editor.on('connectiondrop', io => {
      return null;
    });

    this.editor.on('connectionpick', io => {
      return false;
    });

    await this.addNodes();

    this.arrangeNodes();

    // this.displayAllNodes();

    this.editor.view.resize();

    this.editor.trigger('process');

    AreaPlugin.zoomAt(this.editor, this.editor.nodes);

  }



  /**
   * Funzone che si occupa dell'inizializzazione dell'editor, container e del drag&drop.
   * Prende le configurazioni dell'editor per i plugin da utilizzare ed eventi da captare.
   * @see {ReteTheaterComposerSettings} 
   * @see {addNodes}
   */
  async startApp(): Promise<void> {

    // this.module = await this.parseService.parseModuleForModuleVisualizer(1459);

    this.container = this.el.nativeElement;

    this.editor = new NodeEditor('InfraCreateEditor@0.2.0', this.container);

    this.engine = new Engine('InfraCreateEngine@0.2.0');

    var v = new ReteTheaterVisualizerSettings(this.container, this.editor, this.components, this.engine);

    v.editorUSE();

    this.editor.on("nodeselected", (node) => {
      // this.zone.run(() => {
      this.touchModule(node);
      // });
    });


    this.editor.on('rendernode', ({ el, node }) => {
      el.addEventListener('dblclick', () => {
        // this.zone.run(() => {
        this.showhideModuleInfo(node)
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

    this.editor.on("nodecreate", (node) => {
      // console.warn(node);
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
    this.initTabModuleNavs();
    this.initTabTheaterNavs();
    this.cdr.detectChanges();
  }
  initNavbar() {
    this.navbarData = {
      type: "theater",
      element: [
        { text: "Theater info", id: 'info' },
        { text: "Download", id: 'download' },
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
  initTabTheaterNavs() {
    this.tabnavElementTheater = {
      element: [
        { id: "id_basic", text: "Properties", template: this.tab_theater_basic },
        { id: "id_areas", text: "Areas", template: this.tab_theater_areas },
        { id: "id_tags", text: "Tags", template: this.tab_theater_tags },
        { id: "id_imp", text: "Imports", template: this.tab_theater_imports },
        { id: "id_seq", text: "Deployment", template: this.tab_theater_deploy },
        { id: "id_map", text: "Mapping", template: this.tab_theater_map },
      ]
    }
  }
  initTabModuleNavs() {
    this.tabnavElementModule = {
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
   * Funzione che si occupa di gestire gli eventi di selection-item della navbar.
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
        this.download();
        break;
      case "home":
        this.goHome();
        break;
      default:
        break;
    }
  }
  /**
   * Funzione che ha lo scopo di switchare il valore di visualizzazione dell'offcanvas del teatro.
   * @see {hideTheaterInfo}
   */
  showhideTheaterInfo() {
    this.displayTdata = this.displayTheaterData(this.theater);
    this.hideTheaterInfo = !this.hideTheaterInfo;
    this.cdr.detectChanges();
  }
  /**
   * Funzione che permette il download del modulo in:
   * - JSON, se si volgiono utilzzare i dati mockati.
   * - ZIP (tutti dati [yaml]), se siamo connessi al server.
   * @see {exportService}
   */
  async download() {
    this.spinnerService.setSpinner(true, "Creating theater download");
    if (!environment.mocked) {
      (await this.attachmentsService.getTheaterAttachment(this.theater.id))
        .subscribe(
          () => {
            this.spinnerService.setSpinner(false);
          }
        )
    }
    else {
      //CHANGE TO YAML
      this.exportService.exportTheaterToJSON(this.theater, this.editor.toJSON());
      this.spinnerService.setSpinner(false);
    }
  }
  /**
   * Funzione che come scopo ritornare alla home.
   * @see {router}
   */
  goHome() {
    this.router.navigateByUrl('/home');
  }


  /**
   * Funzione che ha lo scopo di switchare il valore di visualizzazione dell'offcanvas del modulo.
   * @see {hideModuleInfo}
   */
  showhideModuleInfo(node: Node) {
    this.touchModule(node);
    this.hideModuleInfo = !this.hideModuleInfo;
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
        this.spinnerService.setSpinner(true, "Restoring Nodes");
        this.editor.clear();
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
   * Funzione che permette di visualizzare tutti i moduli posizionati all'interno del canvas
   */
  displayAllNodes() {
    AreaPlugin.zoomAt(this.editor, this.editor.nodes);
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
   * Funzione che permette, con buona approssimazione di sistemare i moduli in una struttura organizzata.
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
   * Funzione che seleziona il modulo passato come argomento.
   * @param node 
   */
  touchModule(node: Node) {
    this.nodeSelected = { ...node } as Node;
    this.moduleSelected = this.theater.topology.elements[node.data.name as string].moduleInfo;
    this.displayMdata = this.displayModuleData(this.moduleSelected);
    this.cdr.detectChanges();
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
   * Funzione richiamata quando si ha il caso in cui si è importato un modulo. 
   * Essa si occupa della creazione, connessione e sistemazione dei nodi salvati nel modulo importato.
   * Provvede anche l'inizializzazione delle variabile che hanno scopo di mostrare i dati del moduli (offcanvas).
   * @see {module}
   * @see {arrangeNodes}
   * @see {consumerInterface}
   * @see {producerInterface}
   * @see {importList}
   */
  public async addNodes() {

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

  }




  /**
   * Questa funzione serve a non eseguire l'automatico sorting dei dati all'ng-for degli elementi (DOM).
   * @returns 
   */
  notSort() {
    return 0;
  }



}
