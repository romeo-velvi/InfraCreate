import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { ModalButton, ModalItem } from 'src/app/components/modal/modaltype';





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


@Injectable({
  providedIn: 'root'
})
export class ModalService {

  modalData: BehaviorSubject<ModalItem> = new BehaviorSubject<ModalItem>(modalItem);
  show: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  value: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() {
    // this.setConfirmationModal("");
  }

  getModal(): Observable<boolean> {
    return this.value.asObservable();
  }

  setConfirmationModal(text_content: string) {
    this.value.next(null); //clear old resposnse first
    modalItem.text_content = text_content;
    this.modalData.next(modalItem);
    this.show.next(true);
  }

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

  showConfirmationModal(text_content: string): Observable<boolean>{
    if (!text_content) return; 
    this.setConfirmationModal(text_content);
    return this.getModal();
  }

}
