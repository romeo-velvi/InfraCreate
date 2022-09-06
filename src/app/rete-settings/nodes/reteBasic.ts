import { Node, Output as or, Input as ir } from "rete";
import { EnumNodeType, EnumModuleType } from "src/app/models/appType";
import { SimpleModuleApplication, ModuleApplication, TheaterApplication } from "src/app/services/modelsApplication/applicationModels";
import { ModuleInstancePropertiesDTO, ModuleNetworkInterfaceDTO, StatisticItemDTO, TheaterInstancePropertiesDTO } from "src/app/services/modelsDTO/moduleDTO";
import { DeployInstanceDTO, EntityNameMappingFileDTO, NameMappingDTO } from "src/app/services/modelsDTO/theaterDTO";
// import { EnumModuleType, EnumNodeType } from "../models/reteModelType";

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
