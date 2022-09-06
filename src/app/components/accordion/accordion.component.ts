import { AfterContentInit, Component, ContentChild, ElementRef, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.sass'],
})
export class AccordionComponent implements OnInit, AfterContentInit {

  @Input() title: string;
  // @Input() content: TemplateRef<any>;
  @ContentChild('accordionContet') child: ElementRef;
  // @ContentChild('accordionContet') child: TemplateRef<any>;
  content: HTMLElement;
  headerid: string;
  collapseid: string;

  constructor() { }

  ngOnInit(): void {
    this.headerid = this.title + Math.floor(Math.random()*99999);
    this.collapseid = this.headerid + "collapse";
  }

  ngAfterContentInit() {
    // treat this.elemRef as a ElementRef type variable and do whatever you want to do with it
    this.content = this.child.nativeElement as HTMLElement;
   }

}
