import { Component, Input, Output, Node } from 'rete';
import { _Socket } from '../../../sockets/socket';
import { _Control } from '../../../controls/control';
import { AngularComponent, AngularComponentData } from 'rete-angular-render-plugin';
import { SubnetComponent } from './subnet.component';
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data';
import {  reteBasicNodeInfo } from '../../reteBasic';
import { EnumNodeType } from 'src/app/models/appType';

/**
 * Classe utilizzata per indicare il tipo di modulo SubnetNode.
 * @see {reteBasicModuleInfo}
 */
export class ReteSubnetInfo extends reteBasicNodeInfo {
  cidr: string;
  version: string | number;
  isDhcp: string | boolean;
  type: EnumNodeType.Subnet;
}

/**
 * Funzione dichiarata in SubnetNode. 
 * Essa ha lo scopo di generare una struttura dati empty.
 * Viene utilizzata in per instanziare un nodo del tipo di ritorno indicato senza dati.
 * @returns {ReteSubnetInfo}
 */
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


/**
 * Classe che rappresenta il nodo (rete-node) Subnet all'interno del canvas/editor di rete.
 */
export class SubnetNode extends Component implements AngularComponent {

  data: AngularComponentData;

  /**
   * Costruttore di SubnetNode
   */
  constructor() {
    super(EnumNodeType.Subnet);
    this.data.render = 'angular';
    this.data.component = SubnetComponent;
  }

  /**
   * Funzione richiamata in fase di costruzione del nodo (rete-node).
   * Controlla se bisogna instanziare il nodo oppure crearne uno nuovo:
   * - In fase di design, il nodo non ha dati, per cui bisogna crearne uno nuovo.
   * - In fase di visualizing, il nodo presenta dei dati, per cui va valorizzato il nodo.
   * @param node 
   */
  async builder(node: Node) {
    if (Object.keys(node.data).length === 0)
      this.createNewNode(node)
    else
      this.valorizeNode(node)
  }

  /**
   * Funzione che ha come scopo creare un nodo (rete-node).
   * In particolare gli assegna una struttura vuota.
   * @param node 
   */
  createNewNode(node: Node) {
    let t = getEmptySubnetInfo()
    node.data = {
      ...node.data,
      ...t
    }
  }

  /**
   * Funzione che ha come scopo la valorizzazione del nodo (rete-node) con i dati in suo possesso.
   * In quasta fase avviene anche la fase iniziale di instanziamento delle porte input/output.
   * @param node 
   */
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

  /**
   * Funzione richiamta per eseguire operazioni che conivolgono computazioni dei nodi.
   * Non sono necessari in questa versione.
   * @param node 
   * @param inputs 
   * @param outputs 
   */
  worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs) {
    console.log("Worker - work", node, inputs, outputs);
  }

  /**
   * Funzione richiamata una volta in nodo creato.
   * @param node 
   */
  created(node) {
    console.log('created', node);
  }

  /**
   * Funzione richiamata una volta in nodo cancellato.
   * @param node 
   */
  destroyed(node) {
    console.log('destroyed', node);
  }


}