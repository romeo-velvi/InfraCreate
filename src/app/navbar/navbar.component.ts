import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

// class Navlink {
//   name:String = "";
//   redirect:String = "";
//   constructor(name:String, redirect:String){
//     this.name = name;
//     this.redirect = redirect;
//   }
//   getname():String{
//     return this.name;
//   }
//   getredirection():String{
//     return this.redirect;
//   }
// }

export class NavbarComponent implements OnInit {

  // navlink: Navlink[] = [
  //   new Navlink ("Home", "/home"),
  //   new Navlink ("About us", "/about-us"),
  //   new Navlink ("How to use", "/how-to-use"),
  // ]

  constructor() { }

  ngOnInit(): void {
    
  }

}
