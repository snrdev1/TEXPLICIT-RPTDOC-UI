import { Component, Input, Inject} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { HomeService } from 'src/app/shared/services/home.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LocalStorageService } from 'src/app/core/local-storage.service';

@Component({
  selector: 'app-home-filter-dialog',
  templateUrl: './home-filter-dialog.component.html',
  styleUrls: ['./home-filter-dialog.component.scss']
})
export class HomeFilterDialogComponent {
  form: FormGroup;
  tags: any=[];
  tagsIndices: any=[];
  
  constructor(
    public dialogRef: MatDialogRef<HomeFilterDialogComponent>,
    private formBuilder: FormBuilder,
    private homeService: HomeService,
    private localStorage: LocalStorageService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.formBuilder.group({
      category: new FormControl("")
    });
  }

  ngOnInit(){
      console.log("getting all tags",this.data);
      this.tags = this.data;
      // console.log("getting all tags",this.tags);
      this.tagsIndices = Array.from(this.tags.keys());
      // console.log("getting all tags",this.tagsIndices);
      const selectedValues = this.localStorage.getitem("tagsSelected");
      // this.form = this.formBuilder.group({
      //   category: new FormControl(selectedValues)
      // })
      this.form.get("category")?.setValue(selectedValues);

  }
  onCloseClick(){
    console.log("this.form.value.category ",this.form.value.category );
    this.dialogRef.close(this.form.value);
  }

  onSubmit(){
    console.log(this.form.value);
    this.localStorage.setitem("tagsSelected", this.form.controls['category'].value);
    this.dialogRef.close(this.form.value);
  }
  formReset(){
    this.form.reset();
    this.localStorage.setitem("tagsSelected", []);
  }
}
