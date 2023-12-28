import { Component, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-subtopic',
  templateUrl: './add-subtopic.component.html',
  styleUrls: ['./add-subtopic.component.scss']
})
export class AddSubtopicComponent {

  form: FormGroup;
  constructor(private fb: FormBuilder, 
              @Inject(MAT_DIALOG_DATA) public subtopics: any,
              public dialogRef: MatDialogRef<AddSubtopicComponent>) {
    this.form = this.fb.group({
      rows: this.fb.array([])
    });

  }

  
  ngOnInit() {
    if (this.subtopics !== null && this.subtopics.length>0) {
      for (let i = 0; i < this.subtopics.length; i++) {
        this.addRow(this.subtopics[i]);
      }
    } else {
      this.addRow();
    }
  }

  
  get rows() {
    return this.form.get('rows') as FormArray;
  }

  createRow(initialValues:any): FormGroup {
      return this.fb.group({
        task: [initialValues?.task || '' , Validators.required],
        source: [initialValues?.source || 'external' , Validators.required],
        // websearch: [{value:initialValues?.websearch || false,disabled:initialValues?.source=='my_documents'}]
        websearch: [true]
      
      });
    }   
  
  

  addRow(initialValues={}) {
    const newRow = this.createRow(initialValues);
    this.rows.push(newRow);
  }
  
  get getRows() {
    return this.form.controls["rows"] as FormArray;
  }

  onSourceChange(i:any)
  { 
    const selectedRow=this.getRows.controls[i];
    if(selectedRow.get('source')?.value=='my_documents'){
      selectedRow.get('websearch')?.disable();
    }
    else{
      selectedRow.get('websearch')?.enable();
    }
  }
  removeRow(index:number){
    this.rows.removeAt(index);
  }
  onSubmit() {
    console.log(this.form.value);
    this.dialogRef.close(this.form.value);
  }

  onCloseClick() {
    this.dialogRef.close(this.form.value);
  } 
}
