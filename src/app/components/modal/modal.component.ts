import { Component, EventEmitter, Input, OnInit, TemplateRef } from '@angular/core';
import { Output } from '@angular/core';
import { ModalButton, ModalItem } from './modalType';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.sass']
})
export class ModalComponent implements OnInit {

  @Input() element: ModalItem;

  _show: boolean;  
  @Input()
  set show(val: boolean) {
    this.showChange.emit(val);
    this._show = val;
  }
  get show() {
    return this._show;
  }
  @Output() showChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output() onButtonPressed: EventEmitter<ModalButton> = new EventEmitter<ModalButton>();

  constructor() {
  }

  ngOnInit(): void {
  }

  closemodal(){
    this.show=false;
  }

  showModal(){
    this.show=true;
  }

  clickButton( val: ModalButton){
    this.onButtonPressed.emit(val);
  }

}
