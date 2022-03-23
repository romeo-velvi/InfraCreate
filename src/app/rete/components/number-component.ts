import { Component, Input, Output, Node } from 'rete';
import { numSocket } from '../sockets';
import { NumControl } from '../controls/control1/number-control';
import { AngularComponent, AngularComponentData } from 'rete-angular-render-plugin';
import { MyNodeComponent2 } from './node2/node2.component';


export class NumComponent extends Component implements AngularComponent {
  
  data: AngularComponentData;

  constructor() {
    super('ELEM-2');
    this.data.render = 'angular';
    this.data.component = MyNodeComponent2;
  }

  async builder(node) {
    // const out1 = new Output('num', 'Number', numSocket);
    // node.addControl(new NumControl(this.editor, 'num')).addOutput(out1);

    console.log(node);
    var i = node['data']['Input'];
    var o = node['data']['Output'];
    i = parseInt(i);
    o = parseInt(o);
    // console.log(i,o);

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
  
  // setData(where:string, data:Object){
  //   this.data[where]=data;
  // }

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
