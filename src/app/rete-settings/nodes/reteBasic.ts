import { EnumNodeType, EnumModuleType } from "src/app/models/appType";
import { ModuleInstancePropertiesDTO} from "src/app/services/modelsDTO/moduleDTO";

/**
 * Elemento che rappresenta una struttura dati generale per le classi dei singoli nodi.
 */
export class reteBasicNodeInfo {
    Input: string[];
    Output: string[];
    name: string;
    readonly type: EnumNodeType;
}


/**
 * Elemento che rappresenta una struttura dati generale per le classi dei singoli moduli.
 * @extends {reteBasicModuleInfo}
 */
export class reteBasicModuleInfo extends ModuleInstancePropertiesDTO { // may extends retemodulenodeinfo
    Input: string[];
    Output: string[];
    name: string;
    host_number: number;
    network_number: number
    subnet_number: number
    readonly type: EnumModuleType;
}
