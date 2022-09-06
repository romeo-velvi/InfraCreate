// enum per ora prevede un solo elemento ma si deve ipotizzare che possano essere aggiunti altri
export enum NodeTypeExport {
    Host = "cloudify.openstack.nodes.Server",
}
export enum SubnetTypeExport {
    Subnet = "cloudify.openstack.nodes.Subnet"
}
export enum NetworkTypeExport {
    Network = "cloudify.openstack.nodes.Network",
}
export enum PortTypeExport {
    Port = "cloudify.openstack.nodes.Port"
}

export enum ToscaDefinitionType {
    cloudify = "cloudify_dsl_1_3"
}

export enum ModeTypeExport {
    managed = "Managed"
}

export enum TheaterTypeExport {
    Theater = "sysman.creo.nodes.Theater"
}

export enum ModuleTypeExport {
    TheaterModuleInstance = "sysman.creo.nodes.TheaterModuleInstance",
    MirroringModuleInstance = "sysman.creo.nodes.MirroringModuleInstance",
    TheaterInternalServiceModuleInstance = "sysman.creo.nodes.TheaterInternalServiceModuleInstance",
    VirtualServerModuleInstance = "sysman.creo.nodes.VirtualServerModuleInstance", //TODO
    ExternalVirtualMachine = "sysman.creo.nodes.ExternalVirtualMachine", //TODO
    AutomaticSystem = "sysman.creo.nodes.AutomaticSystem", //TODO
    Border = "sysman.creo.nodes.Border", //TODO
}

export enum RelationshipsTypeExport {
    depends_on = "cloudify.relationships.depends_on",
    connect_port = "cloudify.openstack.server_connected_to_port",
    contained_in = "cloudify.relationships.contained_in"
}