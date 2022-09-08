import { Component, EventEmitter, Input, Output, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DataInputElement, DataInputReturned, SingleDataInputReturned } from './dataInputType';


@Component({
  selector: 'app-data-input',
  templateUrl: './data-input.component.html',
  styleUrls: ['./data-input.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataInputComponent implements OnInit {

  @Input() element: DataInputElement;
  @Output() dataSubmitted = new EventEmitter<DataInputReturned>();
  dataForm: FormGroup;
  // dataForm: FormGroup = new FormGroup({
  //   ISrequired: new FormControl('', Validators.required)
  // });


  constructor(private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.dataForm = new FormGroup({});
    this.element.element.forEach(e=>{
      e.required
      ? this.dataForm.addControl(e.id,new FormControl('', Validators.required))
      : this.dataForm.addControl(e.id,new FormControl())
    })
  }

  print(val: any) {
    console.log(val);
  }

  save() {
    let values: { [key: string]: SingleDataInputReturned } = {};
    this.element.element.forEach(
      (el) => {
        let val: HTMLInputElement = document.getElementById(el.id) as HTMLInputElement;
        if (el.type === 'checkbox')
          values[el.id] = { id: el.id, text: el.text, type: el.type, value: val.checked };
        else
          values[el.id] = { id: el.id, text: el.text, type: el.type, value: val?val.value:undefined };
      }
    )
    let event: DataInputReturned = {
      element: values,
      isValid: true,
      exitStatus: 'submitted'
    }
    this.returnOutput(event);
  }

  exit() {
    let event: DataInputReturned = {
      element: {},
      isValid: false,
      exitStatus: 'cancel'
    }
    this.returnOutput(event);
  }

  returnOutput(val: DataInputReturned) {
    this.dataSubmitted.emit(val);
    this.cdr.detectChanges();
  }


}
