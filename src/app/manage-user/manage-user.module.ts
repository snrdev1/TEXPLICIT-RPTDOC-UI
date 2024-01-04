import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageUserComponent } from './manage-user.component';
import { RouterModule, Routes } from '@angular/router';
import { environment } from 'src/environments/environment';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from '../shared/shared.module';
import { AddEditUserDialogComponent } from './modal-dialog/add-edit-user-dialog/add-edit-user-dialog.component';
import { AuthGuard } from '../core/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: ManageUserComponent,
    canActivate: [AuthGuard],
    data: {
      seo: environment.seoData.manageuser
    }
  }
];

@NgModule({
  declarations: [
    ManageUserComponent,
    AddEditUserDialogComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FlexLayoutModule,
    SharedModule
  ]
})
export class ManageUserModule { }
