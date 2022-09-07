import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

 private _data: any;

  set data(data:any){
    this._data=data;
  }
  get data(){
    return this._data;
  }

  constructor() { }
}
