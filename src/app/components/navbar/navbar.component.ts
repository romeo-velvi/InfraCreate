import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NavbarElement } from './navbartype';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.sass']
})
export class NavbarComponent implements OnInit, AfterViewInit {

  @Input() element: NavbarElement;
  @Input() title: string;
  @Output() itemSelected = new EventEmitter<NavbarElement>();


  constructor() {
  }

  ngOnInit(): void {
  }

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

  select_item(val: NavbarElement) {
    this.itemSelected.emit(val);
  }

}
