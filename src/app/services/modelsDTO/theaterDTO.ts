import { ElementIntoTheaterDTO, ModuleInstanceDTO, TheaterInstanceDTO } from "./moduleDTO"

export class TagCatalogueDTO {
    description: string
    id: string | number
    name: string
}

export class TheatreStatusDTO {
    code: string
    id: string | number
    name: string
}

export class DeployInstanceDTO {
    moduleInstanceConfigurationUUID?: string
    moduleInstanceName: string
    moduleInstanceUUID: string
    moduleUUID: string
}

export class BlueprintFileDTO {
    description: string
    imports: string[]
    node_templates: {[name:string]:ModuleInstanceDTO|TheaterInstanceDTO}
    tosca_definitions_version: string
}

export class NameMappingDTO {
    display_name: string
    module_instance_name: string
    module_name: string
    node_template_name: string
}
export class EntityNameMappingFileDTO {
    name_mapping: NameMappingDTO[]
}
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

export const TheaterType: string = "sysman.creo.nodes.Theater";
