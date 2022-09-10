import { Node, Output as or, Input as ir } from "rete";
import { EnumNodeType } from "src/app/models/appType";
import { SimpleModuleApplication, ModuleApplication, TheaterApplication } from "src/app/services/modelsApplication/applicationModels";
import { StatisticItemDTO } from "src/app/services/modelsDTO/moduleDTO";
import { DeployInstanceDTO } from "src/app/services/modelsDTO/theaterDTO";



//module visualizer
export function ReteDisplayNodeDataMV(node: Node): { [field: string]: string[] }[] {
    let v: { [field: string]: string[] }[] = [];
    v["base"] = [
        { ["name"]: [node.data.name] as string[] },
        { ["type"]: [node.data.type] as string[] },
    ];
    v["ports"] = [];
    v["ports"]["input"] = [];
    v["ports"]["output"] = [];
    node.inputs.forEach((el) => {
        let s: string = el.connections.length + " connection";
        v["ports"]["input"].push(
            { [el.name]: s as unknown as string[] }
        );
    });
    node.outputs.forEach((el) => {
        let s: string = el.connections.length + " connection";
        v["ports"]["output"].push(
            { [el.name]: s as unknown as string[] }
        )
    });
    v["ports"]["input"] = v["ports"]["input"].length > 0 ? v["ports"]["input"] : [];
    v["ports"]["output"] = v["ports"]["output"].length > 0 ? v["ports"]["output"] : [];
    switch (node.data.type) {
        case EnumNodeType.Host:
            v["base"].push(
                { ["Operating System"]: [node.data.os] as string[] }
            )
            break;
        case EnumNodeType.Subnet:
            v["base"].push(
                { ["cidr"]: [node.data.cidr] as string[] },
                { ["DHCP"]: [node.data.isDhcp] as string[] },
                { ["IP version"]: [node.data.version] as string[] },
            )
            break;
        case EnumNodeType.Network:
            v["base"].push(
                { ["External Interface name"]: [node.data.externalInterfaceName] as string[] },
                { ["Type"]: [node.data.externalInterfaceType] as string[] }
            )
            break;

        default:
            alert("Problem loading module")
            break;
    }
    return v;
}
export function ReteDisplayModuleDataMV(module: ModuleApplication): { [field: string]: string[] }[][] {
    let v: { [field: string]: string[] }[][] = [];
    v["basic"] = [
        { ["Name"]: [module.name] as unknown as string[] },
        { ["Description"]: [module.description ? module.description : module.configurationTemplate.description ? module.configurationTemplate.description : "No available description"] as unknown as string[] },
        { ["Version"]: [module.version] as unknown as string[] },
        { ["Mode"]: [module.mode ? module.mode : "Module"] as unknown as string[] },
        { ["Type"]: [module.classification.expectedInstanceType] as unknown as string[] },
        { ["Platform"]: [module.configurationTemplate.platform] as unknown as string[] },
        { ["ID"]: [module.id] as unknown as string[] },
        { ["UUID"]: [module.uuid] as unknown as string[] },
        { ["Author"]: [module.author] as unknown as string[] },
        { ["Creation Date"]: [module.createdDate] as unknown as string[] },
        { ["Last Modify Date"]: [module.lastModifiedDate] as unknown as string[] },
        { ["Last Modify By"]: [module.lastModifiedBy] as unknown as string[] },
    ];
    v["counter"] = [
        { ["Host number"]: [module.host_number] as unknown as string[] },
        { ["Network number"]: [module.network_number] as unknown as string[] },
        { ["Subnet number"]: [module.subnet_number] as unknown as string[] },
    ];
    v["statistics"] = [
        { ["Validation status"]: [module.status.name] as unknown as string[] },
    ];
    // per ordine di occorrenza...
    v["statistics"].push({ ["Elapsed Time (sec)"]: [module.statistics["elapsed_time_sec"]] as unknown as string[] });
    v["statistics"].push({ ["Status"]: [module.statistics["status"]] as unknown as string[] });
    for (let key in module.statistics) {
        if (key === "status" || key === "elapsed_time_sec")
            continue;
        else {
            let value: StatisticItemDTO = module.statistics[key] as StatisticItemDTO;
            let shownString: string[] = [
                "error: " + value.error,
                "inserted: " + value.inserted,
                "updated: " + value.updated
            ];
            v["statistics"].push(
                { [key]: shownString as unknown as string[] },
            );
        }
    }
    v["option"] = [];
    v["option"]["input"] = [];
    v["option"]["output"] = [];
    for (let key in module.input) { //json -> parse
        let val: string[] = [];
        let x = JSON.parse(module.input[key].replace("\n", ''));
        Object.entries(x).map(([key, value]) => {
            val[key] = value;
        })
        v["option"]["input"].push(
            { [key]: val as unknown as string[] }
        );
    };
    for (let key in module.output) { //xml -> not parse
        let val: string[] = [module.output[key].replace("\n", '')];
        v["option"]["output"].push(
            { [key]: val as unknown as string[] }
        );
    };
    v["interfaces"] = [];
    v["interfaces"]["consumer_if"] = [];
    v["interfaces"]["producer_if"] = [];
    let x: string;
    module.interfaces?.forEach(el => {
        let s: [] = [];
        s["ID"] = el.id;
        s["UUID"] = el.uuid;
        if (el.type === "CONSUMER")
            x = "consumer_if";
        else
            x = "producer_if";
        v["interfaces"][x].push(
            { [el.nodeName]: s as unknown as string[] },
        );
    });
    v["interfaces"]["consumer_if"] = v["interfaces"]["consumer_if"].length > 0 ? v["interfaces"]["consumer_if"] : [];
    v["interfaces"]["producer_if"] = v["interfaces"]["producer_if"].length > 0 ? v["interfaces"]["producer_if"] : [];

    v["capabilities"] = [];
    for (let key in module.capabilities) {
        let val = module.capabilities[key];
        v["capabilities"].push(
            { [key]: val as unknown as string[] }
        )
    }

    v["parameters"] = []
    v["parameters"]["anchor"] = []
    for( let key in module.configurationTemplate.anchor_parameters){
        let val = module.configurationTemplate.anchor_parameters[key];
        v["parameters"]["anchor"].push(
            { [key]: val as unknown as string[] }
        )
    }
    v["parameters"]["fixed"] = []
    for( let key in module.configurationTemplate.fixed_parameters){
        let val = module.configurationTemplate.fixed_parameters[key];
        v["parameters"]["fixed"].push(
            { [key]: val as unknown as string[] }
        )
    }
    v["parameters"]["instance"] = []
    for( let key in module.configurationTemplate.instance_parameters){
        let val = module.configurationTemplate.instance_parameters[key];
        v["parameters"]["instance"].push(
            { [key]: val as unknown as string[] }
        )
    }
    v["parameters"]["structural"] = []
    for( let key in module.configurationTemplate.structural_parameters){
        let val = module.configurationTemplate.structural_parameters[key];
        v["parameters"]["fixed"].push(
            { [key]: val as unknown as string[] }
        )
    }
    return v;
}

//theater visualizer
export function ReteDisplayModuleDataTV(module: SimpleModuleApplication): { [field: string]: string[] }[][] {
    let v: { [field: string]: string[] }[][] = [];
    v["basic"] = [
        { ["Name"]: [module.name] as unknown as string[] },
        { ["Description"]: [module.description ? module.description : "No available description"] as unknown as string[] },
        { ["Version"]: [module.version] as unknown as string[] },
        { ["Type"]: [module.type] as unknown as string[] },
        { ["ID"]: [module.id] as unknown as string[] },
        { ["UUID"]: [module.uuid] as unknown as string[] },
        // { ["Deploy position"]: .... } // sequence sta nelle proprietà -> SimpleModuleRoot non le ha...
        { ["Creation Date"]: [module.createdDate] as unknown as string[] },
        { ["Last Modify Date"]: [module.lastModifiedDate] as unknown as string[] },
        { ["Last Modify By"]: [module.lastModifiedBy] as unknown as string[] },
    ];
    v["counter"] = [
        { ["Host number"]: [module.host_number] as unknown as string[] },
        { ["Network number"]: [module.network_number] as unknown as string[] },
        { ["Subnet number"]: [module.subnet_number] as unknown as string[] },
    ];
    v["interfaces"] = [];
    v["interfaces"]["consumer_if"] = [];
    v["interfaces"]["producer_if"] = [];
    let x: string; let cc = 0, cp = 0;
    module.interfaces?.forEach(el => {
        let s: [] = [];
        s["ID"] = el.id;
        s["UUID"] = el.uuid;
        if (el.type === "CONSUMER") {
            x = "consumer_if";
            cc++;
        }
        else {
            x = "producer_if";
            cp++;
        }
        v["interfaces"][x].push(
            { [el.nodeName]: s as unknown as string[] },
        );
    })
    // if (!cc) {
    //     v["interfaces"]["consumer_if"] = [
    //         { ["Consumer interfaces not found"]: "" as unknown as string[] },
    //     ];
    // }
    // if (!cp) {
    //     v["interfaces"]["producer_if"] = [
    //         { ["Producer interfaces not found"]: "" as unknown as string[] },
    //     ];
    // }
    v["interfaces"]["consumer_if"] = v["interfaces"]["consumer_if"].length > 0 ? v["interfaces"]["consumer_if"] : [];
    v["interfaces"]["producer_if"] = v["interfaces"]["producer_if"].length > 0 ? v["interfaces"]["producer_if"] : [];

    return v;
}
export function ReteDisplayTheaterDataTV(theater: TheaterApplication) {
    let v: { [field: string]: string[] }[][] = [];
    v["basic"] = [
        { ["Name"]: [theater.name] as unknown as string[] },
        { ["Description"]: [theater.description] as unknown as string[] },
        { ["Version"]: [theater.version] as unknown as string[] },
        { ["ID"]: [theater.id] as unknown as string[] },
        { ["UUID"]: [theater.uuid] as unknown as string[] },
        { ["Author"]: [theater.author] as unknown as string[] },
        { ["Create Date"]: [theater.createdDate] as unknown as string[] },
        { ["Last Modify Date"]: [theater.lastModifiedDate] as unknown as string[] },
        { ["Last Modify By"]: [theater.lastModifiedBy] as unknown as string[] },
    ];
    v["areas"] = [];
    theater.properties.areas?.forEach(a => {
        v["areas"].push(
            { [a.area]: [a.description] as unknown as string[] },
        )
    });
    v["imports"] = [];
    theater.blueprintFile.imports?.forEach(i => {
        v["imports"].push(
            { [i]: undefined },
        )
    });

    v["tags"] = [];
    theater.tags?.forEach(t => {
        v["tags"].push(
            { [t.name]: [t.description] as unknown as string[] },
        )
    });
    


    v["deploymentSequence"] = []; let i = 0;
    Object.entries(theater.deploymentSequence!).map(([key, value]) => {
        v["deploymentSequence"].push(
            { [key]: [(value as DeployInstanceDTO).moduleInstanceName] as unknown as string[] },
        )
    })
    v["mapping"] = [];
    theater.entityNameMappingFile?.name_mapping?.forEach(e => {
        let x: string[] = [];
        e.module_instance_name
            ? x["Module Instnce Name"] = e.module_instance_name
            : false;
        e.node_template_name
            ? x["Module Template Name"] = e.node_template_name
            : false;
        v["mapping"].push(
            { [e.display_name! as string]: x as unknown as string[] },
        )
    })
    return v;
}

// non viene usato in questa versione, ma, per i valori -> [0]:valore [1]:text|textarea|selection
export function ReteDisplayModuleInstanceTC(node: Node): { [field: string]: string[] }[] {
    let v: { [field: string]: string[] }[] = [
        { ["area"]: [node.data.area, "selection"] as unknown as string[] },
        { ["name"]: [node.data.name, "text"] as unknown as string[] },
        { ["description"]: [node.data.description, "textarea"] as unknown as string[] },
        { ["version"]: [node.data.version, "text"] as unknown as string[] },
    ]
    return v;
}
export function ReteDisplayModuleDataTC(module: SimpleModuleApplication): { [field: string]: string[] }[][] {
    let v: { [field: string]: string[] }[][] = [];
    v["basic"] = [
        { ["Name"]: [module.name] as unknown as string[] },
        { ["Description"]: [module.description ? module.description : "No available description"] as unknown as string[] },
        { ["Version"]: [module.version] as unknown as string[] },
        { ["Type"]: [module.type] as unknown as string[] },
        { ["ID"]: [module.id] as unknown as string[] },
        { ["UUID"]: [module.uuid] as unknown as string[] },
        { ["Creation Date"]: [module.createdDate] as unknown as string[] },
        { ["Last Modify Date"]: [module.lastModifiedDate] as unknown as string[] },
        { ["Last Modify By"]: [module.lastModifiedBy] as unknown as string[] },
    ];
    v["counter"] = [
        { ["Host number"]: [module.host_number] as unknown as string[] },
        { ["Network number"]: [module.network_number] as unknown as string[] },
        { ["Subnet number"]: [module.subnet_number] as unknown as string[] },
    ];
    v["interfaces"] = [];
    v["interfaces"]["consumer_if"] = [];
    v["interfaces"]["producer_if"] = [];
    let x: string; let cc = 0, cp = 0;
    module.interfaces?.forEach(el => {
        let s: [] = [];
        s["ID"] = el.id;
        s["UUID"] = el.uuid;
        if (el.type === "CONSUMER") {
            x = "consumer_if";
            cc++;
        }
        else {
            x = "producer_if";
            cp++;
        }
        v["interfaces"][x].push(
            { [el.nodeName]: s as unknown as string[] },
        );
    })
    if (!cc) {
        v["interfaces"]["consumer_if"] = [];
    }
    if (!cp) {
        v["interfaces"]["producer_if"] = [];
    }

    return v;
}
export function ReteDisplayTheaterDataTC(theater: TheaterApplication) {
    let v: { [field: string]: string[] }[][] = [];
    v["basic"] = [
        { ["Name"]: [theater.name] as unknown as string[] },
        { ["Description"]: [theater.description] as unknown as string[] },
        { ["Version"]: [theater.version] as unknown as string[] },
        // { ["ID"]: [theater.id] as unknown as string[] },
        // { ["UUID"]: [theater.uuid] as unknown as string[] },
        { ["Author"]: [theater.author] as unknown as string[] },
        { ["Create Date"]: [theater.createdDate] as unknown as string[] },
        // { ["Last Modify Date"]: [theater.lastModifiedDate] as unknown as string[] },
        // { ["Last Modify By"]: [theater.lastModifiedBy] as unknown as string[] },
    ];
    v["areas"] = [];
    theater.properties.areas?.forEach(a => {
        v["areas"].push(
            { [a.area]: [a.description] as unknown as string[] },
        )
    });
    v["imports"] = [];
    theater.blueprintFile.imports?.forEach(i => {
        v["imports"].push(
            { [i]: undefined },
        )
    });
    // TODO
    // v["deploymentSequence"] = []; let i = 0;
    // Object.entries(theater.deploymentSequence!).map(([key, value]) => {
    //     v["deploymentSequence"].push(
    //         { [key]: [(value as DeployInstanceDTO).moduleInstanceName] as unknown as string[] },
    //     )
    // })

    // MAPPING -> FUTURE IMPLEMENTAZIONI
    // v["mapping"] = [];
    // theater.entityNameMappingFile?.name_mapping?.forEach(e => {
    //     let x: string[] = [];
    //     e.module_instance_name
    //         ? x["Module Instnce Name"] = e.module_instance_name
    //         : false;
    //     e.node_template_name
    //         ? x["Module Template Name"] = e.node_template_name
    //         : false;
    //     v["mapping"].push(
    //         { [e.display_name! as string]: x as unknown as string[] },
    //     )
    // })
    return v;
}


export function ReteDisplayModuleDataMC(module: ModuleApplication): { [field: string]: string[] }[][] {
    let v: { [field: string]: string[] }[][] = [];
    v["basic"] = [
        { ["Name"]: [module.name] as unknown as string[] },
        { ["Description"]: [module.description ? module.description : "No available description"] as unknown as string[] },
        { ["Version"]: [module.version] as unknown as string[] },
        { ["Author"]: [module.author] as unknown as string[] },
        // { ["ID"]: [module.id] as unknown as string[] },
        // { ["UUID"]: [module.uuid] as unknown as string[] },
        // { ["Deploy position"]: .... } // sequence sta nelle proprietà -> SimpleModuleRoot non le ha...
        { ["Creation Date"]: [module.createdDate] as unknown as string[] },
        // { ["Last Modify Date"]: [module.lastModifiedDate] as unknown as string[] },
        // { ["Last Modify By"]: [module.lastModifiedBy] as unknown as string[] },
    ];
    // v["counter"] = [
    //     { ["Host number"]: [module.host_number] as unknown as string[] },
    //     { ["Network number"]: [module.network_number] as unknown as string[] },
    //     { ["Subnet number"]: [module.subnet_number] as unknown as string[] },
    // ];
    // v["interfaces"] = [];
    // v["interfaces"]["consumer_if"] = [];
    // v["interfaces"]["producer_if"] = [];
    // let x: string; let cc = 0, cp = 0;
    // module.interfaces?.forEach(el => {
    //     let s: [] = [];
    //     s["ID"] = el.id;
    //     s["UUID"] = el.uuid;
    //     if (el.type === "CONSUMER") {
    //         x = "consumer_if";
    //         cc++;
    //     }
    //     else {
    //         x = "producer_if";
    //         cp++;
    //     }
    //     v["interfaces"][x].push(
    //         { [el.nodeName]: s as unknown as string[] },
    //     );
    // })
    // // if (!cc) {
    // //     v["interfaces"]["consumer_if"] = [
    // //         { ["Consumer interfaces not found"]: "" as unknown as string[] },
    // //     ];
    // // }
    // // if (!cp) {
    // //     v["interfaces"]["producer_if"] = [
    // //         { ["Producer interfaces not found"]: "" as unknown as string[] },
    // //     ];
    // // }
    // v["interfaces"]["consumer_if"] = v["interfaces"]["consumer_if"].length>0?v["interfaces"]["consumer_if"]: [{ ["Consumper interface not found"]: undefined as unknown as string[] }];
    // v["interfaces"]["producer_if"]= v["interfaces"]["producer_if"].length>0?v["interfaces"]["producer_if"]:[{ ["Producer interface not found"]: undefined as unknown as string[] }];

    return v;
}