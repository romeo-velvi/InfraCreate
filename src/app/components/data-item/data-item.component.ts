import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-window-item',
  templateUrl: './data-item.component.html',
  styleUrls: ['./data-item.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataItemComponent implements OnInit {

  // @Input() content: TemplateRef<any>;
  @Input() title?: string;
  @Input() isfull?: boolean = false;
  @Input() onlyResize?: boolean = false;

  @Output() onRemove: EventEmitter<any> = new EventEmitter();


  toReduceIconClass: string = "bi bi-box-arrow-in-down-right";
  toOpenIconClass: string = "bi bi-square";
  closeIconClass: string = "bi bi-x-lg";

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
  }

  reduce() {
    this.isfull = !this.isfull;
    this.cdr.detectChanges();
  }
  
  remove(){
    this.onRemove.emit(null);
    this.cdr.detectChanges();
  }


}

