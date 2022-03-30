
export class VisualEditorParser {

    data_theater: any;
    data_modules: any;

    parsed_theater: any;
    parsed_modules: any;

    constructor() { }

    parse_data(theater: any, modules: any) {
        this.data_theater = theater;
        this.data_modules = this.to_module_list(modules);
        // console.log("parsed dm", this.data_modules);
        this.get_info_theater();
    }

    to_module_list(modules:any){
        var m = [];
        Object.entries(modules).map(async ([key, value]) => {
            m[value["name"]]=value;
        });
        return m;
    }

    get_info_theater() {
        var t = [];
        var m = [];
        t["name"] = this.data_theater["name"];
        t["description"] = this.data_theater["description"];
        t["version"] = this.data_theater["version"];
        t["createdDate"] = this.data_theater["createdDate"];
        t["theater_node"] = this.data_theater["blueprintFile"]["node_templates"][t["name"]];
        delete this.data_theater["blueprintFile"]["node_templates"][t["name"]];
        // console.log(t);
        
        Object.entries(this.data_theater["blueprintFile"]["node_templates"]).map(async ([key, value]) => {
            m[key.toString()] = [];value["properties"];
            m[key.toString()]["into_theater"] = value["properties"];
            m[key.toString()]["module_details"] = this.data_modules[value["properties"]["module"]];
        });
        // console.log(m);

        this.parsed_theater = t;
        this.parsed_modules = m;
    }

    get_parsed_theater(){
        return this.parsed_theater;
    }

    get_parsed_modules(){
        // console.log(this.data_modules);
        return this.parsed_modules;
    }

}