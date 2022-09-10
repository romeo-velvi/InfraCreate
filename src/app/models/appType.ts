/**
 * Enum per eseguire le operazioni in base al tipo
 */
export enum SubjectType {
    MODULE = "Module",
    THEATER  = "Theater"
}

/**
 * Enum per eseguire le operazioni in base al tipo
 */
export enum ComposerVisualizerType {
    COMPOSER = "Composer",
    VISUALIZER  = "Visualizer"
}

/**
 * Enum per indicare il tipo di interfaccia
 */
export enum InterfacePortType {
    CONSUMER = "CONSUMER",
    PRODUCER = "PRODUCER"
}

/**
 * Enum per indicare il tipo di porta
 */
export enum NodePortType{
    INPUT="input",
    OUTPUT="output"
}

/**
 * Enum per indicare il tipo di sistma operativo
 */
export enum StaticValue{
    SubnetOutput = "Link",
    hostOS1 = "Linux",
    hostOS2 = "Ubuntu",
    hostOS3 = "CentOS",
}

/**
 * Enum per indicare la versione dell'ip
 */
export enum IpVersionType {
    FOUR = "4",
    SIXSTEEN = "16"
}


//// Router data

/**
 * Elemento che contiene le variabili da portare al router nel caso si tratti della visualizzazione.
 */
export class DataRouteVisualizer{
    id: number;
    type: SubjectType;
}
/**
 * Elemento che contiene le variabili da portare al router nel caso si tratti della costruzione.
 */
export class DataRouteComposer{
    name: string;
    description: string;
    author: string;
    type: SubjectType;
}


/**
 * Enum per indicare i tipi di nodi nel modulo.
 */
export enum EnumNodeType {
    Host = "Host",
    Subnet = "Subnet",
    Network = "Network",
}
/**
 * Enum per l'indicazione testuale descrittiva dei tipi di nodi nel modulo.
 */
export enum EnumNodeTypeString {
    Host = "Nodo Host",
    Subnet = "Nodo Subnet",
    Network = "Nodo Network",
}

/**
 * Enum per indicare i tipi di moduli nel teatro.
 */
export enum EnumModuleType {
    TheaterModuleInstance = "TheaterModuleInstance", // SINONIMI -> TheatreModuleInstance = "TheatreModuleInstance",
    TheaterInternalServiceModuleInstance = "TheaterInternalServiceModuleInstance",
    MirroringModuleInstance = "MirroringModuleInstance",
    VirtualServerModuleInstance = "VirtualServerModuleInstance", //TODO
    ExternalVirtualMachine = "ExternalVirtualMachine", //TODO
    AutomaticSystem = "AutomaticSystem", //TODO
    Border = "Border", //TODO
}
/**
 * Enum per l'indicazione testuale descrittiva dei tipi di modulo nel teatro.
 */
export enum EnumModuleTypeDescription {
    TheaterModuleInstance = "Module", // SINONIMI -> TheatreModuleInstance = "Module",
    TheaterInternalServiceModuleInstance = "Internal Service",
    MirroringModuleInstance = "Mirroring Module",
    VirtualServerModuleInstance = "Virtual Server", // TODO
    ExternalVirtualMachine = "External Virtual Machine", // TODO
    AutomaticSystem = "Automatic System", //TODO
    Border = "Border", //TODO
}