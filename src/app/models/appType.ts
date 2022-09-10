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
export enum EnumNodeTypeDescription {
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


// MODULES PROPERTIES


/**
 * Enum che restituisce delle proprietà, espresse in termini di variabili indicatrici dei moduli.
 * Indica il tipo di un modulo e la sua rappresentazione. (api-restituzione moduli da teatro)
 */
 export enum ModuleTypeTheater {
    TheaterModuleInstance = "sysman.creo.nodes.TheaterModuleInstance",
    MirroringModuleInstance = "sysman.creo.nodes.MirroringModuleInstance",
    TheaterInternalServiceModuleInstance = "sysman.creo.nodes.TheaterInternalServiceModuleInstance",
    VirtualServerModuleInstance = "sysman.creo.nodes.VirtualServerModuleInstance", //TODO
    ExternalVirtualMachine = "sysman.creo.nodes.ExternalVirtualMachine", //TODO
    AutomaticSystem = "sysman.creo.nodes.AutomaticSystem", //TODO
    Border = "sysman.creo.nodes.Border", //TODO
}
/**
 * Rappresentazione inversa di @see {ModuleTypeTheater}
 */
 export enum ModuleType1 {
    "sysman.creo.nodes.TheaterModuleInstance" = "TheaterModuleInstance", // SINONIMI -> "sysman.creo.nodes.TheatreModuleInstance" = "TheaterModuleInstance",
    "sysman.creo.nodes.MirroringModuleInstance" = "MirroringModuleInstance",
    "sysman.creo.nodes.TheaterInternalServiceModuleInstance" = "TheaterInternalServiceModuleInstance",
    "sysman.creo.nodes.VirtualServerModuleInstance" = "VirtualServerModuleInstance", //TODO
    "sysman.creo.nodes.ExternalVirtualMachine" = "ExternalVirtualMachine", //TODO
    "sysman.creo.nodes.AutomaticSystem" = "AutomaticSystem", //TODO
    "sysman.creo.nodes.Border" = "Border", //TODO
}


/**
 * Enum che restituisce delle proprietà, espresse in termini di variabili indicatrici dei moduli.
 * Indica il tipo di un modulo e la sua altra indicazione in altri tipi di dati reperiti. (api-restituzione moduli da chiamata apposita)
 */
export enum ModuleTypeLink {
    TheaterModuleInstance = "THEATER",
    MirroringModuleInstance = "MIRRORING",
    TheaterInternalServiceModuleInstance = "INTERNAL_THEATRE_SERVICE",
    VirtualServerModuleInstance = "VIRTUAL_SERVER", // TODO
    ExternalVirtualMachine = "EXTERNAL_VIRTUAL_MACHINE", // TODO
    AutomaticSystem = "AUTOMATIC_SYSTEM", //TODO
    Border = "BORDER", //TODO
}
/**
 * Rappresentazione inversa di @see {ModuleTypeLink}
 */
export enum ModuleType2 {
    "THEATRE" = "TheaterModuleInstance", //Attenzione, per qualche motivo qui la corretta è teatRE. SINONIMI -> "THEATRE" = "TheaterModuleInstance",
    "MIRRORING" = "MirroringModuleInstance",
    "INTERNAL_THEATRE_SERVICE" = "TheaterInternalServiceModuleInstance",
    "VIRTUAL_SERVER" = "VirtualServerModuleInstance", // TODO
    "EXTERNAL_VIRTUAL_MACHINE" = "ExternalVirtualMachine", // TODO
    "AUTOMATIC_SYSTEM" = "AutomaticSystem", // TODO
    "BORDER" = "Border", // TODO
}

