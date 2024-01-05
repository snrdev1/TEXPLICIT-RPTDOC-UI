import { HttpClient } from '@angular/common/http';
import { Injectable, Input } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable,map} from 'rxjs';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from './local-storage.service';
import { CommonService } from '../shared/services/common.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router:Router, private http:HttpClient, 
              private localStorage: LocalStorageService) { }

  signup(input:any): Observable<any> {
    const url = `${environment.hostName}/account/signup`;
    return this.http.post<any>(url,input);
  }

  login(input:any): Observable<any> {
    const url = `${environment.hostName}/account/login`;
    return this.http.post<any>(url,input);
  }
  

  logout(){
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigateByUrl('/home');
  }

  get isLoggedIn():boolean{
    return (this.token!='');
  }

  @Input() set token(token:string){
    localStorage.setItem("token",token);
  }

  get token():string{
    return localStorage.getItem("token") || '';
  }
  
  getCurrentUser(){
    const url =  `${environment.hostName}/account/current-user`;
    return this.http.get(url).pipe(map((res: any) => res.data));
  }
}
