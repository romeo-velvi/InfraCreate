import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
// import { ReteComponent } from '../rete/rete.component';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-visual-editor',
  templateUrl: './visual-editor.component.html',
  styleUrls: ['./visual-editor.component.sass']
})

export class VisualEditorComponent implements OnInit {

  token;
  theater;

  constructor(private keycloakService: KeycloakService, private http: HttpClient) {
    this.token = this.keycloakService.getToken();
    this.token = this.token;
  }

  ngOnInit() {
    this.http_get_theater(502); // take theater
  }

  got_elements(theater: any, modules: any) {
    console.log("theater: ", theater);
    console.log("modules: ", modules);
  }

  got_theater(theater: any) {
    // console.log("returned value T: ", theater);
    this.http_get_modules(theater);
  }

  got_modules(theater: any, modules: any) {
    // console.log("returned value M: ", modules);
    this.got_elements(theater,modules);
  }

  async http_get_theater(id: number): Promise<any> {
    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer' + this.token,
      }
    )
    var x = await this.http
      .get(`http://10.20.30.210:8000/library-asset/api/v1/rest/theatres/${id}`,
        {
          headers: headers,
          observe: "body",
        }
      )
      .subscribe(
        res => {
          let theater = res;
          this.got_theater(theater);
          return;

        }, error => {
          console.log(error);
        }
      )
  }

  async http_get_modules(theater: any): Promise<any> {
    let theatre_uuid = theater['uuid'];
    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer' + this.token,
      }
    )
    var x = await this.http
      .get(`http://10.20.30.210:8000/library-asset/api/v1/rest/modules/theatre_uuid/${theatre_uuid}`,
        {
          headers: headers,
          observe: "body",
        }
      )
      .subscribe(
        res => {
          let modules = res;
          this.got_modules(theater, modules);
          return;
        }, error => {
          console.log(error);
        }
      )
  }



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


