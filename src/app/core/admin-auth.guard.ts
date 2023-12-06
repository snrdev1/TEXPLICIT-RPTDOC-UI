import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { CommonService } from '../shared/services/common.service';
import { Router } from '@angular/router';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthGuard implements CanActivate {

  constructor(
    private auth: AuthService,
    private commonService: CommonService,
    private router: Router,
    private localStorageService: LocalStorageService
  ) {
  }

   /**
   * 
   * @returns boolean : True if the user is Admin or False if the user is not
   */
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const user = this.localStorageService.getitem("userInfo");
      console.log("Auth guard user :", user);
      // role value 1 stands for Admin role
      if(user["role"] == 1){
        return true;
      }
      else{
        this.router.navigate(['/home']);
        return false;
      }
  }
  
}
