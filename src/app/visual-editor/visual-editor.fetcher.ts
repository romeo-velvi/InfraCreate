import { HttpClient, HttpHeaders } from '@angular/common/http';
import { KeycloakService } from 'keycloak-angular';

declare interface PromiseConstructor {
    allSettled(promises: Array<Promise<any>>): Promise<Array<{ status: 'fulfilled' | 'rejected', value?: any, reason?: any }>>;
}

export class VisualEditorFetcher {

    token: string | Promise<string>;
    headers: HttpHeaders;

    data_theater: any[];
    data_modules: any[];

    constructor(private keycloakService: KeycloakService, private http: HttpClient) {
        this.token = this.keycloakService.getToken();
        this.token = this.token;
        this.headers = new HttpHeaders(
            {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer' + this.token,
            }
        )
    }

    async retrieve_data(id: number = 502) {
        console.log("Start fetching");
        ////////////////// TEATRO ////////////////////////////////////////////////7
        var theater: [] = await this.http_get_theater(id);// console.log(theater);
        // option for theater -> passo proprietà espresse in node_template in for_retejs e le cancello, per evitare problemi con i normali moduli
        theater["ref_name"] = theater["name"];
        if (theater["blueprintFile"]["node_templates"][theater["ref_name"]] === undefined) {
            Object.entries(theater["blueprintFile"]["node_templates"]).map(([key, value]) => {
                if (value["type"] === "sysman.creo.nodes.Theater")
                    theater["ref_name"] = key;
                return;
            });
        }
        console.log("ref_name", theater["ref_name"]);
        theater["for_retejs"] = theater["blueprintFile"]["node_templates"][theater["ref_name"]]["properties"];
        delete theater["blueprintFile"]["node_templates"][theater["ref_name"]];
        this.data_theater = theater;
        ////////////////// MODULI ////////////////////////////////////////////////7
        var modules: [] = await this.http_get_all_modules(theater);
        var modules_plus = modules;
        await Promise.all( // prendo i dati host e interface
            Object.entries(modules).map(async ([key, value]) => {
                try {
                    modules_plus[key]['hosts_info'] = await this.http_get_modules_details(value['uuid']);
                } catch (e) {
                    console.log(e);
                }
                try { //suggerimento per MARIA -> vedere se possibile cambiare il ritorno in caso di non trovate da undefined ad -> [ ]
                    modules_plus[key]['interfaces_info'] = await this.http_get_modules_interface(value['id']);
                } catch (e) {
                    console.log(e);
                }
            })
        );
        // option for modules
        modules= [];
        var modules_dict = this.get_modules_dict_uuid(modules_plus);// console.log("---->",modules_dict)
        Object.entries(theater["blueprintFile"]["node_templates"]).map(([key, value]) => {
            var module_uuid = Object.values(theater["deploymentSequence"]).filter(element => element["moduleInstanceName"] === key)[0]; // trovo uuid corrispondente al modulo
            modules[key.toString()] = {};
            modules[key.toString()]["into_theater"] = value["properties"];
            modules[key.toString()]["into_theater"]["type"] = value["type"];
            modules[key.toString()]["module_details"] = modules_dict[ module_uuid["moduleUUID"] ];
            modules[key.toString()]["for_retejs"] = { title: key.toString(), type: value["type"], sequence: value["properties"]["sequence"], area: value["properties"]["area"], Input: [], Output: [] };
        });
        this.data_modules = modules;


        console.log("End fetching");

    }


    get_data_theater() {
        return this.data_theater;
    }

    get_data_modules() {
        return this.data_modules;
    }


    get_basic_theater() {
        var t = [];
        t["name"] = this.data_theater["name"];
        t["description"] = this.data_theater["description"];
        t["version"] = this.data_theater["version"];
        t["createdDate"] = this.data_theater["createdDate"];
        t["theater_node"] = this.data_theater["blueprintFile"]["node_templates"][t["name"]];
        delete this.data_theater["blueprintFile"]["node_templates"][t["name"]];
        return t;
    }

    get_modules_dict_uuid(modules) {
        var m = [];
        Object.entries(modules).map(async ([key, value]) => {
            m[value["uuid"]] = value;
        });
        return m;
    }

    async http_get_theater(id: number): Promise<any> {

        const promise = await new Promise<any>((resolve, reject) => {
            this.http.get(`http://10.20.30.210:8000/library-asset/api/v1/rest/theatres/${id}`,
                {
                    headers: this.headers,
                    observe: "body",
                }
            ).toPromise()
                .then((res: string[]) => {
                    resolve(res);
                })
                .catch(error => {
                    reject(error);
                });
        });

        return promise;
        // const x = await this.http
        //     .get(`http://10.20.30.210:8000/library-asset/api/v1/rest/theatres/${id}`,
        //         {
        //             headers: headers,
        //             observe: "body",
        //         }
        //     )
        //     .subscribe(
        //         async res => {
        //             let theater = res;
        //             await this.http_get_modules(theater);
        //             // await new Promise(resolve => setTimeout(resolve, 6000));
        //         }, error => {
        //             console.log(error);
        //         }
        //     )
    }

    // per le connessioni degli host con le porte/if-net esposte dal modulo andare in:
    // [host_info] -> port -> subnet -> network -> name *
    // essendo che il nome-net trovato qui * non coincide con il nome dell'if-net esposto dal modulo:
    // per trovarlo bisogna andare su: 
    // [interfaces_info] -> network -> name
    async http_get_all_modules(theater: any): Promise<any> {

        const promise = await new Promise<any>((resolve, reject) => {
            this.http.get(`http://10.20.30.210:8000/library-asset/api/v1/rest/modules/theatre_uuid/${theater["uuid"]}`,
                {
                    headers: this.headers,
                    observe: "body",
                }
            ).toPromise()
                .then((res: string[]) => {
                    resolve(res);
                })
                .catch(error => {
                    reject(error);
                });
        });
        return promise;

        // var x = await this.http
        //     .get(`http://10.20.30.210:8000/library-asset/api/v1/rest/modules/theatre_uuid/${theatre_uuid}`,
        //         {
        //             headers: this.headers,
        //             observe: "body",
        //         }
        //     )
        //     .subscribe(
        //         async res => {
        //             let modules = res;
        //             await this.got_modules(theater, modules);
        //             return;
        //         }, error => {
        //             console.log(error);
        //         }
        //     )
    }

    //  only one and then filter, but return only 15 out of >20 -> http://10.20.30.210:8000/library-asset/api/v1/rest/moduleVms/theatre/9c0bf7a7-2ea3-4f88-9860-1c0ad212e2fc/virtual/machines
    async http_get_modules_details(module_uuid: any): Promise<any> {

        const promise = await new Promise<any>((resolve, reject) => {
            this.http.get(`http://10.20.30.210:8000/library-asset/api/v1/rest/moduleVms/module/${module_uuid}/host`,
                {
                    headers: this.headers,
                    observe: "body",
                }
            ).toPromise()
                .then((res: string[]) => {
                    resolve(res);
                })
                .catch(error => {
                    reject(error);
                });
        });
        return promise;
    }

    async http_get_modules_interface(module_id: any): Promise<any> {

        const promise = await new Promise<any>((resolve, reject) => {
            this.http.get(`http://10.20.30.210:8000/library-asset/api/v1/rest/moduleNetworkInterfaces/module/${module_id}`,
                {
                    headers: this.headers,
                    observe: "body",
                }
            ).toPromise()
                .then((res: string[]) => {
                    resolve(res);
                })
                .catch(error => {
                    reject(error);
                    //console.log("VR-Problem data-code", error);
                })
        });
        return promise;
    }

}