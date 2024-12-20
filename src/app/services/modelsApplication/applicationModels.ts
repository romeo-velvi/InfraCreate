import { ReteHostInfo } from "src/app/rete-settings/nodes/rete-nodes/host/hostNode";
import { ReteNetworkInfo } from "src/app/rete-settings/nodes/rete-nodes/network/networkNode";
import { ReteSubnetInfo } from "src/app/rete-settings/nodes/rete-nodes/subnet/subnetNode";
import { ReteMirroringModuleInstanceInfo } from "src/app/rete-settings/nodes/rete-modules/mirroringModuleInstance/mirroringModuleInstanceNode";
import { ReteTheaterInternalServiceModuleInstanceInfo } from "src/app/rete-settings/nodes/rete-modules/theaterInternalServiceModuleInstance/theaterInternalServiceModuleInstanceNode";
import { ReteTheaterModuleInstanceInfo } from "src/app/rete-settings/nodes/rete-modules/theaterModuleInstance/theaterModuleInstanceNode";
import { FlavorBasicInfo } from "../modelsDTO/falvorDTO";
import { HostModuleDTO } from "../modelsDTO/hostDTO";
import { ModuleNetworkInterfaceDTO, ModuleInstancePropertiesDTO, SimpleModuleDTO, TheaterInstancePropertiesDTO, ModuleInstanceDTO, ModuleDTO, SimpleAreaDTO, AreaDTO } from "../modelsDTO/moduleDTO";
import { TheaterDTO } from "../modelsDTO/theaterDTO";


export interface CommonModule {
    interfaces: ModuleNetworkInterfaceDTO[]
    hosts: HostModuleDTO[]
    host_number: number
    subnet_number: number
    network_number: number
    topology: NodeTopologyElement
}


/**
 * Classe contenente gli attributi utilizzati per le operazioni che coinvolgono i moduli.
 * ps. Questa struttura è prettamente utilizzata nella chiamata relativa al singolo modulo.
 */
export class ModuleApplication extends ModuleDTO implements CommonModule {
    imports: string[] // perchè nell'export yaml è previsto
    interfaces: ModuleNetworkInterfaceDTO[]
    hosts: HostModuleDTO[]
    host_number: number
    subnet_number: number
    network_number: number
    topology: NodeTopologyElement
    // serve per validare il json risultante dal parsing del theaterApplication
    validateObject?: string = "module";
}
// PER IMPLEMENTAZIONI FUTURE, PER COERENZA, PRENDERE DIRETTAMENTE I SINGOLI NODI DALLA CHIAMATA ESCLUSIVA E NON DA QUELLA CHE RESTITUISCE TUTTI I TEATRI
/**
 * Classe contenente gli attributi utilizzati per le operazioni che coinvolgono i moduli.
 * ps. Questa struttura è prettamente utilizzata nella chiamata che prende tutti i moduli del teatro.
 */
export class SimpleModuleApplication extends SimpleModuleDTO implements CommonModule {
    interfaces: ModuleNetworkInterfaceDTO[]
    hosts: HostModuleDTO[]
    host_number: number
    subnet_number: number
    network_number: number
    topology: NodeTopologyElement
}


export class ReteConnection {
    from: string;
    port_src: string;
    to: string;
    port_dst: string;
}

export interface TopologyList {
    rete: any;
    topology?: TopologyElement
}
export class TopologyElement {
    elements: { [name: string]: any };
    connection: ReteConnection[]
}

// apptype module topology

export class NodeTopologyElement implements TopologyElement {
    elements: { [hostName: string]: ReteHostInfo | ReteSubnetInfo | ReteNetworkInfo };
    connection: ReteConnection[]
}

export interface ModuleTopology extends TopologyList {
    rete: ReteMirroringModuleInstanceInfo | ReteTheaterInternalServiceModuleInstanceInfo | ReteTheaterModuleInstanceInfo
    topology: NodeTopologyElement;
}

export class ModuleInstance extends ModuleInstanceDTO implements ModuleTopology {
    // moduleTopology data
    rete: ReteTheaterModuleInstanceInfo | ReteTheaterInternalServiceModuleInstanceInfo | ReteMirroringModuleInstanceInfo;
    topology: NodeTopologyElement;
    // other data
    moduleInfo: SimpleModuleApplication
}

// apptype theater theater

export interface TheaterTopology extends TopologyElement {
    elements: { [hostName: string]: ModuleInstance };
    connection: ReteConnection[];
}

export class TheaterApplication extends TheaterDTO implements TheaterTopology {
    // theaterTopology data
    elements: { [hostName: string]: ModuleInstance; };
    connection: ReteConnection[];
    // other data
    properties: TheaterInstancePropertiesDTO;
    topology: TheaterTopology;
    // serve per validare il json risultante dal parsing del theaterApplication
    validateObject?: string = "theater";
}

export class AreaApplication extends AreaDTO {
    color?: string;
}
export class AreaColorDTO extends SimpleAreaDTO {
    color: string;
}


export class FlavorApplication extends FlavorBasicInfo {
    flavorName: string;
}