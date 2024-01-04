import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { UrlSegmentGroup } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class ManageUserService {

  constructor( private http: HttpClient) { }

  getUserMenuNames(data : string[]) : Observable<any[]> {
    const url = `${environment.hostName}/user-management/get-menu-names`;
    const params = {"menuIds" : data};
    return this.http.get<any>(url, {params});
  }
  addNewUser(data : any): Observable<any> {
    const url = `${environment.hostName}/user-management/add-user`;
    return this.http.post<any>(url, data);
  }
  getAllChildUsers(pageIndex: number, pageSize: number): Observable<any>{
    const params = {
      "pageIndex": pageIndex,
      "pageSize": pageSize
    }
    const url = `${environment.hostName}/user-management/get-users`;
    return this.http.get<any>(url, {params});
  }
  editUserData(data : any, userId : string): Observable<any> {
    const url = `${environment.hostName}/user-management/edit-user/${userId}`;
    return this.http.put<any>(url, data);
  }
  deleteUserData(userId: string): Observable<any>{
    const url = `${environment.hostName}/user-management/del-user/${userId}`;
    return this.http.delete<any>(url);
  }
  getUserById(userId: string): Observable<any>{
    const url = `${environment.hostName}/user-management/get-user/${userId}`;
    return this.http.get<any>(url);
  }
}
