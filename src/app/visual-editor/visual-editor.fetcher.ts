import { HttpClient, HttpHeaders } from '@angular/common/http';
import { KeycloakService } from 'keycloak-angular';


export class VisualEditorFetcher {

    token: string | Promise<string>;
    headers: HttpHeaders;

    data_theater: any;
    data_modules: any;

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
        var theater = await this.http_get_theater(502);// console.log(theater);
        this.data_theater = theater;
        var modules = await this.http_get_modules(theater);// console.log(modules);
        this.data_modules = modules;
        Object.entries(modules).map(async ([key, value]) => {
            // console.log("->",key, value);
            var temp1, temp2;
            try{
                temp1 = await this.http_get_modules_details(value['uuid']);
            }catch(e){
                temp1 = [];
                console.log(e);
            }
            try{
                temp2 = await this.http_get_modules_interface(value['id']);
            }catch(e){
                temp2 = [];
                console.log(e);
            }

            this.data_modules[key]['hosts_info']=temp1;
            this.data_modules[key]['interface_info']=temp2;
        });

    }

    get_data_theater() {
        return this.data_theater;
    }

    get_data_modules() {
        return this.data_modules;
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

    // -> http://10.20.30.210:8000/library-asset/api/v1/rest/moduleNetworkInterfaces/module/1459
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
                    // reject(error);
                    console.log("VR-Problem data-code", error);
                });
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