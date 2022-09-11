import { TheaterService } from '../../api/theater.service';
import { ModuleService } from '../../api/module.service';
import { TheaterDTO, TheaterType } from '../../modelsDTO/theaterDTO';
import { ElementIntoTheaterDTO, ModuleInstanceDTO, ModuleNetworkInterfaceDTO, SimpleModuleDTO, TheaterInstancePropertiesDTO } from '../../modelsDTO/moduleDTO';
import { SimpleModuleApplication, ModuleInstance, TheaterApplication, ReteConnection } from '../../modelsApplication/applicationModels';
import { HostModuleDTO, HostPortModuleDTO } from '../../modelsDTO/hostDTO';
import { SubnetDTO } from '../../modelsDTO/networkDTO';
import { ReteHostInfo } from 'src/app/rete-settings/nodes/rete-nodes/host/hostNode';
import { ReteNetworkInfo } from 'src/app/rete-settings/nodes/rete-nodes/network/networkNode';
import { ReteSubnetInfo } from 'src/app/rete-settings/nodes/rete-nodes/subnet/subnetNode';
import { StaticValue } from 'src/app/models/appType';
import { createHost, createSubnet, createNetwork, createModuleNode } from './parseCommonElement';


/**
 * Elemento che ha lo scopo di eseguire il fetching ed il parsing dei dati per la visualizzazione del teatro.
 */
export class ParseDataForTheaterVisualizer {

    /**
     * Costruttore componente.
     * @param theaterService 
     * @param moduleService 
     */
    constructor(
        private theaterService: TheaterService,
        private moduleService: ModuleService,
    ) {
    }




    /**
     * Funzione che viene richiamata per fornire il teatro pareserizzato.
     * Questa funzione si avvale di tutte quei metodi che permettono di restituire e fixare un output adatto all'applicazione.
     * @param id 
     * @returns {Promise<TheaterApplication>}
     * @see {parseTheater}
     * @see {parseModulesFromTheater}
     * @see {parseModuleInstance}
     * @see {getModuleConnection}
     */
    async parseTheaterForTheaterVisualizer(id: string | number): Promise<TheaterApplication> {

        var theaterDTO: TheaterDTO;
        var theater: TheaterApplication;
        [theaterDTO, theater] = await this.parseTheater(id as string);

        var modules: { [name: string]: SimpleModuleApplication } = await this.parseModulesFromTheater(theater.uuid);

        // connect modules to instance-module into theater
        var moduleInstances: { [name: string]: ModuleInstance }
            = await this.parseModuleInstance(theater, modules);

        //assign theater topology
        theater.topology = {
            elements: moduleInstances,
            connection: this.getModuleConnection(theater)
        }

        return theater;
    }




    /**
     * Funzione che ritorna i dati a seguito della fetch con il server.
     * @param id 
     * @returns {Promise<[TheaterDTO, TheaterApplication]>}
     * @see {theaterService}
     * @see {initTheaterAfterFetch}
     */
    async parseTheater(id: string | number): Promise<[TheaterDTO, TheaterApplication]> {
        //normalizzazione & get theater
        var rowTheater: TheaterDTO = await this.theaterService.getTheaterInfoByID(id);
        let theater: TheaterApplication = await this.initTheaterAfterFetch(rowTheater);
        return [rowTheater, theater];
    }




    /**
     * Funzione che inizializza gli attributi del teatro per l'applicazione.
     * @param rowTheater 
     * @returns {TheaterApplication}
     * @see {fixTheaterName}
     */
    initTheaterAfterFetch(rowTheater: TheaterDTO): TheaterApplication {
        this.fixTheaterName(rowTheater);
        let theaterProperties: TheaterInstancePropertiesDTO = this.get_and_remove_theater_properties_from_blueprint(rowTheater);
        let theater: TheaterApplication = {
            ...rowTheater,
            properties: theaterProperties,
            elements: {},
            connection: [],
            topology: undefined
        };
        return theater;
    }





    /**
     * Funzione che ha come scopo la fix del nome del teatro nel caso diverga dalla sua rappresentazione nel node_templates.
     * @param rowTheater 
     */
    fixTheaterName(rowTheater: TheaterDTO) {
        // @check controllo incoerenza nome teatro con quello riporato in node_templates -> si preferisce quello proveniente dal blueprint
        if (!rowTheater.blueprintFile.node_templates[rowTheater.name]) {
            Object.entries(rowTheater.blueprintFile.node_templates).map(([key, value]) => {
                let moduleIntoTheater: ElementIntoTheaterDTO = value as ElementIntoTheaterDTO
                if (moduleIntoTheater.type.toLowerCase().includes(TheaterType.toLowerCase())) {
                    rowTheater.name = key;
                    return;
                }
            });
            console.warn("Theater name doesn't match");
        }
    }





    /**
     * Funzione che serve ad esportare le proprietà del modulo dalla parte dei node_templates all'oggetto generale.
     * @param rowTheater 
     * @returns {TheaterInstancePropertiesDTO}
     */
    get_and_remove_theater_properties_from_blueprint(rowTheater: TheaterDTO): TheaterInstancePropertiesDTO {
        // esporta e rimuove le proprietà situate in node_modules
        let moduleIntoTheater: ElementIntoTheaterDTO = rowTheater.blueprintFile.node_templates[rowTheater.name];
        let theaterProperties: TheaterInstancePropertiesDTO = moduleIntoTheater.properties as TheaterInstancePropertiesDTO;
        delete rowTheater.blueprintFile.node_templates[rowTheater.name];
        return theaterProperties;
    }





    /**
     * Funzione che si occupa di eseguire il fetching dei moduli appartenenti al teatro e le ritorna come dizionario di modulo-oggetto.
     * Si occupa anche di organizzare la topologia dei moduli del teatro.
     * @param theaterUUID 
     * @returns {Promise<{ [name: string]: SimpleModuleApplication }>}
     * @see {theaterService}
     * @see {getModuleDict}
     * @see {getModulesTopology}
     */
    async parseModulesFromTheater(theaterUUID: string | number): Promise<{ [name: string]: SimpleModuleApplication }> {
        //normalizzazione & get modules -> Assign Map
        let rowModules: SimpleModuleDTO[] = await this.theaterService.getTheaterModulesByUUID(theaterUUID);
        let modules: { [name: string]: SimpleModuleApplication } = await this.getModuleDict(rowModules);
        this.getModulesTopology(modules);
        return modules;
    }





    /**
     * Funzione che prende in input i dati dei moduli del teatro e le ritorna parserizzati e sottoforma organizzata di dizionario.
     * @param modules 
     * @returns { Promise<{ [name: string]: SimpleModuleApplication }>}
     * @see {getModulesDetails}
     */
    async getModuleDict(modules: SimpleModuleDTO[]): Promise<{ [name: string]: SimpleModuleApplication }> {
        let moduleDict: { [name: string]: SimpleModuleApplication } = {};
        let modulesApplication: SimpleModuleApplication[] = await this.getModulesDetails(modules);
        Object.entries(modulesApplication).map(async ([key, value]) => {
            moduleDict[value.name] = value;
        });
        return moduleDict;
    }




    /**
     * Funzione che prende i moduli reperiti dal server e li parserizza e "arricchisce" con le informazione dei nodi e interfacce.
     * @param modules 
     * @returns {Promise<SimpleModuleApplication[]>}
     * @see {getModulesNodes}
     * @see {getModulesInterfaces}
     */
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





    /**
     * Funzione che esegue il fetch degli host di un modulo di un teatro.
     * @param modules 
     * @returns {Promise<{ [key: string]: HostModuleDTO[] }>}
     * @see {moduleService}
     */
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





    /**
     * Funzione che esegue il fetch delle interfacce di un modulo di un teatro.
     * @param modules 
     * @returns {Promise<{ [key: string]: ModuleNetworkInterfaceDTO[] }>}
     * @see {moduleService}
     */
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




    /**
     * Funzione che si occupa di collegare le istanze dei moduli del teatro con i dettagli dei singoli moduli (root).
     * Questa funzione produce direttamente i dati del modulo (sottoforma di nodo) da poter essere inserito nel canvas.
     * @param theater 
     * @param modules 
     * @returns {{ [name: string]: ModuleInstance }}
     */
    parseModuleInstance(theater: TheaterApplication, modules: { [name: string]: SimpleModuleApplication }): { [name: string]: ModuleInstance } {
        var elements: { [name: string]: ModuleInstance } = {};
        Object.entries(theater.blueprintFile.node_templates).map(async ([key, value]) => {
            let moduleInstanceName: string = key;
            let moduleInstance: ModuleInstanceDTO = value as ModuleInstanceDTO;
            let smr = modules[moduleInstance.properties.module]
            // @check -> if module instance has connection with module root & name is correct
            if (!smr) {
                for (let key in modules) {
                    if (key.toLowerCase().includes(moduleInstance.properties.module.toLowerCase())) {
                        smr = modules[key]; //modulo più probabile
                    }
                }
                console.warn("Root module not exists or invalid.\n Declared into instance: ", moduleInstance.properties.module, ".\nLinked to", smr.name, "into Root module list")
            }
            let newModule: ModuleInstance = createModuleNode(moduleInstanceName, moduleInstance, smr);
            elements[moduleInstanceName] = newModule;
        });
        return elements;
    }





    /**
     * Funzione che ha lo scopo di valorizzare le connessioni dei moduli
     * @param theater 
     * @returns {ReteConnection[]}
     */
    getModuleConnection(theater: TheaterApplication): ReteConnection[] {
        var connections_list: ReteConnection[] = [];
        Object.entries(theater.blueprintFile.node_templates).map(([key, value]) => {
            let module_name: string = key;
            let module_content: ModuleInstanceDTO = value as ModuleInstanceDTO;
            if (module_content.properties.consumer_interfaces_link) {
                Object.entries(module_content.properties.consumer_interfaces_link).map(([key, value]) => {
                    connections_list.push(
                        {
                            from: module_name,
                            port_src: value.local_interface,
                            to: value.module_instance,
                            port_dst: value.remote_interface
                        }
                    );
                });
            }
        });
        return connections_list;
    }




    /**
     * Funzione che ha lo scopo di controllare ed inserire la topologia dei nodi di ogni moduli del teatro.
     * Questa funzione inizializza già i nodi da poter essere inseriti nel canvas.
     * @param modulesInfo 
     * @see {createHost}
     * @see {createSubnet}
     * @see {createNetwork}
     */
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





}

