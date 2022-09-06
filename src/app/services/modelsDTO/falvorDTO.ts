export class FlavorBasicInfo {
    cpu: number | string;
    disk: number | string;
    ram: number | string;
}

export class VirtualizationEnvironmentTypeDTO {
    description: string
    id: number
    isEnabled: true
    name: string
    nameAlias: string
    supportMachineId: number
    uuid: string
}

export class FlavorDTO extends FlavorBasicInfo {
    name: string;
    detailJson: {};
    id: number | string;
    uuid: string;
    virtualizationEnvironmentType: VirtualizationEnvironmentTypeDTO;
}
