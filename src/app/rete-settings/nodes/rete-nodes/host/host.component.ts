import { Component, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { NodeComponent, NodeService } from 'rete-angular-render-plugin';
import { EnumNodeType } from 'src/app/models/appType';
import { HostIcon } from 'src/app/rete-settings/style/styleIconConfig';
// import { EnumNodeType } from 'src/app/rete-settings/models/reteModelType';


@Component({
  templateUrl: './host.component.html',
  styleUrls: ['./host.component.sass',],
  providers: [NodeService],
  changeDetection: ChangeDetectionStrategy.OnPush, // render più veloce.
})

export class HostComponent extends NodeComponent {

  showPorts: boolean = true;
  showOutputOutlet: boolean = true;
  showInputOutlet: boolean = false;
  NodeType = EnumNodeType;
  HostIcon = HostIcon;
  
  constructor(
    protected service: NodeService,
    protected cdr: ChangeDetectorRef) {
    super(service, cdr);
  }

  showhidesocket() {
    this.showPorts = !this.showPorts;
  }
  
}
