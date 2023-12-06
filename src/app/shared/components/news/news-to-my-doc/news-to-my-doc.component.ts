import { Component, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MydocumentsService } from 'src/app/services/mydocuments.service';
import { LocalStorageService } from 'src/app/core/local-storage.service';
import { Observable } from 'rxjs';
import { CommonService } from 'src/app/shared/services/common.service';
import { NewsService } from '../news.service';

@Component({
  selector: 'app-news-to-my-doc',
  templateUrl: './news-to-my-doc.component.html',
  styleUrls: ['./news-to-my-doc.component.scss']
})
export class NewsToMyDocComponent {
  fols : any = [];
  newfolder : any = [];
  filterfols:any = [];
  id_root : string = "";
  curr_id:string = "";
  folderstructure: any;
  selectedFolder:any;
  FolderName:string = "Home";
  renamedFile:string = "";
  userInfo$: Observable<any> = this.localStorageService.userInfo$;
  constructor(
    public dialogRef: MatDialogRef<NewsToMyDocComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private mydocs : MydocumentsService,
    private localStorageService : LocalStorageService,
    private formBuilder: FormBuilder,
    private newsService: NewsService,
    private commonService: CommonService
  ) { 
  }

  ngOnInit(){
    this.localStorageService.getUserInfo();
    this.userInfo$.subscribe((data) =>{
      this.curr_id = data._id;
    });
    console.log("Curr_ID:",this.curr_id);
    this.getAllFolders();
  }
  onFolderClick(folder:any){
    console.log("folderpassed:",folder);
    // this.selectedFolder=folder.name;
    if(folder.db_id == "/"){
      this.FolderName = "Home";
    }
    else{
      this.mydocs.getDocument(folder.db_id).subscribe((res)=>{
        this.selectedFolder = res.data;
        this.FolderName = res.data.originalFileName;
      })
    }
  }
  getAllFolders(){
    this.mydocs.getAllFolders().subscribe((res)=>{
      console.log(res);
      this.fols = res.data;
      console.log("Fols :",this.fols);
      for(let i = 0;i<this.fols.length;i++)
      {
        this.id_root = "/"+ this.fols[i].createdBy._id+"/";
        if(this.id_root == this.fols[i].root){
          
          this.filterfols.push(this.fols[i]);
        }
      }
      // console.log("FilterFolders:",this.filterfols);
      let home_folder = []
      home_folder.push({
        db_id:"/",
        id:0,
        name:"Home",
        expand:false,
        children:this.dfs(this.fols)
      })
      this.folderstructure =  home_folder;
      console.log("FolderStructure:",this.folderstructure);
    });
  }
  dfs(array:any[], root = "/" + this.curr_id,index = 1):any[]{
    let curr_root = (root == "/" + this.curr_id)?(root + '/') : root ;
    let curr_folder = [];
    for(let i of array){
      if(i.root === curr_root){
        // console.log(i.originalFileName);
        // console.log("Current_Folder:",curr_folder);
        curr_folder.push({
          db_id:i._id,
          id: index,
          name : i.originalFileName,
          expand: false,
          children: this.dfs(array, root+'/'+i.originalFileName,index+1)
        })
        index = index + 1;
      }
    }
    return curr_folder;
  }
  saveNews(){
    console.log("DATA",this.data);
    if(this.FolderName == "Home"){
      this.selectedFolder = "/";
    } 
    console.log("this.selectedFolder",this.selectedFolder);
    
    this.newsService.shareNews(this.data.news,this.selectedFolder).subscribe({
      next: (res)=>{
        console.log("Res in shareNews",res);
        this.commonService.showSnackbar("snackbar-success",res.message,"0");
      },
      error: (e)=>{
        console.log("Error:",e);
        this.commonService.showSnackbar("snackbar-error",e.error.message,e.status);
      },
      complete:()=>{
        console.log("Complete");
      }
    });
  }
  onCloseClick(){
    this.dialogRef.close(false);
  }
}
