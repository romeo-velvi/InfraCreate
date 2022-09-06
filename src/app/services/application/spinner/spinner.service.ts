import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, Subject } from 'rxjs';

class SpinnerData {
  show: boolean;
  text: string
}

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  spinnerData: Subject<SpinnerData> = new Subject<SpinnerData>();

  constructor(private ss: NgxSpinnerService) { 
    this.setSpinner(false);
   }

   getSpinner(): Observable<SpinnerData>{
    return this.spinnerData.asObservable();
   }

  setSpinner(show:boolean, text: string = "Loading") {
    this.spinnerData.next({show:show,text:text});
    show
      ? this.ss.show()
      : this.ss.hide();
  }

}
