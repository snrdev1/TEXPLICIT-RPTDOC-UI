import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class AdminServices {
  constructor(
    private http: HttpClient
  ) {
  }

  getPendingKIs(): Observable<any> {
    const url = `${environment.hostName}/admin/ki/pending/all`;
    return this.http.post<any>(url, {});
  }

  getPendingKIbyID(id: string): Observable<any> {
    const url = `${environment.hostName}/admin/ki/pending/${id}`;
    return this.http.get<any>(url);
  }

  changeKIStatus(params: any): Observable<any> {
    const url = `${environment.hostName}/admin/ki/change_status`;
    return this.http.post<any>(url, params);
  }

  getAllUsers(): Observable<any> {
    const url = `${environment.hostName}/admin/user/all`;
    return this.http.get<any>(url);
  }

  /**
   * 
   * @param userId : User ID of the user to be approved
   * @returns approval status
   */
  getUserById(userId: string): Observable<any> {
    const url = `${environment.hostName}/admin/user/approve/${userId}`;
    console.log("URL : ", url);
    return this.http.get<any>(url);
  }

  // Utils
  getUserDetailsById(userId: string): Observable<any> {
    const url = `${environment.hostName}/account/${userId}`;
    return this.http.get<any>(url);
  }

  getRejectionResponse(): Observable<any> {
    const url = `${environment.hostName}/admin/ki/rejection-responses`;
    return this.http.get<any>(url);
  }

  createUpdateUser(userDetails: any): Observable<any> {
    const url = `${environment.hostName}/admin/user/user-add-update`;

    return this.http.post<any>(url, userDetails);
  }

  toggleUserStatus(userId: string): Observable<any> {
    const url = `${environment.hostName}/admin/user/user_status`;
    const params = {
      "userId": userId
    };
    return this.http.post<any>(url, params);
  }
}