import { Injectable } from '@angular/core';

/**
 * Service che si occupa dello storaging di dati condivisibili attraverso le componenti.
 */
@Injectable({
  providedIn: 'root'
})
export class StorageService {

  /**
   * Variabile che memorizza le informazioni da salvare
   */
  private _data: any;

  /**
   * Funzione che consente di settare i dati.
   */
  set data(data: any) {
    this._data = data;
  }
  /**
   * Funzione che ritorna i dati memorizzati.
   */
  get data() {
    return this._data;
  }

  constructor() { }
}
