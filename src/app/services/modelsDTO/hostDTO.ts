import { NetworkDTO, SubnetDTO } from "./networkDTO"

/**
 * Classe che contiene gli attributi che indicano le porte degli host.
 */
export class HostPortModuleDTO {
    id: string | number
    name: string
    networks: NetworkDTO[]
    subnets: SubnetDTO[]
}

/**
 * Classe che contiene gli attributi che indicano gli host.
 */
export class HostModuleDTO {
    hasQuery: boolean
    id: string | number
    name: string
    ports: HostPortModuleDTO[]
    uuid: string
}