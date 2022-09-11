import { ModeTypeExport, ModuleTypeExport, NetworkTypeExport, NodeTypeExport, PortTypeExport, RelationshipsTypeExport, SubnetTypeExport, ToscaDefinitionType } from "./TypeExport"


/**
 * Classe utilizzata per l'export. 
 * Contiene le informazioni generali per il modulo che devono esserci nello standard Tosca.
 */
export class ModuleExport {
    tosca_definitions_version: ToscaDefinitionType
    description: string
    imports: string[]
    node_templates: { [name: string]: ModuleSimpleData | NodeSimpleData | PortSimpleData | NetworkSimpleData | SubnetSimpleData }
    dsl_definition: any | null; //future
    capabilites: any | null //future
    outputs: any | null //future
}

/**
 * Classe che contiene gli attributi che indicano la rappresentazione del modulo per l'export.
 */
export class ModuleSimpleData {
    type: ModuleTypeExport
    properties: PropertiesMSD
}

/**
 * Classe che contiene gli attributi che indicano le proprietà del modulo per l'export.
 */
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
/**
 * Classe che contiene gli attributi che indicano i vincoli di connessione del modulo per l'export.
 */
export class ConstraintsMSD {
    interface_constraints: InterfaceConstraints[]
    module_constraints: ModuleConstraints[]
    network_constraints: NetworkConstraints[]
}
/**
 * Classe che contiene gli attributi che indicano i viconli per le interfacce di connessione del modulo.
 */
export class InterfaceConstraints {
    local_interface: string
    multiple_mode: boolean = false //future
    module_name: string
    compatibility: string = "1.0" // future
    remote_interface: string
}
/**
 * Classe che contiene gli attributi che indicano i viconli del modulo.
 */
export class ModuleConstraints {
}
/**
 * Classe che contiene gli attributi che indicano i viconli dei network del modulo.
 */
export class NetworkConstraints {
}
/**
 * Classe che contiene gli attributi che indicano le interfacce provider del modulo.
 */
export class InterfaceNetworksProvider {
    interface: string
    network: string
    tag: string
    subnets: SubnetExport[]
}
/**
 * Classe che contiene gli attributi che indicano le interfacce consumer del modulo.
 */
export class InterfaceNetworksConsumer {
    interface: string
    network: string
    tag: string
    subnets: SubnetExport[]
}
/**
 * Classe che contiene gli attributi che indicano l'insieme di host presenti in un modulo.
 */
export class VirtualMachine {
    virtual_machine: string
    ports: VirtualMachinePorts[]
}
/**
 * Classe che contiene gli attributi che indicano le porte associate ad un host di un modulo.
 */
export class VirtualMachinePorts {
    port: string
    network: string
    subnets: SubnetExport[]
}
/**
 * Classe che contiene gli attributi che indicano la subnet connessa alla porte dell'host.
 * @see {VirtualMachinePorts}
 */
export class SubnetExport {
    subnet: string;
}

/**
 * Classe che contiene gli attributi che indica un nodo all'interno dei node_templates.
 * @see {ModuleExport}
 */
export class NodeSimpleData {
    type: NodeTypeExport
    properties: any | null // future
    interfaces: any | null // future
    relationships: RelationshipsExport[]
}

/**
 * Classe che contiene gli attributi che indicano le relazioni generali.
 */
export class RelationshipsExport {
    type: RelationshipsTypeExport
    target: string
}
/**
 * Classe che contiene gli attributi che indicano i dati della porta all'interno dei node_templates.
 */
export class PortSimpleData {
    type: PortTypeExport
    relationships: RelationshipsExport[]
}
/**
 * Classe che contiene gli attributi che indicano i dati delle network all'interno dei node_templates.
 */
export class NetworkSimpleData {
    type: NetworkTypeExport
    properties: PropertiesNSD
}
/**
 * Classe che contiene gli attributi che indicano le proprietà della network all'interno dei node_templates.
 * @see {NetworkSimpleData}
 */
export class PropertiesNSD {
    openstack_config?: any | null // future
    use_external_resource?: boolean | null // future
    resource_id?: any | null // future
}

/**
 * Classe che contiene gli attributi che indicano i dati delle subnet all'interno dei node_templates.
 */
export class SubnetSimpleData {
    type: SubnetTypeExport
    relationships: RelationshipsExport[]
    properties: PropertiesSSD
}
/**
 * Classe che contiene gli attributi che indicano le proprietà della subnet all'interno dei node_templates.
 * @see {NetworkSimpleData}
 */
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

