/**
 * Classe che contiene gli attributi generali che indicano il flavor.
 */
export class FlavorBasicInfo {
    cpu: number | string;
    disk: number | string;
    ram: number | string;
}

/**
 * Classe che contiene gli attributi che indicano l'environment virtualizzato del flavor.
 */
export class VirtualizationEnvironmentTypeDTO {
    description: string
    id: number
    isEnabled: true
    name: string
    nameAlias: string
    supportMachineId: number
    uuid: string
}


/**
 * Classe che contiene gli attributi che indicano i flavor utilizzabili.
 * @extends {FlavorBasicInfo}
 */
export class FlavorDTO extends FlavorBasicInfo {
    name: string;
    detailJson: {};
    id: number | string;
    uuid: string;
    virtualizationEnvironmentType: VirtualizationEnvironmentTypeDTO;
}
