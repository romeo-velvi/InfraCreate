import { Component, Input, Output, Node } from 'rete';
import { numSocket } from '../sockets';
import { NumControl } from '../controls/control1/number-control';
import { AngularComponent, AngularComponentData } from 'rete-angular-render-plugin';
import { MyNodeComponent3 } from './node3/node3.component';
import { toUnicode } from 'punycode';


export class OthComponent extends Component implements AngularComponent {

  data: AngularComponentData;

  constructor() {
    super('ELEM-3');
    this.data.render = 'angular';
    this.data.component = MyNodeComponent3;
  }

  async builder(node) {
    console.log(node);
    var i = node['data']['Input'];
    var o = node['data']['Output'];
    i = parseInt(i);
    o = parseInt(o);
    console.log(i,o);

    for (let index = 0; index < i; index++) {
      var key = "input"+index;
      var title = "i-sock"+index;
      var socket = numSocket;
      var inp = new Input(key, title, socket);
      node.addInput(inp);
    }

    for (let index = 0; index < o; index++) {
      var key = "output"+index;
      var title = "o-sock"+index;
      var socket = numSocket;
      var out = new Output(key, title, socket);
      node.addOutput(out);
    }

    // const out1 = new Output('num', 'Number', numSocket);
    // node.addControl(new NumControl(this.editor, 'num')).addOutput(out1);
    // node.addControl(new NumControl(this.editor, 'Altro'));
  }

  worker(node, inputs, outputs) {
    // outputs['num'] = node.data.num;
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
