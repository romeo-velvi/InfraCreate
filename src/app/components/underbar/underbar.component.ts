import { Component, EventEmitter, Output, Input, ChangeDetectionStrategy } from '@angular/core';
import { UnderbarItem, UnderbarElement } from './underbarType';

/**
 * Componente che consente di mostrare una underbar (sottoposta) alla navbar ad elementi generici.
 */
@Component({
  selector: 'app-underbar',
  templateUrl: './underbar.component.html',
  styleUrls: ['./underbar.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UnderbarComponent {

  /**
   * Variabile data in input che contiene gli elementi dell'underbar.
   * @type {UnderbarElement}
   */
  @Input() element: UnderbarElement[];
  /**
   * Variabile (event) che ritorna l'elemento selezionatp
   */
  @Output() itemSelected:EventEmitter<UnderbarItem> = new EventEmitter<UnderbarItem>();

  /**
   * Costruttore componente UnderbarComponent.
   * Controlla che tutti gli id siano diversi prima di procedere alla loro visualizzazione.
   * @returns 
   */
  constructor() {
    if (!this.element)
      return
    let check = [];
    this.element.forEach(
      (el) => {
        el.element.forEach(e => {
          if (check[e.id])
            check[e.id] = true;
          else {
            console.error("UnderbarItem [ID] duplicated");
            return;
          }
        }
        );
      }
    )
  }

  /**
   * Funzione che emette l'evento appena si seleziona un elemento.
   * @param event 
   * @see {itemSelected}
   */
  itemClicked(event: UnderbarItem) {
    this.itemSelected.emit(event);
  }

}
