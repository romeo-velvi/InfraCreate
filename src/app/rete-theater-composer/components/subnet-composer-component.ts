import { Component, Input, Output, Node } from 'rete';
import { _Socket } from '../sockets';
import { _Control } from '../controls/control-template/control-template';
import { AngularComponent, AngularComponentData } from 'rete-angular-render-plugin';
import { SubnetComposer } from './subnet-composer/subnet-composer.component';

export class SubnetComposerComponent extends Component implements AngularComponent {

  data: AngularComponentData;

  constructor() {
    super('subnet');
    this.data.render = 'angular';
    // this.data.component = MyNodeComponent3;
    this.data.component = SubnetComposer;
  }
 
  async builder(node) {
    // console.log(node);
    var i = ["host_in"];
    var o = ["contained_in"];
    var il = i.length, ol = o.length;
    // console.log(node,i.length,o.length);

    for (let index = 0; index < il ; index++) {
      var key = i[index]
      var title = i[index]
      var socket = _Socket;
      var inp = new Input(key, title, socket, true);
      node.addInput(inp);
    }

    for (let index = 0; index < ol ; index++) {
      var key = o[index]
      var title = o[index]
      var socket = _Socket;
      var out = new Output(key, title, socket, true);
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
