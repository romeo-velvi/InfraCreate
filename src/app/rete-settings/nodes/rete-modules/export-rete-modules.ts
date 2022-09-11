import { getEmptyReteMirroringModuleInstanceInfo, MirroringModuleInstanceNode, ReteMirroringModuleInstanceInfo } from "./mirroringModuleInstance/mirroringModuleInstanceNode";
import { getEmptyReteTheaterInternalServiceModuleInstanceInfo, ReteTheaterInternalServiceModuleInstanceInfo, TheaterInternalServiceModuleInstanceNode } from "./theaterInternalServiceModuleInstance/theaterInternalServiceModuleInstanceNode";
import { getEmptyReteTheaterModuleInstanceInfo, ReteTheaterModuleInstanceInfo, TheaterModuleInstanceNode } from "./theaterModuleInstance/theaterModuleInstanceNode";

/**
 * Enum utilizzato per indicare l'indice di riferimento degli array contenenti le informazioni.
 * @see {NodeComponents}
 */
export enum IndexModuleComponent {
    TheaterModuleInstance = 0, //SINONIMO -> TheatreModuleInstance = 0, 
    MirroringModuleInstance = 1,
    TheaterInternalServiceModuleInstance = 2,
    VirtualServerModuleInstance = 1, //todo
    ExternalVirtualMachine = 1, //todo
    AutomaticSystem = 1, //todo
    Border = 1 //todo
}


/**
 * Array utilizzato per assegnare i valori al component negli editor. 
 * Usato per processare e creare i vari nodi (rete-node).
 */
export const ModuleComponents = [
    new TheaterModuleInstanceNode(),
    new MirroringModuleInstanceNode(),
    new TheaterInternalServiceModuleInstanceNode()
];


/**
 * Elemento che assegna le variabili a funzioni che restituiscono una struttura inizializzata vuota dei singoli nodi.
 * @see {getEmptyReteMirroringModuleInstanceInfo}
 * @see {getEmptyReteTheaterModuleInstanceInfo}
 * @see {getEmptyReteTheaterInternalServiceModuleInstanceInfo}
 */
export class EmptyModuleInfo {
    TheaterModuleInstance: ReteTheaterModuleInstanceInfo = getEmptyReteTheaterModuleInstanceInfo()
    TheaterInternalServiceModuleInstance: ReteTheaterInternalServiceModuleInstanceInfo = getEmptyReteTheaterInternalServiceModuleInstanceInfo()
    MirroringModuleInstance: ReteMirroringModuleInstanceInfo = getEmptyReteMirroringModuleInstanceInfo()
    VirtualServerModuleInstance: ReteMirroringModuleInstanceInfo = getEmptyReteMirroringModuleInstanceInfo() // todo
    ExternalVirtualMachine: ReteMirroringModuleInstanceInfo = getEmptyReteMirroringModuleInstanceInfo() // todo
    AutomaticSystem: ReteMirroringModuleInstanceInfo = getEmptyReteMirroringModuleInstanceInfo() // todo
    Border: ReteMirroringModuleInstanceInfo = getEmptyReteMirroringModuleInstanceInfo() // todo
}