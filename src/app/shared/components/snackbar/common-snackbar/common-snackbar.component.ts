import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
  selector: 'app-common-snackbar',
  templateUrl: './common-snackbar.component.html',
  styleUrls: ['./common-snackbar.component.scss']
})
export class CommonSnackbarComponent {
  icon:string=''
  title:string='';
  text:string='';

  constructor(private snackbarRef:MatSnackBarRef<CommonSnackbarComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: any){
      console.log(this.data);
      if(this.data.type=='info'){
        this.title='Info';
        this.icon='error';
      }
      if(this.data.type=='success'){
        this.title='Success';
        this.icon='check_circle';
      }
      if(this.data.type=='warning'){
        this.title='Warning';
        this.icon='warning';
      }
      if(this.data.type=='error'){
        this.title='Error';
        this.icon='report';
        if (this.data.errorCode!==undefined && this.data.errorCode!==null && this.data.errorCode!=='' && this.data.errorCode!=='0')
        {
          this.title+=': '+this.data.errorCode;
        }
      }

      this.text=this.data.messageText;
    }

  onClose(){
    this.snackbarRef.dismiss();
  }
}
