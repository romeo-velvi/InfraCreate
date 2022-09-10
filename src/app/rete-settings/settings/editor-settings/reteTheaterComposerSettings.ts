import { Engine, NodeEditor, Node, Output as or, Input as ir } from "rete";
import ConnectionPlugin from 'rete-connection-plugin';
import ContextMenuPlugin from 'rete-context-menu-plugin';
import { AngularRenderPlugin } from 'rete-angular-render-plugin';
import AreaPlugin from 'rete-area-plugin';
import MinimapPlugin from 'rete-minimap-plugin';
import AutoArrangePlugin from 'rete-auto-arrange-plugin'
import Vue from 'vue/dist/vue.esm';
import { _Socket } from '../../sockets/socket';
import HistoryPlugin from 'rete-history-plugin';

/**
 * Classe che ha lo scopo di eseguire i dovuti settaggi all'ambiente di rete.
 * Questa riguarda la parte di ReteTheaterComposer
 */
export class ReteTheaterComposerSettings {
    public container = null;
    public editor: NodeEditor = null;
    public components = null;
    public engine: Engine = null;
    public nodeSelected: any = {};


    /**
     * Costruttore di ReteTheaterComposerSettings
     * @param container 
     * @param edito 
     * @param components 
     * @param engine 
     */
    constructor(container: any, edito: NodeEditor, components: any, engine: Engine) {
        this.container = container;
        this.editor = edito;
        this.components = components;
        this.engine = engine;
    }


    /**
     * Funzione che, una volta richiamata, setta l'editor i dovuti plugin.
     */
    editorUSE() {

        this.editor.use(ConnectionPlugin);

        this.editor.use(AngularRenderPlugin)//, { component: MyNodeComponent });

        this.editor.use(MinimapPlugin, { Vue });

        this.editor.use(HistoryPlugin, { keyboard: true });

        this.editor.use(ContextMenuPlugin, {
            searchBar: false,
            components: {},
            items: {
                "Undo": () => {
                    this.editor.trigger("undo");
                },
                "Redo": () => {
                    this.editor.trigger("redo");
                },
                "Show all nodes": () => {
                    AreaPlugin.zoomAt(this.editor, this.editor.nodes);
                },
                "Editor": () => {
                    console.log(JSON.stringify(this.editor.toJSON()));
                },
                "Nodes": () => {
                    var x = this.editor.toJSON();
                    var z = [];
                    for (let key in x) {
                        let value = x[key];
                        z.push(value);
                    }
                    return z;
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

}
