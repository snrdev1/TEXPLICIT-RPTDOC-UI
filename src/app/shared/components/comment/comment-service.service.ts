import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor( private http: HttpClient ) { }

  // getComments(id: string, sortBy?: number): Observable<any> {
  //   let params : {[key : string] : number | undefined} = {filterBy: sortBy};
  //   const url = `${environment.hostName}/ki/${id}/comments?sortBy=${sortBy}`;
  //   return this.http.get(url, params);
  // }

  // likeComment(ki_id: string, commentId: string) {
  //   const url = `${environment.hostName}/ki/${ki_id}/comments/${commentId}/like`;
  //   return this.http.put(url, {});
  // }

  // addComment(id: string, query: any) {
  //   const url = `${environment.hostName}/ki/${id}/comments`;
  //   return this.http.post(url, query);
  // }

  // deleteComment(kiId: string, commentId: string) {
  //   const url = `${environment.hostName}/ki/${kiId}/comments/${commentId}`;
  //   return this.http.delete(url);
  // }

  // editComment(kiId: string, commentId: string, comment: string){
  //   const url = `${environment.hostName}/ki/${kiId}/comments/${commentId}`;
  //   const params = {
  //     "comment" : comment
  //   }
  //   return this.http.put(url, params);
  // }
}
