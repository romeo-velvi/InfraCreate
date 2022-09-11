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
/**
 * Classe che contiene gli attributi che indicano il teatro all'interno dei node_templates.
 */
export class TheaterSimpleData {
    type: TheaterTypeExport
    properties: PropertiesTSD
}
/**
 * Classe che contiene gli attributi che indicano le proprietà del teatro.
 */
export class PropertiesTSD {
    version: string | number
    description: string
    mode: ModeTypeExport
    author: string
    tags: TagsExport[]
    areas: AreaExport[]
}
/**
 * Classe che contiene gli attributi che indicano i tag nelle proprietà del teatro.
 * @see {PropertiesTSD}
 */
export class TagsExport {
    tag: string
}
/**
 * Classe che contiene gli attributi che indicano le aree nelle proprietà del teatr.
 * @see {PropertiesTSD}
 */
export class AreaExport {
    area: string
    description: string
}

/**
 * Classe che contiene gli attributi che indicano il modulo all'interno dei node_modules.
 */
export class ModuleInstanceSimpleData {
    type: ModuleTypeExport
    properties: PropertiesMISD
}
/**
 * Classe che contiene gli attributi che indicano le propeitò del modulo all'interno dei node_templates.
 */
export class PropertiesMISD{
    module: string
    version: string | number
    area: string
    sequence: number
    sources?: SourceExport[]
    consumer_interface_link: ConsumerInterfaceLinkExport[]
}
/**
 * Classe che contiene gli attributi che indicano le porte di ingresso del modulo all'interno dei node_templates.
 */
export class SourceExport{
    module_instance: string
    host:string
    interfaces: string[]
}
/**
 * Classe che contiene gli attributi che indicano i collegamenti e relazioni intramodulo con le varie interfacce.
 */
export class ConsumerInterfaceLinkExport{
    local_interface: string
    module_interface:string
    remote_interface:string
}