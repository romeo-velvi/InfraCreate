import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ModalItem } from './components/modal/modalType';
import { ModalService } from './services/application/modal/modal.service';
import { SpinnerService } from './services/application/spinner/spinner.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {

  // general
  title = 'InfraCreate';

  // global spinner
  spinner: Observable<any>;
  showspinner: boolean = false;
  textspinner: string = "";

  //global modal
  modalData: ModalItem;
  showmodal: boolean;

  constructor(
    public router: Router,
    public spinnerService: SpinnerService,
    private cdr: ChangeDetectorRef,
    protected modal: ModalService
  ) {

    document.body.style.overflow = 'hidden'; // per prevenire lo scrolling
    document.body.style.background = '#0f131a'; // per background

    this.spinner = spinnerService.getSpinner();
    this.spinner.subscribe(
      el => {
        this.showspinner = el.show;
        this.textspinner = el.text;
        this.cdr.detectChanges();
      }
    )

    this.modal.modalData.asObservable().subscribe(v => this.modalData = v);
    this.modal.show.asObservable().subscribe(v => this.showmodal = v);
  }

}
