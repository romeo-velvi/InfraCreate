import { Component, EventEmitter, Input, Output, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DataInputElement, DataInputReturned, SingleDataInputReturned } from './dataInputType';

/**
 * Componente usata per renderizzare e gestire in modo automatico diversi elementi di input attraverso form.
 * Attualmente disponibili sono: text, textarea, (multi)selection e checkbox.  
 */
@Component({
  selector: 'app-data-input',
  templateUrl: './data-input.component.html',
  styleUrls: ['./data-input.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataInputComponent implements OnInit {

  /**
   * Variabile dato in input per essere processato.
   * @type {DataInputElement}
   */
  @Input() element: DataInputElement;
  
  /**
   * Variabile ritornata in output.
   * @type {EventEmitter<DataInputReturned>}
   */
  @Output() dataSubmitted = new EventEmitter<DataInputReturned>();

  /**
   * Variabile usata per le operazione form.
   * @type {FormGroup}
   */
  protected dataForm: FormGroup;

  /**
   * Costruttore di DataInputComponent.
   */
  constructor(private cdr: ChangeDetectorRef) {
  }

  /**
   * Funzione chiamata quando la componente viene inizializzata.
   * Esegue controlli e inizializzazioni dei Form element e Form control.
   * @see {dataForm}
   * @see {FormGroup}
   * @see {FormControl}
   */
  ngOnInit(): void {
    this.dataForm = new FormGroup({});
    this.element.element.forEach(e => {
      e.required
        ? this.dataForm.addControl(e.id, new FormControl('', Validators.required))
        : this.dataForm.addControl(e.id, new FormControl())
    })
  }

  /**
   * Funzione usata per elaborare gli elementi della form.
   * @see {returnOutput}
   * @see {SingleDataInputReturned}
   */
  save() {
    let values: { [key: string]: SingleDataInputReturned } = {};
    this.element.element.forEach(
      (el) => {
        let val: HTMLInputElement = document.getElementById(el.id) as HTMLInputElement;
        if (el.type === 'checkbox')
          values[el.id] = { id: el.id, text: el.text, type: el.type, value: val.checked };
        else
          values[el.id] = { id: el.id, text: el.text, type: el.type, value: val ? val.value : undefined };
      }
    )
    let event: DataInputReturned = {
      element: values,
      isValid: true,
      exitStatus: 'submitted'
    }
    this.returnOutput(event);
  }

  /**
   * Funzione usata per annullare l'operazione di convalida di risultato.
   * @see {returnOutput}
   */
  exit() {
    let event: DataInputReturned = {
      element: {},
      isValid: false,
      exitStatus: 'cancel'
    }
    this.returnOutput(event);
  }

  /**
   * Funzione usata per emettere il valore processato dalla exit() oppure dalla save().
   * @param val 
   * @see {dataSubmitted}
   */
  returnOutput(val: DataInputReturned) {
    this.dataSubmitted.emit(val);
    this.cdr.detectChanges();
  }


}
