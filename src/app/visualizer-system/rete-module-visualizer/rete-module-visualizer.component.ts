import { Component, AfterViewInit, ViewChild, ElementRef, Input, Output, ChangeDetectionStrategy, Renderer2, OnInit, TemplateRef, ChangeDetectorRef, NgZone } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { NodeEditor, Node, Engine, Output as or, Input as ir } from 'rete';
import AreaPlugin from 'rete-area-plugin';
import { Router } from '@angular/router';
import { _Socket } from '../../rete-settings/sockets/socket';
import { NavbarItem, NavbarElement } from '../../components/navbar/navbartype';
import { UnderbarItem, UnderbarElement } from '../../components/underbar/underbartypes';
import { TabnavElement } from '../../components/tabnav/tabnavtype';
import { from } from 'rxjs';
import { ParseService } from 'src/app/services/application/parse/parse.service';
import { SimpleModuleApplication, ModuleApplication, ReteConnection } from 'src/app/services/modelsApplication/applicationModels';
import { IndexNodeComponent, NodeComponents } from 'src/app/rete-settings/nodes/rete-nodes/export-rete-nodes';
import { ReteModuleVisualizerSettings } from 'src/app/rete-settings/settings/editor-settings/reteModuleVisualizerSettings';
import { SpinnerService } from 'src/app/services/application/spinner/spinner.service';
import { ReteDisplayNodeDataMV, ReteDisplayModuleDataMV } from 'src/app/rete-settings/settings/displayData';
import { AttachmentsService } from 'src/app/services/api/attachments.service';
import { environment } from 'src/environments/environment';
import { ExportService } from 'src/app/services/application/export/export.service';


@Component({
  selector: 'app-rete-module-visualizer',
  templateUrl: './rete-module-visualizer.component.html',
  styleUrls: ['./rete-module-visualizer.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class ReteModuleVisualizerComponent implements OnInit, AfterViewInit {

  // input data
  @Input() module: ModuleApplication;
  @Input() simpleModule?: SimpleModuleApplication;
  @Input() isSimple: boolean = true;
  // @Input() moduleID?: string | number;

  //node editor component
  @ViewChild('nodeEditor', { static: false }) el: ElementRef;
  nodeSelected: Node;
  displayNdata: { [field: string]: string[] }[];
  displayMdata: { [field: string]: string[] }[][];
  displayNodeData = (node: Node): { [field: string]: string[] }[] => { let x = ReteDisplayNodeDataMV(node); return x; }
  displayModuleData = (module: ModuleApplication): { [field: string]: string[] }[][] => { let x = ReteDisplayModuleDataMV(module); return x; }


  // node editor data
  container = null;
  editor: NodeEditor = null;
  components: any = NodeComponents; // type ComponentRete[]
  engine: Engine = null;

  // variabili per input-research
  nodetofind: string = '';
  NodeNameList: string[] = [];

  // for map bool
  ismapvisible: boolean = true;

  // to download
  downloadJsonHref: SafeUrl;

  // navbar data
  navbarData: NavbarElement;

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
  // => nav parameters
  tabnavPAR: TabnavElement;
  @ViewChild('tab_module_parameters') tab_module_parameters?: TemplateRef<any>;
  @ViewChild('tab_anchor') tab_anchor?: TemplateRef<any>;
  @ViewChild('tab_fixed') tab_fixed?: TemplateRef<any>;
  @ViewChild('tab_instance') tab_instance?: TemplateRef<any>;
  @ViewChild('tab_structural') tab_structural?: TemplateRef<any>;







  constructor(
    private render: Renderer2,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private parseService: ParseService,
    private zone: NgZone,
    private spinnerService: SpinnerService,
    private attachmentsService: AttachmentsService,
    private exportService: ExportService
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.spinnerService.setSpinner(true, "Loading theater elements");
    if (this.isSimple) {
      this.module = {
        import: [],
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

  async startSimpleApp(): Promise<void> {

    this.container = this.el.nativeElement;

    this.editor = new NodeEditor('moduleEditor@0.1.0', this.container);

    this.engine = new Engine('moduleEngine@0.2.0');

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

  async startApp(): Promise<void> {

    // this.module = await this.parseService.parseModuleForModuleVisualizer(1459);

    this.container = this.el.nativeElement;

    this.editor = new NodeEditor('moduleEditor@0.1.0', this.container);

    this.engine = new Engine('moduleEngine@0.2.0');

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
        { text: "Download zip", id: 'download' },
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


  //// NAV FUNC
  navItemSelected(val: NavbarItem) {
    switch (val.id) {
      case "mod_info":
        this.showhideModuleInfo();
        break;
      case "download":
        this.downloadZIP();
        break;
      case "home":
        this.goHome();
        break;
      default:
        break;
    }
  }
  showhideModuleInfo() {
    this.displayMdata = this.displayModuleData(this.module);
    this.hideModuleInfo = !this.hideModuleInfo;
    this.cdr.detectChanges();
  }
  showhideNodeInfo(node: Node) {
    this.nodeSelected = node;
    this.hideNodeInfo = !this.hideNodeInfo;
    this.displayNdata = this.displayNodeData(node);
    this.displaceLeft();
    this.cdr.detectChanges();
  }
  async downloadZIP() {
    this.spinnerService.setSpinner(true, "Creating module download");
    if (!environment.mocked) {
      (await this.attachmentsService.getModuleAttachment(this.module.id, this.module.attachments[0]))
        .subscribe(
          () => {
            this.spinnerService.setSpinner(false);
          }
        )
    }
    else {
      this.exportService.exportModuleToYAML(this.module, this.editor.toJSON());
      this.spinnerService.setSpinner(false);
    }
  }
  goHome() {
    this.router.navigateByUrl('/home');
  }


  //// operation underbar
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
  updateSelectedNode() {
    this.nodeSelected.update();
  }



  // add node function
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

    this.arrangenodes();

  }

  // editor func
  public async arrangenodes() {
    this.editor.nodes.forEach(async node => {
      await node.update()
      this.editor.trigger("arrange", { node: node });
    });

  }

  // async not parse
  notSort() {
    return 0;
  }

  print(...Params: any[]) {
    console.log(Params);
  }




}
