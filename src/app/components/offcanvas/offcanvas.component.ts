import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-offcanvas',
  templateUrl: './offcanvas.component.html',
  styleUrls: ['./offcanvas.component.sass'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class OffcanvasComponent implements OnInit{

  _show: boolean;  
  @Input()
  set show(val: boolean) {
    this.showChange.emit(val);
    this._show = val;
  }
  get show() {
    return this._show;
  }
  @Output() showChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  
  @Input() title: string;
  @Input() alt_title?: string;
  @Input() title_template?: TemplateRef<any>;
  @Input() element: TemplateRef<any>;
  @Input() position: "end" | "start" | "top" | "bottom";

  hasMultipleTag: boolean = true;


  @Input() isfull?: boolean = false;
  toReduceIconClass: string = "bi bi-box-arrow-in-down-right";
  toOpenIconClass: string = "bi bi-square";
  closeIconClass: string = "bi bi-x-lg";


  constructor(private cdr: ChangeDetectorRef) {
  }
  ngOnInit(): void {
  }
  closeOffcanvas(){
    this.show=false;
    this.cdr.detectChanges();
  }
  reduce() {
    this.isfull = !this.isfull;
    this.cdr.detectChanges();
  }

}
