import { getEmptyHostInfo, HostNode, ReteHostInfo } from "./host/hostNode";
import { getEmptyNetworkInfo, NetworkNode, ReteNetworkInfo } from "./network/networkNode";
import { getEmptySubnetInfo, ReteSubnetInfo, SubnetNode } from "./subnet/subnetNode";

/**
 * Enum utilizzato per indicare l'indice di riferimento degli array contenenti le informazioni.
 * @see {NodeComponents}
 */
export enum IndexNodeComponent {
    Host = 0,
    Subnet = 1,
    Network = 2
}

/**
 * Array utilizzato per assegnare i valori al component negli editor. 
 * Usato per processare e creare i vari nodi (rete-node).
 */
export const NodeComponents = [
    new HostNode(),
    new SubnetNode(),
    new NetworkNode()
];

/**
 * Elemento che assegna le variabili a funzioni che restituiscono una struttura inizializzata vuota dei singoli nodi.
 * @see {getEmptyHostInfo}
 * @see {getEmptySubnetInfo}
 * @see {getEmptyNetworkInfo}
 */
export class EmptyNodeInfo {
    static Host: ReteHostInfo = getEmptyHostInfo();
    static Subnet: ReteSubnetInfo = getEmptySubnetInfo();
    static Network: ReteNetworkInfo = getEmptyNetworkInfo();
}