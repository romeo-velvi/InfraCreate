import { PageableDTO, SortDTO } from './elementDTO';
import { NetworkDTO } from './networkDTO';
import { TheaterDTO } from './theaterDTO';


export class ModuleListDTO {
    content: SimpleModuleDTO[]
    pageable: PageableDTO
    last: boolean
    totalPages: string | number
    totalElements: string | number
    size: string | number
    number: string | number
    sort: SortDTO
    numberOfElements: string | number
    first: boolean
    empty: boolean
}


export class TypesCatalogueDTO {
    group: string
    id: string | number
    parentId: {}
    value: string
}

export class ModuleClassificationDTO {
    blueprintType: string
    category: string
    expectedInstanceType: string
    id: string | number
    mcClass: string
    type: string
    uuid: string
}

export class GenericParameterDTO {
    type: string
    default: string
    description: string
}

export class ConfigurationTemplateDTO {
    anchor_parameters: { [name: string]: GenericParameterDTO | string }
    instance_parameters: { [name: string]: GenericParameterDTO }
    structural_parameters: { [name: string]: GenericParameterDTO }
    fixed_parameters: { [name: string]: GenericParameterDTO }
    control_parameters: { [name: string]: GenericParameterDTO }
    infrastructure_parameters: { [name: string]: GenericParameterDTO }
    module: string
    description: string
    category: string
    version: string | number
    platform: string
}

export class ModuleModeDTO {
    code: string
    id: string | number
    name: string
}

export class ModuleStatusDTO {
    descriptionCode: string
    id: string | number
    name: string
}
export class StatisticItemDTO {
    error: string | number
    updated: string | number
    inserted: string | number
}

export class SimpleModuleDTO {
    createdBy: string
    createdDate: string
    description: string
    id: string | number
    isLocked: boolean
    lastModifiedBy: string
    lastModifiedDate: string
    lockAcquiredTimestamp: string
    lockLastUserAcquiring: string
    lockReleasedTimestamp: string
    name: string
    status: ModuleStatusDTO
    type?: string | any
    uuid: string
    version: string | number
}
export class ModuleDTO extends SimpleModuleDTO {
    attachments: string[]
    author: string
    capabilities: { [name: string]: string }
    catalog1: TypesCatalogueDTO
    catalog2: TypesCatalogueDTO
    catalog3: TypesCatalogueDTO
    classification: ModuleClassificationDTO
    configurationTemplate: ConfigurationTemplateDTO
    detailProperties: {}
    input: { [name: string]: string }
    output: { [name: string]: string }
    mode: ModuleModeDTO
    statistics: { [name: string]: StatisticItemDTO | string | number }
    tags: []
}

export class ModuleNetworkInterfaceDTO {
    id: string | number
    label: string
    module: ModuleDTO
    network: NetworkDTO
    nodeName: string
    type: string
    uuid: string
}

export class ConsumerInterfaceLinkDTO {
    local_interface: string
    module_instance: string
    remote_interface: string
}

export class ModuleInstancePropertiesDTO {
    area: string
    description: string
    module: string
    version: string | number
    sequence: string | number
    consumer_interfaces_link: ConsumerInterfaceLinkDTO[]
}

export class AreaDTO {
    id: string | number;
    uuid: string;
    name: string;
    description: string;
    theater: TheaterDTO;
    deleted: boolean | string;
}

export class SimpleAreaDTO {
    area: string
    description: string
}
export class TheaterInstancePropertiesDTO {
    mode: string
    tags: TagTIP[]
    areas: SimpleAreaDTO[]
    author: string
    version: string | number
    description: string
}
export class TagTIP{
    tag: string
}
export class ElementIntoTheaterDTO {  // goes into map in blueprint [name:string]: Module...
    properties: ModuleInstancePropertiesDTO | TheaterInstancePropertiesDTO
    type: string
}
export class ModuleInstanceDTO {
    properties: ModuleInstancePropertiesDTO
    type: string
}
export class TheaterInstanceDTO {
    properties: TheaterInstancePropertiesDTO
    type: string
}