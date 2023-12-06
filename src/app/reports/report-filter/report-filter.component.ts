import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LocalStorageService } from 'src/app/core/local-storage.service';
import { HomeFilterDialogComponent } from 'src/app/home/modal-dialog/home-filter-dialog/home-filter-dialog.component';
import { HomeService } from 'src/app/shared/services/home.service';

@Component({
  selector: 'app-report-filter',
  templateUrl: './report-filter.component.html',
  styleUrls: ['./report-filter.component.scss']
})
export class ReportFilterComponent {
  // sourceSelection: number = 1;
  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<ReportFilterComponent>,
    private formBuilder: FormBuilder,
    private homeService: HomeService,
    private localStorage: LocalStorageService,
    // @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.formBuilder.group({
      source: new FormControl(""),
      format: new FormControl(""),
      report_type:new FormControl("")
    });
  }

  ngOnInit(){
      // console.log("getting source",this.data);
    let selectedFilter = this.localStorage.getitem('reportFilter');
     console.log("SelectedFilter",selectedFilter);
     if(selectedFilter){
     this.form.get('source')?.setValue(selectedFilter.source);
     this.form.get('format')?.setValue(selectedFilter.format);
     this.form.get('report_type')?.setValue(selectedFilter.report_type);
     }

  }
  onCloseClick(){
    // console.log("this.form.value ",this.form.value );
    this.formValueReset();
    this.dialogRef.close(this.form.value);
  }

  onSubmit(){
    // console.log(this.form.value);
    this.localStorage.setitem('reportFilter',this.form.value);
    this.dialogRef.close(this.form.value);
  }
  formReset(){
    this.formValueReset();
    this.localStorage.setitem('reportFilter',this.form.value);
  }
  formValueReset(){
    this.form.controls['source'].setValue("");
    this.form.controls['format'].setValue("");
    this.form.controls['report_type'].setValue("");
  }
}
