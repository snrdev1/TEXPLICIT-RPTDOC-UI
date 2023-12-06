import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { CommonService } from '../shared/services/common.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router:Router,
    private authService: AuthService,
    private commonService: CommonService){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      
      let result:boolean=false;
      if (this.authService.isLoggedIn){
        if(state.url == '/home/anonymous') this.router.navigate(['/home']);
        result = true;
      }
      else{
        if (this.router.url=='/' || state.url == '/home'){
          this.router.navigate(['/home/anonymous']);
          result = false;
        }
        else if (state.url !== '/home' && state.url !== '/home/anonymous'){
          this.commonService.openLoginModal(state.url);
          result = false;
        }
      }

      return result;
      
    }
  }
