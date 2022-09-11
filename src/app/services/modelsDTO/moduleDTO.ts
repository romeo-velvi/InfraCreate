import { PageableDTO, SortDTO } from './elementDTO';
import { NetworkDTO } from './networkDTO';
import { TheaterDTO } from './theaterDTO';

/**
 * Classe che contiene gli attributi che indicano l'insieme dei moduli ritornati dal teatro.
 */
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

/**
 * Classe che contiene gli attributi che indica il catalogo del tipo.
 */
export class TypesCatalogueDTO {
    group: string
    id: string | number
    parentId: {}
    value: string
}

/**
 * Classe che contiene gli attributi che indicano la classificazione del modulo.
 */
export class ModuleClassificationDTO {
    blueprintType: string
    category: string
    expectedInstanceType: string
    id: string | number
    mcClass: string
    type: string
    uuid: string
}

/**
 * Classe che contiene gli attributi che indicano un parametro generico.
 */
export class GenericParameterDTO {
    type: string
    default: string
    description: string
}

/**
 * Classe che contiene gli attributi che indicano i parametri di configurazione di un modulto.
 */
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

/**
 * Classe che contiene gli attributi che indicano la modalità di un modulo.
 */
export class ModuleModeDTO {
    code: string
    id: string | number
    name: string
}

/**
 * Classe che contiene gli attributi che indicano lo stato di un modulo.
 */
export class ModuleStatusDTO {
    descriptionCode: string
    id: string | number
    name: string
}

/**
 * Classe che contiene gli attributi che indicano le statitistiche di un modulo.
 */
export class StatisticItemDTO {
    error: string | number
    updated: string | number
    inserted: string | number
}

/**
 * Classe che contiene gli attributi che indicano il modulo (simple - in dipendenza del teatro).
 */
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

/**
 * Classe che contiene gli attributi che indicano il modulo (complex - ritorato da call appostita).
 * @extends {SimpleModuleDTO}
 */
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

/**
 * Classe che contiene gli attributi che indicano le interfacce esposte da un modulo.
 */
export class ModuleNetworkInterfaceDTO {
    id: string | number
    label: string
    module: ModuleDTO
    network: NetworkDTO
    nodeName: string
    type: string
    uuid: string
}

/**
 * Classe che contiene gli attributi che indicano le connessioni interfaccia-modulo.
 */
export class ConsumerInterfaceLinkDTO {
    local_interface: string
    module_instance: string
    remote_interface: string
}

/**
 * Classe che contiene gli attributi che indicano le proprietà dell'istanza di un modulo all'interno del node_templates.
 */
export class ModuleInstancePropertiesDTO {
    area: string
    description: string
    module: string
    version: string | number
    sequence: string | number
    consumer_interfaces_link: ConsumerInterfaceLinkDTO[]
}


/**
 * Classe che contiene gli attributi che indicano l'area di appartenenza di un modulo (complex).
 */
export class AreaDTO {
    id: string | number;
    uuid: string;
    name: string;
    description: string;
    theater: TheaterDTO;
    deleted: boolean | string;
}

/**
 * Classe che contiene gli attributi che indicano l'area di appartenenza di un modulo (simple).
 */
export class SimpleAreaDTO {
    area: string
    description: string
}

/**
 * Classe che contiene gli attributi che indicano le proprietà dell'istanza di un teatro all'interno del node_templates.
 */
export class TheaterInstancePropertiesDTO {
    mode: string
    tags: TagTIP[]
    areas: SimpleAreaDTO[]
    author: string
    version: string | number
    description: string
}

/**
 * Classe che contiene gli attributi che indicano un tag.
 */
export class TagTIP{
    tag: string
}

/**
 * Classe che contiene gli attributi che indicano in via generale le caratteristiche di un elemento che deve essere presente nel node_templates.
 */
export class ElementIntoTheaterDTO {  // goes into map in blueprint [name:string]: Module...
    properties: ModuleInstancePropertiesDTO | TheaterInstancePropertiesDTO
    type: string
}


/**
 * Classe che contiene gli attributi che indicano le caratteristiche di un teatro presente nel node_templates.
 */
export class ModuleInstanceDTO {
    properties: ModuleInstancePropertiesDTO
    type: string
}
/**
 * Classe che contiene gli attributi che indicano le caratteristiche di un modulo presente nel node_templates.
 */
export class TheaterInstanceDTO {
    properties: TheaterInstancePropertiesDTO
    type: string
}