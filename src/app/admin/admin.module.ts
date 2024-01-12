import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {SharedModule} from '../shared/shared.module';
import { environment } from 'src/environments/environment.prod';
import { AuthGuard } from '../core/auth.guard';
import { MatSortModule } from '@angular/material/sort';
// import {AngularSvgIconModule} from 'angular-svg-icon';
// import {MaterialModule} from '../shared/material.module';
// import {InfiniteScrollModule} from 'ngx-infinite-scroll';
import {FormsModule} from "@angular/forms";
import {AdminComponent} from './admin.component';
// import {ApproveKIComponent} from './approve-ki/approve-ki.component';
// import {RejectionReasonsComponent} from './rejection-reasons/rejection-reasons.component';
import {ReactiveFormsModule} from '@angular/forms';
import { AdminAuthGuard } from '../core/admin-auth.guard';
import { AddEditUserComponent } from './add-edit-user/add-edit-user.component';
import { ApproveKiComponent } from './approve-ki/approve-ki.component';
import { RejectionReasonsComponent } from './rejection-reasons/rejection-reasons.component';
// import {UserApprovalComponent} from './user-approval/user-approval.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    canActivate: [AuthGuard,AdminAuthGuard],
    data: {
      seo: environment.seoData.admin
    }
  }
];
@NgModule({
  declarations: [
    AdminComponent,
    AddEditUserComponent,
    ApproveKiComponent,
    RejectionReasonsComponent,
    // ApproveKIComponent,
    // RejectionReasonsComponent,
    // UserApprovalComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    MatSortModule,
    // AngularSvgIconModule.forRoot(),
    // MaterialModule,
    // InfiniteScrollModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AdminModule {
}
