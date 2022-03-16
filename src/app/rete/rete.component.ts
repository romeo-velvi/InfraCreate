import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

import { NodeEditor, Engine } from 'rete';
import ConnectionPlugin from 'rete-connection-plugin';
import ContextMenuPlugin from 'rete-context-menu-plugin';
import { AngularRenderPlugin } from 'rete-angular-render-plugin';
import AreaPlugin from 'rete-area-plugin';
import MinimapPlugin from 'rete-minimap-plugin';
import AutoArrangePlugin from 'rete-auto-arrange-plugin'


import { NumComponent } from './components/number-component';
import { AddComponent } from './components/add-component';
import { OthComponent } from './components/other-component';


@Component({
  selector: 'app-rete',
  templateUrl: './rete.component.html',
  styleUrls: ['./rete.component.css'],
})

export class ReteComponent implements AfterViewInit {

  @ViewChild('nodeEditor', { static: true }) el: ElementRef;

  container = null;
  editor: NodeEditor = null;
  components = null;
  engine = null;

  async ngAfterViewInit() {

    this.container = this.el.nativeElement;

    // stored all node-types
    this.components = [
      new NumComponent(),
      new OthComponent(),
      new AddComponent(),
    ];

    this.editor = new NodeEditor('demo@0.2.0', this.container);

    this.editor.use(ConnectionPlugin);
    this.editor.use(AngularRenderPlugin)//, { component: MyNodeComponent });
    this.editor.use(MinimapPlugin);
    this.editor.use(ContextMenuPlugin, {
      searchBar: false,
      items: {
        "Dump JSON": () => {
          console.log(this.editor.toJSON());
        }
      },
      allocate(component) {
        return ["+ New"];
      },
      rename(component) {
        return component.name;
      }
    });
    this.editor.use(AreaPlugin, {
      background: true, //righe
      snap: false,
      scaleExtent: { min: 0.1, max: 1 },
      translateExtent: { width: 5000, height: 4000 }
    })
    this.editor.use(AutoArrangePlugin, {
      margin: { x: 80, y: 240 },
      depth: 0,
      vertical: false,
    })



    this.engine = new Engine('demo@0.2.0');

    this.components.map(c => {
      this.editor.register(c);
      this.engine.register(c);
    });


    await this.addNodes();


    this.editor.on(
      [
        'process',
        'nodecreated',
        'noderemoved',
        'connectioncreated',
        'connectionremoved'
      ],
      (
        async () => {
          await this.engine.abort();
          await this.engine.process(this.editor.toJSON());
        }
      ) as any
    );


    this.editor.on("connectioncreated", connection => {
      setInterval(() => {
        let node = connection.output.node;
        this.editor.view.updateConnections({ node });
      }, 1);
    });

    this.editor.on(["connectioncreated"], connection => {
      setInterval(() => {
        let node = connection.output.node;
        this.editor.view.updateConnections({ node });
      }, 1);
    });


    this.editor.view.resize();
    this.editor.trigger('process');

    // to arrange all nodes
    this.editor.nodes.forEach(node => {
      //console.log(node);
      this.editor.trigger("arrange", { node: node });
    });


    // AreaPlugin.zoomAt(editor, [n3]);


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

  public async addNodes() {
    try {

      const n1 = await this.components[0].createNode({ num: 2 });
      const n2 = await this.components[1].createNode({title:"nodotipo2", Output:3, Input:6});
      const n3 = await this.components[2].createNode();

      // insert name
      n1.data['title'] = "nodotipo1"
      n3.data['title'] = "nodotipo3";

      // n1.position = [80, 200];
      // n2.position = [80, 400];
      // n3.position = [500, 240];

      this.editor.addNode(n1);
      this.editor.addNode(n2);
      this.editor.addNode(n3);

      this.editor.connect(n1.outputs.get('num'), n3.inputs.get('num1'));
      this.editor.connect(n2.outputs.get('num'), n3.inputs.get('num2'));


    } catch (error) {
      console.log(error);
    }
  }
}
