import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  showio: boolean;
  type: String = "";

  constructor() {
    this.showio = false;
    this.type = "";
  }

  ngOnInit(): void { }

  switch(tipo:String): void {

    if(tipo === "CR"){
      this.startapplication();
      //do smtg -> applicazione
    }

    if(tipo === this.type){
      this.showio = !this.showio;
    }
    else if(tipo!==this.type && this.showio===false){
      this.type = tipo;
      this.showio = !this.showio;
    }
    else{
      this.type = tipo;
    }
  }

  startapplication():void{

  }

  

}
