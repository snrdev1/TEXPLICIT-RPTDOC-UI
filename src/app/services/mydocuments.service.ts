import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import {saveAs} from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class MydocumentsService {
  // private api = "http://115.187.43.48:6544"

  constructor(private http:HttpClient) {}
  createFolder(input:any) {
    console.log("Input:",input);
    const url = `${environment.hostName}/my-documents/create-folder`;
    return this.http.post<any>(url,input);
  }
  getAllFiles(root : string): Observable<any> {
    const url = `${environment.hostName}/my-documents/display-documents`;
    const params = {"root" : root};
    console.log("params : ",params);
    return this.http.get<any>(url, {params});
  }
  uploadFiles(formData : FormData): Observable<any> {
    const url = `${environment.hostName}/my-documents/upload-documents`;
    return this.http.post<any>(url,formData,{reportProgress:true,observe:'events'});
  }
  deleteFolder(folderId : string , path:string): Observable<any>{
    const url = `${environment.hostName}/my-documents/delete-folder/${folderId}`
    return this.http.delete<any>(url);
  }
  deleteFile(fileId: string , path:string): Observable<any>{
    const url = `${environment.hostName}/my-documents/${fileId}`
    return this.http.delete<any>(url);
  }
  movefile(file: any , folder: any){
    const url = `${environment.hostName}/my-documents/move-files`
    const params = {"file":file,"folder":folder};
    console.log("params:",params);
    return this.http.put<any>(url,params);
  }
  getDocument(documentId: string): Observable<any>{
    const url = `${environment.hostName}/my-documents/${documentId}`;
    return this.http.get<any>(url);
  }
  shareDocument(documentId: string, usersWithAccess: any): Observable<any> {
    const url = `${environment.hostName}/my-documents/share`;
    const params = {
      "documentId": documentId,
      "usersWithAccess": usersWithAccess
    };
    return this.http.post<any>(url, params);
  }
  getAllFolders():Observable<any>{
    const url = `${environment.hostName}/my-documents/display-folders`;
    console.log("Url : ", url);
    return this.http.get<any>(url);
  }
  getFolderContents(_id : string) : Observable<any> {
    const url = `${environment.hostName}/my-documents/folder-content/${_id}`;
    return this.http.get<any>(url);
  }
  downloadFile(virtualFileName:string,originalFileName:string){  
    const url = `${environment.hostName}/my-documents/download/${virtualFileName}`;
    // const params = {"root":strpath}
    this.http.get(url, {responseType: 'blob'}).subscribe({
      next: (res: any) => {
        console.log(res);
        let blob: any = new Blob([res], {type: 'text/json; charset=utf-8'});
        const url = window.URL.createObjectURL(blob);
        saveAs(blob, originalFileName);
        console.log("File download complete");
      },
      error: (e) => console.error("Error : ", e),
      complete: () => {
        console.info('Complete!');
      }
    });
  }
  rename(id:string,newname:string){
    console.log("Id",id);
    console.log("Rename_value:",newname);
    const url = `${environment.hostName}/my-documents/rename/${id}`;
    const params = {
      "renameValue":newname
    };
    return this.http.put<any>(url,params);
  }
  // shareFolder(documentId: string, usersWithAccess: any): Observable<any> {
  //   const url = `${environment.hostName}/my-documents/share`;
  //   const params = {
  //     "documentId": documentId,
  //     "usersWithAccess": usersWithAccess
  //   };
  //   return this.http.post<any>(url, params);
  // }
}
