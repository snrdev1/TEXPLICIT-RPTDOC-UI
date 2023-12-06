import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { CommonService } from '../shared/services/common.service';
import { LocalStorageService } from './local-storage.service';
import { SharedService } from '../shared/services/shared.service';

@Injectable({
  providedIn: 'root'
})
export class PathAuthGuard implements CanActivate {
  menu: any[] = [];
  menuIds: any[] = [];
  userInfo$: Observable<any> = this.localStorage.userInfo$;
  userInfo:any=[];
  constructor(
    private commonService: CommonService,
    private sharedService: SharedService,
    private localStorage: LocalStorageService,
  ) {
    this.userInfo =  this.localStorage.getUserInfo();
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return new Observable<boolean | UrlTree>((observer) => {
      // this.userInfo$.subscribe((res:any) => {
      //   if (res) {
      //     this.menuIds = res.permissions.menu || [];
          this.menuIds = this.userInfo.permissions.menu || [];

          this.commonService.getMenu(this.menuIds).subscribe({
            next: (menuRes) => {
              // console.log("res in getMenu", menuRes);
              this.menu = menuRes.data;
              const url = state.url;

              if (this.menu.some((menuItem) => menuItem.link === url)) {
                observer.next(true);
              } else {
                observer.next(false);
                this.sharedService.redirectToHome();
              }
            },
            error: (err) => {
              observer.next(false);
            }
          });
      //   } else {
      //     observer.next(false);
      //   }
      // });
    });
  }
}
