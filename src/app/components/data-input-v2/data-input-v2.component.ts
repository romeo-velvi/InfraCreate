import { ThrowStmt } from '@angular/compiler';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { DataInputElement, DataInputReturned, SelectOption, SingleDataInputReturned } from '../data-input/datainputtype';
import { OnChangeV2 } from './datainputv2type';


@Component({
  selector: 'app-data-input-v2',
  templateUrl: './data-input-v2.component.html',
  styleUrls: ['./data-input-v2.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataInputV2Component implements OnInit {

  @Input() idForChanges?: string;
  @Input() directChange?: "function" | "direct";
  @Input() title: string;
  // @Input() value: any;
  @Input() formType: "textarea" | "text" | "selection" | "checkbox";
  // specific form option
  @Input() selectOption?: SelectOption[];
  @Input() checked?: boolean;
  @Input() required?: boolean;
  _value: any;
  @Input()
  set value(val: any) {
    if (!this.directChange || this.directChange === "direct") {
      this.valueChange.emit(val);
      this.onChange.emit({ key: this.idForChanges ? this.idForChanges : this.title, old_value: this._value, new_value: val }); // poi notifica aggiornamento
    }
    this._value = val;
  }
  get value() {
    return this._value;
  }
  @Output() valueChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() onChange: EventEmitter<OnChangeV2> = new EventEmitter<OnChangeV2>();

  console = console;

  // dynamic var
  isUpdateTime: boolean = false;
  die: DataInputElement = new DataInputElement();;

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.die.element = [];
    if (this.formType === 'text' || this.formType === 'textarea') {
      this.die = this.getText();
    }
    else if (this.formType === 'checkbox') {
      this.die = this.getCheckbox();
    }
    else if (this.formType === 'selection' && this.selectOption) {
      this.die = this.getSelection();
    }
    else {
      console.error("PROBLEMA CON TIPO O DATO PASSATO");
    }
  }

  getText(): DataInputElement {
    let die: DataInputElement = new DataInputElement;
    die.element = [
      {
        id: this.idForChanges ? this.idForChanges : this.title,
        placeholder: this.value ? this.value as string : '',
        type: this.formType,
        required: this.required ? true : false
      }
    ];
    return die;
  }

  getSelection(): DataInputElement {
    let index_selected = this.selectOption.findIndex((el) => el.value === this.value || el.text === this.value)
    index_selected = (index_selected < 0) ? 0 : index_selected;
    let die: DataInputElement = new DataInputElement;
    die.element = [
      {
        id: this.idForChanges ? this.idForChanges : this.title,
        type: this.formType,
        selected_number: index_selected,
        selection: this.selectOption,
        required: this.required ? true : false
      }
    ];
    return die;
  }

  getCheckbox(): DataInputElement {
    let die: DataInputElement = new DataInputElement;
    console.log(this.checked);
    die.element = [
      {
        id: this.idForChanges ? this.idForChanges : this.title,
        type: this.formType,
        checked: this.checked ? this.checked : false,
        required: this.required ? true : false
      }
    ];
    return die;
  }

  updateTime() {
    this.isUpdateTime = !this.isUpdateTime;
    this.cdr.detectChanges();
  }

  dataInputReturned(val: DataInputReturned) {
    this.console.log("ee->",val);
    if (!val.isValid) {
      this.updateTime();
      return;
    }
    else {
      let x: SingleDataInputReturned = val.element[this.idForChanges ? this.idForChanges : this.title];
      if (!this.directChange || this.directChange === "direct") {
        (x.value instanceof Boolean || (x.value !== undefined || x.value !== ''))
          ? this.value = x.value
          : this.value;
      }
      else {
        let tmp;
        (x.value && x.value !== undefined && x.value !== '')
          ? tmp = x.value
          : tmp = this.value;
        this.onChange.emit({ key: this.idForChanges ? this.idForChanges : this.title, old_value: this.value, new_value: tmp }); // poi notifica aggiornamento
      }
      this.updateTime();
      return;
    }
  }

}
