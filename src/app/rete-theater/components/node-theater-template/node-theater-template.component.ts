import { Component, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { NodeComponent, NodeService } from 'rete-angular-render-plugin';

@Component({
  templateUrl: './node-theater-template.component.html',
  styleUrls: ['./node-theater-template.component.sass',],
  providers: [NodeService],
  changeDetection: ChangeDetectionStrategy.OnPush, // render più veloce.
})

export class NodeTheaterTemplate extends NodeComponent {

  public isCollapsed = false;
  public nothide = true;
  public imageSrc = 'assets/images/nodeimg/';
  public imageAlt = '';
  public nodedata: any;
  public active = true;
  public imgalt = '';
  public type= '';

  constructor(
    protected service: NodeService,
    protected cdr: ChangeDetectorRef) {
    super(service, cdr);
  }

  /* passing data from node (visible once '.html' is loaded to this class node) */
  // può essere migliorata (vedere anche la call fatta in '.html')
  initdatanode(data: any) {
    if (this.active) {
      this.active = false;
      // console.log("td: ", data);
      this.nodedata = data;
      this.type=data.type.toLowerCase();;
      this.selectimge();
    }
  }

  showhidesocket() {
    // console.log(this.nodedata);
    this.nothide = !this.nothide;
  }

  selectimge() {
    let img = this.type.toLowerCase();;
    switch (this.type) {
      case "sysman.creo.nodes.TheaterModuleInstance".toLowerCase():
        img = "module"
        break;
      case "sysman.creo.nodes.TheaterInternalServiceModuleInstance".toLowerCase():
        img = "module"
        break;
      case "sysman.creo.nodes.MirroringModuleInstance".toLowerCase():
        img = "module"
        break;
      default:
        img = this.type;
        break;
    }
    this.imageSrc += img + ".png";
    this.imageAlt = img;
    this.imgalt = '<img src="' + this.imageSrc + '"class="d-inline-block" width="100" height="100"  alt="' + this.imageAlt + '" />'
  
  }

  
}
