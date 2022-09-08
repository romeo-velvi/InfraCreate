import { Component, EventEmitter, Input } from '@angular/core';
import { Output } from '@angular/core';
import { ModalButton, ModalItem } from './modalType';


/**
 * Componente che ha come scopo la visualizzazione di una modale a contenuto generico.
 */
@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.sass']
})
export class ModalComponent {

  /**
   * Variabile in input usata per la configurazione della modale.
   * @type {ModalItem}
   */
  @Input() element: ModalItem;

  /**
   * Variabile di appoggio per l'hide-or-show della modale
   * @type {boolean}
   */
  protected _show: boolean;  
  /**
   * Variabile (set) input che rappresenta lo stato dell'hide-or-show della modale
   * Quando esegue l'update del valore show. Lo emette anche in output.
   * @see {_show}
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
   * Variabile (emitter) di output che rappresenta l'evento di click dei pulsanti.
   * @type {EventEmitter}
   */
  @Output() onButtonPressed: EventEmitter<ModalButton> = new EventEmitter<ModalButton>();

  /**
   * Costrutture componente ModalComponent.
   */
  constructor() {
  }

  /**
   * Funzione che setta la variabile show a false
   * @see {show}
   */
  closemodal(){
    this.show=false;
  }

  /**
   * Funzione che setta la variabile show a true
   * @see {show}
   */
  showModal(){
    this.show=true;
  }

  /**
   * Funzione che capta l'evento di pulsante cliccato e lo emette in output.
   * @param val 
   * @see {onButtonPressed}
   */
  clickButton( val: ModalButton){
    this.onButtonPressed.emit(val);
  }

}
