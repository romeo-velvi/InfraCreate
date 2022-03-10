import { Component, Input, Output, Node } from 'rete';
import { numSocket } from '../sockets';
import { NumControl } from '../controls/number-control';
import { AngularComponent, AngularComponentData } from 'rete-angular-render-plugin';
import { MyNodeComponent2 } from './node2/node2.component';


export class NumComponent extends Component implements AngularComponent {
  
  data: AngularComponentData;

  constructor() {
    super('Num');
    this.data.render = 'angular';
    this.data.component = MyNodeComponent2;
  }

  async builder(node) {
    const out1 = new Output('num', 'Number', numSocket);
    node.addControl(new NumControl(this.editor, 'num')).addOutput(out1);
  }

  worker(node, inputs, outputs) {
    outputs['num'] = node.data.num;
  }

  created(node) {
    console.log('created', node);
  }

  destroyed(node) {
    console.log('destroyed', node);
  }
}



// import { Component, Output } from 'rete';
// import { numSocket } from '../sockets';
// import { NumControl } from '../controls/number-control';
// import { MyNodeComponent2 } from './node2/node.component';

// export class NumComponent extends Component {

//   constructor() {
//     super('Number');

//   }

//   builder(node) {
//     const out1 = new Output('num', 'Number', numSocket);
//     return node.addControl(new NumControl(this.editor, 'num')).addOutput(out1);
//   }

//   worker(node, inputs, outputs) {
//     outputs['num'] = node.data.num;
//   }
// }
