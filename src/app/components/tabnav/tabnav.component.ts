import { ChangeDetectionStrategy } from '@angular/compiler/src/compiler_facade_interface';
import { ChangeDetectorRef, Component, Input, OnInit, Output } from '@angular/core';
import { TabnavElement } from './tabnavType';

@Component({
  selector: 'app-tabnav',
  templateUrl: './tabnav.component.html',
  styleUrls: ['./tabnav.component.sass']
})
export class TabnavComponent implements OnInit {

  @Input() title: string;
  @Input() alt_title: string;
  @Input() element: TabnavElement;

  hasMultipleTag: boolean = true;

  activetab: string;

  constructor(
    private cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    this.hasMultipleTag = (this.element.element.length > 1) ? true : false;
    this.active(this.element.element[0].id);
  }

  active(val: string | any) {
    this.activetab = val;
    this.cdr.detectChanges();
  }

}
