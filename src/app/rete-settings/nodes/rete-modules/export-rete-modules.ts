import { getEmptyReteMirroringModuleInstanceInfo, MirroringModuleInstanceNode, ReteMirroringModuleInstanceInfo } from "./mirroringModuleInstance/mirroringModuleInstanceNode";
import { getEmptyReteTheaterInternalServiceModuleInstanceInfo, ReteTheaterInternalServiceModuleInstanceInfo, TheaterInternalServiceModuleInstanceNode } from "./theaterInternalServiceModuleInstance/theaterInternalServiceModuleInstanceNode";
import { getEmptyReteTheaterModuleInstanceInfo, ReteTheaterModuleInstanceInfo, TheaterModuleInstanceNode } from "./theaterModuleInstance/theaterModuleInstanceNode";

export enum IndexModuleComponent {
    TheaterModuleInstance = 0, //SINONIMO -> TheatreModuleInstance = 0, 
    MirroringModuleInstance = 1,
    TheaterInternalServiceModuleInstance = 2,
    VirtualServerModuleInstance = 1, //todo
    ExternalVirtualMachine = 1, //todo
    AutomaticSystem = 1, //todo
    Border = 1 //todo
}

export const ModuleComponents = [
    new TheaterModuleInstanceNode(),
    new MirroringModuleInstanceNode(),
    new TheaterInternalServiceModuleInstanceNode()
];

export class EmptyModuleInfo {
    static MirroringModuleInstance: ReteMirroringModuleInstanceInfo = getEmptyReteMirroringModuleInstanceInfo();
    static TheaterModuleInstance: ReteTheaterModuleInstanceInfo = getEmptyReteTheaterModuleInstanceInfo();
    static TheaterInternalServiceModuleInstance: ReteTheaterInternalServiceModuleInstanceInfo = getEmptyReteTheaterInternalServiceModuleInstanceInfo();
}


export enum TheaterNodeTypeFromTheater {
    TheaterModuleInstance = "sysman.creo.nodes.TheaterModuleInstance",
    MirroringModuleInstance = "sysman.creo.nodes.MirroringModuleInstance",
    TheaterInternalServiceModuleInstance = "sysman.creo.nodes.TheaterInternalServiceModuleInstance",
    VirtualServerModuleInstance = "sysman.creo.nodes.VirtualServerModuleInstance", //TODO
    ExternalVirtualMachine = "sysman.creo.nodes.ExternalVirtualMachine", //TODO
    AutomaticSystem = "sysman.creo.nodes.AutomaticSystem", //TODO
    Border = "sysman.creo.nodes.Border", //TODO
}

export enum ModuleTypeLink {
    TheaterModuleInstance = "THEATER",
    MirroringModuleInstance = "MIRRORING",
    TheaterInternalServiceModuleInstance = "INTERNAL_THEATRE_SERVICE",
    VirtualServerModuleInstance = "VIRTUAL_SERVER", // TODO
    ExternalVirtualMachine = "EXTERNAL_VIRTUAL_MACHINE", // TODO
    AutomaticSystem = "AUTOMATIC_SYSTEM", //TODO
    Border = "BORDER", //TODO
}

export enum ModuleType1 {
    "sysman.creo.nodes.TheaterModuleInstance" = "TheaterModuleInstance", // SINONIMI -> "sysman.creo.nodes.TheatreModuleInstance" = "TheaterModuleInstance",
    "sysman.creo.nodes.MirroringModuleInstance" = "MirroringModuleInstance",
    "sysman.creo.nodes.TheaterInternalServiceModuleInstance" = "TheaterInternalServiceModuleInstance",
    "sysman.creo.nodes.VirtualServerModuleInstance" = "VirtualServerModuleInstance", //TODO
    "sysman.creo.nodes.ExternalVirtualMachine" = "ExternalVirtualMachine", //TODO
    "sysman.creo.nodes.AutomaticSystem" = "AutomaticSystem", //TODO
    "sysman.creo.nodes.Border" = "Border", //TODO
}

export enum ModuleType2 {
    "THEATRE" = "TheaterModuleInstance", //Attenzione, per qualche motivo qui la corretta è teatRE. SINONIMI -> "THEATRE" = "TheaterModuleInstance",
    "MIRRORING" = "MirroringModuleInstance",
    "INTERNAL_THEATRE_SERVICE" = "TheaterInternalServiceModuleInstance",
    "VIRTUAL_SERVER" = "VirtualServerModuleInstance", // TODO
    "EXTERNAL_VIRTUAL_MACHINE" = "ExternalVirtualMachine", // TODO
    "AUTOMATIC_SYSTEM" = "AutomaticSystem", // TODO
    "BORDER" = "Border", // TODO
}
