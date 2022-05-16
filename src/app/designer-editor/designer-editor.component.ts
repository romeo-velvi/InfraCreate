import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-designer-editor',
  templateUrl: './designer-editor.component.html',
  styleUrls: ['./designer-editor.component.sass']
})
export class DesignerEditorComponent implements OnInit {

  name: string;
  description: string;

  constructor(private router: Router) { 
    this.name = this.router.getCurrentNavigation().extras.state.name;
    this.description = this.router.getCurrentNavigation().extras.state.description;
    console.log("passed", this.name,this.description);
    document.body.style.overflow = 'hidden'; // per prevenire lo scrolling
    document.body.style.background = '#0f131a'; // per background
  }

  ngOnInit(): void {
  }


}
