import { Component, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { NodeComponent, NodeService } from 'rete-angular-render-plugin';
import { EnumModuleType } from 'src/app/models/appType';
import { HostIcon, SubnetIcon, NetworkIcon, TheaterModuleInstance_ICON } from 'src/app/rete-settings/style/styleIconConfig';
// import { EnumModuleType } from 'src/app/rete-settings/models/reteModelType';
 
@Component({
  templateUrl: './theaterModuleInstance.component.html',
  styleUrls: ['./theaterModuleInstance.component.sass',],
  providers: [NodeService],
  changeDetection: ChangeDetectionStrategy.OnPush, // render più veloce.
})

export class TheaterModuleInstanceComponent extends NodeComponent {

  showPorts = true;
  showOutputOutlet: boolean = true;
  showInputOutlet: boolean = true;
  showFooter: boolean = true;
  
  TheaterModuleInstanceIcon = TheaterModuleInstance_ICON;
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
