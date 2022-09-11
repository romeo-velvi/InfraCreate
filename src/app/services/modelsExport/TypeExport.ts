// enum per ora prevede un solo elemento ma si deve ipotizzare che possano essere aggiunti altri
/**
 * Elemento utizzato per definire i tipi di host "comprensibili" nello yaml tosca.
 */
export enum NodeTypeExport {
    Host = "cloudify.openstack.nodes.Server",
}
/**
 * Elemento utizzato per definire i tipi di subnet "comprensibili" nello yaml tosca.
 */
export enum SubnetTypeExport {
    Subnet = "cloudify.openstack.nodes.Subnet"
}
/**
 * Elemento utizzato per definire i tipi di network "comprensibili" nello yaml tosca.
 */
export enum NetworkTypeExport {
    Network = "cloudify.openstack.nodes.Network",
}
/**
 * Elemento utizzato per definire i tipi di porta "comprensibili" nello yaml tosca.
 */
export enum PortTypeExport {
    Port = "cloudify.openstack.nodes.Port"
}
/**
 * Elemento utizzato per definire i tipi di versione tosca utilizzato.
 */
export enum ToscaDefinitionType {
    cloudify = "cloudify_dsl_1_3"
}

/**
 * Elemento utizzato per definire il tipo di modalità "comprensibile" nello yaml tosca.
 */
export enum ModeTypeExport {
    managed = "Managed"
}
/**
 * Elemento utizzato per definire i tipi di teatro "comprensibili" nello yaml tosca.
 */
export enum TheaterTypeExport {
    Theater = "sysman.creo.nodes.Theater"
}

/**
 * Elemento utizzato per definire i tipi di moduli "comprensibili" nello yaml tosca.
 */
export enum ModuleTypeExport {
    TheaterModuleInstance = "sysman.creo.nodes.TheaterModuleInstance",
    MirroringModuleInstance = "sysman.creo.nodes.MirroringModuleInstance",
    TheaterInternalServiceModuleInstance = "sysman.creo.nodes.TheaterInternalServiceModuleInstance",
    VirtualServerModuleInstance = "sysman.creo.nodes.VirtualServerModuleInstance", //TODO
    ExternalVirtualMachine = "sysman.creo.nodes.ExternalVirtualMachine", //TODO
    AutomaticSystem = "sysman.creo.nodes.AutomaticSystem", //TODO
    Border = "sysman.creo.nodes.Border", //TODO
}
/**
 * Elemento utizzato per definire i tipi di relazioni "comprensibili" nello yaml tosca.
 */
export enum RelationshipsTypeExport {
    depends_on = "cloudify.relationships.depends_on",
    connect_port = "cloudify.openstack.server_connected_to_port",
    contained_in = "cloudify.relationships.contained_in"
}