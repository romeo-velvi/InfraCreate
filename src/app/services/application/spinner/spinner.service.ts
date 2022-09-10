import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, Subject } from 'rxjs';

/**
 * Classe utilizzata per lo stato dello spinner.
 * @see {SpinnerService}
 */
class SpinnerData {
  show: boolean;
  text: string
}

/**
 * Servizio di settaggio dello spinner (operazioni di loading).
 * Questo serivizio è associato allo spinner situato nell'AppComponent.
 * Questo servizio rende raggiungibile lo stesso dalle diverse componenti dell'applicazione. 
 */
@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  /**
   * Variabile che memorizza lo stato dello spinner.
   * @type {Subject}
   */
  protected spinnerData: Subject<SpinnerData> = new Subject<SpinnerData>();

  /**
   * Costruttore dello SpinnerService
   * Setta lo spinner come "hide"
   * @param ss 
   */
  constructor(private ss: NgxSpinnerService) {
    this.setSpinner(false);
  }

  /**
   * Funzione che ritorna l'observable dello stato dello spinner.
   * @returns {Observable}
   */
  getSpinner(): Observable<SpinnerData> {
    return this.spinnerData.asObservable();
  }

  /**
   * Funzone che setta lo stato dello spinner.
   * @param show 
   * @param text 
   */
  setSpinner(show: boolean, text: string = "Loading") {
    this.spinnerData.next({ show: show, text: text });
    show
      ? this.ss.show()
      : this.ss.hide();
  }

}
