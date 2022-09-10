import { Component, AfterViewInit, ViewChild, ElementRef, Input, Output, ChangeDetectionStrategy, Renderer2, OnInit, TemplateRef, ChangeDetectorRef, NgZone } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NodeEditor, Node, Engine, Output as or, Input as ir } from 'rete';
import AreaPlugin from 'rete-area-plugin';
import { Router } from '@angular/router';
import { _Socket } from '../../rete-settings/sockets/socket';
import { NavbarItem, NavbarElement } from '../../components/navbar/navbarType';
import { UnderbarItem, UnderbarElement } from '../../components/underbar/underbarType';
import { TabnavElement } from '../../components/tabnav/tabnavType';
import { from } from 'rxjs';
import { ParseService } from 'src/app/services/application/parse/parse.service';
import { SimpleModuleApplication, ReteConnection, TheaterApplication } from 'src/app/services/modelsApplication/applicationModels';
import { ReteTheaterVisualizerSettings } from 'src/app/rete-settings/settings/editor-settings/reteTheaterVisualizerSettings';
import { IndexModuleComponent, ModuleComponents } from 'src/app/rete-settings/nodes/rete-modules/export-rete-modules';
import { SpinnerService } from 'src/app/services/application/spinner/spinner.service';
import { ReteDisplayModuleDataTV, ReteDisplayTheaterDataTV } from 'src/app/rete-settings/settings/displayData';
import { AttachmentsService } from 'src/app/services/api/attachments.service';
import { environment } from 'src/environments/environment';
import { ExportService } from 'src/app/services/application/export/export.service';
import { ModuleType1 } from 'src/app/models/appType';


@Component({
  selector: 'app-rete-theater-visualizer',
  templateUrl: './rete-theater-visualizer.component.html',
  styleUrls: ['./rete-theater-visualizer.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class ReteTheaterVisualizerComponent implements OnInit, AfterViewInit {

  // input data
  @Input() theater: TheaterApplication;
  @Input() isSimple: boolean = true;
  // @Input() theaterID: string | number;

  //node editor component
  @ViewChild('theaterEditor', { static: false }) el: ElementRef;
  nodeSelected: Node;
  moduleSelected: SimpleModuleApplication;
  displayMdata: { [field: string]: string[] }[][];
  displayTdata: { [field: string]: string[] }[][];
  displayModuleData = (module: SimpleModuleApplication): { [field: string]: string[] }[][] => { let x = ReteDisplayModuleDataTV(module); return x; }
  displayTheaterData = (theater: TheaterApplication): { [field: string]: string[] }[][] => { let x = ReteDisplayTheaterDataTV(theater); return x; }


  // node editor data
  container = null;
  editor: NodeEditor = null;
  components: any = ModuleComponents; // type ComponentRete[]
  engine: Engine = null;

  // variabili per input-research
  nodetofind: string = '';
  ModuleNameList: string[] = [];

  // for map bool
  ismapvisible: boolean = true;

  // navbar data
  navbarData: NavbarElement;

  // underbar data
  underbarData: UnderbarElement[] = [];
  @ViewChild('map_underbar') map_underbar: TemplateRef<any>;
  @ViewChild('search_underbar') search_underbar: TemplateRef<any>;
  @ViewChild('arrange_underbar') arrange_underbar: TemplateRef<any>;

  //// offcanvas theater info
  hideTheaterInfo: boolean = false;
  //-> nav data for nodes
  tabnavElementTheater: TabnavElement;
  @ViewChild('tab_theater_basic') tab_theater_basic?: TemplateRef<any>;
  @ViewChild('tab_theater_areas') tab_theater_areas?: TemplateRef<any>;
  @ViewChild('tab_theater_tags') tab_theater_tags?: TemplateRef<any>;
  @ViewChild('tab_theater_imports') tab_theater_imports?: TemplateRef<any>;
  @ViewChild('tab_theater_deploy') tab_theater_deploy?: TemplateRef<any>;
  @ViewChild('tab_theater_map') tab_theater_map?: TemplateRef<any>;


  // offcanvas Module info
  hideModuleInfo: boolean = false;
  tabnavElementModule: TabnavElement;
  //-> nav data for basic tab
  @ViewChild('tab_module_basic') tab_module_basic?: TemplateRef<any>;
  @ViewChild('tab_module_interfaces') tab_module_interfaces?: TemplateRef<any>;
  @ViewChild('tab_module_counter') tab_module_counter?: TemplateRef<any>;
  @ViewChild('tab_module_topology') tab_module_topology?: TemplateRef<any>;
  ///-> nav for option
  tabnavIF: TabnavElement;
  @ViewChild('tab_if_cons') tab_if_cons?: TemplateRef<any>;
  @ViewChild('tab_if_prod') tab_if_prod?: TemplateRef<any>;


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


  //// NAV FUNC
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
  showhideTheaterInfo() {
    this.displayTdata = this.displayTheaterData(this.theater);
    this.hideTheaterInfo = !this.hideTheaterInfo;
    this.cdr.detectChanges();
  }
  touchModule(node: Node) {
    this.nodeSelected = { ...node } as Node;
    this.moduleSelected = this.theater.topology.elements[node.data.name as string].moduleInfo;
    this.displayMdata = this.displayModuleData(this.moduleSelected);
    this.cdr.detectChanges();
  }
  showhideModuleInfo(node: Node) {
    this.touchModule(node);
    this.hideModuleInfo = !this.hideModuleInfo;
    this.displaceLeft();
    this.cdr.detectChanges();
  }
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
  goHome() {
    this.router.navigateByUrl('/home');
  }


  //// operation sub.nav
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
    this.ModuleNameList = [];
    this.editor.nodes.forEach(
      (el) => {
        this.ModuleNameList.push(el.data.name as string);
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

  // async not parse
  notSort() {
    return 0;
  }

  print(...Params: any[]) {
    console.log(Params);
  }



}
