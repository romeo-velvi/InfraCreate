import { Component, Input, Output, Node } from 'rete';
import { _Socket } from '../../../sockets/socket';
import { _Control } from '../../../controls/control';
import { AngularComponent, AngularComponentData } from 'rete-angular-render-plugin';
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data';
import { TheaterModuleInstanceComponent } from './theaterModuleInstance.component';
import {  reteBasicModuleInfo } from '../../reteBasic';
import { EnumModuleType } from 'src/app/models/appType';

/**
 * Classe utilizzata per indicare il tipo di modulo MirroringModuleInstanceNode.
 * @see {reteBasicModuleInfo}
 */
export class ReteTheaterModuleInstanceInfo extends reteBasicModuleInfo {
  type: EnumModuleType.TheaterModuleInstance;
}

/**
 * Funzione dichiarata in TheaterModuleInstanceNode. 
 * Essa ha lo scopo di generare una struttura dati empty.
 * Viene utilizzata in per instanziare un nodo del tipo di ritorno indicato senza dati.
 * @returns {ReteTheaterModuleInstanceInfo}
 */
export function getEmptyReteTheaterModuleInstanceInfo(): ReteTheaterModuleInstanceInfo {
  let x: ReteTheaterModuleInstanceInfo = {
    Input: [],
    Output: [],
    description: "",
    name: "",
    type: EnumModuleType.TheaterModuleInstance,
    host_number: 0,
    network_number: 0,
    subnet_number: 0,
    area: '',
    module: '',
    version: '',
    sequence: '',
    consumer_interfaces_link: []
  };
  return x;

}

/**
 * Classe che rappresenta il modulo (rete-node) TheaterModuleInstance all'interno del canvas/editor di rete.
 */
export class TheaterModuleInstanceNode extends Component implements AngularComponent {

  data: AngularComponentData;

    /**
   * Costruttore di MirroringModuleInstanceNode
   */
  constructor() {
    super(EnumModuleType.TheaterModuleInstance);
    this.data.render = 'angular';
    this.data.component = TheaterModuleInstanceComponent;
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
    let t = getEmptyReteTheaterModuleInstanceInfo()
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
      var out = new Output(key, title, socket, true);
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
  created(node: Node) {
    console.log('created', node);
  }

  /**
   * Funzione richiamata una volta in nodo cancellato.
   * @param node 
   */
  destroyed(node: Node) {
    console.log('destroyed', node);
  }


}