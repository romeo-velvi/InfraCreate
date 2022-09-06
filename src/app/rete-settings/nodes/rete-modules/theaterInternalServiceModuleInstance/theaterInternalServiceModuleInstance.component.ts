import { Component, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { NodeComponent, NodeService } from 'rete-angular-render-plugin';
import { EnumModuleType } from 'src/app/models/appType';
import { HostIcon, SubnetIcon, NetworkIcon, TheaterInternalServiceModuleInstance_ICON } from 'src/app/rete-settings/style/styleIconConfig';
// import { EnumModuleType } from 'src/app/rete-settings/models/reteModelType';
 
@Component({
  templateUrl: './theaterInternalServiceModuleInstance.component.html',
  styleUrls: ['./theaterInternalServiceModuleInstance.component.sass',],
  providers: [NodeService],
  changeDetection: ChangeDetectionStrategy.OnPush, // render più veloce.
})

export class TheaterInternalServiceModuleInstanceComponent extends NodeComponent {

  showPorts = true;
  showOutputOutlet: boolean = true;
  showInputOutlet: boolean = true;
  showFooter: boolean = true;
  
  TheaterInternalServiceModuleInstanceIcon = TheaterInternalServiceModuleInstance_ICON;
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
