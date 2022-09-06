import { Component, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { NodeComponent, NodeService } from 'rete-angular-render-plugin';
import { EnumModuleType } from 'src/app/models/appType';
import { MirroringModuleInstance_ICON, SubnetIcon, NetworkIcon, HostIcon } from 'src/app/rete-settings/style/styleIconConfig';
// import { EnumModuleType } from 'src/app/rete-settings/models/reteModelType';


@Component({
  templateUrl: './mirroringModuleInstance.component.html',
  styleUrls: ['./mirroringModuleInstance.component.sass',],
  providers: [NodeService],
  changeDetection: ChangeDetectionStrategy.OnPush, // render più veloce.
})

export class MirroringModuleInstanceComponent extends NodeComponent {

  showPorts = true;
  showOutputOutlet: boolean = true;
  showInputOutlet: boolean = true;
  showFooter: boolean = true;
  
  MirroringModuleInstanceIcon = MirroringModuleInstance_ICON;
  ModuleType = EnumModuleType;
  SubnetIcon=SubnetIcon;
  NetworkIcon=NetworkIcon;
  HostIcon=HostIcon;

  constructor(
    protected service: NodeService,
    protected cdr: ChangeDetectorRef) {
    super(service, cdr);
  }

  showhidesocket() {
    this.showPorts = !this.showPorts;    
  }
  
}
