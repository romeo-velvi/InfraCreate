import { Component, Input, Output, Node } from 'rete';
import { _Socket } from '../../../sockets/socket';
import { _Control } from '../../../controls/control';
import { AngularComponent, AngularComponentData } from 'rete-angular-render-plugin';
import { SubnetComponent } from './subnet.component';
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data';
import {  reteBasicNodeInfo } from '../../reteBasic';
import { EnumNodeType } from 'src/app/models/appType';
// import { EnumNodeType } from 'src/app/rete-settings/models/reteModelType';


export class ReteSubnetInfo extends reteBasicNodeInfo {
  cidr: string;
  version: string | number;
  isDhcp: string | boolean;
  type: EnumNodeType.Subnet;
}

export function getEmptySubnetInfo(): ReteSubnetInfo {
  let x: ReteSubnetInfo = {
    cidr: "",
    Input: [],
    Output: [],
    name: "",
    type: EnumNodeType.Subnet,
    version: "",
    isDhcp: ''
  };
  return x;
}



export class SubnetNode extends Component implements AngularComponent {

  data: AngularComponentData;

  constructor() {
    super(EnumNodeType.Subnet);
    this.data.render = 'angular';
    this.data.component = SubnetComponent;
  }

  async builder(node: Node) {
    if (Object.keys(node.data).length === 0) // fase di design -> esista ma è node.data = {} | fase di visual data != {}
      this.createNewNode(node)
    else
      this.valorizeNode(node)
  }

  createNewNode(node: Node) {
    let t = getEmptySubnetInfo()
    node.data = {
      ...node.data,
      ...t
    }
    var i = ["host_in"];
    var o = ["contained_in"];
    var il = i.length, ol = o.length;

    for (let index = 0; index < il; index++) {
      var key = i[index]
      var title = i[index]
      var socket = _Socket;
      var inp = new Input(key, title, socket, true);
      node.addInput(inp);
    }

    for (let index = 0; index < ol; index++) {
      var key = o[index]
      var title = o[index]
      var socket = _Socket;
      var out = new Output(key, title, socket, true);
      node.addOutput(out);
    }
  }

  valorizeNode(node: Node) {
    var i: any = node.data['Input'];
    var o: any = node.data['Output'];
    var il = i.length;
    var ol = o.length;

    for (let index = 0; index < il; index++) {
      var key = i[index]
      var title = i[index]
      var socket = _Socket;
      var inp = new Input(key, title, socket, true);
      node.addInput(inp);
    }

    for (let index = 0; index < ol; index++) {
      var key = o[index]
      var title = o[index]
      var socket = _Socket;
      var out = new Output(key, title, socket, false); // solo una connession con un network
      node.addOutput(out);
    }
  }

  worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs) {
    console.log("Worker - work", node, inputs, outputs);
  }

  created(node) {
    console.log('created', node);
  }

  destroyed(node) {
    console.log('destroyed', node);
  }


}



// import { Component, Output } from 'rete';
// import { numSocket } from '../sockets';
// import { NumControl } from '../controls/number-control';
// import { MyNodeComponent2 } from './node2/node.component';

// export class NumComponent extends Component {

//   constructor() {
//     super('Number');

//   }

//   builder(node) {
//     const out1 = new Output('num', 'Number', numSocket);
//     return node.addControl(new NumControl(this.editor, 'num')).addOutput(out1);
//   }

//   worker(node, inputs, outputs) {
//     outputs['num'] = node.data.num;
//   }
// }
