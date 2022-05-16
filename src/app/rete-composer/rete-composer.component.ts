import { Component, AfterViewInit, ViewChild, ElementRef, Input, Output as outcore, ChangeDetectionStrategy, Renderer2, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { NodeEditor, Engine, Output, Connection } from 'rete';
import ConnectionPlugin from 'rete-connection-plugin';
import ConnectionPathPlugin from 'rete-connection-path-plugin';
import ContextMenuPlugin from 'rete-context-menu-plugin';
import { AngularRenderPlugin } from 'rete-angular-render-plugin';
import AreaPlugin from 'rete-area-plugin';
import MinimapPlugin from 'rete-minimap-plugin';
import AutoArrangePlugin from 'rete-auto-arrange-plugin'
import DockPlugin from 'rete-dock-plugin';

import { NodeComposerComponent } from './components/node-composer-component';
import { ServerComposerComponent } from './components/server-composer-component';

import { NgxSpinnerService } from "ngx-spinner";
import { NgxTypeaheadModule } from "ngx-typeahead";


@Component({
  selector: 'app-rete-composer',
  templateUrl: './rete-composer.component.html',
  styleUrls:  ['./rete-composer.component.css'],
})

export class ReteComposerComponent implements OnInit,AfterViewInit {

  @ViewChild('nodeEditor', { static: true }) el: ElementRef;

  @Input() name: any;
  @Input() description: any;

  container = null;
  editor: NodeEditor = null;
  components = null;
  engine = null;

  // for html dynamic part
  showside: boolean = true;
  hidemoduleinfo: boolean = false;
  hidetheaterinfo: boolean = false;
  @outcore() nodeselected: any = {};

  // variabili per input-research
  nodetofind: string = '';
  namelist = [];

  //for map bool
  ismapvisible: boolean = true;

  // to download
  downloadJsonHref: SafeUrl;

  //tab
  activetab = 1;

  // d&d
  @ViewChild('dedsb') dedsb: ElementRef;

  constructor(private spinner: NgxSpinnerService, private render: Renderer2, private sanitizer: DomSanitizer) {
  }

  async ngAfterViewInit() {
    this.displayded(false);
  }


  async ngOnInit() {

    console.log("data passed: ", this.name, this.description);

    this.container = this.el.nativeElement;

    // stored all node-types
    this.components = [
      new NodeComposerComponent(),
      new ServerComposerComponent(),
    ];

    this.editor = new NodeEditor('demo@0.2.0', this.container);
    /* https://github.com/retejs/connection-path-plugin */
    this.editor.use(ConnectionPlugin);
    /* DECOMMENTARE SE SI NECESSITA DELLE CURVATURE DELLE CONNESSINI AD ANGOLO */
    // this.editor.use(ConnectionPathPlugin, {
    //   //  transformer: () => ([x1, y1, x2, y2]) => [[x1, y1], [(x1+x2)/2, y1], [(x1+x2)/2, y2], [x2, y2]],
    //   // transformer: () => ([x1, y1, x2, y2]) => [[x1, y1],[x2, y2]],
    //   // curve: ConnectionPathPlugin.curveLinear
    //   curve: ConnectionPathPlugin.curveBundle
    // });
    this.editor.use(AngularRenderPlugin)//, { component: MyNodeComponent });
    this.editor.use(MinimapPlugin);
    this.editor.use(ContextMenuPlugin, {
      searchBar: false,
      components: {},
      items: {
        "Dump JSON": () => {
          this.printjson();
        },
        "Get nodes": () => {
          this.getNodes();
        }
      },
      allocate(component) {
        return null;
      },
      // rename(component) {
      //   return component.name;
      // }
    });

    const el: HTMLElement = document.getElementById('dragdrop');
    // console.log(el);
    this.editor.use(DockPlugin, {
      container: el,
      itemClass: "dock-item",
      plugins: [AngularRenderPlugin],
    });

    this.editor.use(AreaPlugin, {
      background: false, //righe
      snap: false,
      scaleExtent: { min: 0.1, max: 1 },
      translateExtent: { width: 5000, height: 4000 }
    })
    this.editor.use(AutoArrangePlugin, {
      // snap: {size: 64, dynamic: true},
      margin: { x: 400, y: 100 },
      depth: 0,
      vertical: false,
    })

    var _this = this;
    this.editor.on("nodeselected", (node) => { });
    this.editor.on('rendernode', ({ el, node }) => {
      el.addEventListener('dblclick', async () => {
        let title: string = node["data"]["title"].toString();
        // _this.showhidemoduleinfo(this.modules[title]);
        _this.hidemoduleinfo = !_this.hidemoduleinfo;
        // _this.nodeselected = _this.modules[title];
        // TODO: VEDERE A NODO SELEZIONATO IL CAMPIO COLORE
        // let conn: Connection[] = node.getConnections();
        // conn.forEach(element => {
        //   console.log("--->",element,element.data);
        // });
        AreaPlugin.zoomAt(_this.editor, _this.editor.selected.list);
        const { area, container } = this.editor.view; // read from Vue component data;
        area.translate(area.transform.x - 200, area.transform.y);
      });
    });

    // TODO: CONTROLLARE L'UNSELECTING
    this.editor.on("click", ({e,container}) => { 
      // console.log(e);
      // console.log("before unselect:",this.editor.selected.list);
      // this.editor.selected.list.forEach(element => {
      //   this.editor.selected.remove(element); 
      // });
      // console.log("after unselect:",this.editor.selected.list);
    });

    this.engine = new Engine('demo@0.2.0');

    this.components.map(c => {
      this.editor.register(c);
      this.engine.register(c);
    });

    this.editor.on("connectioncreated", connection => {
      setInterval(() => {
        let node = connection.output.node;
        this.editor.view.updateConnections({ node });
      }, 1);
    });



    this.editor.view.resize();
    this.editor.trigger('process');

    // to arrange all nodes
    this.editor.nodes.forEach(node => {
      this.editor.trigger("arrange", { node: node });
    });

    AreaPlugin.zoomAt(this.editor, this.editor.nodes);
    this.editor.on('zoom', ({ source }) => {
      return source !== 'dblclick';
    });

  }


  public showhidemoduleinfo(node) {
    this.hidemoduleinfo = !this.hidemoduleinfo;
    this.nodeselected["data"] = node;
    console.log("node -> ", this.nodeselected);

  }

  public showhidetheaterinfo() {
    this.hidetheaterinfo = !this.hidetheaterinfo;
  }

  public makezoom(k) {
    // k is declarend in (click) ad +- 0.1
    const { area, container } = this.editor.view; // read from Vue component data;
    const rect = area.el.getBoundingClientRect();
    const ox = (rect.left - container.clientWidth / 2) * k;
    const oy = (rect.top - container.clientHeight / 2) * k;
    area.zoom(area.transform.k + k, ox, oy, 'wheel');
  }

  public showallcomponent() {
    AreaPlugin.zoomAt(this.editor, this.editor.nodes);
  }

  public findElement(result) {
    this.nodetofind = result;
    console.log("finding ", this.nodetofind);

    let elementfound = this.editor.nodes.find(n => n["data"]["title"] === this.nodetofind)
    let elementpick = new Array(elementfound); // deve necessariamente trovarsi in un array...

    AreaPlugin.zoomAt(this.editor, elementpick);
    this.editor.selectNode(elementpick[0]);
  }

  public removeminimap() {
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

  public displayded(show:boolean){
    if(show)
      this.dedsb.nativeElement.style.visibility="visible";
    else
    this.dedsb.nativeElement.style.visibility="hidden";
  }

  public downloadJSON() {
    var theJSON = JSON.stringify(this.editor.toJSON());
    var uri = this.sanitizer.bypassSecurityTrustUrl("data:text/json;charset=UTF-8," + encodeURIComponent(theJSON));
    this.downloadJsonHref = uri;
  }

  public async arrangenodes() {
    this.editor.nodes.forEach(async node => {
      await node.update()
      this.editor.trigger("arrange", { node: node });
    });
  }

  public activatetab(num) {
    for (var i = 1; i <= 3; i++) {
      var x = "a" + i;
      var el = document.getElementById(x);
      // console.log("-->",x,el);
      if (i === num) {
        this.activetab = num;
        el.setAttribute("aria-selected", "true");
        el.classList.add("active");
      }
      else {
        el.setAttribute("aria-selected", "false");
        el.classList.remove("active");
      }
    }

  }

  public printjson() {
    console.log(this.editor.toJSON());
    console.log(JSON.stringify(this.editor.toJSON()));
  }

  public getNodes(): Object[] {
    var x = this.editor.toJSON();
    var z = [];
    for (let key in x) {
      let value = x[key];
      console.log(value);
      z.push(value);
    }
    return z;
  }


  public delay(ms: number) {
    // console.log("start -> delay");
    return new Promise(resolve => setTimeout(resolve, ms));
  }

}
