import { ModeTypeExport, ModuleTypeExport, TheaterTypeExport, ToscaDefinitionType } from "./TypeExport"

/**
 * Classe utilizzata per l'export. 
 * Contiene le informazioni generali per il teatro che devono esserci nello standard Tosca.
 */
export class TheaterExport {
    tosca_definitions_version: ToscaDefinitionType
    description: string
    imports: string[]
    node_templates: { [name: string]: TheaterSimpleData | ModuleInstanceSimpleData }
}

export class TheaterSimpleData {
    type: TheaterTypeExport
    properties: PropertiesTSD
}
export class PropertiesTSD {
    version: string | number
    description: string
    mode: ModeTypeExport
    author: string
    tags: TagsExport[]
    areas: AreaExport[]
}
export class TagsExport {
    tag: string
}
export class AreaExport {
    area: string
    description: string
}

export class ModuleInstanceSimpleData {
    type: ModuleTypeExport
    properties: PropertiesMISD
}
export class PropertiesMISD{
    module: string
    version: string | number
    area: string
    sequence: number
    sources?: SourceExport[]
    consumer_interface_link: ConsumerInterfaceLinkExport[]
}
export class SourceExport{
    module_instance: string
    host:string
    interfaces: string[]
}
export class ConsumerInterfaceLinkExport{
    local_interface: string
    module_interface:string
    remote_interface:string
}