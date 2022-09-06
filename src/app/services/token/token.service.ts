import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {


  private token;
  private headers;
  private httpgetOption;

  constructor() { }

  setToken(val: any) {
    this.token = val;
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer' + this.token,
    });
    this.httpgetOption = {
      headers: this.headers,
      observe: "body",
    }
  }
  getToken() {
    return this.token;
  }

  setHeaders(val: HttpHeaders) {
    this.headers = val;
  }
  getHeaders() {
    return this.headers;
  }

  setHttpgetOption(val: any) {
    this.httpgetOption = val;
  }
  getHttpgetOption() {
    return this.httpgetOption as unknown;
  }

}
