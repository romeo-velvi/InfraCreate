import { StaticValue, InterfacePortType, ModuleType1, ModuleType2 } from "src/app/models/appType";
import { getEmptyHostInfo, ReteHostInfo } from "src/app/rete-settings/nodes/rete-nodes/host/hostNode";
import { ReteNetworkInfo, getEmptyNetworkInfo } from "src/app/rete-settings/nodes/rete-nodes/network/networkNode";
import { getEmptySubnetInfo, ReteSubnetInfo } from "src/app/rete-settings/nodes/rete-nodes/subnet/subnetNode";
import { ReteMirroringModuleInstanceInfo } from "src/app/rete-settings/nodes/rete-modules/mirroringModuleInstance/mirroringModuleInstanceNode";
import { ReteTheaterInternalServiceModuleInstanceInfo } from "src/app/rete-settings/nodes/rete-modules/theaterInternalServiceModuleInstance/theaterInternalServiceModuleInstanceNode";
import { ReteTheaterModuleInstanceInfo } from "src/app/rete-settings/nodes/rete-modules/theaterModuleInstance/theaterModuleInstanceNode";
import { SimpleModuleApplication, ModuleInstance } from "../../modelsApplication/applicationModels";
import { HostModuleDTO } from "../../modelsDTO/hostDTO";
import { ModuleInstanceDTO, ModuleNetworkInterfaceDTO } from "../../modelsDTO/moduleDTO";
import { SubnetDTO } from "../../modelsDTO/networkDTO";
import { EmptyModuleInfo } from "src/app/rete-settings/nodes/rete-modules/export-rete-modules";

/**
 * Funzione che esegue il settaggio iniziale per i nodi host.
 * @param name 
 * @param hostDTO 
 * @returns {ReteHostInfo}
 */
export function createHost(name: string, hostDTO: HostModuleDTO): ReteHostInfo {
    var x: ReteHostInfo = getEmptyHostInfo()
    x.os = StaticValue.hostOS1;
    x.name = name;
    return x;
}
/**
 * Funzione che esegue il settaggio iniziale per i nodi subnet.
 * @param name 
 * @param subnetDTO 
 * @returns {ReteSubnetInfo}
 */
export function createSubnet(name: string, subnetDTO: SubnetDTO): ReteSubnetInfo {
    var x: ReteSubnetInfo = getEmptySubnetInfo()
    x.cidr = subnetDTO.cidr;
    x.isDhcp = subnetDTO.isDhcp ? true : false;
    x.version = subnetDTO.version
    x.name = name;
    x.Input.push(StaticValue.SubnetOutput) // add (only one) port for input
    return x;
}
/**
 * Funzione che esegue il settaggio iniziale per i nodi network.
 * @param name 
 * @param moduleInterfaceDTO 
 * @returns {ReteNetworkInfo}
 */
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
/**
 * Funzione che esegue il settaggio iniziale per i moduli del teatro.
 * La funzione controlla prima di che tipo è il modulo, prima di eseguire le dovute assegnazioni. 
 * @param name 
 * @param moduleInstance 
 * @param simpleModuleRoot
 * @returns {ModuleInstance}
 */
export function createModuleNode(name: string, moduleInstance: ModuleInstanceDTO, simpleModuleRoot: SimpleModuleApplication): ModuleInstance {
    let rete: ReteTheaterModuleInstanceInfo | ReteTheaterInternalServiceModuleInstanceInfo | ReteMirroringModuleInstanceInfo;
    if (ModuleType1[moduleInstance.type]) {
        rete = new EmptyModuleInfo()[ModuleType1[moduleInstance.type]];
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
