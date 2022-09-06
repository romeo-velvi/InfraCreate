
import { TheaterService } from '../../api/theater.service';
import { ModuleService } from '../../api/module.service';
import { ModuleInstanceDTO, ModuleListDTO, ModuleNetworkInterfaceDTO, SimpleModuleDTO } from '../../modelsDTO/moduleDTO';
import { SimpleModuleApplication, ModuleInstance, ReteConnection } from '../../modelsApplication/applicationModels';
import { HostModuleDTO, HostPortModuleDTO } from '../../modelsDTO/hostDTO';
import { SubnetDTO } from '../../modelsDTO/networkDTO';
import { ReteHostInfo } from 'src/app/rete-settings/nodes/rete-nodes/host/hostNode';
import { ReteNetworkInfo } from 'src/app/rete-settings/nodes/rete-nodes/network/networkNode';
import { ReteSubnetInfo } from 'src/app/rete-settings/nodes/rete-nodes/subnet/subnetNode';
import { StaticValue } from 'src/app/models/appType';
import { createHost, createSubnet, createNetwork, createModuleNode } from './parseCommonElement';
import { ModuleType2, TheaterNodeTypeFromTheater } from 'src/app/rete-settings/nodes/rete-modules/export-rete-modules';

export class PerseDataForTheaterComposer {

    constructor(private moduleService: ModuleService) {
    }

    async parseModuleForTheaterComposer(): Promise<{ [name: string]: ModuleInstance }> {
        let modules: { [name: string]: SimpleModuleApplication } = await this.parseModuleList();
        let moduleInstances: { [name: string]: ModuleInstance } = await this.initEmptyModuleInstance(modules);
        return moduleInstances
    }
    async parseModuleList(): Promise<{ [name: string]: SimpleModuleApplication }> {
        let rowModules: SimpleModuleDTO[] = await this.moduleService.getAllModules();
        let modules: { [name: string]: SimpleModuleApplication } = await this.getModuleDict(rowModules)
        this.getModulesTopology(modules);
        return modules;
    }
    async getModuleDict(modules: SimpleModuleDTO[]): Promise<{ [name: string]: SimpleModuleApplication }> {
        let moduleDict: { [name: string]: SimpleModuleApplication } = {};
        let modulesApplication: SimpleModuleApplication[] = await this.getModulesDetails(modules);
        Object.entries(modulesApplication).map(async ([key, value]) => {
            moduleDict[value.name] = value;
        });
        return moduleDict;
    }
    async getModulesDetails(modules: SimpleModuleDTO[]): Promise<SimpleModuleApplication[]> {
        let h: { [key: string]: HostModuleDTO[] } = await this.getModulesNodes(modules);
        let i: { [key: string]: ModuleNetworkInterfaceDTO[] } = await this.getModulesInterfaces(modules);
        let moduleInfo: SimpleModuleApplication[] = [];
        await Promise.all(
            Object.entries(modules).map(async ([key, value]) => {
                moduleInfo[key] = {
                    ...value,
                    hosts: h[key],
                    interfaces: i[key],
                }
            })
        )
        return moduleInfo;
    }
    async getModulesNodes(modules: SimpleModuleDTO[]): Promise<{ [key: string]: HostModuleDTO[] }> {
        let h: { [key: string]: HostModuleDTO[] } = {};
        await Promise.all(
            Object.entries(modules).map(async ([key, value]) => {
                let simpleModuleDTO: SimpleModuleDTO = value as SimpleModuleDTO;
                try {
                    h[key] = await this.moduleService.getModuleHostByTheaterUUID(simpleModuleDTO.uuid);
                } catch (e) {
                    console.error(e);
                }
            })
        )
        return h;
    }
    async getModulesInterfaces(modules: SimpleModuleDTO[]): Promise<{ [key: string]: ModuleNetworkInterfaceDTO[] }> {
        let i: { [key: string]: ModuleNetworkInterfaceDTO[] } = {};
        await Promise.all(
            Object.entries(modules).map(async ([key, value]) => {
                let simpleModuleDTO: SimpleModuleDTO = value as SimpleModuleDTO;
                try {
                    i[key] = await this.moduleService.getModuleInterfacesByModuleID(simpleModuleDTO.id);
                } catch (e) {
                    console.error(e);
                }
            })
        )
        return i;
    }
    getModulesTopology(modulesInfo: { [name: string]: SimpleModuleApplication }) {
        Object.entries(modulesInfo).map(([key, value]) => {
            let moduleInfo: SimpleModuleApplication = value;
            var occourence: Map<string, string> = new Map<any, any>();
            var connections_list: ReteConnection[] = [];
            var elements: { [name: string]: ReteHostInfo | ReteSubnetInfo | ReteNetworkInfo } = {};
            var hn: number = 0, sn: number = 0, nn: number = 0;
            moduleInfo.hosts.forEach(
                (node: HostModuleDTO) => {
                    let host_name: string = node.name;
                    elements[host_name] = createHost(host_name, node);
                    hn++; // counter
                    node.ports.forEach(
                        (port: HostPortModuleDTO) => {
                            let port_name: string = port.name;
                            port.subnets.forEach(
                                (subnet: SubnetDTO) => { // controllo subnet & network
                                    let subnet_name: string = subnet.name;
                                    let network_name: string = subnet.network.name;
                                    if (!occourence.get(subnet_name)) { // se non è stata considerata la subnet -> add
                                        elements[subnet_name] = createSubnet(subnet_name, subnet)
                                        occourence.set(subnet_name, subnet_name) // segno l'occorrenza
                                        sn++; // counter
                                        elements[subnet_name].Output.push(network_name) // add output port to sub

                                        if (!occourence.get(network_name)) { // se non è stata considerata la network -> add
                                            elements[network_name] = createNetwork(network_name, moduleInfo.interfaces);
                                            occourence.set(network_name, network_name); // segno l'occorrenza
                                            nn++; // counter
                                        }
                                        elements[network_name].Input.push(subnet_name) // add input port to net

                                        connections_list.push( // add connection sub->net
                                            {
                                                from: subnet_name,
                                                port_src: network_name,
                                                to: network_name,
                                                port_dst: subnet_name
                                            }
                                        )
                                    }
                                    elements[host_name].Output.push(port_name) // add output port to host
                                    connections_list.push( // add connection host->sub
                                        {
                                            from: host_name,
                                            port_src: port_name,
                                            to: subnet_name,
                                            port_dst: StaticValue.SubnetOutput
                                        }
                                    )
                                }
                            )
                        }
                    )
                }
            )
            // assign value to module
            moduleInfo.topology = {
                connection: connections_list,
                elements: elements
            };
            moduleInfo.host_number = hn;
            moduleInfo.subnet_number = sn;
            moduleInfo.network_number = nn;
        });
    }
    initEmptyModuleInstance(modules: { [name: string]: SimpleModuleApplication }): { [name: string]: ModuleInstance } {
        let x: { [name: string]: ModuleInstance } = {};
        Object.entries(modules).map(async ([key, value]) => {
            let smr: SimpleModuleApplication = value as SimpleModuleApplication;
            if (ModuleType2[smr.type]) {  // se è tra i tipi definiti
                let mit: ModuleInstanceDTO = {
                    properties: {
                        description: '',
                        area: '',
                        module: smr.name,
                        version: undefined,
                        sequence: '',
                        consumer_interfaces_link: []
                    },
                    type: TheaterNodeTypeFromTheater[ModuleType2[value.type]],
                };

                let ma: ModuleInstance = createModuleNode(undefined, mit, smr)
                // x["Instance "+key] = ma;
                x[key] = ma;
            }
        });
        return x;
    }


}
