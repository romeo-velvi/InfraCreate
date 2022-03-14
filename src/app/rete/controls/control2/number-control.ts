import { Component, Input, Type } from '@angular/core';
import { Control, NodeEditor } from 'rete';
import { AngularControl } from 'rete-angular-render-plugin';

@Component({
  templateUrl: './number-control.html',
  styleUrls:  ['./number-control.css'],
})

export class NumberComponent {
  @Input() value!: number;
  @Input() readonly!: boolean;
  @Input() change!: Function;
  @Input() mounted!: Function;

  ngOnInit() {
    this.mounted();
  }
}

export class NumControl extends Control implements AngularControl {
  
  component: Type<NumberComponent>
  props: { [key: string]: unknown }

  constructor(public emitter: NodeEditor, public key: string, readonly = false) {
    
    super(key);

    this.component = NumberComponent;
    this.props = {
      readonly,
      change: (v: undefined) => this.onChange(v),
      value: 0,
      mounted: () => {
        this.setValue(+(this.getData(key) as any) || 0)
      }
    };
    
  }

  onChange(val: number) {
    this.setValue(val);
    this.emitter.trigger('process');
  }

  setValue(val: number) {
    this.props.value = +val;
    this.putData(this.key, this.props.value)
  }

  

}
