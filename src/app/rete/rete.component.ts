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

import { NgxSpinnerService } from "ngx-spinner";


@Component({
  selector: 'app-rete',
  templateUrl: './rete.component.html',
  styleUrls: ['./rete.component.css'],
})

export class ReteComponent implements AfterViewInit {

  constructor(private spinner: NgxSpinnerService){
  }

  @ViewChild('nodeEditor', { static: true }) el: ElementRef;

  container = null;
  editor: NodeEditor = null;
  components = null;
  engine = null;


  async ngAfterViewInit() {

    await this.spinner.show()
    .then(
      async () =>{
        await this.delay(1000);
        // console.log("start 3")
        await this.StartApp();
      }
    )
    .then(
      async ()=>{
        // console.log("start 5")
        await this.spinner.hide();
      }
    )


  }


  async StartApp(){
    // console.log("start 4");
    
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


    // await this.addNodes();

    await this.stresstest(50);


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

    this.editor.view.resize();
    this.editor.trigger('process');

    // to arrange all nodes
    this.editor.nodes.forEach(node => {
      //console.log(node);
      this.editor.trigger("arrange", { node: node });
    });

    //AreaPlugin.zoomAt(editor, [n3]);
    console.log("end");
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

      // DATA info-node
      var infon1 = { title: "node-type2", Output: 2, Input: 3 }
      var infon2 = { title: "node-type3", Output: 3, Input: 6, type: 'Server' }
      var infon3 = { title: "node-type3-1", Output: 3, Input: 6, type: 'port' }
      // var infon3 = { title:"node-type1", Output:4, Input:9 }

      // Component creation (foreach module)
      const n1 = await this.components[0].createNode(infon1);
      const n2 = await this.components[1].createNode(infon2);
      const n3 = await this.components[1].createNode(infon3);
      const n4 = await this.components[2].createNode({ title: "nodotipo3" });

      /* 
      //insert name
      // n1.data['title'] = "nodotipo1";
      // n2.data['title'] = "nodotipo2";
      // n3.data['title'] = "nodotipo3";

      // n1.position = [80, 200];
      // n2.position = [80, 400];
      // n3.position = [500, 240];
      */

      // Insert into editor
      this.editor.addNode(n1);
      this.editor.addNode(n2);
      this.editor.addNode(n3);
      this.editor.addNode(n4);

      // Sempre prima che avvengano i collegamenti
      //Necessario per il path delle connessioni (altrimenti si fottono)
      this.editor.on("connectioncreated", connection => {
        setInterval(() => {
          let node = connection.output.node;
          this.editor.view.updateConnections({ node });
        }, 1);
      });

      // Create connection
      this.editor.connect(n2.outputs.get('output0'), n4.inputs.get('num2'));
      this.editor.connect(n2.outputs.get('output1'), n3.inputs.get('input1'));
      this.editor.connect(n1.outputs.get('output1'), n4.inputs.get('num1'));
      this.editor.connect(n3.outputs.get('output1'), n4.inputs.get('num2'));
      
      
    } catch (error) {
      console.log(error);
    }
  }
  

  public async stresstest(num:number){
    var a_node = [];
    for (let index = 0; index < num; index++) {
      var info = { title: "node-type3", Output: 3, Input: 6, type: 'Server' }
      a_node[index] = await this.components[1].createNode(info);
    }
    
    for (let index = 0; index < num; index++) {
      this.editor.addNode(a_node[index]);
    }

    this.editor.on("connectioncreated", connection => {
      setInterval(() => {
        let node = connection.output.node;
        this.editor.view.updateConnections({ node });
      }, 1);
    });

    for (let index = 1; index < a_node.length; index++) {
      var element1 = a_node[index];
      var element0 = a_node[index-1];
      this.editor.connect(element1.outputs.get('output1'), element0.inputs.get('input1'));
    }


  }

  public delay(ms: number) {
    // console.log("start -> delay");
    return new Promise(resolve => setTimeout(resolve, ms));
  }

}
