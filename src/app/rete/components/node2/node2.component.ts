import { Component, ChangeDetectorRef } from '@angular/core';
import { NodeComponent, NodeService } from 'rete-angular-render-plugin';

@Component({
  templateUrl: './node2.component.html',
  styleUrls: ['./node2.component.sass'],
  providers: [NodeService]
})

export class MyNodeComponent2 extends NodeComponent {
  constructor(protected service: NodeService, protected cdr: ChangeDetectorRef) {
    super(service, cdr);
  }
}
