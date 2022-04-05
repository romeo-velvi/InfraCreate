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

    async retrieve_data() {
        console.log("Start fetching");

        var theater: [] = await this.http_get_theater(502);// console.log(theater);
        this.data_theater = theater;
        // option for theater
        this.data_theater["for_retejs"] = this.data_theater["blueprintFile"]["node_templates"][theater["name"]]["properties"];
        delete this.data_theater["blueprintFile"]["node_templates"][theater["name"]];

        var modules: [] = await this.http_get_modules(theater);// console.log(modules);
        this.data_modules = modules;

        var i = 0;
        await Promise.all(Object.entries(modules).map(async ([key, value]) => {
            try {
                this.data_modules[key]['hosts_info'] = await this.http_get_modules_details(value['uuid']);
            } catch (e) {
                console.log(e);
            }
            try { //suggerimento per MARIA -> vedere se possibile cambiare il ritorno in caso di non trovate da undefined ad -> [ ]
                this.data_modules[key]['interfaces_info'] = await this.http_get_modules_interface(value['id']);
            } catch (e) {
                console.log(e);
            }
        })
        );


        // option for modules
        var p = this.get_basic_modules();
        var m = [];
        Object.entries(this.data_theater["blueprintFile"]["node_templates"]).map(([key, value]) => {
            m[key.toString()] = {};
            m[key.toString()]["into_theater"] = value["properties"];
            m[key.toString()]["into_theater"]["type"] = value["type"];
            m[key.toString()]["module_details"] = p[value["properties"]["module"]];
            m[key.toString()]["for_retejs"] = { title: key.toString(), type: value["type"], sequence: value["properties"]["sequence"], area: value["properties"]["area"], Input: [], Output: [] };
        });
        this.data_modules = m;


        console.log("End fetching");

    }


    get_data_theater() {
        return this.data_theater;
    }

    get_data_modules() {
        return this.data_modules;
        // var t = this.get_data_theater();
        // var p = this.get_basic_modules();
        // var m = {};
        // Object.entries(t["blueprintFile"]["node_templates"]).map(([key, value]) => {
        //     m[key.toString()] = {};
        //     m[key.toString()]["into_theater"] = value["properties"];
        //     m[key.toString()]["into_theater"]["type"] = value["type"];
        //     m[key.toString()]["module_details"] = p[value["properties"]["module"]];
        //     m[key.toString()]["for_retejs"] = { title: key.toString(), type: value["type"], sequence: value["properties"]["sequence"], area: value["properties"]["area"], Input: [], Output: [] };
        //     // console.log(m[key])
        // });
        // return m;
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

    get_basic_modules() {
        var m = [];
        Object.entries(this.data_modules).map(async ([key, value]) => {
            m[value["name"]] = value;
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

    async http_get_modules(theater: any): Promise<any> {

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