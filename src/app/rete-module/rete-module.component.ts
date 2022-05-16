import { Component, AfterViewInit, ViewChild, ElementRef, Input, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { NodeEditor, Engine } from 'rete';
import ConnectionPlugin from 'rete-connection-plugin';
import { AngularRenderPlugin } from 'rete-angular-render-plugin';
import ContextMenuPlugin from 'rete-context-menu-plugin';
import AreaPlugin from 'rete-area-plugin';
import AutoArrangePlugin from 'rete-auto-arrange-plugin'
import { NodeModuleComponent } from './components/node-module-component';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-rete-modules',
  templateUrl: './rete-module.component.html',
  styleUrls: ['./rete-module.component.sass'],
  //changeDetection: ChangeDetectionStrategy.OnPush,
})

export class ReteModuleComponent implements AfterViewInit {

  @ViewChild('nodeEditor', { static: true }) el: ElementRef;

  @Input() module: any;

  container = null;
  editor: NodeEditor = null;
  components = null;
  engine = null;

  // for html dynamic part
  showside: boolean = true;
  hidemoduleinfo: boolean = false;
  nodeselected: any;

  constructor() {}

  async ngAfterViewInit() {

    // await this.spinner.show()
    //   .then(
    //     async () => {
    //       await this.delay(1000);
    //       // console.log("start 3")
    //       await this.StartApp();
    //     }
    //   )
    //   .then(
    //     async () => {
    //       // console.log("start 5")
    //       await this.spinner.hide();
    //     }
    //   )

    await this.StartApp();

  }


  async StartApp() {

    console.log("data passed----->: ", this.module);

    // console.log("start 4");

    this.container = this.el.nativeElement;

    // stored all node-types
    this.components = [
      new NodeModuleComponent(),
    ];

    this.editor = new NodeEditor('demo@0.1.0', this.container);

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
        }
      },
      allocate(component) {
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


    // await this.stresstest(20);
    await this.addNodes();



    // to arrange all nodes
    this.editor.nodes.forEach(node => {
      this.editor.trigger("arrange", { node: node });
    });

    this.editor.view.resize();
    this.editor.trigger('process');



    AreaPlugin.zoomAt(this.editor, this.editor.nodes);
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
    await Promise.all( // per host
      Object.entries(this.module["topology"]["host"]).map(async ([key, value]) => {
        nodes[key] = await this.components[0].createNode(value["for_retejs"]);
      })
    );

    await Promise.all( // per network
      Object.entries(this.module["topology"]["network"]).map(async ([key, value]) => {
        nodes[key] = await this.components[0].createNode(value["for_retejs"]);
      })
    );

    await Promise.all( // per subnet
      Object.entries(this.module["topology"]["subnet"]).map(async ([key, value]) => {
        nodes[key] = await this.components[0].createNode(value["for_retejs"]);
      })
    );

    await Promise.all(
      Object.entries(nodes).map(async ([key, value]) => {
        this.editor.addNode(value);
      })
    );

    await Promise.all(
      Object.entries(this.module["topology"]["host_connection"]).map(async ([key, value]) => { // connection host-subnet
        try {
          if (nodes[value["to"]] !== undefined && nodes[value["from"]] !== undefined) {
            // this.editor.connect(nodes[value["to"]].outputs.get(value["port_dst"]), nodes[value["from"]].inputs.get(value["port_src"]));
            this.editor.connect(nodes[value["from"]].outputs.get(value["port_src"]), nodes[value["to"]].inputs.get(value["port_dst"]));
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
    );

    Object.entries(this.module["topology"]["subnet_connection"]).map(async ([key, value]) => { // connection subnet-net
      try {
        if (nodes[value["to"]] !== undefined && nodes[value["from"]] !== undefined) {
          // this.editor.connect(nodes[value["to"]].outputs.get(value["port_dst"]), nodes[value["from"]].inputs.get(value["port_src"]));
          this.editor.connect(nodes[value["from"]].outputs.get(value["port_src"]), nodes[value["to"]].inputs.get(value["port_dst"]));
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

    console.log(nodes);

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
