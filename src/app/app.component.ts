import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ModalItem } from './components/modal/modalType';
import { ModalService } from './services/application/modal/modal.service';
import { SpinnerService } from './services/application/spinner/spinner.service';

/**
 * Componente principale dell'applicazione.
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {

  // general
  /**
   * Variabile dedicata al titolo dell'applicazione
   */
  protected title = 'InfraCreate';

  // global spinner
  /**
   * Variabile utilizzata per captare lo stato dello spinner generale.
   * Serve a farlo mostrare/nascondere all'occorrenza, indipendentemente dall'applicazione
   */
  protected spinner: Observable<any>;
  protected showspinner: boolean = false;
  protected textspinner: string = "";

  /**
   * Variabile utilizzata per la modale generale.
   */
  protected modalData: ModalItem;
  protected showmodal: boolean;

  /**
   * Costruttore della componente principale dell'applicazione.
   * Contiene i subscriber dello spinner e modale generale
   * @param router 
   * @param spinnerService 
   * @param cdr 
   * @param modal 
   */
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
