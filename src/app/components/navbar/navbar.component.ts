import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { NavbarElement } from './navbarType';


/**
 * Componente che genera una navbar a contenuto variabile.
 */
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.sass']
})
export class NavbarComponent implements AfterViewInit {

  /**
   * Variabile passata in input che fornisce le caratterisiche della navbar
   * @see {NavbarElement}
   */
  @Input() element: NavbarElement;
  /**
   * Variabile passata in input che rappresenta il titolo della nav
   */
  @Input() title: string;
  /**
   * Variabile di output che ritorna l'evento del click di un elemento selezionato.
   */
  @Output() itemSelected = new EventEmitter<NavbarElement>();

  /**
   * Costruttore componente NavbarComonent
   */
  constructor() {
  }

  /**
   * Funzione richiamata non appena la navbar è visibile.
   * Ha lo scopo di valorizzare gli attrubuti dei singoli elementi passati in input.
   */
  ngAfterViewInit(): void {
    this.element.element.forEach(
      (el) => {
        let a_element: HTMLElement = document.getElementById(el.id);
        if (el.a_option)
          el.a_option.forEach(
            (opt) => {
              a_element.setAttribute(opt.attr_key, opt.attr_val);
            }
          );
      }
    )
  }

  /**
   * Funzione che emette il valore di click su elemento appena è stato selezionato.
   * @param val 
   */
  select_item(val: NavbarElement) {
    this.itemSelected.emit(val);
  }

}
