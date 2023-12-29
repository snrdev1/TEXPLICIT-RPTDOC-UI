import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout.component';
import { RouterModule, Routes } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NewsPanelComponent } from '../shared/components/news/news-panel/news-panel.component';
import { NewsCardComponent } from '../shared/components/news/news-card/news-card.component';
import { ChatPanelComponent } from '../shared/components/chat/chat-panel/chat-panel.component';
import { ChatCardComponent } from '../shared/components/chat/chat-card/chat-card.component';
// import { NotePanelComponent } from '../shared/components/note/note-panel/note-panel.component';
// import { NoteCardComponent } from '../shared/components/note/note-card/note-card.component';
import { SharedModule } from '../shared/shared.module';
import { DisclaimerDialogComponent } from './modal-dialog/disclaimer-dialog/disclaimer-dialog.component';
import { FeedbackDialogComponent } from './modal-dialog/feedback-dialog/feedback-dialog.component';
import { AuthGuard } from '../core/auth.guard';
import { UserAuthGuard } from '../core/user-auth.guard';
import { AdminModule } from '../admin/admin.module';
import { PathAuthGuard } from '../core/path-auth.guard';

const routes: Routes = [{
  path: '',
    component: LayoutComponent,
    children:[
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
          canActivate: [AuthGuard, PathAuthGuard]
      },
      {
        path: 'user-management',
        loadChildren: () =>
          import('../manage-user/manage-user.module').then(
            (m) => m.ManageUserModule
          ),
          canActivate: [AuthGuard, UserAuthGuard, PathAuthGuard]
      },
      {
        path:'admin',
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
          canActivate: [AuthGuard, PathAuthGuard]
      },
      // {
      //   path: 'create-reports',
      //   loadChildren: () =>
      //     import('./../report-create/report-create.module').then(
      //       (m) => m.ReportCreateModule
      //     ),
      //     canActivate: [AuthGuard]
      // },
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
    // NewsPanelComponent,
    // NewsCardComponent,
    // ChatPanelComponent,
    // ChatCardComponent,
    // NotePanelComponent,
    // NoteCardComponent,
    DisclaimerDialogComponent,
    FeedbackDialogComponent,
  ]
})
export class LayoutModule { }
