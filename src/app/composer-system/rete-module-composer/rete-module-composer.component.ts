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
import { EnumModuleType, EnumModuleTypeDescription, EnumNodeType, InterfacePortType, NodePortType, StaticValue } from 'src/app/models/appType';
import { DataInputReturnedV2 } from 'src/app/components/data-input-v2/dataInputTypeV2';
import { ParseService } from 'src/app/services/application/parse/parse.service';
import { ReteDisplayNodeDataMV, ReteDisplayModuleDataMV } from 'src/app/rete-settings/settings/displayData';
import { ExportService } from 'src/app/services/application/export/export.service';
import { ModalService } from 'src/app/services/application/modal/modal.service';
import { take } from 'rxjs/operators';



@Component({
  selector: 'app-rete-module-composer',
  templateUrl: './rete-module-composer.component.html',
  styleUrls: ['./rete-module-composer.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class ReteModuleComposerComponent implements OnInit, AfterViewInit {

  // input data
  @Input() ModuleName: string;
  @Input() ModuleDescription: string;
  @Input() ModuleVersion: string | number;
  @Input() ModuleAuthor: string;
  @Input() flavor: FlavorApplication[];
  @Input() ModuleType: EnumModuleType;
  moduleTypeOption: SelectOption[] = [
    { value: Object.keys(EnumModuleTypeDescription)[0], text: Object.values(EnumModuleTypeDescription)[0] }, //TheaterModuleInstance
    { value: Object.keys(EnumModuleTypeDescription)[1], text: Object.values(EnumModuleTypeDescription)[1] }, //TheaterInternalServiceModuleInstance
    { value: Object.keys(EnumModuleTypeDescription)[2], text: Object.values(EnumModuleTypeDescription)[2] }, //MirroringModuleInstance
    { value: Object.keys(EnumModuleTypeDescription)[3], text: Object.values(EnumModuleTypeDescription)[3] }, //VirtualServerModuleInstance
    { value: Object.keys(EnumModuleTypeDescription)[4], text: Object.values(EnumModuleTypeDescription)[4] }, //ExternalVirtualMachine
    { value: Object.keys(EnumModuleTypeDescription)[5], text: Object.values(EnumModuleTypeDescription)[5] }, //AutomaticSystem
    { value: Object.keys(EnumModuleTypeDescription)[6], text: Object.values(EnumModuleTypeDescription)[6] }, //Border
  ]

  // node editor component
  @ViewChild('moduleEditorComponer', { static: true }) el: ElementRef;
  nodeSelected: Node;
  displayNdata: { [field: string]: string[] }[];
  displayMdata: { [field: string]: string[] }[][];
  displayNodeData = (node: Node): { [field: string]: string[] }[] => { let x = ReteDisplayNodeDataMV(node); return x; }
  displayModuleData = (module: ModuleApplication): { [field: string]: string[] }[][] => { let x = ReteDisplayModuleDataMV(module); return x; }


  // node editor data
  container = null;
  editor: NodeEditor = null;
  components: any = NodeComponents;
  engine: Engine = null;

  // Variable
  @Input() module: ModuleApplication;
  fromFile: boolean = false;

  // variabili per input-research
  nodetofind: string = '';
  NodeNameList: string[] = [];

  // for map bool
  ismapvisible: boolean;

  // navbar data
  navbarData: NavbarElement;
  @ViewChild('download') dropdown_download: TemplateRef<any>;
  showbtn: boolean = false;


  // underbar data
  underbarData: UnderbarElement[] = [];
  @ViewChild('map_underbar') map_underbar: TemplateRef<any>;
  @ViewChild('search_underbar') search_underbar: TemplateRef<any>;
  @ViewChild('arrange_underbar') arrange_underbar: TemplateRef<any>;

  //// offcanvas Node info
  hideNodeInfo: boolean = false;
  //-> nav data for nodes
  tabnavElementNode: TabnavElement;
  @ViewChild('tab_node_data') tab_node_data?: TemplateRef<any>;
  @ViewChild('tab_node_ports') tab_node_ports?: TemplateRef<any>;
  @ViewChild('tab_node_more') tab_node_more?: TemplateRef<any>;
  ///-> nav portas -> inside
  tabnavPorts: TabnavElement;
  @ViewChild('tab_port_in') tab_port_in?: TemplateRef<any>;
  @ViewChild('tab_port_out') tab_port_out?: TemplateRef<any>;


  // offcanvas Module info
  hideModuleInfo: boolean = false;
  tabnavElementModule: TabnavElement;
  //-> nav data for basic tab
  @ViewChild('tab_module_basic') tab_module_basic?: TemplateRef<any>;
  @ViewChild('tab_module_counter') tab_module_counter?: TemplateRef<any>;
  @ViewChild('tab_module_capabilities') tab_module_capabilities?: TemplateRef<any>;
  @ViewChild('tab_module_statistics') tab_module_statistics?: TemplateRef<any>;
  @ViewChild('tab_theater_imports') tab_theater_imports?: TemplateRef<any>;
  ///-> nav for option
  tabnavOpt: TabnavElement;
  @ViewChild('tab_module_more') tab_module_more?: TemplateRef<any>;
  @ViewChild('tab_in_opt') tab_in_opt?: TemplateRef<any>;
  @ViewChild('tab_out_opt') tab_out_opt?: TemplateRef<any>;
  ///-> nav for interfaces
  tabnavIF: TabnavElement;
  @ViewChild('tab_module_interfaces') tab_module_interfaces?: TemplateRef<any>;
  @ViewChild('tab_if_cons') tab_if_cons?: TemplateRef<any>;
  @ViewChild('tab_if_prod') tab_if_prod?: TemplateRef<any>;


  // offcanvas Drag&Drop -> TODOGOOD
  hidedragdrop: boolean = false;
  dragdrop: HTMLElement = null;

  //for modal
  isModalActive: boolean = false;
  dataModal: ModalItem;
  // message
  @ViewChild('data_message') data_message?: TemplateRef<any>;
  modalMessage: string = "";

  // counter index ->  0: host   1: subnet    2:network (IndexNodeComponent)
  counter: BehaviorSubject<Map<string, number>> = new BehaviorSubject<Map<string, number>>(null);
  counterList: Map<string, number> = new Map<string, number>();
  indexHost = IndexNodeComponent.Host;
  indexSubnet = IndexNodeComponent.Subnet;
  indexNetwork = IndexNodeComponent.Network;
  HOST = EnumNodeType.Host;
  SUBNET = EnumNodeType.Subnet;
  NETWORK = EnumNodeType.Network;

  // interface index -> 0: consumer   1: producer
  consumerInterface: BehaviorSubject<ModuleNetworkInterfaceDTO[]> = new BehaviorSubject<ModuleNetworkInterfaceDTO[]>(null);
  producerInterface: BehaviorSubject<ModuleNetworkInterfaceDTO[]> = new BehaviorSubject<ModuleNetworkInterfaceDTO[]>(null);
  consumerSelection: SelectOption[] = [];
  producerSelection: SelectOption[] = [];
  interfacesSelection = (): SelectOption[] => { return [...this.consumerSelection, ...this.producerSelection]; }
  // interface form
  @ViewChild('data_input_interface_producer') data_input_interface_producer?: TemplateRef<any>;
  @ViewChild('data_input_interface_consumer') data_input_interface_consumer?: TemplateRef<any>;
  TypeIFselection: SelectOption[] = [
    { value: InterfacePortType.CONSUMER, text: InterfacePortType.CONSUMER },
    { value: InterfacePortType.PRODUCER, text: InterfacePortType.PRODUCER },
  ];
  CONSUMER = InterfacePortType.CONSUMER;
  PRODUCER = InterfacePortType.PRODUCER;
  formInterfaceElement: DataInputElement = {
    element: [
      {
        id: "name",
        text: "Interface name",
        type: "text",
        required: true
      },
      // {
      //   id: "type",
      //   text: "Interface Type",
      //   type: "selection",
      //   selection: this.TypeIFselection
      // }
    ]
  };

  // port
  INPUT = NodePortType.INPUT;
  OUTPUT = NodePortType.OUTPUT;
  formPort: DataInputElement = {
    element: [
      {
        id: "name",
        text: "Insert port name",
        type: "text",
        required: true
      },
    ]
  }
  @ViewChild('data_input_port_in') data_input_port_in?: TemplateRef<any>;
  @ViewChild('data_input_port_out') data_input_port_out?: TemplateRef<any>;


  // flavor
  availableFlavor: BehaviorSubject<FlavorApplication[]> = new BehaviorSubject<FlavorApplication[]>(null);
  flavorSelection: SelectOption[] = [];
  @ViewChild('tab_module_flavor') tab_module_flavor?: TemplateRef<any>;

  //imports
  importList: BehaviorSubject<string[]> = new BehaviorSubject<string[]>(null);
  // import form
  @ViewChild('data_input_import') data_input_import?: TemplateRef<any>;
  formImportElement: DataInputElement = {
    element: [
      {
        id: "import",
        text: "Import from",
        type: "text",
        required: true
      }
    ]
  };

  //////// static selection value
  // host os
  osSelection: SelectOption[] = [
    { text: StaticValue.hostOS1, value: StaticValue.hostOS1 },
    { text: StaticValue.hostOS2, value: StaticValue.hostOS2 },
    { text: StaticValue.hostOS3, value: StaticValue.hostOS3 },
  ]
  //ip version array
  versionSelection: SelectOption[] = [
    { text: "4", value: "4" },
    { text: "16", value: "16" },
  ];






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

  async startApp(): Promise<void> {

    this.container = this.el.nativeElement;

    this.dragdrop = document.getElementById('dragdrop');

    this.editor = new NodeEditor('InfraCreateEditor@0.2.0', this.container);

    this.engine = new Engine('InfraCreateEngine@0.2.0');

    var v = new ReteModuleComposerSettings(this.container, this.editor, this.components, this.engine);
    v.editorUSE(this.dragdrop);

    // START EDITOR ON

    this.editor.on("nodeselected", (node) => {
      // this.zone.run(() => {
      this.touchNode(node);
      // })
    });

    this.editor.on('rendernode', ({ el, node }) => {
      el.addEventListener('dblclick', async () => {
        // this.zone.run(() => {
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
          { type: "button", button: { iconClass: "bi bi-zoom-in", tooltipText: "zoomo in" }, id: 'zoomin' },
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


  //// NAV FUNC
  navItemSelected(val: NavbarItem) {
    switch (val.id) {
      case "mod_info":
        this.showhideModuleInfo();
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
  showhideModuleInfo() {
    this.hideModuleInfo = !this.hideModuleInfo;
  }
  showhideNodeInfo(node: Node) {
    this.touchNode(node);
    this.hideNodeInfo = !this.hideNodeInfo;
    this.displaceLeft();
    this.cdr.detectChanges();
  }
  downloadYAMLfunction() {
    this.spinnerService.setSpinner(true, "Downloading file");
    this.exportService.exportModuleToYAML(this.module, this.editor.toJSON());
    this.spinnerService.setSpinner(false);
  }
  downloadJSONfunction() {
    this.spinnerService.setSpinner(true, "Downloading file");
    this.exportService.exportModuleToJSON(this.module, this.editor.toJSON());
    this.spinnerService.setSpinner(false);
  }
  goHome() {
    this.modalConfirmation.showConfirmationModal("Do you want really go back home loseing your data?")
      .pipe(take(2)) // perchè il primo valore di reset è a null..
      .subscribe(
        v => {
          if (v) {
            this.router.navigateByUrl('/home');
          }
        }
      )
  }
  loadJson() {
    let json = prompt("Insert json");
    json
      ? this.editor.fromJSON(JSON.parse(json))
      : false;
  }


  //// updateing node
  updateNode(node: Node) {
    if (!node) { console.warn("node not recognized"); return };
    node.update();
    this.editor.view.updateConnections({ node });
    this.cdr.detectChanges();
  }
  updateNodeFlavour(val: DataInputReturnedV2) {
    let x: FlavorApplication = this.availableFlavor.getValue().find(f => f.flavorName === val.new_value);
    if (x) {
      this.nodeSelected.data.cpu = x.cpu;
      this.nodeSelected.data.ram = x.ram;
      this.nodeSelected.data.disk = x.disk;
    }
    this.updateNode(this.nodeSelected);
  }

  addPortIn() {
    this.openModalWithTemplate("Add Input node", this.data_input_port_in);
  }
  addPortOut() {
    this.openModalWithTemplate("Add Output node", this.data_input_port_out);
  }
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
    let input = new ir(name, name, _Socket, true);
    this.nodeSelected.addInput(input);
    this.updateNode(this.nodeSelected);
  }
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
    let output = new or(name, name, _Socket, true);
    this.nodeSelected.addOutput(output);
    this.updateNode(this.nodeSelected);
  }
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
  removeConnection(toberemoved: Connection[] = undefined) {
    if (toberemoved) {
      toberemoved.forEach(c => {
        this.editor.removeConnection(c)
      })
    }
    this.editor.view.updateConnections({ node: this.nodeSelected });
  }

  //// operation underbar
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
  undoEditor() {
    this.editor.trigger("undo");
  }
  redoEditor() {
    this.editor.trigger("redo");
  }
  makezoom(k: number) {
    // k is declarend in (click) ad +- 0.1
    const { area, container } = this.editor.view; // read from Vue component data;
    const rect = area.el.getBoundingClientRect();
    const ox = (rect.left - container.clientWidth / 2) * k;
    const oy = (rect.top - container.clientHeight / 2) * k;
    area.zoom(area.transform.k + k, ox, oy, 'wheel');
  }
  displayAllNodes() {
    AreaPlugin.zoomAt(this.editor, this.editor.nodes);
  }
  findElement(result: string) {
    this.nodetofind = result;

    let elementfound = this.editor.nodes.find(n => n.data.name === this.nodetofind)
    let elementpick = new Array(elementfound); // deve necessariamente trovarsi in un array...

    AreaPlugin.zoomAt(this.editor, elementpick);
    this.editor.selectNode(elementpick[0]);
  }
  updateNameList() {
    this.NodeNameList = [];
    this.editor.nodes.forEach(
      (el) => {
        this.NodeNameList.push(el.data.name as string);
      }
    )
  }
  async arrangeNodes() {
    this.editor.nodes.forEach(
      async node => {
        await node.update()
        this.editor.trigger("arrange", { node: node });
      }
    );
  }
  displaceLeft() {
    AreaPlugin.zoomAt(this.editor, this.editor.selected.list);
    const { area, container } = this.editor.view; // read from Vue component data;
    area.translate(area.transform.x - 200, area.transform.y);
  }
  displaceRight() {
    AreaPlugin.zoomAt(this.editor, this.editor.selected.list);
    const { area, container } = this.editor.view; // read from Vue component data;
    area.translate(area.transform.x + 200, area.transform.y);
  }


  touchNode(node: Node) {
    this.nodeSelected = node;
    this.cdr.detectChanges();
  }


  // show/hide
  showDragDrop(b: boolean = undefined) {
    if (b === undefined)
      this.hidedragdrop = !this.hidedragdrop;
    else
      this.hidedragdrop = b;
  }
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


  // Counter (after node addedd) func -> da vedere
  nodeCreate(node: Node) {
    node.data.name = node.data.name ? node.data.name : node.data.type + ' instance';
    let cnt: Map<string, number> = this.counter.getValue() ? this.counter.getValue() : new Map<string, number>();
    let type = node.data.type as string
    cnt[type] = cnt[type] ? cnt[type] + 1 : 1;
    this.counter.next(cnt);
    this.cdr.detectChanges();
  }
  nodeRemove(node: Node) {
    let cnt: Map<string, number> = this.counter.getValue() ? this.counter.getValue() : new Map<string, number>();
    let type = node.data.type as string
    cnt[type] = cnt[type] - 1;
    this.counter.next(cnt);
    this.removeNetworkFromInerface(node.data.name as string, node.data.externalInterfaceName as string);
    this.cdr.detectChanges();
  }

  // interface func
  addInterface(type: InterfacePortType) {
    if (type === this.CONSUMER)
      this.openModalWithTemplate("Insert Consumer Interface", this.data_input_interface_consumer);
    else
      this.openModalWithTemplate("Insert Producer Interface", this.data_input_interface_producer);
  }
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
  addImport() {
    this.openModalWithTemplate("Insert Import", this.data_input_import);
  }
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
  updateImport(val: DataInputReturnedV2, imp: string) {
    let impor: string[] = this.importList.getValue() ? this.importList.getValue() : [];
    var check = impor.findIndex(el => el === imp);
    if (check < 0) { alert("import does not exist"); return; }
    impor[check] = val.new_value;
    this.importList.next(impor);
    this.cdr.detectChanges();
  }



  // catch event to update node value
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
    this.nodeSelected.data.externalInterfaceName = netIF ? netIF.nodeName : "zeppole";
    this.nodeSelected.data.externalInterfaceType = netIF ? netIF.type : "patate";
    this.updateNode(this.nodeSelected);
    this.cdr.detectChanges();
    val = null;
  }
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
  updateHostName(val: DataInputReturnedV2) {
    this.nodeSelected.data.name = val.new_value;
    this.updateNode(this.nodeSelected);
  }
  updateSubnetName(val: DataInputReturnedV2) {
    this.nodeSelected.data.name = val.new_value;
    this.updateNode(this.nodeSelected);
  }
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

  // modal
  showModal() {
    this.isModalActive = true;
  }
  closeModal() {
    this.isModalActive = false;
  }
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

  // drag & drop function
  elementDragged: Node;
  typeElementDreagged: EnumNodeType;
  async onDrag(event: any, type: EnumNodeType) {
    event.preventDefault();
    document.getElementById(type).classList.add('grabbing');
    let for_rete = { ...EmptyNodeInfo[type] }; // bisogna instanziare una nuova variabile per prevenire cambiamenti
    this.elementDragged = await NodeComponents[IndexNodeComponent[type]].createNode(for_rete)
    this.typeElementDreagged = type;
  }
  async onDrop() {
    document.getElementById(this.typeElementDreagged).classList.remove('grabbing');
    this.elementDragged.position = [this.editor.view.area.mouse.x + 200, this.editor.view.area.mouse.y + 100];
    this.editor.addNode(this.elementDragged)
  }
  async onElementDBclick(type: EnumNodeType) {
    let for_rete = { ...EmptyNodeInfo[type] }; // bisogna instanziare una nuova variabile per prevenire cambiamenti
    this.elementDragged = await NodeComponents[IndexNodeComponent[type]].createNode(for_rete)
    this.typeElementDreagged = type;
    this.elementDragged.position = [this.editor.view.area.mouse.x + 100, this.editor.view.area.mouse.y + 100];
    this.editor.addNode(this.elementDragged);
  }
  dragPreventDefault(event: any) {
    event.preventDefault();
  }
  dropPreventDefault(event: any) {
    event.stopPropagation();
    event.preventDefault();
  }




  //// other
  print(val: any) {
    console.log(val);
  }


  // add node function
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
    if (this.module.imports.length > 0) {
      this.module.imports.forEach(i => {
        imp.push(i);
      })
      this.importList.next(imp);
    }

  }


}
