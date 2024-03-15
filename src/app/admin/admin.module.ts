import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatSortModule } from '@angular/material/sort';
import { RouterModule, Routes } from '@angular/router';
import { environment } from 'src/environments/environment.prod';
import { AdminAuthGuard } from '../core/admin-auth.guard';
import { AuthGuard } from '../core/auth.guard';
import { SharedModule } from '../shared/shared.module';
import { AddEditUserComponent } from './add-edit-user/add-edit-user.component';
import { AdminComponent } from './admin.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    canActivate: [AuthGuard, AdminAuthGuard],
    data: {
      seo: environment.seoData.admin
    }
  }
];
@NgModule({
  declarations: [
    AdminComponent,
    AddEditUserComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    MatSortModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AdminModule {
}
