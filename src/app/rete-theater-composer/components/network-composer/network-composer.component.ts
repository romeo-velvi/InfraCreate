import { Component, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { NodeComponent, NodeService } from 'rete-angular-render-plugin';

@Component({
  templateUrl: './network-composer.component.html',
  styleUrls: ['./network-composer.component.sass',],
  providers: [NodeService],
  changeDetection: ChangeDetectionStrategy.OnPush, // render più veloce.
})

export class NetworkComposer extends NodeComponent {

  public isCollapsed = false;
  public nothide = true;
  public type = '';
  public imageSrc = 'assets/images/nodeimg/';
  public imageAlt = '';
  public nodedata: any;
  public active = true;
  public imgalt = '';

  constructor(
    protected service: NodeService,
    protected cdr: ChangeDetectorRef) {
    super(service, cdr);
  }

  showhidesocket() {
    // console.log(this.nodedata);
    this.nothide = !this.nothide;
  }
  
}
