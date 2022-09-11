/**
 * Classe che contiene gli attributi che indicano i network.
 */
export class NetworkDTO {
    id: string | number
    name: string
    uuid: string
}

/**
 * Classe che contiene gli attributi che indica la border network.
 */
export class BorderNetworkDTO {
    bnName: string
    id: string | number
    subnet: {} | null
    uuid: string | number
}

/**
 * Classe che contiene gli attributi che indicano le net os.
 */
export class NetOSRouterDTO {
    borderNetwork: BorderNetworkDTO
    id: string | number
    subnet: {} | null
    uuid: string | number
}


/**
 * Classe che contiene gli attributi che indicano le subnet.
 */
export class SubnetDTO {
    allocationPool: string
    borderNetwork: BorderNetworkDTO
    cidr: string
    dns: string
    gateway: string
    id: string | number
    isDhcp: boolean
    name: string
    network: NetworkDTO
    router: NetOSRouterDTO
    uuid: string
    version: string
}