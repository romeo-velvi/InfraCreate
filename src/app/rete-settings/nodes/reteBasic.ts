import { EnumNodeType, EnumModuleType } from "src/app/models/appType";
import { ModuleInstancePropertiesDTO} from "src/app/services/modelsDTO/moduleDTO";

export class reteBasicNodeInfo {
    Input: string[];
    Output: string[];
    name: string;
    readonly type: EnumNodeType;
}

export class reteBasicModuleInfo extends ModuleInstancePropertiesDTO { // may extends retemodulenodeinfo
    Input: string[];
    Output: string[];
    name: string;
    host_number: number;
    network_number: number
    subnet_number: number
    readonly type: EnumModuleType;
}
