import { Component, Input, Output, Node } from 'rete';
import { _Socket } from '../../../sockets/socket';
import { _Control } from '../../../controls/control';
import { AngularComponent, AngularComponentData } from 'rete-angular-render-plugin';
import { NetworkComponent } from './network.component';
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data';
import {  reteBasicNodeInfo } from '../../reteBasic';
import { EnumNodeType, InterfacePortType } from 'src/app/models/appType';

export class ReteNetworkInfo extends reteBasicNodeInfo {
  type: EnumNodeType.Network;
  externalInterfaceName: string;
  externalInterfaceType: InterfacePortType;
}

export function getEmptyNetworkInfo():ReteNetworkInfo {
  let x: ReteNetworkInfo = {
    Input: [],
    Output: [],
    name: "",
    type: EnumNodeType.Network,
    externalInterfaceName: '',
    externalInterfaceType: undefined
  };
  return x;

}

export class NetworkNode extends Component implements AngularComponent {

  data: AngularComponentData;

  constructor() {
    super(EnumNodeType.Network);
    this.data.render = 'angular';
    this.data.component = NetworkComponent;
  }

  async builder(node: Node) {
    if (Object.keys(node.data).length === 0) // fase di design -> esista ma è node.data = {} | fase di visual data != {}
      this.createNewNode(node)
    else
      this.valorizeNode(node)
  }

  createNewNode(node: Node) {
    let t = getEmptyNetworkInfo()
    node.data = {
      ...node.data,
      ...t
    }
    var i = ["subnet"];
    var il = i.length;

    for (let index = 0; index < il; index++) {
      var key = i[index]
      var title = i[index]
      var socket = _Socket;
      var inp = new Input(key, title, socket, false);
      node.addInput(inp);
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


  created(node) {
    console.log('created', node);
  }

  destroyed(node) {
    console.log('destroyed', node);
  }


}