import { Component, AfterViewInit, ViewChild, ElementRef, Input, ChangeDetectionStrategy, OnInit, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { NodeEditor, Node, Engine, Output as or, Input as ir } from 'rete';
import AreaPlugin from 'rete-area-plugin';
import { Router } from '@angular/router';
import { IndexModuleComponent, ModuleComponents, ModuleType1 } from 'src/app/rete-settings/nodes/rete-modules/export-rete-modules';
import { _Socket } from '../../rete-settings/sockets/socket';
import { ReteTheaterComposerSettings } from 'src/app/rete-settings/settings/editor-settings/reteTheaterComposerSettings';
import { NavbarItem, NavbarElement } from '../../components/navbar/navbartype';
import { UnderbarItem, UnderbarElement } from '../../components/underbar/underbartypes';
import { DataInputElement, DataInputReturned, SelectOption } from '../../components/data-input/datainputtype';
import { ModalItem } from '../../components/modal/modaltype';
import { TabnavElement } from '../../components/tabnav/tabnavtype';
import { BehaviorSubject, from } from 'rxjs';
import { ParseService } from 'src/app/services/application/parse/parse.service';
import { AreaApplication, ModuleInstance, ReteConnection, SimpleModuleApplication, TheaterApplication } from 'src/app/services/modelsApplication/applicationModels';
import { SpinnerService } from 'src/app/services/application/spinner/spinner.service';
import { SimpleAreaDTO } from 'src/app/services/modelsDTO/moduleDTO';
import { BlueprintFileDTO, DeployInstanceDTO, EntityNameMappingFileDTO, TagCatalogueDTO, TheatreStatusDTO } from 'src/app/services/modelsDTO/theaterDTO';
import { OnChangeV2 } from 'src/app/components/data-input-v2/datainputv2type';
import { ReteDisplayModuleInstanceTC, ReteDisplayModuleDataTC, ReteDisplayTheaterDataTC } from 'src/app/rete-settings/settings/displayData';
import { ExportService } from 'src/app/services/application/export/export.service';
import { ModalService } from 'src/app/services/application/modal/modal.service';
import { take } from 'rxjs/operators';



export class AreaColorDTO extends SimpleAreaDTO {
  color: string;
}


@Component({
  selector: 'app-rete-theater-composer',
  templateUrl: './rete-theater-composer.component.html',
  styleUrls: ['./rete-theater-composer.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class ReteTheaterComposerComponent implements OnInit, AfterViewInit {

  // input data
  @Input() TheaterName: string;
  @Input() TheaterDescription: string;
  @Input() TheaterVersion: string | number;
  @Input() TheaterAuthor: string;
  @Input() ModulesDict: { [name: string]: ModuleInstance };


  //  Variable
  @Input() theater: TheaterApplication;
  fromFile: boolean = false;

  //module D&D
  moduleDD: ModuleInstance[] = [];

  // for display
  displayMdata: { [field: string]: string[] }[][];
  displayTdata: { [field: string]: string[] }[][];
  displayMIdata: { [field: string]: string[] }[];
  displayModuleInstanceData = (node: Node): { [field: string]: string[] }[] => { let x = ReteDisplayModuleInstanceTC(node); return x; }
  displayModuleData = (module: SimpleModuleApplication): { [field: string]: string[] }[][] => { let x = ReteDisplayModuleDataTC(module); return x; }
  displayTheaterData = (theater: TheaterApplication): { [field: string]: string[] }[][] => { let x = ReteDisplayTheaterDataTC(theater); return x; }


  // node editor component
  @ViewChild('theaterEditorComposer', { static: false }) el: ElementRef;
  nodeSelected: Node;
  moduleSelected: SimpleModuleApplication;

  // node editor data
  container = null;
  editor: NodeEditor = null;
  components: any = ModuleComponents;
  engine: Engine = null;

  // variabili per input-research
  nodetofind: string = '';
  ModuleNameList: string[] = [];

  // for map bool
  ismapvisible: boolean = true;

  // navbar data
  navbarData: NavbarElement;
  @ViewChild('download') dropdown_download: TemplateRef<any>;
  showbtn: boolean = false;

  // underbar data
  underbarData: UnderbarElement[] = [];
  @ViewChild('map_underbar') map_underbar: TemplateRef<any>;
  @ViewChild('search_underbar') search_underbar: TemplateRef<any>;
  @ViewChild('arrange_underbar') arrange_underbar: TemplateRef<any>;


  // offcanvas Module info
  hideModuleInfo: boolean = false;
  tabnavElementModule: TabnavElement;
  //elem
  @ViewChild('tab_module_instance') tab_module_instance?: TemplateRef<any>;
  //-> nav data for module root
  @ViewChild('tab_module_root') tab_module_root?: TemplateRef<any>;
  tabnavElementModuleRoot: TabnavElement;
  @ViewChild('tab_module_basic') tab_module_basic?: TemplateRef<any>;
  @ViewChild('tab_module_interfaces') tab_module_interfaces?: TemplateRef<any>;
  @ViewChild('tab_module_counter') tab_module_counter?: TemplateRef<any>;
  ///-> nav for option
  @ViewChild('tab_module_topology') tab_module_topology?: TemplateRef<any>;
  tabnavIF: TabnavElement;
  @ViewChild('tab_if_cons') tab_if_cons?: TemplateRef<any>;
  @ViewChild('tab_if_prod') tab_if_prod?: TemplateRef<any>;


  //// offcanvas theater info
  hideTheaterInfo: boolean = false;
  //-> nav data for nodes
  tabnavElementTheater: TabnavElement;
  @ViewChild('tab_theater_basic') tab_theater_basic?: TemplateRef<any>;
  @ViewChild('tab_theater_areas') tab_theater_areas?: TemplateRef<any>;
  @ViewChild('tab_theater_imports') tab_theater_imports?: TemplateRef<any>;
  @ViewChild('tab_theater_deploy') tab_theater_deploy?: TemplateRef<any>;
  @ViewChild('tab_theater_map') tab_theater_map?: TemplateRef<any>;
  @ViewChild('tab_theater_tags') tab_theater_tags?: TemplateRef<any>;


  // offcanvas Drag&Drop -> TODOGOOD
  hidedragdrop: boolean = false;
  @ViewChild('dragdrop_template') dragdrop_template?: TemplateRef<any>;

  //for modal
  isModalActive: boolean = false;
  dataModal: ModalItem;
  // message
  @ViewChild('data_message') data_message?: TemplateRef<any>;
  modalMessage: string = "";


  //areas
  areaList: BehaviorSubject<AreaApplication[]> = new BehaviorSubject<AreaApplication[]>(null);
  areaSelection: SelectOption[] = [];
  // area form
  @ViewChild('data_input_area') data_input_area?: TemplateRef<any>;
  formAreaElement: DataInputElement = {
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

  //tags
  tagList: BehaviorSubject<TagCatalogueDTO[]> = new BehaviorSubject<TagCatalogueDTO[]>(null);
  // tag form
  @ViewChild('data_input_tag') data_input_tag?: TemplateRef<any>;
  formTagElement: DataInputElement = {
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
  deploymentList: BehaviorSubject<DeployInstanceDTO[]> = new BehaviorSubject<DeployInstanceDTO[]>(null);


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
      this.addDepSeq(node);
    });
    this.editor.on("noderemove", (node) => {
      this.removeDepSeq(node);
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

  //// NAV FUNC
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
  touchNode(node: Node) {
    this.nodeSelected = node;
    this.moduleSelected = this.ModulesDict[node.data.module as string].moduleInfo;
    this.displayMdata = this.displayModuleData(this.moduleSelected);
    this.displayMIdata = this.displayModuleInstanceData(node);
    this.cdr.detectChanges();
  }
  showhideModuleInfo(node: Node) {
    this.touchNode(node);
    this.hideModuleInfo = !this.hideModuleInfo;
    this.displaceLeft();
    this.cdr.detectChanges();
  }
  showhideTheaterInfo() {
    this.hideTheaterInfo = !this.hideTheaterInfo;
  }
  downloadYAMLfunction() {
    this.spinnerService.setSpinner(true, "Downloading file");
    this.exportService.exportTheaterToYAML(this.theater, this.editor.toJSON());
    this.spinnerService.setSpinner(false);
  }
  downloadJSONfunction() {
    this.spinnerService.setSpinner(true, "Downloading file");
    this.exportService.exportTheaterToJSON(this.theater, this.editor.toJSON());
    this.spinnerService.setSpinner(false);
  }
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


  // area func
  addArea() {
    this.openModalWithTemplate("Insert Area", this.data_input_area);
  }
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
  updateAreaDescription(val: OnChangeV2, areaName: string) {
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
  updateAreaName(val: OnChangeV2, areaName: string) {
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
  updateAreaColor(val: OnChangeV2, areaName: string) {
    //TODO -> future implementation
  }

  // import func
  addImport() {
    this.openModalWithTemplate("Insert Import", this.data_input_import);
  }
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
  updateImport(val: OnChangeV2, imp: string) {
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
  updateTag(val: OnChangeV2, imp: string) {
    let tags: TagCatalogueDTO[] = this.tagList.getValue() ? this.tagList.getValue() : [];
    var check = tags.findIndex(el => el.name === imp);
    if (check < 0) { alert("import does not exist"); return; }
    tags[check] = val.new_value;
    this.tagList.next(tags);
    this.cdr.detectChanges();
  }
  updateTagName(val: OnChangeV2, tagName: string) {
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
  updateTagDescription(val: OnChangeV2, tagName: string) {
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

  //// updateing node
  updateModule(node: Node) {
    node.update();
    this.editor.view.updateConnections({ node });
    this.cdr.detectChanges();
  }
  updateModuleName(val: OnChangeV2) {
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
  loadJson() {
    let json = prompt("Insert json");
    json
      ? this.editor.fromJSON(JSON.parse(json))
      : false;
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
  displaceRight() {
    AreaPlugin.zoomAt(this.editor, this.editor.selected.list);
    const { area, container } = this.editor.view; // read from Vue component data;
    area.translate(area.transform.x + 200, area.transform.y);
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


  //// drag
  elementDragged: Node;
  async onDrag(event: any, node: ModuleInstance) {
    event.preventDefault();
    document.getElementById('dragnode').classList.add('grabbing');
    let for_rete = { ...node.rete }; // bisogna instanziare una nuova variabile per prevenire cambiamenti
    this.elementDragged = await ModuleComponents[IndexModuleComponent[ModuleType1[node.type]]].createNode(for_rete)
  }
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
  async onElementDBclick(node: ModuleInstance) {
    let for_rete = { ...node.rete }; // bisogna instanziare una nuova variabile per prevenire cambiamenti
    this.elementDragged = await ModuleComponents[IndexModuleComponent[ModuleType1[node.type]]].createNode(for_rete)
    this.elementDragged.position = [this.editor.view.area.mouse.x + 100, this.editor.view.area.mouse.y + 100];
    this.editor.addNode(this.elementDragged)
  }

  //other
  print(any: any) {
    console.log(any);
  }


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
