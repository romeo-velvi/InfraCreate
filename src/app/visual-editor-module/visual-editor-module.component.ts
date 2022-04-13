import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-visual-editor-module',
  templateUrl: './visual-editor-module.component.html',
  styleUrls: ['./visual-editor-module.component.sass']
})

export class VisualEditorModuleComponent implements OnInit {

  @Input() modules: any;

  constructor() {
  }

  ngOnInit(): void {
  }

}


