import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { TabnavElement } from './tabnavType';

/**
 * Componente utilizzata per la suddivisione dei tab a contenuto generico.
 */
@Component({
  selector: 'app-tabnav',
  templateUrl: './tabnav.component.html',
  styleUrls: ['./tabnav.component.sass']
})
export class TabnavComponent implements OnInit {

  /**
   * Variabile data in input che rappresenta il titolo dalla tab.
   * @type {string}
   */
  @Input() title: string;
  /**
   * Variabile data in input che rappresenta il titolo alternativo dalla tab.
   * @type {string}
   */
  @Input() alt_title: string;
  /**
   * Variabile data in input che contiene le caratteristiche/quantità della tab.
   * @type {TabnavElement}
  */
  @Input() element: TabnavElement;

  /**
   * Variabile che indica se ci siano più tab.
   * @type {boolean}
   */
  protected hasMultipleTag: boolean = true;

  /**
   * Variabile che indica l'id della tab selezionata.
   * @type {string}
   */
  protected activetab: string;

  /**
   * Costrutture TabnavComponent.
   * @param cdr 
   */
  constructor(private cdr: ChangeDetectorRef) { }

  /**
   * Funzione richiamata all'inizializzazione del componente.
   * Controlla che ci siano 1 o più tab.
   * Setta la prima tab attiva, in modo da essere mostrata. 
   */
  ngOnInit(): void {
    this.hasMultipleTag = (this.element.element.length > 1) ? true : false;
    this.active(this.element.element[0].id);
  }

  /**
   * Funzione richiamata quando si seleziona una tab.
   * @see {activetab} 
   * @param val 
   */
  active(val: string | any) {
    this.activetab = val;
    this.cdr.detectChanges();
  }

}
