import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  showio: boolean;
  isCR: boolean;
  type: String = "";
  @ViewChild('name') name:ElementRef;
  @ViewChild('description') description:ElementRef;
  @ViewChild('id') id:ElementRef;


  constructor(private router: Router) {
    this.showio = false;
    this.isCR = false;
    this.type = "";
    document.body.style.overflow = 'auto'; // per prevenire lo scrolling
    document.body.style.background = 'white'; // per background
  }

  ngOnInit(): void { }

  switch(tipo: String): void {

    if (tipo === "CR") {
      this.isCR = true;
    }
    else {
      this.isCR = false;
    }

    this.type=tipo;
    // this.showio = !this.showio;
    if(!this.showio){
      this.showio=true;
    }
    console.log(this.showio,this.isCR);
  }

  startapplication() {

    switch (this.type) {
      case "CR":
        var x = this.id.nativeElement.value;
        console.log("element taken",x);
        this.router.navigateByUrl('/visual',{ state: { id: x}})
        break;
      case "Module":
        var x = this.name.nativeElement.value;
        var y = this.description.nativeElement.value;
        console.log("element taken",x,y);
        this.router.navigateByUrl('/designer',{ state: { name: x, description: y}})
        // this.router.navigate(['/designer'])
        break;
      case "Theater":
        var x = this.name.nativeElement.value;
        var y = this.description.nativeElement.value;
        console.log("element taken",x,y);
        //this.router.navigate(['/application'])
        console.log("todo");
        break;

      default:
        break;
    }

  }



}
