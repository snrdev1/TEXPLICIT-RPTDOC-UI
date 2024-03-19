import { Component, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-urls',
  templateUrl: './add-urls.component.html',
  styleUrls: ['./add-urls.component.scss']
})
export class AddUrlsComponent {
  form: FormGroup;
  urls: any[] = [];

  constructor(private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddUrlsComponent>) {
    this.form = this.fb.group({
      rows: this.fb.array([]),
      restrict_search: new FormControl(false)
    });
  }

  ngOnInit() {
    this.urls = this.data?.urls;
    this.form.get("restrict_search")?.patchValue(this.data?.restrictSearch);

    if (this.urls !== null && this.urls.length > 0) {
      for (let i = 0; i < this.urls.length; i++) {
        this.addRow(this.urls[i]);
      }
    } else {
      this.addRow();
    }
  }

  get rows() {
    return this.form.get('rows') as FormArray;
  }

  createRow(initialValues: any): FormGroup {
    return this.fb.group({
      url: [initialValues?.url || '']
    });
  }

  addRow(initialValues = {}) {
    const newRow = this.createRow(initialValues);
    this.rows.push(newRow);
  }

  get getRows() {
    return this.form.controls["rows"] as FormArray;
  }

  removeRow(index: number) {
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
