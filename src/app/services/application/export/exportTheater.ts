import { Data, InputData, NodeData } from "rete/types/core/data";
import { TheaterApplication } from "../../modelsApplication/applicationModels";
import { ModuleInstanceSimpleData, PropertiesMISD, TheaterExport, TheaterSimpleData } from "../../modelsExport/theaterExport";
import { ModeTypeExport, ModuleTypeExport, TheaterTypeExport, ToscaDefinitionType } from "../../modelsExport/TypeExport";

export class ExportTheater {

    theater: TheaterApplication
    dataEditor: Data

    constructor(theater: TheaterApplication, dataEditor: Data) {
        this.theater = theater;
        this.dataEditor = dataEditor;
    }

    convertTheater(): TheaterExport {
        let te: TheaterExport = new TheaterExport();
        te.tosca_definitions_version = ToscaDefinitionType.cloudify
        te.description = this.theater.description;
        te.imports = this.theater.blueprintFile.imports;
        let nt: { [name: string]: TheaterSimpleData | ModuleInstanceSimpleData } = {}
        // inizia a prendere i moduli del teatro
        for (let key in this.dataEditor.nodes) {
            let element: NodeData = this.dataEditor.nodes[key];
            nt = Object.assign({}, nt, this.getModuleInstanceExport(element));
        }
        nt = { ...nt, ...this.getTheaterExport() }
        te.node_templates = nt;
        return te;
    }

    getModuleInstanceExport(module: NodeData): { [name: string]: ModuleInstanceSimpleData } {
        let mi: { [name: string]: ModuleInstanceSimpleData } = {};
        let moduleInstanceSimpleData: ModuleInstanceSimpleData = {
            type: ModuleTypeExport[module.data.type as unknown as string]?ModuleTypeExport[module.data.type as unknown as string]:ModuleTypeExport[0],
            properties: {
                module: module.data.module as unknown as string,
                version: module.data.version as unknown as string,
                area: module.data.area as unknown as string,
                sequence: module.data.sequence as unknown as number,
                consumer_interface_link: [],
                sources: null,
            }
        }

        // TODO
        for (let key in module.inputs) {
            let consumerIF: InputData = module.inputs[key];
            consumerIF.connections.forEach(c => {
                let moduleConnected: NodeData = this.dataEditor.nodes[c.node];
                moduleInstanceSimpleData.properties.consumer_interface_link.push(
                    {
                        local_interface: key,
                        module_interface: moduleConnected.data.name as unknown as string,
                        remote_interface: c.output
                    }
                )
            })
        }

        mi[module.data.name as unknown as string] = moduleInstanceSimpleData;
        return mi;
    }

    getTheaterExport(): { [name: string]: TheaterSimpleData } {
        let ti: { [name: string]: TheaterSimpleData } = {};
        let theaterSimpleData: TheaterSimpleData = {
            type: TheaterTypeExport.Theater,
            properties: {
                version: this.theater.version,
                description: this.theater.version,
                mode: ModeTypeExport.managed,
                author: this.theater.author,
                areas: [],
                tags: [],
            }
        }

        this.theater.properties.areas.forEach(a => {
            theaterSimpleData.properties.areas.push(
                { area: a.area, description: a.description }
            )
        });

        this.theater.tags.forEach(t => {
            theaterSimpleData.properties.tags.push(
                { tag: t.name}
            )
        });

        ti[this.theater.name] = theaterSimpleData;
        return ti
    }

}