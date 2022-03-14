import { Component, ChangeDetectorRef } from '@angular/core';
import { NodeComponent, NodeService } from 'rete-angular-render-plugin';

@Component({
  templateUrl: './node1.component.html',
  styleUrls: ['./node1.component.sass'],
  providers: [NodeService],
})

export class MyNodeComponent1 extends NodeComponent {
  constructor(protected service: NodeService, protected cdr: ChangeDetectorRef) {
    super(service, cdr);
  }
}
