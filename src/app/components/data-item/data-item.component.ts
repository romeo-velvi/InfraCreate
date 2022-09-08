import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';

/**
 * Componente usata per mostrare, tipo accordion, determinati livelli.
 * Producendo una vista "astratta" dell'oggetto e i suoi elementi.
 * Permette di eseguire il collapse.
 * Permette di mostrare la cancellazione. Gestire correttamente questo caso.
 * @see {onRemove}
 */
@Component({
  selector: 'app-window-item',
  templateUrl: './data-item.component.html',
  styleUrls: ['./data-item.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataItemComponent{
  /**
   * Varibile di input che rappresenta il titolo della componente
   * @type {string}
   */
  @Input() title?: string;
  /**
   * Varibile in input che rappresenta lo stato "aperto" o "chiuso" della componente
   * @type {boolean}
   */
  @Input() isfull?: boolean = false;
  /**
   * Variabile di input che permette o meno la possibilità di visualizzare il pulsante di elimina.
   * @see {remove}
   */
  @Input() onlyResize?: boolean = false;

  /**
   * Variabile di output che emette l'evento di eliminazione elemento.
   * @see {remove}
   */
  @Output() onRemove: EventEmitter<any> = new EventEmitter();

  // variabili classi icona -> bootstrap-icon
  protected toReduceIconClass: string = "bi bi-box-arrow-in-down-right";
  protected toOpenIconClass: string = "bi bi-square";
  protected closeIconClass: string = "bi bi-x-lg";

  /**
   * Costruttore componente DataItemComponent.
   * @param cdr 
   */
  constructor(private cdr: ChangeDetectorRef) { }

  /**
   * Funzione che esegue uno switch di valore della variabile che rappresenta il collapse dell'elemento.
   * @see {isfull} 
  */
  reduce() {
    this.isfull = !this.isfull;
    this.cdr.detectChanges();
  }
  
  /**
   * Funzione che emette l'evento di click sul tasto di cancellazione.
   * @see {onRemove} 
   */
  remove(){
    this.onRemove.emit(null);
    this.cdr.detectChanges();
  }


}

