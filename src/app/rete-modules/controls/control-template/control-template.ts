import { Component, Input, Type } from '@angular/core';
import { Control, NodeEditor } from 'rete';
import { AngularControl } from 'rete-angular-render-plugin';
import { NodeStringDecoder } from 'string_decoder';

@Component({
  templateUrl: './control-template.html',
  styleUrls:  ['./control-template.css'],
})

export class ControlTemplate {
  @Input() value!: number;
  @Input() readonly!: boolean;
  @Input() change!: Function;
  @Input() mounted!: Function;

  ngOnInit() {
    this.mounted();
  }
}

export class _Control extends Control implements AngularControl {
  
  component: Type<ControlTemplate>
  props: { [key: string]: unknown }

  constructor(public emitter: NodeEditor, public key: string, readonly = false) {
    
    super(key);

    this.component = ControlTemplate;
    this.props = {
      readonly,
      change: (v: undefined) => this.onChange(v),
      value: 0,
      mounted: () => {
        this.setValue(+(this.getData(key) as any) || 0)
      },
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
