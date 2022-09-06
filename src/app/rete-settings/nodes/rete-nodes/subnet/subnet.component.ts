import { Component, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { NodeComponent, NodeService } from 'rete-angular-render-plugin';
import { EnumNodeType } from 'src/app/models/appType';
import { SubnetIcon } from 'src/app/rete-settings/style/styleIconConfig';
// import { EnumNodeType } from 'src/app/rete-settings/models/reteModelType';

@Component({
  templateUrl: './subnet.component.html',
  styleUrls: ['./subnet.component.sass',],
  providers: [NodeService],
  changeDetection: ChangeDetectionStrategy.OnPush, // render più veloce.
})

export class SubnetComponent extends NodeComponent {

  showPorts: boolean = true;
  showOutputOutlet: boolean = true;
  showInputOutlet: boolean = true;
  NodeType = EnumNodeType;
  SubnetIcon = SubnetIcon;

  constructor(
    protected service: NodeService,
    protected cdr: ChangeDetectorRef) {
    super(service, cdr);
  }

  showhidesocket() {
    this.showPorts = !this.showPorts;
  }
  
}
