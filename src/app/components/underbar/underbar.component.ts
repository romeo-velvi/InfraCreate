import { Component, EventEmitter, OnInit, Output, Input, ChangeDetectionStrategy } from '@angular/core';
import { UnderbarItem, UnderbarElement } from './underbartypes';

@Component({
  selector: 'app-underbar',
  templateUrl: './underbar.component.html',
  styleUrls: ['./underbar.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UnderbarComponent implements OnInit {


  @Input() element: UnderbarElement[];
  @Output() itemSelected = new EventEmitter<UnderbarItem>();

  constructor() {
    if (!this.element)
      return
    let check = [];
    this.element.forEach(
      (el) => {
        el.element.forEach(e => {
          if(check[e.id])
            check[e.id]=true;
          else{
            console.error("UnderbarItem [ID] duplicated");
            return;
          }
        }
        );
      }
    )
  }

  ngOnInit(): void {
  }

  itemClicked(event: UnderbarItem) {
    this.itemSelected.emit(event);
  }

  print(s: string, item: any) {
    console.log(s, item)
  }

}
