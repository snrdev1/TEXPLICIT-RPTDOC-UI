import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../core/auth.guard';
import { UserAuthGuard } from '../core/user-auth.guard';
import { SharedModule } from '../shared/shared.module';
import { LayoutComponent } from './layout.component';
import { DisclaimerDialogComponent } from './modal-dialog/disclaimer-dialog/disclaimer-dialog.component';
import { FeedbackDialogComponent } from './modal-dialog/feedback-dialog/feedback-dialog.component';

const routes: Routes = [{
  path: '',
  component: LayoutComponent,
  children: [
    {
      path: '',
      loadChildren: () =>
        import('./../home/home.module').then(
          (m) => m.HomeModule
        )
    },
    {
      path: 'home',
      loadChildren: () =>
        import('./../home/home.module').then(
          (m) => m.HomeModule
        )
    },
    {
      path: 'registration',
      loadChildren: () =>
        import('./../registration/registration.module').then(
          (m) => m.RegistrationModule
        )
    },
    {
      path: 'reset-password/:token',
      loadChildren: () =>
        import('./../reset-password/reset-password.module').then(
          (m) => m.ResetPasswordModule
        )
    },
    {
      path: 'my-documents',
      loadChildren: () =>
        import('./../my-documents/my-documents.module').then(
          (m) => m.MyDocumentsModule
        ),
      canActivate: [AuthGuard]
    },
    {
      path: 'user-management',
      loadChildren: () =>
        import('../manage-user/manage-user.module').then(
          (m) => m.ManageUserModule
        ),
      canActivate: [AuthGuard, UserAuthGuard]
    },
    {
      path: 'admin',
      loadChildren: () =>
        import('../admin/admin.module').then(
          (m) => m.AdminModule
        )
    },
    {
      path: 'reports',
      loadChildren: () =>
        import('./../reports/reports.module').then(
          (m) => m.ReportsModule
        ),
      canActivate: [AuthGuard]
    },
    {
      path: 'about-us',
      loadChildren: () =>
        import('./../about-us/about-us.module').then(
          (m) => m.AboutUsModule
        )
    },
    {
      path: 'contact-us',
      loadChildren: () =>
        import('./../contact-us/contact-us.module').then(
          (m) => m.ContactUsModule
        )
    },
    {
      path: 'pricing',
      loadChildren: () =>
        import('./../pricing/pricing.module').then(
          (m) => m.PricingModule
        )
    },
    {
      path: 'payment',
      loadChildren: () =>
        import('./../payment/payment.module').then(
          (m) => m.PaymentModule
        )
    },
    {
      path: 'profile',
      loadChildren: () =>
        import('./../user-profile/user-profile.module').then(
          (m) => m.UserProfileModule
        ),
      canActivate: [AuthGuard]
    }

  ]
}];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FlexLayoutModule,
    SharedModule
  ],
  declarations: [
    LayoutComponent,
    DisclaimerDialogComponent,
    FeedbackDialogComponent,
  ]
})
export class LayoutModule { }
