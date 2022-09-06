import { Component, Input, Output, Node } from 'rete';
import { _Socket } from '../../../sockets/socket';
import { _Control } from '../../../controls/control';
import { AngularComponent, AngularComponentData } from 'rete-angular-render-plugin';
import { HostComponent } from '../../../nodes/rete-nodes/host/host.component'
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data';
import {  reteBasicNodeInfo } from '../../reteBasic';
import { EnumNodeType } from 'src/app/models/appType';
// import { EnumNodeType } from 'src/app/rete-settings/models/reteModelType';


export class ReteHostInfo extends reteBasicNodeInfo {
  os: string;
  flavorName: string;
  cpu: number | string;
  disk: number | string;
  ram: number | string;
  type: EnumNodeType.Host
}

export function getEmptyHostInfo(): ReteHostInfo {
  let x: ReteHostInfo = {
    os: "",
    Input: [],
    Output: [],
    name: "",
    type: EnumNodeType.Host,
    cpu: '',
    disk: '',
    ram: '',
    flavorName: ''
  };
  return x;
}


export class HostNode extends Component implements AngularComponent {

  data: AngularComponentData;

  constructor() {
    super(EnumNodeType.Host);
    this.data.render = 'angular';
    this.data.component = HostComponent;
  }

  async builder(node: Node) {
    if (Object.keys(node.data).length === 0) // fase di design -> esista ma è node.data = {} | fase di visual data != {}
      this.createNewNode(node)
    else
      this.valorizeNode(node)
    // const out1 = new Output('num', 'Number', numSocket);
    // node.addControl(new NumControl(this.editor, 'num')).addOutput(out1);
    // node.addControl(new NumControl(this.editor, 'Altro'));
  }

  createNewNode(node: Node) {
    let t = getEmptyHostInfo()
    node.data = {
      ...node.data,
      ...t
    }
    var o = ["port_out"];
    var ol = o.length;

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
      var out = new Output(key, title, socket, true);
      node.addOutput(out);
    }
  }

  worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs) {
    console.log("Worker - work", node, inputs, outputs);
  }

  created(node: Node) {
    console.log('created', node);
  }

  destroyed(node: Node) {
    console.log('destroyed', node);
  }



}