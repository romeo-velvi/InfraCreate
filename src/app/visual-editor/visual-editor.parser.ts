
export class VisualEditorParser {

    data_theater: any;
    data_modules: any;

    parsed_theater: any;
    parsed_modules: any;

    constructor() {
        this.parsed_modules = [];
        this.parsed_theater = [];
    }

    async parse_data(theater: any, modules: any) {
        console.log("Start parsing");
        // console.log("AAAA-> ", theater, modules);
        this.parsed_modules = modules;
        this.parsed_theater = theater;
        this.parse_module_for_rete();
        this.parse_theater_for_rete();
        console.log("End parsing");
    }


    parse_module_for_rete() {
        Object.entries(this.parsed_modules).map(([key, value]) => {

            var K = key;
            var V = value;
            try {
                Object.entries(V["module_details"]["interfaces_info"]).map(async ([key, value]) => {
                    var v = [];
                    if (value["type"].toString() === "CONSUMER") {
                        // console.log("add consumer ",value["nodeName"]," to ",K);
                        v = this.parsed_modules[K.toString()]["for_retejs"]["Input"]
                        v.push(value["nodeName"]);
                        this.parsed_modules[K.toString()]["for_retejs"]["Input"] = v
                    }
                    else if (value["type"].toString() === "PRODUCER") {
                        // console.log("add producer ",value["nodeName"]," to ",K);
                        v = this.parsed_modules[K.toString()]["for_retejs"]["Output"]
                        v.push(value["nodeName"]);
                        this.parsed_modules[K.toString()]["for_retejs"]["Output"] = v
                    }
                    else {
                        console.log("eeh? ", value["nodeName"]);
                    }
                });
            }
            catch (e) {
                console.log(K, " -> ", e)
                this.parsed_modules[K.toString()]["for_retejs"]["Input"] = [];
                this.parsed_modules[K.toString()]["for_retejs"]["Output"] = [];
            }
        });

        this.parse_host_for_rete();
        // console.log(this.parsed_modules);

    }

    parse_theater_for_rete() {
        var connection_list = [];
        Object.entries(this.parsed_theater["blueprintFile"]["node_templates"]).map(([key, value]) => {
            var conn_v = value["properties"]["consumer_interfaces_link"];
            var K = key;
            if (conn_v !== undefined) {
                Object.entries(conn_v).map(([key, value]) => {
                    connection_list.push(
                        {
                            from: K,
                            port_src: value["local_interface"],
                            to: value["module_instance"],
                            port_dst: value["remote_interface"]
                        }
                    );
                });
            }
        });
        this.parsed_theater["for_retejs"]["module_connection"] = connection_list;
    }

    parse_host_for_rete() {        

        Object.entries(this.parsed_modules).map(([key, value]) => { // scorre moduli

            var K = key;

            this.parsed_modules[K]["hosts"] = { // foreach moduls initialize empty variables
                into_module_details: this.parsed_modules[K]["module_details"]["hosts_info"],
                host_list: {},
                host_connection: {},
                subnet: {},
                network: {},
                subnet_connection: {},
            };

            var host_for_retejs = [];
            var host_connection = [];
            var subnet_connection = [];
            var network = [];
            var subnetwork = [];


            Object.entries(value["module_details"]["hosts_info"]).map(async ([key, value]) => { // for host
                
                var hostname = value["name"]; // host name
                
                var O = []; // port out 

                Object.entries(value["ports"]).map(async ([key, value]) => { // for host -> port
                    
                    var portname = value["name"]; // port name

                    Object.entries(value["subnets"]).map(async ([key, value]) => { // for host -> net+sub

                        var netname = value["network"]["name"]; // network name

                        var subname = value["name"]; // subnet name

                        if (subnetwork[subname] === undefined) { // if not exists -> create subnet
                            
                            subnetwork[subname] = {};
                            subnetwork[subname]["counter"] = 0;
                            subnetwork[subname]["linkedto"] = [];
                            subnetwork[subname]["network"] = netname;
                            subnetwork[subname]["for_retejs"] = {};
                            subnetwork[subname]["for_retejs"] = {
                                Input: [],
                                Output: [],
                                title: subname,
                                type: "Subnet",
                            };
                            subnetwork[subname]["for_retejs"]["Input"].push("from_host");
                            subnetwork[subname]["for_retejs"]["Output"].push(netname);


                            if (network[netname] === undefined) { // if not exists -> create network
                                network[netname] = {};
                                network[netname]["subnet"] = [];
                                network[netname]["subnet"][subname]=(subnetwork[subname]);
                                network[netname]["for_retejs"] = {
                                    Input: [],
                                    Output: [],
                                    title: netname,
                                    type: "Network",
                                };
                                // network[netname]["for_retejs"]["Input"].push(subname);
                            }
                            // if there are no link network to subnet -> create link
                            if (network[netname]["for_retejs"]["Input"].find((x: { id: any; }) => x.id === subname) === undefined) {
                                network[netname]["for_retejs"]["Input"].push(subname);
                                
                                subnet_connection.push(
                                    {
                                        from: subname,
                                        port_src: netname,
                                        to: netname,
                                        port_dst: subname,
                                        // sub: subname,
                                        // to_net: netname,
                                    }
                                )

                            }
                        }
                        else { // if exsists -> increase counter (inutile)
                            subnetwork[subname]["counter"] += 1;
                        }

                        // once initialized the subnet -> create connection host-port to subnet
                        subnetwork[subname]["linkedto"].push(portname);

                        host_connection.push(
                            {
                                from: hostname,
                                port_src: portname,
                                to: subname,
                                port_dst: "from_host",
                                // sub: subname,
                                // to_net: netname,
                            }
                        )
                    });
                    O.push(portname);

                });
                host_for_retejs[hostname] = {
                    for_retejs: [],
                }
                host_for_retejs[hostname]["for_retejs"] = {
                    Input: [],
                    Output: O,
                    title: hostname,
                    type: "Server",
                }

            });
            this.parsed_modules[K]["hosts"]["host_list"] = host_for_retejs;
            this.parsed_modules[K]["hosts"]["subnet"] = subnetwork;
            this.parsed_modules[K]["hosts"]["network"] = network;
            this.parsed_modules[K]["hosts"]["host_connection"] = host_connection;
            this.parsed_modules[K]["hosts"]["subnet_connection"] = subnet_connection;
        });

    }

    get_parsed_theater() {
        return this.parsed_theater;
    }

    get_parsed_modules() {
        // console.log(this.data_modules);
        return this.parsed_modules;
    }



}