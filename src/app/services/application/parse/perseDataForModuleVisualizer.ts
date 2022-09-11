import { ModuleService } from '../../api/module.service';
import { ModuleNetworkInterfaceDTO, ModuleDTO } from '../../modelsDTO/moduleDTO';
import {ReteConnection, NodeTopologyElement, ModuleApplication } from '../../modelsApplication/applicationModels';
import { HostModuleDTO, HostPortModuleDTO } from '../../modelsDTO/hostDTO';
import { SubnetDTO } from '../../modelsDTO/networkDTO';
import {  ReteHostInfo } from 'src/app/rete-settings/nodes/rete-nodes/host/hostNode';
import {  ReteNetworkInfo } from 'src/app/rete-settings/nodes/rete-nodes/network/networkNode';
import { ReteSubnetInfo } from 'src/app/rete-settings/nodes/rete-nodes/subnet/subnetNode';
import {  StaticValue } from 'src/app/models/appType';
import { createHost, createSubnet, createNetwork } from './parseCommonElement';


/**
 * Elemento che ha lo scopo di eseguire il fetching ed il parsing dei dati per la costruzione del modulo.
 */
export class PerseDataForModuleVisualizer {


    /**
     * Costruttore della componente.
     * @param moduleService 
     */
    constructor(private moduleService: ModuleService) {
    }




    /**
     * Funzione che ritorna il modulo parserizzato per la visualizzazione.
     * @param id 
     * @returns {Promise<ModuleApplication> }
     * @see {parseMainModule}
     */
    async parseModuleForModuleVisualizer(id: string | number): Promise<ModuleApplication> {
        let moduleDTO: ModuleDTO;
        let module: ModuleApplication;
        [moduleDTO, module] = await this.parseMainModule(id);
        return module;
    }




    /**
     * Funzione che esegue il fetching e il parsing dei dati del modulo.
     * Si procura anche i dati di dettaglio sui nodi e topologie.
     * @param id 
     * @returns {Promise<[ModuleDTO, ModuleApplication]>}
     * @see {getModuleByID}
     * @see {getMainModuleDetails}
     * @see {getMainModuleTopology}
     */
    async parseMainModule(id: string | number): Promise<[ModuleDTO, ModuleApplication]> {
        let module: ModuleDTO = await this.moduleService.getModuleByID(id);
        let parsedModule: ModuleApplication = await this.getMainModuleDetails(module)
        this.getMainModuleTopology(parsedModule);
        return [module, parsedModule];
    }




    /**
     * Funzione che prende i dati dei nodi e interfacce del modulo e le collega ad esso.
     * @param module 
     * @returns {Promise<ModuleApplication> }
     * @see {getMainModuleNodes}
     * @see {getMainModuleInterfaces}
     */
    async getMainModuleDetails(module: ModuleDTO): Promise<ModuleApplication> {
        let h: HostModuleDTO[] = await this.getMainModuleNodes(module);
        let i: ModuleNetworkInterfaceDTO[] = await this.getMainModuleInterfaces(module);
        let moduleInfo2: ModuleApplication = {
            imports: [],
            ...module,
            hosts: h,
            interfaces: i,
            host_number: 0,
            subnet_number: 0,
            network_number: 0,
            topology: new NodeTopologyElement
        };
        return moduleInfo2;
    }




    /**
     * Funzione che segue il fetching degli host del modulo.
     * @param module 
     * @returns {Promise<HostModuleDTO[]>}
     * @see {moduleService}
     */
    async getMainModuleNodes(module: ModuleDTO): Promise<HostModuleDTO[]> {
        let h: HostModuleDTO[] = undefined;
        try {
            h = await this.moduleService.getModuleHostByTheaterUUID(module.uuid);
        } catch (e) {
            console.error(e);
        }
        return h;
    }




    /**
     * Funzione che segue il fetching delle intefracce del modulo.
     * @param module 
     * @returns {Promise<ModuleNetworkInterfaceDTO[]>}
     * @see {moduleService}
     */
    async getMainModuleInterfaces(module: ModuleDTO): Promise<ModuleNetworkInterfaceDTO[]> {
        let i: ModuleNetworkInterfaceDTO[] = [];
        try {
            i = await this.moduleService.getModuleInterfacesByModuleID(module.id);
        } catch (e) {
            console.error(e);
        }
        return i;
    }




    /**
     * Funzione che ha lo scopo di collegare, inizializzare e parserizzare i nodi del modulo e strutturare la topologia per la visualizzazione su canvas.
     * Crea anche direttamente i nodi per il rendering dell'editor.
     * @param moduleInfo 
     * @see {createHost}
     * @see {createSubnet}
     * @see {createNetwork}
     */
    getMainModuleTopology(moduleInfo: ModuleApplication) {
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
                                        occourence.set(network_name, network_name) // segno l'occorrenza
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
    }





}
