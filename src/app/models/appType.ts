export enum SubjectType {
    MODULE = "Module",
    THEATER  = "Theater"
}

export enum ComposerVisualizerType {
    COMPOSER = "Composer",
    VISUALIZER  = "Visualizer"
}

export enum InterfacePortType {
    CONSUMER = "CONSUMER",
    PRODUCER = "PRODUCER"
}

export enum NodePortType{
    INPUT="input",
    OUTPUT="output"
}

export enum StaticValue{
    SubnetOutput = "Link",
    hostOS1 = "Linux",
    hostOS2 = "Ubuntu",
    hostOS3 = "CentOS",
}

export enum VersionType {
    FOUR = 4,
    SIX = 6
}

export class DataRouteVisualizer{
    id: number;
    type: SubjectType;
}

export class DataRouteComposer{
    name: string;
    description: string;
    author: string;
    type: SubjectType;
}




export enum EnumNodeType {
    Host = "Host",
    Subnet = "Subnet",
    Network = "Network",
}
export enum EnumNodeTypeString {
    Host = "Nodo Host",
    Subnet = "Nodo Subnet",
    Network = "Nodo Network",
}


export enum EnumModuleType {
    TheaterModuleInstance = "TheaterModuleInstance", // SINONIMI -> TheatreModuleInstance = "TheatreModuleInstance",
    TheaterInternalServiceModuleInstance = "TheaterInternalServiceModuleInstance",
    MirroringModuleInstance = "MirroringModuleInstance",
    VirtualServerModuleInstance = "VirtualServerModuleInstance", //TODO
    ExternalVirtualMachine = "ExternalVirtualMachine", //TODO
    AutomaticSystem = "AutomaticSystem", //TODO
    Border = "Border", //TODO
}
export enum EnumModuleTypeDescription {
    TheaterModuleInstance = "Module", // SINONIMI -> TheatreModuleInstance = "Module",
    TheaterInternalServiceModuleInstance = "Internal Service",
    MirroringModuleInstance = "Mirroring Module",
    VirtualServerModuleInstance = "Virtual Server", // TODO
    ExternalVirtualMachine = "External Virtual Machine", // TODO
    AutomaticSystem = "Automatic System", //TODO
    Border = "Border", //TODO
}