import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';


/**
 * Servizio che serve per la gestione di un toker per le chiamate al server.
 */
@Injectable({
  providedIn: 'root'
})
export class TokenService {

  /**
   * Variabile che serve a memorizzare il token
   */
  private token;
  /**
   * Variabile che serve per memorizzare gli header della chiamata api.
   */
  private headers;
  /**
   * Variabile utilizzata per salvare le httpOption delle chiamate api.
   */
  private httpgetOption;

  constructor() { }

  /**
   * Funzione che si occupa di settare il token
   * @param val 
   */
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
  /**
   * Funzione che ha come scopo di ritornare il token salvato.
   */
  getToken() {
    return this.token;
  }

  /**
   * Funzione che setta l'header.
   * @param val 
   */
  setHeaders(val: HttpHeaders) {
    this.headers = val;
  }
  /**
   * Funzione che ritorna l'header salvato.
   */
  getHeaders() {
    return this.headers;
  }

  /** 
   * Funzione che salva l'http get option.
  */
  setHttpgetOption(val: any) {
    this.httpgetOption = val;
  }
  /**
   * Funzione che ritorna l'http get option salvato.
   * @returns 
   */
  getHttpgetOption() {
    return this.httpgetOption as unknown;
  }

}
