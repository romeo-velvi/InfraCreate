import { Component, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { NodeComponent, NodeService } from 'rete-angular-render-plugin';
import { EnumNodeType } from 'src/app/models/appType';
import { NetworkIcon } from 'src/app/rete-settings/style/styleIconConfig';
// import { EnumNodeType } from 'src/app/rete-settings/models/reteModelType';

@Component({
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.sass',],
  providers: [NodeService],
  changeDetection: ChangeDetectionStrategy.OnPush, // render più veloce.
})

export class NetworkComponent extends NodeComponent {

  showPorts: boolean = true;
  showOutputOutlet: boolean = false;
  showInputOutlet: boolean = true;
  NetworkIcon = NetworkIcon;
  NodeType = EnumNodeType;


  constructor(
    protected service: NodeService,
    protected cdr: ChangeDetectorRef) {
    super(service, cdr);
  }

  showhidesocket() {
    this.showPorts = !this.showPorts;
  }

}
