import { ModeTypeExport, ModuleTypeExport, NetworkTypeExport, NodeTypeExport, PortTypeExport, RelationshipsTypeExport, SubnetTypeExport, ToscaDefinitionType } from "./TypeExport"



export class ModuleExport {
    tosca_definitions_version: ToscaDefinitionType
    description: string
    imports: string[]
    node_templates: { [name: string]: ModuleSimpleData | NodeSimpleData | PortSimpleData | NetworkSimpleData | SubnetSimpleData }
    dsl_definition: any | null; //future
    capabilites: any | null //future
    outputs: any | null //future
}


export class ModuleSimpleData {
    type: ModuleTypeExport
    properties: PropertiesMSD
}
export class PropertiesMSD {
    mode: ModeTypeExport
    description: string
    version: string | number
    constraints: ConstraintsMSD
    interface_networks: {
        providers: InterfaceNetworksProvider[]
        consumers: InterfaceNetworksConsumer[]
    }
    virtual_machines: VirtualMachine[]
}
export class ConstraintsMSD {
    interface_constraints: InterfaceConstraints[]
    module_constraints: ModuleConstraints[]
    network_constraints: NetworkConstraints[]
}
export class InterfaceConstraints {
    local_interface: string
    multiple_mode: boolean = false //future
    module_name: string
    compatibility: string = "1.0" // future
    remote_interface: string
}
export class ModuleConstraints {
}
export class NetworkConstraints {
}

export class InterfaceNetworksProvider {
    interface: string
    network: string
    tag: string
    subnets: SubnetExport[]
}
export class InterfaceNetworksConsumer {
    interface: string
    network: string
    tag: string
    subnets: SubnetExport[]
}

export class VirtualMachine {
    virtual_machine: string
    ports: VirtualMachinePorts[]
}
export class VirtualMachinePorts {
    port: string
    network: string
    subnets: SubnetExport[]
}

export class SubnetExport {
    subnet: string;
}

export class NodeSimpleData {
    type: NodeTypeExport
    properties: any | null // future
    interfaces: any | null // future
    relationships: RelationshipsExport[]
}

export class RelationshipsExport {
    type: RelationshipsTypeExport
    target: string
}

export class PortSimpleData {
    type: PortTypeExport
    relationships: RelationshipsExport[]
}

export class NetworkSimpleData {
    type: NetworkTypeExport
    properties: PropertiesNSD
}
export class PropertiesNSD {
    openstack_config?: any | null // future
    use_external_resource?: boolean | null // future
    resource_id?: any | null // future
}


export class SubnetSimpleData {
    type: SubnetTypeExport
    relationships: RelationshipsExport[]
    properties: PropertiesSSD
}
export class PropertiesSSD {
    subnet?: {
        ip_version: string | number
        cidr: string
        enable_dhcp: boolean
        gateway_ip?: any | null // future
    }
    openstack_config?: any | null // future
    use_external_resource?: boolean | null // future
    resource_id?: any | null // future
}

