export class NetworkDTO {
    id: string | number
    name: string
    uuid: string
}

export class BorderNetworkDTO {
    bnName: string
    id: string | number
    subnet: {} | null
    uuid: string | number
}

export class NetOSRouterDTO {
    borderNetwork: BorderNetworkDTO
    id: string | number
    subnet: {} | null
    uuid: string | number
}

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