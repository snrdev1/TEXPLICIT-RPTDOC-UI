import { Injectable, Input } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private _localStorage: Storage;
  public _userInfo$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public userInfo$: Observable<any> = this._userInfo$.asObservable();

  constructor() {
    this._localStorage = localStorage;
  }

  observeUserInfo() {
    const data = this._localStorage.getItem('userInfo');
    // Emit User data
    if (data !== null)
      this._userInfo$.next(JSON.parse(data));
    else
      this._userInfo$.next(null);
  }

  setUserInfo(data: any) {
    // Set User data in localStorage
    const jsonData = JSON.stringify(data);
    this._localStorage.setItem('userInfo', jsonData);

    this._userInfo$.next(data);
  }

  getUserInfo() {
    const data = this._localStorage.getItem('userInfo');

    if (data !== null)
      return JSON.parse(data);
    else
      return null;
  }

  setitem(key: string, value: any) {
    this._localStorage.setItem(key, JSON.stringify(value));
  }
  
  getitem(key: string): any | null {
    const keystring = this._localStorage.getItem(key);
    if (keystring) {
      return JSON.parse(keystring);
    }
    return null;
  }
}

