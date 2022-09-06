import { getEmptyHostInfo, HostNode, ReteHostInfo } from "./host/hostNode";
import { getEmptyNetworkInfo, NetworkNode, ReteNetworkInfo } from "./network/networkNode";
import { getEmptySubnetInfo, ReteSubnetInfo, SubnetNode } from "./subnet/subnetNode";


export enum IndexNodeComponent {
    Host = 0,
    Subnet = 1,
    Network = 2
}

export const NodeComponents = [
    new HostNode(),
    new SubnetNode(),
    new NetworkNode()
];

export class EmptyNodeInfo {
    static Host: ReteHostInfo = getEmptyHostInfo();
    static Subnet: ReteSubnetInfo = getEmptySubnetInfo();
    static Network: ReteNetworkInfo = getEmptyNetworkInfo();
}
