import { NetworkDTO, SubnetDTO } from "./networkDTO"

export class HostPortModuleDTO {
    id: string | number
    name: string
    networks: NetworkDTO[]
    subnets: SubnetDTO[]
}

export class HostModuleDTO {
    hasQuery: boolean
    id: string | number
    name: string
    ports: HostPortModuleDTO[]
    uuid: string
}