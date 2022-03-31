import { HttpClient, HttpHeaders } from '@angular/common/http';
import { KeycloakService } from 'keycloak-angular';

declare interface PromiseConstructor {
    allSettled(promises: Array<Promise<any>>): Promise<Array<{ status: 'fulfilled' | 'rejected', value?: any, reason?: any }>>;
}

export class VisualEditorFetcher {

    token: string | Promise<string>;
    headers: HttpHeaders;

    data_theater: [];
    data_modules: [];

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
        var theater: [] = await this.http_get_theater(502);// console.log(theater);
        this.data_theater = theater;
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
        
        // var i = 0;
        // var promisesIF: Promise<any>[] = [];
        // Object.entries(modules).map(async ([key, value]) => {
        //     console.log(i++, value["name"], value["id"])
        //     var x = this.http_get_modules_interface(value['id']);
        //     //var x = this.http_get_modules_details(value['uuid']);
        //     promisesIF.push(x);
        // });


        // n1
        // await Promise.all(
        //     promisesIF
        // )
        //     .then((values) => {
        //         console.log(values);
        //     })

        //n2
        // for await (const prom of promisesIF) {
        //     console.log("aaaaa->",prom);
        // }

        //n3
        // const reflect = p => p.then(
        //     v => ({ v, status: "fulfilled" }),
        //     e => ({ e, status: "rejected" })
        // );

        // await Promise.all(promisesIF.map(reflect))
        //     .then(function (results) {
        //         var success = results.filter(x => x.status === "fulfilled");
        //     });

    }

    get_data_theater() {
        return this.data_theater;
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

    get_data_modules() {
        var t = this.get_data_theater(); delete this.data_theater["blueprintFile"]["node_templates"][t["name"]];
        var p = this.get_basic_modules();
        var m = {};
        Object.entries(t["blueprintFile"]["node_templates"]).map(([key, value]) => {
            m[key.toString()] = {};
            m[key.toString()]["into_theater"] = value["properties"];
            m[key.toString()]["module_details"] = p[value["properties"]["module"]];
            m[key.toString()]["to_nodes"] = { Input: [], Output: [] };
            // console.log(m[key])
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

    // got_elements(theater: any, modules: any) {
    //     console.log(5);
    //     //////////  OTTENUTI TEATRI E MODULI  /////////////////////////
    //     this.flag = 0;
    //     console.log("fetched");
    //     this.data_modules = modules;
    //     this.data_theater = theater
    //     // console.log("theater: ", this.data_theater);
    //     // console.log("modules: ", this.data_modules);

    // }

    // async got_theater(theater: any) {
    //     console.log(2);
    //     // console.log("returned value T: ", theater);
    //     await this.http_get_modules(theater);
    // }

    // async got_modules(theater: any, modules: any) {
    //     console.log(4);
    //     // console.log("returned value M: ", modules);
    //     await this.got_elements(theater, modules);
    // }



    // PASSING PROMISE AND THEN RESOLVE TO ANOTHER FUNCTION "SUBSCRIBER"
    // async takeTheater() {
    //   let v = null;
    //   // si può togliere "from" -> togliere anche "toPromise" nella func. invocata
    //   from(this.http_get_theater(502))
    //     .subscribe(
    //       res => {
    //         v = res;
    //         console.log('eeeee', v);
    //         return v;
    //       }, error => {
    //         console.log(error);
    //       }
    //     )
    // }


}