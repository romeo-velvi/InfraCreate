
export class VisualEditorParser {

    data_theater: any;
    data_modules: any;

    parsed_theater: any;
    parsed_modules: any;

    constructor() { 
        this.parsed_modules = [];
        this.parsed_theater = [];
    }

    parse_data(theater: any, modules: any) {
        console.log("AAAA-> ",theater,modules);
        this.parsed_modules = modules;
        this.parsed_theater = theater;
        this.parse_module_to_nodes();
    }


    parse_module_to_nodes() {

        Object.entries(this.parsed_modules).map(([key, value]) => {
            // console.log(key,value["module_details"]["interfaces_info"]); //suggerimento per maria -> vedere se possibile cambiare il ritorno in caso di non trovate da undefined ad -> [ ]
            // console.log(key,value["module_details"]["hosts_info"]);
            //console.log("var z:",this.data_modules[m[key]["module_details"]["name"]["interfaces_info"]]);
            //console.log(value);
            // mettere nodi
            /**/
            var K = key;
            var V = value;
            try{
            Object.entries(V["module_details"]["interfaces_info"]).map(async ([key, value]) => {
                var v = [];
                if (value["type"].toString() === "CONSUMER") {
                    console.log("add consumer ",value["nodeName"]," to ",K);
                    v = this.parsed_modules[K.toString()]["to_nodes"]["Input"]
                    v.push(value["nodeName"]);
                    this.parsed_modules[K.toString()]["to_nodes"]["Input"] = v
                }
                else if (value["type"].toString()  === "PRODUCER") {
                    console.log("add producer ",value["nodeName"]," to ",K);
                    v = this.parsed_modules[K.toString()]["to_nodes"]["Output"]
                    v.push(value["nodeName"]);
                    this.parsed_modules[K.toString()]["to_nodes"]["Output"] = v
                }
                else{
                    console.log("eeh? ",value["nodeName"]);
                }
            });
        }
        catch(e){console.log(e)}

            console.log(" IO ",key,value["to_nodes"]["Input"], " - ", ["to_nodes"]["Output"]);


            //dopo -> per vedere le connessioni
            /*Object.entries(this.parsed_theater["blueprintFile"]["node_templates"]).map(async ([key, value]) => {
                console.log(key,value);
                if (value["type"] === "CONSUMER") {
                    this.parsed_modules[key.toString()]["to_nodes"]["Input"].push(value["nodeName"]);
                }
                else if (value["type"] === "PRODUCER") {
                    this.parsed_modules[key.toString()]["to_nodes"]["Output"].push(value["nodeName"]);
                }
                else{
                    console.log("eeh? ",key,value);
                }
            });*/
        });

        console.log(this.parsed_modules);

    }

    get_parsed_theater() {
        return this.parsed_theater;
    }

    get_parsed_modules() {
        // console.log(this.data_modules);
        return this.parsed_modules;
    }



}