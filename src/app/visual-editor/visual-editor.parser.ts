
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
        this.parsed_theater["for_retejs"]["modules_connection"] = connection_list;
    }

    get_parsed_theater() {
        return this.parsed_theater;
    }

    get_parsed_modules() {
        // console.log(this.data_modules);
        return this.parsed_modules;
    }



}