import { Engine, NodeEditor, Node, Output as or, Input as ir } from "rete";
import ConnectionPlugin from 'rete-connection-plugin';
import ConnectionPathPlugin from 'rete-connection-path-plugin';
import ContextMenuPlugin from 'rete-context-menu-plugin';
import { AngularRenderPlugin } from 'rete-angular-render-plugin';
import AreaPlugin from 'rete-area-plugin';
import MinimapPlugin from 'rete-minimap-plugin';
import AutoArrangePlugin from 'rete-auto-arrange-plugin'
import DockPlugin from 'rete-dock-plugin';
import Vue from 'vue/dist/vue.esm';
import { _Socket } from '../../sockets/socket';
import ReadonlyPlugin from 'rete-readonly-plugin';
import HistoryPlugin from 'rete-history-plugin';
import { ReteEditor } from "../SettingsDTO";

export class ReteModuleVisualizerSettings implements ReteEditor {
  container = null;
  editor: NodeEditor = null;
  components = null;
  engine: Engine = null;
  nodeSelected: any = {};

  constructor(container: any, edito: NodeEditor, components: any, engine: Engine) {
    this.container = container;
    this.editor = edito;
    this.components = components;
    this.engine = engine;
  }

  editorUSE() {

    this.editor.use(ConnectionPlugin);

    this.editor.use(AngularRenderPlugin)//, { component: MyNodeComponent });

    this.editor.use(MinimapPlugin, { Vue });

    this.editor.use(HistoryPlugin, { keyboard: true });

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
      allocate(component: any) {
        return null;
      },
      // rename(component) {
      //   return component.name;
      // }
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
  }

  editorUSE_simple() {

    this.editor.use(ConnectionPlugin);
    this.editor.use(AngularRenderPlugin)//, { component: MyNodeComponent });
    this.editor.use(ContextMenuPlugin, {
      searchBar: false,
      components: {},
      items: {
        "Dump JSON": () => {
          this.printjson();
        },
        "Get nodes": () => {
          this.getNodes();
        },
        "Show all modules": () => {
          this.showAllNodes();
        }
      },
      allocate(component: any) {
        return null;
      },
      // rename(component) {
      //   return component.name;
      // }
    });


    this.editor.use(AreaPlugin, {
      background: false, //righe
      snap: false,
      scaleExtent: { min: 0.1, max: 1 },
      translateExtent: { width: 5000, height: 4000 }
    })
    this.editor.use(AutoArrangePlugin, {
      margin: { x: 400, y: 200 },
      depth: 1,
      vertical: false,
    })
  }

  printjson() {
    console.log(JSON.stringify(this.editor.toJSON()));
  }
  getNodes(): Object[] {
    var x = this.editor.toJSON();
    var z = [];
    for (let key in x) {
      let value = x[key];
      z.push(value);
    }
    return z;
  }
  showAllNodes() {
    AreaPlugin.zoomAt(this.editor, this.editor.nodes);
  }
}
