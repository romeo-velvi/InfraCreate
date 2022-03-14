import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

import { NodeEditor, Engine } from 'rete';
import ConnectionPlugin from 'rete-connection-plugin';
import ContextMenuPlugin from 'rete-context-menu-plugin';
import { AngularRenderPlugin } from 'rete-angular-render-plugin';
import AreaPlugin from 'rete-area-plugin';

import { NumComponent } from './components/number-component';
import { AddComponent } from './components/add-component';
import { OthComponent } from './components/other-component';
import { zip } from 'rxjs';


@Component({
  selector: 'app-rete',
  templateUrl: './rete.component.html',
  styleUrls: ['./rete.component.css'],
})

export class ReteComponent implements AfterViewInit {

  @ViewChild('nodeEditor', { static: true }) el: ElementRef;
  editor: NodeEditor = null;

  async ngAfterViewInit() {
    const container = this.el.nativeElement;

    // stored all node-types
    const components = [
      new NumComponent(),
      new OthComponent(),
      new AddComponent(),
    ];

    const editor = new NodeEditor('demo@0.2.0', container);
    editor.use(ConnectionPlugin);
    editor.use(AngularRenderPlugin)//, { component: MyNodeComponent });
    editor.use(ContextMenuPlugin);

    editor.use(AreaPlugin, {
      background: true, //righe
      snap: false,
      scaleExtent: { min: 0.1, max: 1 },
      translateExtent: { width: 5000, height: 4000 }
    })

    const engine = new Engine('demo@0.2.0');

    components.map(c => {
      editor.register(c);
      engine.register(c);
    });

    const n1 = await components[0].createNode({ num: 2 });
    const n2 = await components[1].createNode({ num: 0 });
    const add = await components[2].createNode();

    // insert value
    n1.data['valoreacazzo'] = "QUALCOSA";

    n1.position = [80, 200];
    n2.position = [80, 400];
    add.position = [500, 240];

    editor.addNode(n1);
    editor.addNode(n2);
    editor.addNode(add);

    editor.connect(n1.outputs.get('num'), add.inputs.get('num1'));
    editor.connect(n2.outputs.get('num'), add.inputs.get('num2'));


    editor.on(['process', 'nodecreated', 'noderemoved', 'connectioncreated', 'connectionremoved'], (async () => {
      await engine.abort();
      await engine.process(editor.toJSON());
    }) as any);

    editor.view.resize();
    editor.trigger('process');
    AreaPlugin.zoomAt(editor, [add]);

    this.editor = editor;

  }

  public printjson() {
    console.log(this.editor.toJSON());
    console.log(JSON.stringify(this.editor.toJSON()));
  }

  public getNodes(): Object[] {
    var x = this.editor.toJSON();
    var z = [];
    for (let key in x) {
      let value = x[key];
      console.log(value);
      z.push(value);
    }
    return z;
  }


}
