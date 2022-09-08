import { ChangeDetectorRef, Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';


/**
 * Componente utilizzata per il rendering degli offcanvas a contenuto generico.
 * Supporta operazioni di full-screen e mid-screen con posizioni: destra, sinistra, sotto, sopra 
 */
@Component({
  selector: 'app-offcanvas',
  templateUrl: './offcanvas.component.html',
  styleUrls: ['./offcanvas.component.sass'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class OffcanvasComponent {

  /**
   * Variabile di appoggio per lo stato "hide-or-show" dell'offcanvas.
   */
  protected _show: boolean;
  /**
   * Variabile (set) input che rappresenta lo stato dell'hide-or-show dell'offcanvas
   * Quando esegue l'update del valore show. Lo emette anche in output.
   */
  @Input()
  set show(val: boolean) {
    this.showChange.emit(val);
    this._show = val;
  }
  get show() {
    return this._show;
  }
  @Output() showChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  /**
   * Variabile in input che rappresenta il titolo.
   * @type {string}
   */
  @Input() title: string;
  /**
   * Variabile in input che rappresente un titolo alternativo (se presente).
   * @type {string}
   */
  @Input() alt_title?: string;
  /**
   * Variabile in input, messo, se presente, al posto del titolo.
   * @type {TemplateRef}
   */
  @Input() title_template?: TemplateRef<any>;

  /**
   * Variabile in input che rappresenta il Blob da visualizzare come contenuto nell'offcanvas
   * @type {TemplateRef}
   */
  @Input() element: TemplateRef<any>;

  /**
   * Variabile che indica la posizione dell'offcanvas.
   * Ci sono quattro possibilità:
   *  @type {"end"} dx
   *  @type {"start"} sx
   *  @type {"top"} sopra
   *  @type {"bottom"} sotto
   */
  @Input() position: "end" | "start" | "top" | "bottom";

  /**
   * Variabile che rappresenta lo stato di visualizzazione full-screen / mid-screen
   * @type {boolean}
   * @default {false}
   */
  @Input() isfull?: boolean = false;
  
  // variabili classe icone
  protected toReduceIconClass: string = "bi bi-box-arrow-in-down-right";
  protected toOpenIconClass: string = "bi bi-square";
  protected closeIconClass: string = "bi bi-x-lg";


  /**
   * Constructor componente OffcavanvasComponent
   * @param cdr 
   */
  constructor(private cdr: ChangeDetectorRef) {
  }


  /**
   * Funzione richiamata per la chiusura dell'offcanvas
   * @see {show}
   */
  closeOffcanvas() {
    this.show = false;
    this.cdr.detectChanges();
  }

  /**
   * funzione richiamata per lo stato full/mid-screen dell'offcanvas
   * @see {isfull}
   */
  reduce() {
    this.isfull = !this.isfull;
    this.cdr.detectChanges();
  }

}
