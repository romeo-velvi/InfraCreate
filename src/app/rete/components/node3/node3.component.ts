import { Component, ChangeDetectorRef } from '@angular/core';
import { NodeComponent, NodeService } from 'rete-angular-render-plugin';

@Component({
  templateUrl: './node3.component.html',
  styleUrls: ['./node3.component.sass',],
  providers: [NodeService]
})
 
export class MyNodeComponent3 extends NodeComponent {
  public isCollapsed = false;
  public nothide = true;
  constructor(protected service: NodeService, protected cdr: ChangeDetectorRef) {
    super(service, cdr);
  }

  showhidesocket(){
    this.nothide = !this.nothide;
  }
}
