import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MarkdownModule } from 'ngx-markdown';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MaterialModule } from '../material/material.module';
import { ChatCardComponent } from '../chat/chat-card/chat-card.component';
import { ChatPanelComponent } from '../chat/chat-panel/chat-panel.component';
import { FabButtonsComponent } from './components/fab-buttons/fab-buttons.component';
import { FileFolderCardComponent } from './components/file-folder/file-folder-card/file-folder-card.component';
import { InnerToolbarButtonsComponent } from './components/inner-toolbar-buttons/inner-toolbar-buttons.component';
import { LoaderComponent } from './components/loader/loader.component';
import { ConfirmDialogComponent } from './components/modal-dialog/confirm-dialog/confirm-dialog.component';
import { DemoRequestDialogComponent } from './components/modal-dialog/demo-request-dialog/demo-request-dialog.component';
import { DialogBaseComponent } from './components/modal-dialog/dialog-base/dialog-base.component';
import { ForgotPasswordDialogComponent } from './components/modal-dialog/forgot-password-dialog/forgot-password-dialog.component';
import { LoginDialogComponent } from './components/modal-dialog/login-dialog/login-dialog.component';
import { NewsCardComponent } from './components/news/news-card/news-card.component';
import { NewsDetailDialogComponent } from './components/news/news-detail-dialog/news-detail-dialog.component';
import { NewsPanelComponent } from './components/news/news-panel/news-panel.component';
import { NewsToMyDocComponent } from './components/news/news-to-my-doc/news-to-my-doc.component';
import { OuterToolbarButtonsComponent } from './components/outer-toolbar-buttons/outer-toolbar-buttons.component';
import { ReportStepsComponent } from './components/report-steps/report-steps.component';
import { SearchInputComponent } from './components/search-input/search-input.component';
import { CommonSnackbarComponent } from './components/snackbar/common-snackbar/common-snackbar.component';
import { DateAgoPipe } from './services/date-ago.pipe';


@NgModule({
  declarations: [
    SearchInputComponent,
    OuterToolbarButtonsComponent,
    FabButtonsComponent,
    InnerToolbarButtonsComponent,
    DialogBaseComponent,
    ConfirmDialogComponent,
    FileFolderCardComponent,
    LoginDialogComponent,
    NewsDetailDialogComponent,
    ForgotPasswordDialogComponent,
    CommonSnackbarComponent,
    DateAgoPipe,
    NewsToMyDocComponent,
    LoaderComponent,
    NewsPanelComponent,
    NewsCardComponent,
    ChatCardComponent,
    ChatPanelComponent,
    ReportStepsComponent,
    DemoRequestDialogComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    NgxSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSkeletonLoaderModule,
    MarkdownModule.forChild()
  ],
  exports: [
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SearchInputComponent,
    OuterToolbarButtonsComponent,
    FabButtonsComponent,
    InnerToolbarButtonsComponent,
    DialogBaseComponent,
    ConfirmDialogComponent,
    FileFolderCardComponent,
    NgxSkeletonLoaderModule,
    LoaderComponent,
    NewsPanelComponent,
    NewsCardComponent,
    ChatCardComponent,
    ChatPanelComponent,
    ReportStepsComponent,
    DemoRequestDialogComponent
  ]
})
export class SharedModule { }
