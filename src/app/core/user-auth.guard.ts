import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { LocalStorageService } from './local-storage.service';
import { AuthService } from './auth.service';
import { CommonService } from '../shared/services/common.service';

@Injectable({
  providedIn: 'root'
})
export class UserAuthGuard implements CanActivate {
   constructor(
    private auth: AuthService,
    private commonService: CommonService,
    private router: Router,
    private localStorageService: LocalStorageService
  ) {
  }

   
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const user = this.localStorageService.getitem("userInfo");
      // console.log("manage user guard :", user);
      if(user["role"] == 2){
        return true;
      }
      else{
        this.router.navigate(['/']);
        return false;
      }
  }
}
