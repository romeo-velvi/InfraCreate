import { StaticValue, InterfacePortType, ModuleType1, ModuleType2 } from "src/app/models/appType";
import { getEmptyHostInfo, ReteHostInfo } from "src/app/rete-settings/nodes/rete-nodes/host/hostNode";
import { ReteNetworkInfo, getEmptyNetworkInfo } from "src/app/rete-settings/nodes/rete-nodes/network/networkNode";
import { getEmptySubnetInfo, ReteSubnetInfo } from "src/app/rete-settings/nodes/rete-nodes/subnet/subnetNode";
import { ReteMirroringModuleInstanceInfo, getEmptyReteMirroringModuleInstanceInfo } from "src/app/rete-settings/nodes/rete-modules/mirroringModuleInstance/mirroringModuleInstanceNode";
import { getEmptyReteTheaterInternalServiceModuleInstanceInfo, ReteTheaterInternalServiceModuleInstanceInfo } from "src/app/rete-settings/nodes/rete-modules/theaterInternalServiceModuleInstance/theaterInternalServiceModuleInstanceNode";
import { getEmptyReteTheaterModuleInstanceInfo, ReteTheaterModuleInstanceInfo } from "src/app/rete-settings/nodes/rete-modules/theaterModuleInstance/theaterModuleInstanceNode";
import { SimpleModuleApplication, ModuleInstance } from "../../modelsApplication/applicationModels";
import { HostModuleDTO } from "../../modelsDTO/hostDTO";
import { ModuleInstanceDTO, ModuleNetworkInterfaceDTO } from "../../modelsDTO/moduleDTO";
import { SubnetDTO } from "../../modelsDTO/networkDTO";

export class ModuleNodeTypeToRete {
    Host: ReteHostInfo = getEmptyHostInfo()
    Subnet: ReteSubnetInfo = getEmptySubnetInfo()
    Network: ReteNetworkInfo = getEmptyNetworkInfo()
}
export class TheaterNodeTypeToRete {
    TheaterModuleInstance: ReteTheaterModuleInstanceInfo = getEmptyReteTheaterModuleInstanceInfo()
    TheaterInternalServiceModuleInstance: ReteTheaterInternalServiceModuleInstanceInfo = getEmptyReteTheaterInternalServiceModuleInstanceInfo()
    MirroringModuleInstance: ReteMirroringModuleInstanceInfo = getEmptyReteMirroringModuleInstanceInfo()
    VirtualServerModuleInstance: ReteMirroringModuleInstanceInfo = getEmptyReteMirroringModuleInstanceInfo() // todo
    ExternalVirtualMachine: ReteMirroringModuleInstanceInfo = getEmptyReteMirroringModuleInstanceInfo() // todo
    AutomaticSystem: ReteMirroringModuleInstanceInfo = getEmptyReteMirroringModuleInstanceInfo() // todo
    Border: ReteMirroringModuleInstanceInfo = getEmptyReteMirroringModuleInstanceInfo() // todo
}

export function createHost(name: string, hostDTO: HostModuleDTO): ReteHostInfo {
    var x: ReteHostInfo = getEmptyHostInfo()
    x.os = StaticValue.hostOS1;
    x.name = name;
    return x;
}
export function createSubnet(name: string, subnetDTO: SubnetDTO): ReteSubnetInfo {
    var x: ReteSubnetInfo = getEmptySubnetInfo()
    x.cidr = subnetDTO.cidr;
    x.isDhcp = subnetDTO.isDhcp ? true : false;
    x.version = subnetDTO.version
    x.name = name;
    x.Input.push(StaticValue.SubnetOutput) // add (only one) port for input
    return x;
}
export function createNetwork(name: string, moduleInterfaceDTO: ModuleNetworkInterfaceDTO[]): ReteNetworkInfo {
    var x: ReteNetworkInfo = getEmptyNetworkInfo()
    x.name = name;
    // controlla il tipo di network -> per le porte esterne:
    var mifdto: ModuleNetworkInterfaceDTO = moduleInterfaceDTO.find(el => el.network.name === name);
    // @check if has real external link
    if (!mifdto) {
        console.warn("External interface for ", name, "not found");
        return x;
    }
    x.externalInterfaceName = mifdto ? mifdto.nodeName : "No Exteranal Link";
    x.externalInterfaceType = InterfacePortType[mifdto.type];
    return x;
}
export function createModuleNode(name: string, moduleInstance: ModuleInstanceDTO, simpleModuleRoot: SimpleModuleApplication): ModuleInstance {
    let rete: ReteTheaterModuleInstanceInfo | ReteTheaterInternalServiceModuleInstanceInfo | ReteMirroringModuleInstanceInfo;
    if (ModuleType1[moduleInstance.type]) {
        rete = new TheaterNodeTypeToRete()[ModuleType1[moduleInstance.type]];
    }
    rete.name = name ? name : moduleInstance.properties.module + " instance";
    rete.module = moduleInstance.properties.module;
    rete.area = moduleInstance.properties.area;
    rete.sequence = moduleInstance.properties.sequence;
    rete.version = moduleInstance.properties.version;
    rete.description = moduleInstance.properties.description;
    rete.host_number = simpleModuleRoot.host_number;
    rete.subnet_number = simpleModuleRoot.subnet_number;
    rete.network_number = simpleModuleRoot.network_number;

    // controlla input/output per le porte dei nodi
    var input: string[] = [];
    var output: string[] = [];
    if (simpleModuleRoot.interfaces) // se il modulo dispone di interfacce
        simpleModuleRoot.interfaces.forEach((el) => {
            if (el.type === InterfacePortType.CONSUMER)
                input.push(el.nodeName);
            else if (el.type === InterfacePortType.PRODUCER)
                output.push(el.nodeName);
            else
                console.warn(" Problem with interface of ", el.nodeName);
        })
    rete.Input = input;
    rete.Output = output;

    let newNode: ModuleInstance = {
        ...moduleInstance,
        moduleInfo: simpleModuleRoot,
        rete: rete,
        topology: simpleModuleRoot.topology
    }

    //@check -> essendo che l'api non ritorna i valori del tipo del nodo (almeno quella che ritorna tutti i moduli del teatro [richiesta check fatta a maria])
    newNode.moduleInfo.type =
        ModuleType1[newNode.moduleInfo.type]
            ? ModuleType1[newNode.moduleInfo.type]
            : ModuleType1[newNode.type]
                ? ModuleType1[newNode.type]
                : ModuleType2[newNode.type]
    // che sia sysman.creo.... oppure EXERNAL_VIR... ritornerà TheaterModuleInstance etc...

    return newNode;

}
