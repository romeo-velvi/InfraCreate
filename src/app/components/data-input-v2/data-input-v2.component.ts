import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DataInputElement, DataInputReturned, SelectOption, SingleDataInputReturned } from '../data-input/dataInputType';
import { DataInputReturnedV2 } from './dataInputTypeV2';

/**
 * Componente usata per mostrare il valore di un determinato elemento. 
 * Attraverso un click, è possibile visualizzare un form di modifica in place.
 * I form attualmente disponibili sono: text, textarea, (multi)selection e checkbox. 
 */
@Component({
  selector: 'app-data-input-v2',
  templateUrl: './data-input-v2.component.html',
  styleUrls: ['./data-input-v2.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataInputV2Component implements OnInit {

  /**
   * Variabile di appoggio per value
   */
  protected _value: any;
  /**
   * Variabile (set) in input che rappresenta il valore attuale dell'elemento passato.
   * Questa variabile predispone di determinate operazioni prima di eseguire l'effettivo salvataggio del valore.
   * In particolare controlla se emettere o meno il cambiamento della variabile in modo diretto o indiretto
   * @see {directChange}
   * @see {_value}
   */
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
  
  /**
   * Attributo ritornato in output.
   * @type {EventEmitter<DataInputReturnedV2>}
   */
  @Output() onChange: EventEmitter<DataInputReturnedV2> = new EventEmitter<DataInputReturnedV2>();


  /**
   * Varibile (opzionale) data in input per assegnare un "riconoscimento" all'elemento di ritorno.
   * @see {DataInputReturnedV2} per il campo "key".
   * @type {string}
   */
  @Input() idForChanges?: string;
  /**
   * Varibile (opzionale) data in input che serve per il comportamento della componente.
   * Essa può essere: 
   * @type {"function"} : nel caso si voglia aggiornare il valore passato in input alla funzione.
   * @type {"direct"} : nel caso si vuole aggiornare direttamente il valore.
   * La funzione di base predilige un comportamento su "direct".
   */
  @Input() directChange?: "function" | "direct";

  /**
   * Variabile data in input che serve per dare un titolo all'elemento
   * @type {string}
   */
  @Input() title: string;
  /**
   * Variabile data in input che serve per capire che tipo di elemento sta trattando.
   * Nel caso di modifiche si provvederà a renderizzare la giusta scelta. 
   * Essa può essere:
   * @type {"text"} : nel caso si voglia un input text base.
   * @type {"textarea"} : nel caso si voglia un input text-area.
   * @type {"selection"} : nel caso si voglia un input selection.
   * @type {"checkbox"} : nel caso si voglia un input checkbox.
   */
  @Input() formType: "textarea" | "text" | "selection" | "checkbox";

  // varibili specifiche dei form.
  @Input() selectOption?: SelectOption[];
  @Input() checked?: boolean;
  @Input() required?: boolean;

  /**
   * Variabile usata per eseguire la modifica del valore.
   * @type {boolean}
   */
  protected isUpdateTime: boolean = false;
  /**
   * Variabile usata per passare i valori alla componente @see {DataInputComponent}.
   * @type {DataInputElement}
   */
  protected dataInputElement: DataInputElement = new DataInputElement();;

  /**
   * Costruttore di DataInputV2Component.
   */
  constructor(private cdr: ChangeDetectorRef) { }

  /**
   * Funzione richiamata all'inizializzazione della componente e ritorna il form adeguato scelto.
   * @see {getSelection}
   * @see {getCheckbox}
   * @see {getText}
   */
  ngOnInit(): void {
    this.dataInputElement.element = [];
    if (this.formType === 'text' || this.formType === 'textarea') {
      this.dataInputElement = this.getText();
    }
    else if (this.formType === 'checkbox') {
      this.dataInputElement = this.getCheckbox();
    }
    else if (this.formType === 'selection' && this.selectOption) {
      this.dataInputElement = this.getSelection();
    }
    else {
      console.error("PROBLEMA CON TIPO O DATO PASSATO");
    }
  }

  getText(): DataInputElement {
    let dataInputElement: DataInputElement = new DataInputElement;
    dataInputElement.element = [
      {
        id: this.idForChanges ? this.idForChanges : this.title,
        placeholder: this.value ? this.value as string : '',
        type: this.formType,
        required: this.required ? true : false
      }
    ];
    return dataInputElement;
  }

  getSelection(): DataInputElement {
    let index_selected = this.selectOption.findIndex((el) => el.value === this.value || el.text === this.value)
    index_selected = (index_selected < 0) ? 0 : index_selected;
    let dataInputElement: DataInputElement = new DataInputElement;
    dataInputElement.element = [
      {
        id: this.idForChanges ? this.idForChanges : this.title,
        type: this.formType,
        selected_number: index_selected,
        selection: this.selectOption,
        required: this.required ? true : false
      }
    ];
    return dataInputElement;
  }

  getCheckbox(): DataInputElement {
    let dataInputElement: DataInputElement = new DataInputElement;
    dataInputElement.element = [
      {
        id: this.idForChanges ? this.idForChanges : this.title,
        type: this.formType,
        checked: this.checked ? this.checked : false,
        required: this.required ? true : false
      }
    ];
    return dataInputElement;
  }

  /**
   * Funzione che ha come scopo lo switch della variabile di modifica.
   * @see {isUpdateTime}
   */
  updateTime() {
    this.isUpdateTime = !this.isUpdateTime;
    this.cdr.detectChanges();
  }

  /**
   * Funzione usata per emettere il valore di ritorno dal form.
   * @param val 
   * @see {dataInputElement}
   * @see {updateTime}
   * @see {onChange}
   */
  dataInputReturned(val: DataInputReturned) {
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
