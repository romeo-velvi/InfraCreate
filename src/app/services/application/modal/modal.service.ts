import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { ModalButton, ModalItem } from 'src/app/components/modal/modalType';



let modalItem: ModalItem = {
  title: 'Confirm operation',
  buttons: [
    {
      id: "yes",
      text: "Yes",
      type: "primary",
    },
    {
      id: "no",
      text: "No",
      type: "secondary",
    }
  ],
  backgroundColor: "#0000005e",
  text_content: ""
};


/**
 * Servizio di gestione modale.
 * Questo servizio è direttamente collegato con le generiche componenti verso l'AppComponent (principale).
 * Nell'AppComponent si trova una modale.
 * Il che comporta la possibilità, attraverso questo servizio di poter essere attivata da tutte le componenti.
 * Utilizzata quasi esclusivamente per delle conferma/cancellazione delle operazioni.
 * Attenzione. Nella fase di show e scelta, essa ritorna 2 valori: Un valore null (da non considerare) e il secondo valore, la scelta dell'utente.
 * Per cui va utilizzata, nella subscribe, take(2). Per fare in modo di ricevere questi due valori e poi eseguire l'unsibscribe
 */
@Injectable({
  providedIn: 'root'
})
export class ModalService {

  /**
   * Variabile che memorizza i dati della modale.
   * @type {BehaviorSubject}
   */
  public modalData: BehaviorSubject<ModalItem> = new BehaviorSubject<ModalItem>(modalItem);
  /**
   * Variabile che indica lo stato della modale hide/show.
   * @type {BehaviorSubject}
   * @default {false}
   */
  public show: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  /**
   * Variabile che indica lo stato della modale hide/show.
   * @type {BehaviorSubject}
   * @default {false}
   */
  public value: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() {
    // this.setConfirmationModal("");
  }

  /**
   * Funzione che ritorna lo stato della modale show/hide.
   * @returns {Observable}
   */
  getModal(): Observable<boolean> {
    return this.value.asObservable();
  }

  /**
   * Funzione che setta la modale in un determinato stato con un determinato messaggio.
   * @param text_content 
   */
  setConfirmationModal(text_content: string) {
    this.value.next(null); //clear old resposnse first
    modalItem.text_content = text_content;
    this.modalData.next(modalItem);
    this.show.next(true);
  }

  /**
   * Funzione che consente di settare il valore (conferma/non conferma) della modale.
   * Quando si sceglie, in automatico avviene la chiusura.
   * @param val 
   */
  setResponse(val: ModalButton){
    if(!val) return 
    if(val.id==="yes"){
      this.value.next(true);
    }
    else if(val.id==="no"){
      this.value.next(false);
    }
    else{
      console.warn("only yes-no available");
    }
    this.show.next(false);
  }


  /**
   * Funzione che setta lo stato della modale. E la mostra.
   * @param text_content 
   * @returns {Observable}
   */
  showConfirmationModal(text_content: string): Observable<boolean>{
    if (!text_content) return; 
    this.setConfirmationModal(text_content);
    return this.getModal();
  }

}
