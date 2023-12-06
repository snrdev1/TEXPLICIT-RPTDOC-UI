import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {

  constructor() { }

  getItem(token:string) {
      const value = localStorage.getItem(token);
      console.log("getItem",value);
      if (value) {
        return value;
      } else {
        return null;
      
  }
}}
