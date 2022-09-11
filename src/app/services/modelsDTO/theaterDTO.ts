import { ModuleInstanceDTO, TheaterInstanceDTO } from "./moduleDTO"

/**
 * Classe che contiene gli attributi che indicano il catalogo di riferimento di un teatro.
 */
export class TagCatalogueDTO {
    description: string
    id: string | number
    name: string
}

/**
 * Classe che contiene gli attributi che indicano lo stato di un teatro.
 */
export class TheatreStatusDTO {
    code: string
    id: string | number
    name: string
}

/**
 * Classe che contiene gli attributi che indicano un elemento nella sequenza di deploy.
 */
export class DeployInstanceDTO {
    moduleInstanceConfigurationUUID?: string
    moduleInstanceName: string
    moduleInstanceUUID: string
    moduleUUID: string
}

/**
 * Classe che contiene gli attributi che indicano il blueprint di un teatro.
 */
export class BlueprintFileDTO {
    description: string
    imports: string[]
    node_templates: {[name:string]:ModuleInstanceDTO|TheaterInstanceDTO}
    tosca_definitions_version: string
}

/**
 * Classe che contiene gli attributi che indicano il mapping nome-modulo.
 */
export class NameMappingDTO {
    display_name: string
    module_instance_name: string
    module_name: string
    node_template_name: string
}
/**
 * Classe che contiene gli attributi che indica l'array dei mapping nome-modulo.
 */
export class EntityNameMappingFileDTO {
    name_mapping: NameMappingDTO[]
}

/**
 * Classe che contiene gli attributi che indicano il teaatro.
 */
export class TheaterDTO {
    author: string
    blueprintFile: BlueprintFileDTO
    blueprintUUID: string | number
    createdBy: string
    createdDate: string
    deploymentSequence: {[index:string]:DeployInstanceDTO} //tosee
    description: string
    entityNameMappingFile: EntityNameMappingFileDTO
    id: string | number
    isLocked: boolean
    lastModifiedBy: string
    lastModifiedDate: string
    lockAcquiredTimestamp: string
    lockLastUserAcquiring: string
    lockReleasedTimestamp: string
    name: string
    status: TheatreStatusDTO
    tags: TagCatalogueDTO[]
    uuid: string
    version: string
}
