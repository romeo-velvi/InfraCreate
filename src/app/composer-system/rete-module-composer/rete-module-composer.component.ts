import { Component, AfterViewInit, ViewChild, ElementRef, Input, Output, ChangeDetectionStrategy, OnInit, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { NodeEditor, Node, Engine, Output as or, Input as ir, Connection } from 'rete';
import AreaPlugin from 'rete-area-plugin';
import { Router } from '@angular/router';
import { EmptyNodeInfo, IndexNodeComponent, NodeComponents } from 'src/app/rete-settings/nodes/rete-nodes/export-rete-nodes';
import { _Socket } from '../../rete-settings/sockets/socket';
import { ReteModuleComposerSettings } from '../../rete-settings/settings/editor-settings/reteModuleComposerSettings'
import { NavbarItem, NavbarElement } from '../../components/navbar/navbarType';
import { UnderbarItem, UnderbarElement } from '../../components/underbar/underbarType';
import { DataInputElement, DataInputReturned, SelectOption } from '../../components/data-input/dataInputType';
import { ModalItem } from '../../components/modal/modalType';
import { TabnavElement } from '../../components/tabnav/tabnavType';
import { SpinnerService } from 'src/app/services/application/spinner/spinner.service';
import { FlavorApplication, ModuleApplication, ReteConnection } from 'src/app/services/modelsApplication/applicationModels';
import { BehaviorSubject, from } from 'rxjs';
import { ModuleNetworkInterfaceDTO } from 'src/app/services/modelsDTO/moduleDTO';
import { EnumModuleType, EnumModuleTypeDescription, EnumNodeType, InterfacePortType, IpVersionType, NodePortType, StaticValue } from 'src/app/models/appType';
import { DataInputReturnedV2 } from 'src/app/components/data-input-v2/dataInputTypeV2';
import { ExportService } from 'src/app/services/application/export/export.service';
import { ModalService } from 'src/app/services/application/modal/modal.service';
import { take } from 'rxjs/operators';


/**
 * Componente che contiene la logica e la gestione della parte di costruzione dei moduli.
 * Si occupa dello scambio di informazioni e le interazioni tra le componenti che permettono il visual-designing dell'applicazione.
 */
@Component({
  selector: 'app-rete-module-composer',
  templateUrl: './rete-module-composer.component.html',
  styleUrls: ['./rete-module-composer.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReteModuleComposerComponent implements OnInit, AfterViewInit {


  //// input var

  /**
   * Variabile in input che rappresenta il nome da assegnare al modulo
   * @type {string}
   */
  @Input() ModuleName: string;
  /**
   * Variabile in input che rappresenta la descrizione da assegnare al modulo
   * @type {string}
   */
  @Input() ModuleDescription: string;
  /**
   * Variabile in input che rappresenta la versione da assegnare al modulo
   * @type {string}
   * @type {number}
   */
  @Input() ModuleVersion: string | number;
  /**
   * Variabile in input che rappresenta l'autore da assegnare al modulo
   * @type {string}
   */
  @Input() ModuleAuthor: string;
  /**
   * Variabile in input che rappresenta i falvor da assegnare al modulo
   * @type {string}
   */
  @Input() flavor: FlavorApplication[];
  /**
   * Variabile in input che rappresenta tipo da assegnare al modulo
   * @type {string}
   */
  @Input() ModuleType: EnumModuleType;
  /**
   * Variabile che contiene gli attributi del modulo.
   * Esso può essere già fornito (come import di un file) per eseguire manipolazioni.
   * Oppure va creato e si valorizza nel corso del designing.
   * @type {ModuleApplication}
   */
  @Input() module: ModuleApplication;



  //// canvas var

  /**
   * Variabile che indica l'elemento all'interno del DOM il canvas su cui verranno eseguite operazioni di costruzione e designing del modulo.
   * @type {ElementRef}
   */
  @ViewChild('moduleComposer', { static: true }) el: ElementRef;
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
  protected components: any = NodeComponents;
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
  /**
   * Variabile che indica se bisogna creare un modulo da zero, oppure, istanziarlo a seguito di un import di un file.
   * @type {boolean}
   * @see {module}
   * @see {ModuleType}
   */
  protected fromFile: boolean = false;


  //// input search var

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
   * Variabile che indica l'hide-or-show della tendina di download
   * @type {boolean}
   * @default {false}
   */
  protected showbtn: boolean = false;


  //// underabar var

  /**
   * Variabile utilizzata per assegnare i valori all'underbar.
   * @type {UnderbarElement}
   */
  underbarData: UnderbarElement[] = [];
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
  ///-> tab node port
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


  //// offcanvas module var

  /**
   * Variabile utilizzata per l'hide-or-show dell'offcanvas del modulo.
   * @type {boolean}
   */
  protected hideModuleInfo: boolean = false;
  /**
   * Variabile utilizzata per assegnare i valori per le tab principali dell'offcanvas del modulo.
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
  * In questo caso la tab riguardante i counter del modulo.
  * @type {TemplateRef}
  */
  @ViewChild('tab_module_counter') tab_module_counter?: TemplateRef<any>;
  /**
  * Variabile che ha come riferimento un tag nel DOM di tipo templato nella quale vi è il contenuto di una tab.
  * In questo caso la tab riguardante le capabilities del modulo.
  * @type {TemplateRef}
  * @future implementation
  */
  @ViewChild('tab_module_capabilities') tab_module_capabilities?: TemplateRef<any>;
  /**
  * Variabile che ha come riferimento un tag nel DOM di tipo templato nella quale vi è il contenuto di una tab.
  * In questo caso la tab riguardante le statistiche del modulo.
  * @type {TemplateRef}
  * @future implementation
  */
  @ViewChild('tab_module_statistics') tab_module_statistics?: TemplateRef<any>;
  /**
   * Variabile che ha come riferimento un tag nel DOM di tipo templato nella quale vi è il contenuto di una tab.
   * In questo caso la tab riguardante gli import del modulo.
   * @type {TemplateRef}
   */
  @ViewChild('tab_theater_imports') tab_theater_imports?: TemplateRef<any>;
  ///-> nav for option
  /**
  * Variabile utilizzata per assegnare i valori per le tab secondaria "option" dell'offcanvas del modulo.
  * @type {TabnavElement}
  */
  protected tabnavOpt: TabnavElement;
  /**
   * Variabile che ha come riferimento un tag nel DOM di tipo templato nella quale vi è il contenuto di una tab.
   * In questo caso la tab riguardante altre informazioni del modulo.
   * @type {TemplateRef}
   * @future implementation
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
  ///-> nav for if
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


  //// d&d var

  /**
   * Variabile per l'hide-or-show dell'offcanvas in cui è presente il drag&drop.
   * @type {boolean}
   */
  protected hidedragdrop: boolean = false;
  /**
   * Variabile che fa riferimento ad un elemento a cui è eseguito il drag.
   * @type  {Node}
   */
  elementDragged: Node;
  /**
   * Variabile contenente il tipo di elemento a cui è eseguito il drag.
   * @type {EnumModuleType}
   */
  typeElementDreagged: EnumNodeType;


  //// modal var

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


  //// counter var

  // counter index ->  0: host   1: subnet   2:network (IndexNodeComponent)
  /**
   * Variabile utilizzata per il counter dei nodi host/subnet/network presenti sul canvas.
   * @type {BehaviorSubject}
   */
  protected counter: BehaviorSubject<Map<string, number>> = new BehaviorSubject<Map<string, number>>(null);
  /**
   * Variabile di appoggio che serve alla visualizzazione (lista) dei counter nell'offcanvas.
   * @type {Map<string, number>}
   * @see {counter}
   * @see  {tab_module_counter}
   */
  protected counterList: Map<string, number> = new Map<string, number>();
  /**
   * Variabile indicatrice dell'indice di riferimento nella quale incrementare il counter degli host.
   * @see {IndexNodeComponent}
   */
  protected indexHost = IndexNodeComponent.Host;
  /**
  * Variabile indicatrice dell'indice di riferimento nella quale incrementare il counter degli subnet.
  * @see {IndexNodeComponent}
  */
  protected indexSubnet = IndexNodeComponent.Subnet;
  /**
   * Variabile indicatrice dell'indice di riferimento nella quale incrementare il counter degli network.
   * @see {IndexNodeComponent}
   */
  protected indexNetwork = IndexNodeComponent.Network;
  /**
   * Variabile che viene utilizzata per assegnare nomenclature e ricerche alla base del tipo desiderato.
   * In questo caso indica il tipo host.
   * @see {EnumNodeType}
   */
  protected HOST = EnumNodeType.Host;
  /**
   * Variabile che viene utilizzata per assegnare nomenclature e ricerche alla base del tipo desiderato.
   * In questo caso indica il tipo subnet.
   * @see {EnumNodeType}
   */
  protected SUBNET = EnumNodeType.Subnet;
  /**
   * Variabile che viene utilizzata per assegnare nomenclature e ricerche alla base del tipo desiderato.
   * In questo caso indica il tipo network.
   * @see {EnumNodeType}
   */
  protected NETWORK = EnumNodeType.Network;


  //// interface var

  // interface index ->   0: consumer   1: producer
  /**
   * Variabile che viene utilizzata per immagazzinare i dati relativi alle interfacce consumer.
   * @type {BehaviorSubject}
   * @see {ModuleNetworkInterfaceDTO}
   */
  protected consumerInterface: BehaviorSubject<ModuleNetworkInterfaceDTO[]> = new BehaviorSubject<ModuleNetworkInterfaceDTO[]>(null);
  /**
   * Variabile che viene utilizzata per immagazzinare i dati relativi alle interfacce producer.
   * @type {BehaviorSubject}
   * @see {ModuleNetworkInterfaceDTO}
   */
  protected producerInterface: BehaviorSubject<ModuleNetworkInterfaceDTO[]> = new BehaviorSubject<ModuleNetworkInterfaceDTO[]>(null);
  /**
   * Variabile di appoggio che consente di selezionare le interfacce consumer.
   * @type {SelectOption[]}
   * @see {consumerInterface}
   */
  protected consumerSelection: SelectOption[] = [];
  /**
   * Variabile di appoggio che consente di selezionare le interfacce producer.
   * @type {SelectOption[]}
   * @see {producerInterface}
   */
  protected producerSelection: SelectOption[] = [];
  /**
   * Variabile di appoggio che consente di selezionare sia le interfacce consumer sia quelle producer.
   * @type {SelectOption[]}
   * @see {consumerInterface}
   */
  interfacesSelection = (): SelectOption[] => { return [...this.consumerSelection, ...this.producerSelection]; }
  /**
   * Variabile che ha come riferimento un tag nel DOM di tipo templato.
   * Contiene le informazini da mostrare nella modale per l'inserimento di una nuova interfaccia consumer.
   * @type {TemplateRef}
   * @see {modal}
   */
  @ViewChild('data_input_interface_consumer') data_input_interface_consumer?: TemplateRef<any>;
  /**
   * Variabile che ha come riferimento un tag nel DOM di tipo templato.
   * Contiene le informazini da mostrare nella modale per l'inserimento di una nuova interfaccia producer.
   * @type {TemplateRef}
   * @see {modal}
   */
  @ViewChild('data_input_interface_producer') data_input_interface_producer?: TemplateRef<any>;
  /**
   * Variabile che indica il nome di interfaccia consumer.
   * @see {InterfacePortType}
   */
  protected CONSUMER = InterfacePortType.CONSUMER;
  /**
   * Variabile che indica il nome di interfaccia producer.
   * @see {InterfacePortType}
   */
  protected PRODUCER = InterfacePortType.PRODUCER;
  /**
   * Variabile che indica cosa visualizzare nella modale, per l'aggiunta di una generica interfaccia.
   * @type {DataInputElement}
   * @see {data_input_interface_consumer}
   * @see {data_input_interface_producer}
   */
  protected formInterfaceElement: DataInputElement = {
    element: [
      {
        id: "name",
        text: "Interface name",
        type: "text",
        required: true
      }
    ]
  };


  //// port var

  /**
   * Variabile che indica il nome di porta input.
   * @see {NodePortType}
   */
  protected INPUT = NodePortType.INPUT;
  /**
   * Variabile che indica il nome di porta input.
   * @see {NodePortType}
   */
  protected OUTPUT = NodePortType.OUTPUT;
  /**
   * Variabile che ha come riferimento un tag nel DOM di tipo templato.
   * Contiene le informazini da mostrare nella modale per l'inserimento di una nuova porta input.
   * @type {TemplateRef}
   * @see {modal}
   */
  @ViewChild('data_input_port_in') data_input_port_in?: TemplateRef<any>;
  /**
   * Variabile che ha come riferimento un tag nel DOM di tipo templato.
   * Contiene le informazini da mostrare nella modale per l'inserimento di una nuova porta output.
   * @type {TemplateRef}
   * @see {modal}
   */
  @ViewChild('data_input_port_out') data_input_port_out?: TemplateRef<any>;
  /**
 * Variabile che indica cosa visualizzare nella modale, per l'aggiunta di una generica porta.
 * @type {DataInputElement}
 * @see {data_input_port_in}
 * @see {data_input_port_out}
 */
  protected formPort: DataInputElement = {
    element: [
      {
        id: "name",
        text: "Insert port name",
        type: "text",
        required: true
      },
    ]
  }


  //// flavor var
  /**
   * Variabile che ha lo scopo di salvare i Flavor assegnabili agli host.
   * @type {BehaviorSubject}
   * @see {FlavorApplication}
   */
  protected availableFlavor: BehaviorSubject<FlavorApplication[]> = new BehaviorSubject<FlavorApplication[]>(null);
  /**
   * Variabile di appoggio per la selezione dei flavor degli host
   * @type {SelectOption}
   * @see {availableFlavor}
   */
  protected flavorSelection: SelectOption[] = [];
  /**
   * Variabile che ha come riferimento un tag nel DOM di tipo templato.
   * In particolare consente la visualiazzione dei dettagli del flavor.
   * @type {TemplateRef}
   * @see {availableFlavor}
   */
  @ViewChild('tab_module_flavor') tab_module_flavor?: TemplateRef<any>;


  //// import var

  /**
   * Variabile che ha lo scopo di salvare gli import del modulo.
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

  //// static section

  /**
   * Variabile che contiene i tipi di os selezionabili dagli host.
   * @type {SelectOption}
   * @see {osSelection}
   * @see {DataInputComponent}
   */
  protected osSelection: SelectOption[] = [
    { text: StaticValue.hostOS1, value: StaticValue.hostOS1 },
    { text: StaticValue.hostOS2, value: StaticValue.hostOS2 },
    { text: StaticValue.hostOS3, value: StaticValue.hostOS3 },
  ]
  /**
   * Variabile che contiene i tipi di ip selezionabili dalle subnet.
   * @type {SelectOption}
   * @see {osSelection}
   * @see {DataInputComponent}
   */
  protected versionSelection: SelectOption[] = [
    { text: IpVersionType.FOUR, value: IpVersionType.FOUR },
    { text: IpVersionType.SIXSTEEN, value: IpVersionType.SIXSTEEN }
  ];
  /**
   * Variabile  che rappresenta le scelte di tipo da assegnare al modulo.
   * @type {SelectOption}
   * @see {DataInputComponent}
   * @see {EnumModuleTypeDescription}
   */
  protected moduleTypeOption: SelectOption[] = [
    { value: Object.keys(EnumModuleTypeDescription)[0], text: Object.values(EnumModuleTypeDescription)[0] }, //TheaterModuleInstance
    { value: Object.keys(EnumModuleTypeDescription)[1], text: Object.values(EnumModuleTypeDescription)[1] }, //TheaterInternalServiceModuleInstance
    { value: Object.keys(EnumModuleTypeDescription)[2], text: Object.values(EnumModuleTypeDescription)[2] }, //MirroringModuleInstance
    { value: Object.keys(EnumModuleTypeDescription)[3], text: Object.values(EnumModuleTypeDescription)[3] }, //VirtualServerModuleInstance
    { value: Object.keys(EnumModuleTypeDescription)[4], text: Object.values(EnumModuleTypeDescription)[4] }, //ExternalVirtualMachine
    { value: Object.keys(EnumModuleTypeDescription)[5], text: Object.values(EnumModuleTypeDescription)[5] }, //AutomaticSystem
    { value: Object.keys(EnumModuleTypeDescription)[6], text: Object.values(EnumModuleTypeDescription)[6] }, //Border
  ]

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
   * Costruttore di ReteModuleComponser.
   * Vengono inserite le subscribe ai subject per gestire gli eventi di modifiche delle varie strutture.
   * @param cdr 
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
    this.counter.asObservable().subscribe(cnt => {
      let x: Map<string, number> = new Map<string, number>();
      if (cnt) {
        x = cnt;
        this.counterList = x;
      }
      if (this.module) {
        this.module.host_number = x[this.HOST];
        this.module.subnet_number = x[this.SUBNET];
        this.module.network_number = x[this.NETWORK];
      }
    });
    this.consumerInterface.asObservable().subscribe(ifc_consumer => {
      let x: SelectOption[] = [];
      if (ifc_consumer) {
        ifc_consumer.forEach(i => {
          x.push({
            value: i.nodeName,
            text: i.nodeName
          });
        })
      }
      this.consumerSelection = x;
      if (this.module) {
        let ifc_producer: ModuleNetworkInterfaceDTO[] = [];
        this.module.interfaces.forEach(i => {
          if (i.type === this.PRODUCER)
            ifc_producer.push(i);
        })
        this.module.interfaces = [...ifc_producer, ...ifc_consumer];
      }
    });
    this.producerInterface.asObservable().subscribe(ifc_producer => {
      let x: SelectOption[] = [];
      if (ifc_producer) {
        ifc_producer.forEach(i => {
          x.push({
            value: i.nodeName,
            text: i.nodeName
          });
        })
      }
      this.producerSelection = x;
      if (this.module) {
        let ifc_consumer: ModuleNetworkInterfaceDTO[] = [];
        this.module.interfaces.forEach(i => {
          if (i.type === this.CONSUMER)
            ifc_consumer.push(i);
        })
        this.module.interfaces = [...ifc_producer, ...ifc_consumer];
      }
    });
    this.availableFlavor.asObservable().subscribe(flv => {
      let x: SelectOption[] = [];
      if (flv) {
        flv.forEach(f => {
          x.push({
            value: f.flavorName, text: f.flavorName
          })
        })
      }
      this.flavorSelection = x;
    });
    this.importList.asObservable().subscribe((imp) => {
      if (this.module)
        this.module.imports = imp ? imp : [];
    });
  }




  /**
   * Funzione richiamata all'inizializzazione della componente.
   * Si occupa di eseguire controlli per l'inizializzazione del modulo (nuovo o da import file).
   * Si occupa anche di valorizzare i flavor in ingresso.
   * Si avvale di operazioni di spinner-loading.
   * Avvia la funzione di start quando ha terminato le precedenti operazioni.
   * @see {startApp}
   */
  async ngOnInit() {
    this.spinnerService.setSpinner(true, "Loading module composer");
    let stringdate = new Date;
    if (!this.module)
      this.module = {
        imports: [],
        createdBy: this.ModuleAuthor,
        createdDate: stringdate as unknown as string,
        description: this.ModuleDescription,
        author: this.ModuleAuthor,
        version: this.ModuleVersion as string,
        host_number: 0,
        subnet_number: 0,
        network_number: 0,
        mode: null,
        tags: null,
        id: null,
        isLocked: null,
        lastModifiedBy: null,
        lastModifiedDate: null,
        lockAcquiredTimestamp: null,
        lockLastUserAcquiring: null,
        lockReleasedTimestamp: null,
        name: this.ModuleName,
        status: null,
        type: null,
        uuid: null,
        interfaces: [],
        hosts: [],
        topology: null,
        attachments: null,
        capabilities: null,
        catalog1: null,
        catalog2: null,
        catalog3: null,
        classification: null,
        configurationTemplate: null,
        detailProperties: null,
        input: null,
        output: null,
        statistics: null,
      };
    else
      this.fromFile = true;
    this.availableFlavor.next(this.flavor);
    from(this.startApp())
      .subscribe(el => {
        this.spinnerService.setSpinner(false);
      });
    this.cdr.detectChanges();
  }




  /**
   * Funzone che si occupa dell'inizializzazione dell'editor, container e del drag&drop.
   * Prende le configurazioni dell'editor per i plugin da utilizzare ed eventi da captare.
   * Nel caso si ha un importing da un file del modulo, provvede ad inizializzare i valori dei nodi.
   * @see {ReteModuleComposerSettings} 
   * @see {initModuleFromFile}
   */
  async startApp(): Promise<void> {

    this.container = this.el.nativeElement;

    this.editor = new NodeEditor('InfraCreateEditor@0.2.0', this.container);

    this.engine = new Engine('InfraCreateEngine@0.2.0');

    var v = new ReteModuleComposerSettings(this.container, this.editor, this.components, this.engine);
    v.editorUSE();

    // START EDITOR ON

    this.editor.on("nodeselected", (node) => {
      // this.zone.run(() => {
      this.touchNode(node);
      // })
    });

    this.editor.on('rendernode', ({ el, node }) => {
      el.addEventListener('dblclick', async () => {
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
      // })
    });

    this.editor.on("connectioncreate", ({ input, output }) => {
      //connection filter
      if (
        (input.node.name === this.HOST && output.node.name === this.NETWORK)
        ||
        (output.node.name === this.HOST && input.node.name === this.NETWORK)
        ||
        (output.node.name === input.node.name)
      ) {
        return false;
      }
    })

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
      ? await this.initModuleFromFile()
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
          { type: "button", button: { iconClass: "bi bi-aspect-ratio", tooltipText: "show context" }, id: 'showall' },
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
          { type: "separator", button: { iconClass: "bi bi-grip-vertical", tooltipText: "show sidebar" }, id: 'separator' }
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
        { id: "id_port_in", text: "Input Port", template: this.tab_port_in },
        { id: "id_port_out", text: "Output Port", template: this.tab_port_out }
      ]
    }
  }
  initTabModuleNavs() {
    /** Comment -> future implementation */
    this.tabnavElementModule = {
      element: [
        { id: "id_basic", text: "Properties", template: this.tab_module_basic },
        { id: "id_cnt", text: "Counter", template: this.tab_module_counter },
        { id: "id_if", text: "Interfaces", template: this.tab_module_interfaces },
        { id: "id_flvr", text: "Flavor", template: this.tab_module_flavor },
        { id: "id_imp", text: "Imports", template: this.tab_theater_imports },
        // { id: "id_stat", text: "Statistics", template: this.tab_module_statistics },
        // { id: "id_opt", text: "More", template: this.tab_module_more },
        // { id: "id_cap", text: "Capabilities", template: this.tab_module_capabilities },
      ]
    };
    // Sezione "Interface"
    this.tabnavIF = {
      element: [
        { id: "if_cons", text: "Consumer", template: this.tab_if_cons },
        { id: "if_prod", text: "Producer", template: this.tab_if_prod }
      ]
    }
    // // Sezione "more"
    // this.tabnavOpt = {
    //   element: [
    //     { id: "id_in_opt", text: "Input", template: this.tab_in_opt },
    //     { id: "id_out_opt", text: "Output", template: this.tab_out_opt }
    //   ]
    // };

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
        // handle in template
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
    this.hideModuleInfo = !this.hideModuleInfo;
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
    this.module.validateObject = "module";
    this.spinnerService.setSpinner(true, "Downloading file");
    this.exportService.exportModuleToJSON(this.module, this.editor.toJSON());
    this.spinnerService.setSpinner(false);
  }
  /**
   * Funzione che come scopo ritornare alla home.
   * Ritorna se vi è stat conferma dalla modale.
   * @see {modalConfirmation}
   * @see {router}
   */
  goHome() {
    this.modalConfirmation.showConfirmationModal("Do you want really go back home losing your data?")
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
   * Permette di caricare degli elementi all'interno del canvas. Se si posseggono i valori di un editor
   */
  loadJson() {
    let json = prompt("Insert json");
    json
      ? this.editor.fromJSON(JSON.parse(json))
      : false;
  }
  /**
   * Funzione che esegue lo switch della variabile di conrollo dell'hide-or-show dell'offcanvas del drag&drop
   * @see {hidedragdrop}
   */
  showDragDrop(show: boolean = undefined) {
    if (show === undefined)
      this.hidedragdrop = !this.hidedragdrop;
    else
      this.hidedragdrop = show;
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
   * Funzione che seleziona il nodo passato come argomento.
   * @param node 
   */
  touchNode(node: Node) {
    this.nodeSelected = node;
    this.cdr.detectChanges();
  }
  /**
   * Funzione che, dato un nodo, lo seleziona, lo posiziona sulla destra e fa apparire il canvas
   * @param node 
   * @see {touchNode}
   * @see {displaceLeft}
   * @see {hideNodeInfo}
   */
  showhideNodeInfo(node: Node) {
    this.touchNode(node);
    this.hideNodeInfo = !this.hideNodeInfo;
    this.displaceLeft();
    this.cdr.detectChanges();
  }
  /**
   * Funzione che posiziona un nodo selezionato alla sinistra
   */
  displaceLeft() {
    AreaPlugin.zoomAt(this.editor, this.editor.selected.list);
    const { area, container } = this.editor.view; // read from Vue component data;
    area.translate(area.transform.x - 200, area.transform.y);
  }
  /**
   * Funzone che posiziona un nodo selezionato sulla destra
   */
  displaceRight() {
    AreaPlugin.zoomAt(this.editor, this.editor.selected.list);
    const { area, container } = this.editor.view; // read from Vue component data;
    area.translate(area.transform.x + 200, area.transform.y);
  }
  /**
   * Funzione richiamata appena l'editor triggera l'evento di creazione nodo.
   * In particolare, se il nodo creato non ha nome, gli viene assegnato uno in automatico.
   * Viene aggiornato il counter relativo al tipo di nodo creato.
   * @param node 
   * @see {counter}
   */
  nodeCreate(node: Node) {
    node.data.name = node.data.name ? node.data.name : node.data.type + ' instance';
    let cnt: Map<string, number> = this.counter.getValue() ? this.counter.getValue() : new Map<string, number>();
    let type = node.data.type as string
    cnt[type] = cnt[type] ? cnt[type] + 1 : 1;
    this.counter.next(cnt);
    this.cdr.detectChanges();
  }
  /**
   * Funzione richiamata appena l'editor triggera l'evento di eliminazione nodo.
   * Viene aggiornato il counter relativo al tipo di nodo eliminato.
   * Viene rimosso il riferimento del nodo eliminato, se presente, all'interno delle interfacce del modulo.
   * @see {counter}
   * @param node 
   */
  nodeRemove(node: Node) {
    let cnt: Map<string, number> = this.counter.getValue() ? this.counter.getValue() : new Map<string, number>();
    let type = node.data.type as string
    cnt[type] = cnt[type] - 1;
    this.counter.next(cnt);
    this.removeNetworkFromInerface(node.data.name as string, node.data.externalInterfaceName as string);
    this.cdr.detectChanges();
  }




  // catch event to update node value

  /**
   * Funzione che esegue l'update di un nodo e le relative connessioni.
   * @param node 
   */
  updateNode(node: Node) {
    if (!node) { console.warn("node not recognized"); return };
    node.update();
    this.editor.view.updateConnections({ node });
    this.cdr.detectChanges();
  }
  /**
   * Funzione che aggiorna il nodo selezione una volta che si è selezionato un flavor da associare.
   * @see {availableFlavor}
   * @see {updateNode}
   */
  updateNodeFlavour(val: DataInputReturnedV2) {
    let x: FlavorApplication = this.availableFlavor.getValue().find(f => f.flavorName === val.new_value);
    if (x) {
      this.nodeSelected.data.cpu = x.cpu;
      this.nodeSelected.data.ram = x.ram;
      this.nodeSelected.data.disk = x.disk;
    }
    this.updateNode(this.nodeSelected);
  }
  /**
   * Funzione che viene richiamata quando un nodo di tipo network cambia interfaccia. Si occupa di:
   * - Aggiorna la nuova interaccia associando la network selezionata.
   * - Rimuove vecchie associazioni con la precesente intefraccia.
   * - Aggiorna la network selezionata cone la nuova interfaccia.
   * @param val 
   * @see {producerInterface}
   * @see {consumerInterface}
   * @see {updateNode}
   */
  updateNetworkInterface(val: DataInputReturnedV2) {
    if (!val || !val.new_value) return;
    let netIF: ModuleNetworkInterfaceDTO;
    let ifcp: ModuleNetworkInterfaceDTO[] = this.producerInterface.getValue();
    let ifcc: ModuleNetworkInterfaceDTO[] = this.consumerInterface.getValue();
    if (val.old_value) { // rimuovo, se esiste, il link con l'altra ifc
      netIF = ifcp?.find(i => i.nodeName === val.old_value);
      netIF = netIF ? netIF : ifcc?.find(i => i.nodeName === val.old_value);
      netIF ? netIF.network.name = "" : false;
    }
    if (val.new_value) { // trova ed assegna l'ifc al nodo
      netIF = ifcp?.find(i => i.nodeName === val.new_value);
      netIF = netIF ? netIF : ifcc?.find(i => i.nodeName === val.new_value);
      netIF.network.name = this.nodeSelected.data.name as string;
      netIF.type === this.CONSUMER ? this.consumerInterface.next(ifcc) : this.producerInterface.next(ifcp);
      // rimuovo (se esiste) il collegamento di un network con la medesima interfaccia
      this.editor.nodes.forEach(n => {
        if (n.data.externalInterfaceName === val.new_value) {
          n.data.externalInterfaceName = null;
          n.data.externalInterfacetype = null;
          this.updateNode(n);
        }
      })
    }
    this.nodeSelected.data.externalInterfaceName = netIF ? netIF.nodeName : "";
    this.nodeSelected.data.externalInterfaceType = netIF ? netIF.type : "";
    this.updateNode(this.nodeSelected);
    this.cdr.detectChanges();
    val = null;
  }
  /**
   * Funzione richiamata al momento dell'aggiornamento del nome di un nodo di tipo network.
   * Controlla eventuale associazioni con le interfaccie e le aggiorna.
   * Aggiorna in fine il nome della network.
   * @param val 
   * @see {producerInterface}
   * @see {consumerInterface}
   * @see {updateNode}
   */
  updateNetworkName(val: DataInputReturnedV2) {
    if (!val) return;
    let netIF: ModuleNetworkInterfaceDTO;
    let ifcp: ModuleNetworkInterfaceDTO[] = this.producerInterface.getValue();
    let ifcc: ModuleNetworkInterfaceDTO[] = this.consumerInterface.getValue();
    if (val.old_value && val.new_value) {
      netIF = ifcp?.find(i => i.network.name === val.old_value);
      netIF = netIF ? netIF : ifcc?.find(i => i.network.name === val.old_value);
      if (netIF) {
        netIF.network.name = val.new_value
        netIF.type === this.CONSUMER ? this.consumerInterface.next(ifcc) : this.producerInterface.next(ifcp);
      }
    }
    this.nodeSelected.data.name = val.new_value;
    this.updateNode(this.nodeSelected);
    this.cdr.detectChanges();
  }
  /**
   * Funzione richiamata quando si esegue l'update del nome di un nodo host
   * @param val 
   * @see {updateNode}
   */
  updateHostName(val: DataInputReturnedV2) {
    this.nodeSelected.data.name = val.new_value;
    this.updateNode(this.nodeSelected);
  }
  /**
   * Funzione richiamata quando si esegue l'update del nome di un nodo subnet
   * @param val 
   * @see {updateNode}
   */
  updateSubnetName(val: DataInputReturnedV2) {
    this.nodeSelected.data.name = val.new_value;
    this.updateNode(this.nodeSelected);
  }
  /**
   * Funzione richiamata quando si esegue l'update di un nome di un nodo generico. Si occupa di:
   * - Controlla se il nuovo nome è unico.
   * - Richiamare la funzione pertinente in base al tipo di nodo passato come parametro.
   * @param val 
   * @param type 
   */
  updateNodeName(val: DataInputReturnedV2, type: EnumNodeType) {
    if (
      !val || //non c'è change
      !val.new_value || // non c'è alcun valore
      !val.old_value || // non c'è alcun valore
      val.new_value === this.nodeSelected.data.name // stiamo cambiando informazioni con offcanvas aperto
    ) return;
    let problem: boolean = false;
    this.editor.nodes.forEach(n => {
      if (n.data.name === val.new_value || n.data.name === val.new_value) {
        this.openModalWithMessage("A problem occurred while updating node name", "This name has already been taken");
        problem = true;
        return;
      }
    });
    if (problem) return;
    switch (type) {
      case this.HOST:
        this.updateHostName(val);
        break;
      case this.SUBNET:
        this.updateSubnetName(val);
        break;
      case this.NETWORK:
        this.updateNetworkName(val);
        break;
      default:
        alert("Type not recognized");
        break;
    }

  }




  // operation on ports

  /**
   * Funzione avviata quando si sceglie di inserire una porta input di un nodo.
   * Fa apparire la modale di inserimento dati per valorizzare la porta.
   * @see {openModalWithTemplate}
   */
  addPortIn() {
    this.openModalWithTemplate("Add Input node", this.data_input_port_in);
  }
  /**
    * Funzione avviata quando si sceglie di inserire una porta output di un nodo.
    * Fa apparire la modale di inserimento dati per valorizzare la porta.
    * @see {openModalWithTemplate}
    */
  addPortOut() {
    this.openModalWithTemplate("Add Output node", this.data_input_port_out);
  }
  /**
   * Funzione che ha come scopo, una volta inseriti i dati della porta input di:
   * - Controllare che non ci sia altra porta che ha le stesse attribuzioni.
   * - Aggiornare il nodo selezionato con la porta inserita, sia nelle variabili globali del nodo, sia sul canvas.
   * ps. multi input dipende dal tipo di nodo
   * @param val 
   * @see {openModalWithMessage}
   */
  validatePortIn(val: DataInputReturned) {
    this.closeModal();
    if (!val || !val.isValid || val.exitStatus !== 'submitted') return;
    let name: string = val.element["name"].value;
    let nameAlreadyExists: boolean = false;
    nameAlreadyExists = (this.nodeSelected.data.Input as string[]).findIndex(i => i === name) >= 0 ? true : false;
    nameAlreadyExists = nameAlreadyExists || (this.nodeSelected.data.Output as string[]).findIndex(o => o === name) >= 0 ? true : false;
    if (nameAlreadyExists) {
      this.openModalWithMessage("Error loading input port", "Port name already inserted.");
      return;
    }
    (this.nodeSelected.data.Input as string[]).push(name);
    //check multi
    let multi: boolean =
      (this.nodeSelected.data.type === this.SUBNET)
        ? true
        : false;
    let input = new ir(name, name, _Socket, multi);
    this.nodeSelected.addInput(input);
    this.updateNode(this.nodeSelected);
  }
  /**
   * Funzione che ha come scopo, una volta inseriti i dati della porta output di:
   * - Controllare che non ci sia altra porta che ha le stesse attribuzioni.
   * - Aggiornare il nodo selezionato con la porta inserita, sia nelle variabili globali del nodo, sia sul canvas.
   * ps. multi output dipende dal tipo di nodo
   * @param val 
   * @see {openModalWithMessage}
   */
  validatePortOut(val: DataInputReturned) {
    this.closeModal();
    if (!val || !val.isValid) return;
    let name: string = val.element["name"].value
    let nameAlreadyExists: boolean = false;
    nameAlreadyExists = (this.nodeSelected.data.Input as string[]).findIndex(i => i === name) >= 0 ? true : false;
    nameAlreadyExists = nameAlreadyExists || (this.nodeSelected.data.Output as string[]).findIndex(o => o === name) >= 0 ? true : false;
    if (nameAlreadyExists) {
      this.openModalWithMessage("Error loading output port", "Port name already inserted.");
      return;
    }
    (this.nodeSelected.data.Output as string[]).push(name);
    //check multi
    let multi: boolean =
      (this.nodeSelected.data.type === this.HOST)
        ? true
        : false;
    let output = new or(name, name, _Socket, multi);
    this.nodeSelected.addOutput(output);
    this.updateNode(this.nodeSelected);
  }
  /**
   * Funzione richiamata quando si cerca di aggiornare il nome di una porta. 
   * Controlla che non ci sia alcuna porta con lo stesso nome prima di aggiornare.
   * Aggiorna inoltre gli attributi del nodo selezionato.
   * @param val 
   * @param type 
   */
  updatePortName(val: DataInputReturnedV2, type: NodePortType) {
    if (!val || !val.old_value || !val.new_value) return;
    let old_value = val.old_value;
    let new_value = val.new_value;
    let portNameAlreadytaken: boolean = (this.nodeSelected.data.Input as string[]).findIndex(i => i === new_value) >= 0 ? true : false;
    portNameAlreadytaken = portNameAlreadytaken || (this.nodeSelected.data.Output as string[]).findIndex(o => o === new_value) >= 0 ? true : false;
    if (portNameAlreadytaken) { // se il nuovo nome ce l'ha già qualche altra porta del nodo
      this.openModalWithMessage("Error port update", "New port name has already been taken");
      (this.nodeSelected.data.Input as string[]) = Array.from(this.nodeSelected.inputs.keys());
      this.cdr.detectChanges();
      return;
    }
    if (type === this.INPUT) {
      this.nodeSelected.inputs.get(old_value).key = new_value;
      this.nodeSelected.inputs.get(old_value).name = new_value;
      this.nodeSelected.inputs.set(new_value, this.nodeSelected.inputs.get(old_value));
      this.nodeSelected.inputs.delete(old_value);
      this.updateNode(this.nodeSelected);
      (this.nodeSelected.data.Input as string[]) = Array.from(this.nodeSelected.inputs.keys());
    }
    else if (type === this.OUTPUT) {
      this.nodeSelected.outputs.get(old_value).key = new_value;
      this.nodeSelected.outputs.get(old_value).name = new_value;
      this.nodeSelected.outputs.set(new_value, this.nodeSelected.outputs.get(old_value));
      this.nodeSelected.outputs.delete(old_value);
      this.updateNode(this.nodeSelected);
      (this.nodeSelected.data.Output as string[]) = Array.from(this.nodeSelected.outputs.keys());
    }
    else {
      alert("Errore modulo")
    }
  }
  /**
   * Funzone che ha come scopo rimuovere una porta output da un nodo se si ha dato la conferma attravero la modale.
   * Seleziona, se presenti, tutte le connessioni uscenti dal nodo e le cancella dal canvas.
   * Aggiorna il nodo selezionato.
   * @param portname 
   * @see {modalConfirmation}
   * @see {removeConnection}
   */
  removePortOut(portname: string) {
    this.modalConfirmation.showConfirmationModal(("Do you want remove output port \"" + portname + "\" ?"))
      .pipe(take(2)) // perchè il primo valore di reset è a null..
      .subscribe(
        v => {
          if (v) {
            let o = this.nodeSelected.outputs.get(portname);
            let connection: Connection[] = this.nodeSelected.getConnections();
            let todelete: Connection[] = [];
            connection.forEach(c => {
              if (c.output.key === portname) {
                todelete.push(c);
                c.input.node.getConnections().forEach(c => {
                  if (c.input.key === portname) {
                    todelete.push(c);
                  }
                });
              }
            });
            (todelete) ? this.removeConnection(todelete) : "";
            this.nodeSelected.removeOutput(o);
            let index = (this.nodeSelected.data.Output as string[]).findIndex(o => o === portname);
            (this.nodeSelected.data.Output as string[]).splice(index, 1);
            this.updateNode(this.nodeSelected);
          }
        }
      )
  }
  /**
   * Funzone che ha come scopo rimuovere una porta input da un nodo se si ha dato la conferma attravero la modale.
   * Seleziona, se presenti, tutte le connessioni entranti dal nodo e le cancella dal canvas.
   * Aggiorna il nodo selezionato.
   * @param portname 
   * @see {modalConfirmation}
   * @see {removeConnection}
   */
  removePortIn(portname: string) {
    this.modalConfirmation.showConfirmationModal(("Do you want remove input port \"" + portname + "\" ?"))
      .pipe(take(2)) // perchè il primo valore di reset è a null..
      .subscribe(
        v => {
          if (v) {
            let i = this.nodeSelected.inputs.get(portname);
            let connection: Connection[] = this.nodeSelected.getConnections();
            let todelete: Connection[] = [];
            connection.forEach(c => {
              if (c.input.key === portname) {
                todelete.push(c);
                c.output.node.getConnections().forEach(c => {
                  if (c.output.key === portname) {
                    todelete.push(c);
                  }
                });
              }
            });
            (todelete) ? this.removeConnection(todelete) : "";
            this.nodeSelected.removeInput(i);
            let index = (this.nodeSelected.data.Input as string[]).findIndex(i => i === portname);
            (this.nodeSelected.data.Input as string[]).splice(index, 1);
            this.updateNode(this.nodeSelected);
          }
        }
      )
  }
  /**
   * Funzione che ha come scopo cancellare dal canvas le connessioni passati come argomento.
   * @param toberemoved 
   */
  removeConnection(toberemoved: Connection[] = undefined) {
    if (toberemoved) {
      toberemoved.forEach(c => {
        this.editor.removeConnection(c)
      })
    }
    this.editor.view.updateConnections({ node: this.nodeSelected });
  }




  // interface func

  /**
   * Funzione che viene richiamata quando si vuole creare un'interfaccia.
   * Mostra la modali di input, in base al tipo passato come argomento.
   * @param type 
   * @see {openModalWithTemplate}
   */
  addInterface(type: InterfacePortType) {
    if (type === this.CONSUMER)
      this.openModalWithTemplate("Insert Consumer Interface", this.data_input_interface_consumer);
    else
      this.openModalWithTemplate("Insert Producer Interface", this.data_input_interface_producer);
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
  removeInterface(ifcName: string, type: InterfacePortType) {
    this.modalConfirmation.showConfirmationModal(("Do you want remove interface \"" + ifcName + "\" ?"))
      .pipe(take(2)) // perchè il primo valore di reset è a null..
      .subscribe(
        v => {
          if (v) {
            let ifc: ModuleNetworkInterfaceDTO[] = [];
            type === this.PRODUCER
              ? ifc = this.producerInterface.getValue() ? this.producerInterface.getValue() : []
              : ifc = this.consumerInterface.getValue() ? this.consumerInterface.getValue() : []
            var check = ifc?.findIndex(el => el.nodeName === ifcName);
            if (check < 0) { alert("This interface does not exist"); return; }
            ifc.splice(check, 1);
            // rimuove quest'area da tutti i nodi
            let node: Node = this.editor.nodes?.find(n => n.data.externalInterfaceName === ifcName);
            if (node) { // esiste un nodo a cui associato -> delete assoication
              node.data.externalInterfaceName = "";
              node.data.externalInterfaceType = "";
              this.updateNode(node);
            }
            type === this.CONSUMER
              ? this.consumerInterface.next(ifc)
              : this.producerInterface.next(ifc)
            this.cdr.detectChanges();
          }
        }
      )
  }
  /**
   * Funzione rimuove l'interfaccia da un nodo, rimuovendo tutti i riferimenti della stessa dal nodo e viceversa.
   * @param netName 
   * @param ifcName  
   */
  removeNetworkFromInerface(netName: string, ifcName: string) {
    if (!netName || !ifcName) return;
    let ifcp: ModuleNetworkInterfaceDTO[] = this.producerInterface.getValue();
    let ifcc: ModuleNetworkInterfaceDTO[] = this.consumerInterface.getValue();
    let netIF: ModuleNetworkInterfaceDTO = ifcp?.find(i => i.nodeName === netName);
    netIF = netIF ? netIF : ifcc?.find(i => i.nodeName === netName);
    netIF ? netIF.network.name = "" : false;
    netIF.type === this.CONSUMER ? this.consumerInterface.next(ifcc) : this.producerInterface.next(ifcp);
    this.cdr.detectChanges();
  }
  /**
   * Funzione che ha lo scopo di validazione dell'interfaccia.
   * Controlla che gli attributi della nuova interfaccia siano uniche.
   * Se il controllo va a buon fine, li aggiunge alle apposita strutture. 
   * @param val 
   * @param type  
   * @see {openModalWithMessage}
   * @see {producerInterface}
   * @see {consumerInterface}
   */
  validateInterface(val: DataInputReturned, type: InterfacePortType) {
    this.closeModal();
    if (!val || !val.isValid || !val.element["name"]) return;
    let ifcp: ModuleNetworkInterfaceDTO[] = this.producerInterface.getValue() ? this.producerInterface.getValue() : [];
    let ifcc: ModuleNetworkInterfaceDTO[] = this.consumerInterface.getValue() ? this.consumerInterface.getValue() : [];
    let nameAlreadyExists: boolean = ifcc.findIndex(el => el.nodeName === val.element["name"].value) >= 0 ? true : false;
    nameAlreadyExists = nameAlreadyExists || ifcp.findIndex(el => el.nodeName === val.element["name"].value) >= 0 ? true : false;
    if (nameAlreadyExists) {
      this.openModalWithMessage("A problem occurred while updating interface", "This interface already exists");
      return;
    }
    let ifc: ModuleNetworkInterfaceDTO[] = (type === this.CONSUMER) ? ifcc : ifcp;
    if (val.element["name"]) {
      ifc.push({
        id: null,
        label: null,
        module: null, // this.module
        network: {
          id: null,
          uuid: null,
          name: null
        },
        nodeName: val.element["name"].value as unknown as string,
        type: type,
        uuid: null
      });
    }
    (type === this.CONSUMER) ? this.consumerInterface.next(ifc) : this.producerInterface.next(ifc)
    this.cdr.detectChanges();
  }
  /**
   * Funzione che si occupa dell'update del nome di un'interfaccia. Si occupa di:
   * - Controllare che il nuovo nome sia unico.
   * - Aggiornare le strutture delle interfacce.
   * - Aggiornare il riferimento da un nodo ad esso associato, se presente. 
   * @param val 
   * @param ifcName 
   * @param type 
   * @see {consumerInterface}
   * @see {producerInterface}
   * @see {openModalWithMessage}
   */
  updateInterfaceName(val: DataInputReturnedV2, ifcName: string, type: InterfacePortType) {
    if (!val || !val.new_value || !val.old_value) return;
    let ifcc: ModuleNetworkInterfaceDTO[] = this.consumerInterface.getValue() ? this.consumerInterface.getValue() : [];
    let ifcp: ModuleNetworkInterfaceDTO[] = this.producerInterface.getValue() ? this.producerInterface.getValue() : [];
    let nameAlreadyExists: boolean = ifcc.findIndex(el => el.nodeName === val.new_value) >= 0 ? true : false;
    nameAlreadyExists = nameAlreadyExists || ifcp.findIndex(el => el.nodeName === val.new_value) >= 0 ? true : false;
    if (nameAlreadyExists) {
      this.openModalWithMessage("A problem occurred while updating interface", "This interface already exists");
      return;
    }
    let ifc: ModuleNetworkInterfaceDTO[] = (type === this.CONSUMER) ? ifcc : ifcp;
    var indexToUpdate = ifc?.findIndex(el => el.nodeName === ifcName);
    if (indexToUpdate < 0) { alert("Interface does not exist"); return; }
    ifc[indexToUpdate]['nodeName'] = val.new_value;
    (type === this.CONSUMER) ? this.consumerInterface.next(ifc) : this.producerInterface.next(ifc)
    // updating linked network
    this.editor.nodes.forEach(n => {
      if (n.data.externalInterfaceName === val.old_value) {
        n.data.externalInterfaceName = val.new_value;
        this.updateNode(n);
      }
    })
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
    this.modalConfirmation.showConfirmationModal(("Do you want remove import: \n" + importName + "\n ?"))
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




  // modal func

  /**
   * Funzione che si occupa di settare a true la variabile di show modal.
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




  // drag&drop func 

  /**
   * Funzione che viene richiamata quando è eseguito il drag di un nodo dall'offcanvas.
   * Salva gli elementi selezionati per il drag.
   * @param event 
   * @param type 
   * @see {elementDragged}
   * @see {typeElementDreagged} 
   */
  async onDrag(event: any, type: EnumNodeType) {
    event.preventDefault();
    document.getElementById(type).classList.add('grabbing');
    let for_rete = { ...EmptyNodeInfo[type] }; // bisogna instanziare una nuova variabile per prevenire cambiamenti
    this.elementDragged = await NodeComponents[IndexNodeComponent[type]].createNode(for_rete)
    this.typeElementDreagged = type;
  }
  /**
   * Funzione richiamata al drop dell'elemento sul canvas di lavoro.
   * Crea un nodo un una posizione approssimativa nel canvas dove il mouse si è fermato.
   * @see {elementDragged}
   */
  async onDrop() {
    document.getElementById(this.typeElementDreagged).classList.remove('grabbing');
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
   * Crea un nodo nell'offcanvas aventi i valori dell'elemento selezionato.
   * @param type 
   * @see {elementDragged}
   * @see {typeElementDreagged}
   */
  async onElementDBclick(type: EnumNodeType) {
    let for_rete = { ...EmptyNodeInfo[type] }; // bisogna instanziare una nuova variabile per prevenire cambiamenti
    this.elementDragged = await NodeComponents[IndexNodeComponent[type]].createNode(for_rete)
    this.typeElementDreagged = type;
    this.elementDragged.position = [this.editor.view.area.mouse.x + 100, this.editor.view.area.mouse.y + 100];
    this.editor.addNode(this.elementDragged);
  }




  /**
   * Funzione richiamata quando si ha il caso in cui si è importato un modulo. Essa si occupa di:
   * - Creazione, connessione e sistemazione dei nodi salvati nel modulo importato.
   * - Prende informazioni sulle intefracce e import e le inserisce.
   * @see {module}
   * @see {arrangeNodes}
   * @see {consumerInterface}
   * @see {producerInterface}
   * @see {importList}
   */
  public async initModuleFromFile(): Promise<void> {

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

    //parsefile section
    let cons_int: ModuleNetworkInterfaceDTO[] = [];
    let prod_int: ModuleNetworkInterfaceDTO[] = [];
    this.module.interfaces?.forEach(el => {
      if (el.type === this.CONSUMER)
        cons_int.push(el);
      else
        prod_int.push(el);
    });
    this.consumerInterface.next(cons_int);
    this.producerInterface.next(prod_int);

    let imp: string[] = [];
    if (this.module.imports && this.module.imports.length > 0) {
      this.module.imports.forEach(i => {
        imp.push(i);
      })
      this.importList.next(imp);
    }

  }


}
