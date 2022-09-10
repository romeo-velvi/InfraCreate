import { Data, InputData, NodeData, NodesData, OutputData } from "rete/types/core/data";
import { EnumNodeType, InterfacePortType } from "src/app/models/appType";
import { ModuleApplication } from "../../modelsApplication/applicationModels";
import { ModuleExport, ModuleSimpleData, NetworkSimpleData, NodeSimpleData, PortSimpleData, PropertiesMSD, PropertiesSSD, SubnetSimpleData, VirtualMachine, VirtualMachinePorts } from "../../modelsExport/moduleExport";
import { ModeTypeExport, ModuleTypeExport, NetworkTypeExport, NodeTypeExport, PortTypeExport, RelationshipsTypeExport, SubnetTypeExport, ToscaDefinitionType } from "../../modelsExport/TypeExport";


/**
 * Classe che ha lo scopo di convertire il modulo nel formato YAML (standard TOSCA).
 */
export class ExportModule {

    /**
     * Variabile che ha lo scopo di memorizzare il modulo fornito al costruttore.
     * @type {ModuleApplication}
     */
    protected module: ModuleApplication
    /**
     * Variabile che ha lo scopo di memorizzare i dati dell'editor fornito al costruttore.
     * @type {Data}
     */
    protected dataEditor: Data
    /**
     * Variabile di supporto.
     * Usata per ottimizzare la parte di inserimento delle virtual machine nel ModuleSimpleData. 
     * @see {getHostExport}
     */
    protected virtualMachines: VirtualMachine[] = []; 

    /**
     * Costruttore classe ExportModule
     * @param module 
     * @param dataEditor 
     */
    constructor(module: ModuleApplication, dataEditor: Data) {
        this.module = module;
        this.dataEditor = dataEditor;
    }

    /**
     * Funzione che si occupa del parsing del modulo in formato adattabile all'export dello YAML.
     * 1) Inizia assegnando i valori alle variabili che possono essere semplicemente dedotte dal modulo fornito nel costruttore.
     * 2) Prende i dati forniti dell'editor e itera su questi: in base al tipo richiama la funzione che restituisce il nodo parsed come oggetto YAML.
     * @return {ModuleExport}
     * @see {ModuleExport} 
     * @see {getHostExport}
     * @see {getSubnetExport}
     * @see {getNetworkExport}
     */
    convertModule(): ModuleExport {
        let me: ModuleExport = new ModuleExport();
        me.tosca_definitions_version = ToscaDefinitionType.cloudify;
        me.description = this.module.description;
        me.imports = this.module.imports;
        // node_Tempates
        let nt: { [name: string]: ModuleSimpleData | NodeSimpleData | PortSimpleData | NetworkSimpleData | SubnetSimpleData } = {};
        // inizia a prendere i nodi del modulo
        for (let key in this.dataEditor.nodes) {
            let element: NodeData = this.dataEditor.nodes[key];
            if (element.data.type === EnumNodeType.Host) {
                nt = Object.assign({}, nt, this.getHostExport(element));
            }
            else if (element.data.type === EnumNodeType.Subnet) {
                nt = { ...nt, ...this.getSubnetExport(element) }
            }
            else if (element.data.type === EnumNodeType.Network) {
                nt = { ...nt, ...this.getNetworkExport(element) }
            }
            else {
                console.warn("Module type not recognized");
                continue;
            }
        }
        // inserimento del modulo nei templates // deve essere fatto dopo che tutti i moduli sono stati completati -> guardare this.virtualMachines
        nt = { ...nt, ...this.getModuleExport() }

        me.node_templates = nt;

        return me;
    }



    /**
     * Funzione di parsing dell'host e delle porte.
     * 1) Controlla le porte di output per le connessioni in uscita.
     * 2) Itera sulle connessioni (porte i/o) e controlla le connessioni depends_on (subnet) e contained_in (network)
     * @param node 
     * @return { { [name: string]: NodeSimpleData | PortSimpleData }}
     * @see {virtualMachines}
     */
    getHostExport(node: NodeData): { [name: string]: NodeSimpleData | PortSimpleData } {

        //serve al ModuleSimpleData
        let MSDvm: VirtualMachine = { 
            virtual_machine: node.data.name as unknown as string, 
            ports: [] 
        };
        let index: number = -1;

        // get node
        let singleNode: { [name: string]: NodeSimpleData } = {}
        let nodeSimpleData: NodeSimpleData = {
            type: NodeTypeExport.Host,
            properties: undefined,
            interfaces: undefined,
            relationships: []
        };
        // node relation -> port # per ora solo le connessioni con le porte
        (node.data.Output as []).forEach(
            (out) => {
                nodeSimpleData.relationships.push(
                    { type: RelationshipsTypeExport.connect_port, target: out }
                )
            }
        )
        singleNode[node.data.name as unknown as string] = nodeSimpleData;



        // get node ports
        let ports: { [name: string]: PortSimpleData } = {};
        for (let portName in node.outputs) {

            MSDvm.ports[++index] = {
                port: portName,
                network: "",
                subnets: [],
            };

            let nodePort: OutputData = node.outputs[portName];
            let portSimpleData: PortSimpleData = {
                type: PortTypeExport.Port,
                relationships: []
            }
            // port relation -> net & sub # controllo ambo contained_in (net) e dependes_on (sub)
            nodePort.connections.forEach(c => {
                // prima depends_on
                let subnetLinkedToPort: NodeData = this.dataEditor.nodes[c.node];
                portSimpleData.relationships.push(
                    { type: RelationshipsTypeExport.depends_on, target: subnetLinkedToPort.data.name as unknown as string }
                );
                MSDvm.ports[index].subnets.push({ subnet: subnetLinkedToPort.data.name as unknown as string });
                // poi contained_in
                for (let key in subnetLinkedToPort.outputs) {
                    let subnetPort: OutputData = subnetLinkedToPort.outputs[key];
                    // controllo network connesso alla sub.
                    subnetPort.connections.forEach(c => {
                        let networkConnectedToSubnet: NodeData = this.dataEditor.nodes[c.node];
                        portSimpleData.relationships.push(
                            { type: RelationshipsTypeExport.contained_in, target: networkConnectedToSubnet.data.name as unknown as string }
                        );
                        MSDvm.ports[index].network = networkConnectedToSubnet.data.name as unknown as string;
                    })
                }

            })

            ports[portName] = portSimpleData;
        }

        let out: { [name: string]: NodeSimpleData | PortSimpleData } = {};
        out = Object.assign({}, singleNode, ports);


        this.virtualMachines.push(MSDvm);

        return out;
    }



    /**
     * Funzione di parsing della subnet.
     * 1) Valorizza i dati che sono direttamente reperibili dalle informazioni del nodo.
     * 2) Controlla le porte di output (connesisoni) che si collegano con la network per le relazioni contained_in.
     * @param subnet 
     * @returns {{ [name: string]: SubnetSimpleData }}
     */
    getSubnetExport(subnet: NodeData): { [name: string]: SubnetSimpleData } {
        // get subnet
        let singleSubnet: { [name: string]: SubnetSimpleData } = {}
        let subnetSimpleData: SubnetSimpleData = {
            type: SubnetTypeExport.Subnet,
            relationships: [],
            properties: {
                openstack_config: null,
                use_external_resource: false,
                subnet: {
                    ip_version: subnet.data.version as unknown as number,
                    cidr: subnet.data.cidr as unknown as string,
                    enable_dhcp: subnet.data.isDhcp as unknown as boolean,
                    gateway_ip: null
                }
            }
        };
        // subnet relation -> network (only contained in)
        (subnet.data.Output as []).forEach(
            (out) => {
                subnetSimpleData.relationships.push(
                    { type: RelationshipsTypeExport.contained_in, target: out }
                )
            }
        )
        singleSubnet[subnet.data.name as unknown as string] = subnetSimpleData;

        return singleSubnet;
    }


    /**
     * Funzione di parsing del network.
     * 1) Valorizza solamente i dati che sono direttamente reperibili dalle informazioni del nodo.
     * @param subnet 
     * @returns {{ [name: string]: NetworkSimpleData }}
     */
    getNetworkExport(network: NodeData): { [name: string]: NetworkSimpleData } {
        // get subnet
        let singleNetwork: { [name: string]: NetworkSimpleData } = {}
        let networkSimpleData: NetworkSimpleData = {
            type: NetworkTypeExport.Network,
            properties: {
                openstack_config: null,
                use_external_resource: false,
            }
        };

        singleNetwork[network.data.name as unknown as string] = networkSimpleData;

        return singleNetwork;
    }


    /**
     * Funzione di parsing del modulo. Creazione dell'elemento modulo nel node_template.
     * 1) Valorizza i dati che sono direttamente reperibili dalle informazioni del Modulo.
     * 2) Salva le virtual_machine @see {virtualMachines}
     * 3) Inserimento delle interfacce consumer/provisor del modulo.
     * @returns { [name: string]: ModuleSimpleData }
     */
    getModuleExport(): { [name: string]: ModuleSimpleData } {
        let moduleExport: { [name: string]: ModuleSimpleData } = {}
        let moduleSimpleData: ModuleSimpleData = {
            type: ModuleTypeExport[this.module.type]?ModuleTypeExport[this.module.type]:ModuleTypeExport[0],
            properties: {
                mode: ModeTypeExport.managed,
                description: this.module.description,
                version: this.module.version as number,
                constraints: {
                    interface_constraints: [],
                    module_constraints: [],
                    network_constraints: []
                },
                interface_networks: {
                    providers: [],
                    consumers: []
                },
                virtual_machines: this.virtualMachines ? this.virtualMachines : null, // per il come si è reperito -> guardare this.virtualMachines
            }
        };

        // inserisco interfacce consumer/privisor
        let index: number = null;
        let indexC: number = -1;
        let indexP: number = -1;
        let type: string = null;
        this.module.interfaces.forEach(i => {
            if (i.type === InterfacePortType.CONSUMER) {
                type = "consumers";
                index = ++indexC;
            }
            else if (i.type === InterfacePortType.PRODUCER) {
                type = "providers"
                index = ++indexP;
            }
            else {
                type = null;
                console.warn("type not recognized")
                index = null;
                return;
            };
            moduleSimpleData.properties.interface_networks[type].push(
                {
                    interface: i.nodeName,
                    tag: i.nodeName,
                    network: i.network.name,
                    subnets: []
                }
            )
            // prende le network + subnet ad esso connesse (se sono connesse)
            let network: NodeData = this.findNode(i.network.name);
            if (network) {
                for (let key in network.inputs) {
                    let networkInputPort: InputData = network.inputs[key];
                    networkInputPort.connections.forEach(c => {
                        let subnet: NodeData = this.dataEditor.nodes[c.node];
                        moduleSimpleData.properties.interface_networks[type][index].subnets.push(
                            { subnet: subnet.data.name as unknown as string }
                        )
                    })
                }
            }
            index++;
        })

        moduleExport[this.module.name] = moduleSimpleData;

        return moduleExport;
    }

    /**
     * Funzone che serve per trovare il nodo partendo dal nome all'interno dei dati del canvas.
     * @param name 
     * @returns {NodeData}
     */
    findNode(name: string): NodeData {
        let n: NodeData = undefined
        for (let key in this.dataEditor.nodes) {
            let node: NodeData = this.dataEditor.nodes[key];
            if ((node.data.name as unknown as string) === name) {
                n = node;
                break;
            }
        }
        return n
    }

}