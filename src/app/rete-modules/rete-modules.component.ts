import { Component, AfterViewInit, ViewChild, ElementRef, Input } from '@angular/core';
import { NodeEditor, Engine } from 'rete';
import ConnectionPlugin from 'rete-connection-plugin';
import ContextMenuPlugin from 'rete-context-menu-plugin';
import { AngularRenderPlugin } from 'rete-angular-render-plugin';
import AreaPlugin from 'rete-area-plugin';
import MinimapPlugin from 'rete-minimap-plugin';
import AutoArrangePlugin from 'rete-auto-arrange-plugin'
import { NgxSpinnerService } from "ngx-spinner";
import { NumComponent } from '../rete/components/number-component';
import { AddComponent } from '../rete/components/add-component';
import { NodeComponent } from '../rete/components/node-component';


@Component({
  selector: 'app-rete-modules',
  templateUrl: './rete-modules.component.html',
  styleUrls: ['./rete-modules.component.sass']
})

export class ReteModulesComponent implements AfterViewInit {

  @ViewChild('nodeEditor', { static: true }) el: ElementRef;

  @Input() modules: any;
  @Input() theater: any;
  @Input() type: any; //per teatro e moduli

  container = null;
  editor: NodeEditor = null;
  components = null;
  engine = null;

  // for html dynamic part
  showside: boolean = true;
  hidemoduleinfo: boolean = false;
  nodeselected: any;

  constructor(private spinner: NgxSpinnerService) {
  }

  async ngAfterViewInit() {

    await this.spinner.show()
      .then(
        async () => {
          await this.delay(1000);
          // console.log("start 3")
          await this.StartApp();
        }
      )
      .then(
        async () => {
          // console.log("start 5")
          await this.spinner.hide();
        }
      )

  }


  async StartApp() {

    console.log("data passed: ", this.theater, this.modules);

    // console.log("start 4");

    this.container = this.el.nativeElement;

    // stored all node-types
    this.components = [
      new NodeComponent(),
      new NumComponent(),
      new AddComponent(),
    ];

    this.editor = new NodeEditor('demo@0.1.0', this.container);

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
      margin: { x: 400, y: 200 },
      depth: 1,
      vertical: false,
    })

    var _this = this;
    this.editor.on("selectnode", (node) => {
      console.log("select node ->", node);
      var x = [];
      x["title"] = node.node["data"]["title"].toString();
      x["area"] = node.node["data"]["area"];
      x["type"] = node.node["data"]["type"];
      _this.showhidemoduleinfo(x);
    }
    );

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


    await this.stresstest(20);




    // this.editor.on(
    //   [
    //     'process',
    //     'nodecreated',
    //     'noderemoved',
    //     'connectioncreated',
    //     'connectionremoved'
    //   ],
    //   (
    //     async () => {
    //       await this.engine.abort();
    //       await this.engine.process(this.editor.toJSON());
    //     }
    //   ) as any
    // );

    // to arrange all nodes
    this.editor.nodes.forEach(node => {
      this.editor.trigger("arrange", { node: node });
    });

    this.editor.view.resize();
    this.editor.trigger('process');



    //AreaPlugin.zoomAt(editor, [nodo_a_caso]);
  }


  public showhidemoduleinfo(node) {
    this.hidemoduleinfo = !this.hidemoduleinfo;
    this.nodeselected = node;
    console.log("node -> ", this.nodeselected);
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

    var nodes = [];
    await Promise.all(
      Object.entries(this.modules).map(async ([key, value]) => {
        nodes[key] = await this.components[0].createNode(value["for_retejs"]);
      })
    );

    console.log(nodes);

    Object.entries(nodes).map(async ([key, value]) => {
      this.editor.addNode(value);
    })


    Object.entries(this.theater["for_retejs"]["modules_connection"]).map(async ([key, value]) => {
      try {
        if (nodes[value["to"]] !== undefined && nodes[value["from"]] !== undefined) {
          this.editor.connect(nodes[value["to"]].outputs.get(value["port_dst"]), nodes[value["from"]].inputs.get(value["port_src"]));
        }
      } catch (e) {
        console.log(
          "PROBLEM: ", e, "\ntry",
          " connect ",
          value["from"], " port ", value["port_src"], " data: ", nodes[value["from"]],
          " to ",
          value["to"], " port ", value["port_dst"], " data: ", nodes[value["to"]],
        );
        // console.log(e);
      }
    })

    /*
    // // Create connection
    // this.editor.connect(n2.outputs.get('output0'), n4.inputs.get('num2'));
    // this.editor.connect(n2.outputs.get('output1'), n3.inputs.get('input1'));
    // this.editor.connect(n1.outputs.get('output1'), n4.inputs.get('num1'));
    // this.editor.connect(n3.outputs.get('output1'), n4.inputs.get('num2'));
    */

  }







  public async stresstest(num: number) {

    this.editor.on("connectioncreated", connection => {
      setInterval(() => {
        let node = connection.output.node;
        this.editor.view.updateConnections({ node });
      }, 1);
    });

    var a_node = [];
    for (let index = 0; index < num; index++) {
      var info = { title: "node-name->" + index.toString(), Output: ["output0", "output1", "output2"], Input: ["intput0", "input1", "input2"], type: 'Server' }
      a_node[index] = await this.components[0].createNode(info);
    }

    for (let index = 0; index < num; index++) {
      this.editor.addNode(a_node[index]);
    }

    // this.editor.on("connectioncreated", connection => {
    //   setInterval(() => {
    //     let node = connection.output.node;
    //     this.editor.view.updateConnections({ node });
    //   }, 1);
    // });

    for (let index = 1; index < a_node.length; index++) {
      var element1 = a_node[index];
      var element0 = a_node[index - 1];
      this.editor.connect(element1.outputs.get('output1'), element0.inputs.get('input1'));
    }



  }

  public delay(ms: number) {
    // console.log("start -> delay");
    return new Promise(resolve => setTimeout(resolve, ms));
  }

}
