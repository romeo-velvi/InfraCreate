import { Component, ChangeDetectorRef } from '@angular/core';
import { NodeComponent, NodeService } from 'rete-angular-render-plugin';

@Component({
  templateUrl: './node-template.component.html',
  styleUrls: ['./node-template.component.sass',],
  providers: [NodeService]
})

export class NodeTemplate extends NodeComponent {

  public isCollapsed = false;
  public nothide = true;
  public imageSrc = 'assets/images/nodeimg/';
  public imageAlt = '';
  public nodedata;
  public active = true;
  public imgalt = '';

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
      console.log("td: ", data);
      this.nodedata = data;
      this.selectimge(data.type)
    }
  }

  showhidesocket() {
    console.log(this.nodedata);
    this.nothide = !this.nothide;
  }

  selectimge(type: any){
    console.log("dddd",type);
    this.imageSrc += type.toLowerCase()+".png";
    this.imageAlt = type.toLowerCase();
    this.imgalt = '<img src="'+this.imageSrc+'"class="d-inline-block" alt="'+this.imageAlt+'" />'
  }

}
