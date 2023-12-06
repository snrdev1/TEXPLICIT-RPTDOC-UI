import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchInputComponent } from './components/search-input/search-input.component';
import { MaterialModule } from '../material/material.module';
import { OuterToolbarButtonsComponent } from './components/outer-toolbar-buttons/outer-toolbar-buttons.component';
import { FabButtonsComponent } from './components/fab-buttons/fab-buttons.component';
import { InnerToolbarButtonsComponent } from './components/inner-toolbar-buttons/inner-toolbar-buttons.component';
import { CommentPanelComponent } from './components/comment/comment-panel/comment-panel.component';
import { CommentListComponent } from './components/comment/comment-list/comment-list.component';
import { CommentCardComponent } from './components/comment/comment-card/comment-card.component';
import { DialogBaseComponent } from './components/modal-dialog/dialog-base/dialog-base.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmDialogComponent } from './components/modal-dialog/confirm-dialog/confirm-dialog.component';
import { FileFolderCardComponent } from './components/file-folder/file-folder-card/file-folder-card.component';
import { LoginDialogComponent } from './components/modal-dialog/login-dialog/login-dialog.component';
import { NewsDetailDialogComponent } from './components/news/news-detail-dialog/news-detail-dialog.component';
import { ForgotPasswordDialogComponent } from './components/modal-dialog/forgot-password-dialog/forgot-password-dialog.component';
import { CommonSnackbarComponent } from './components/snackbar/common-snackbar/common-snackbar.component';
import { DateAgoPipe} from './services/date-ago.pipe';
import { NewsToMyDocComponent } from './components/news/news-to-my-doc/news-to-my-doc.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { NgxSpinnerModule } from 'ngx-spinner';
import { LoaderComponent } from './components/loader/loader.component';
import { NewsPanelComponent } from './components/news/news-panel/news-panel.component';
import { NewsCardComponent } from './components/news/news-card/news-card.component';
import { ChatCardComponent } from './components/chat/chat-card/chat-card.component';
import { ChatPanelComponent } from './components/chat/chat-panel/chat-panel.component';
import { FeedbackDialogComponent } from '../layout/modal-dialog/feedback-dialog/feedback-dialog.component';
import { DisclaimerDialogComponent } from '../layout/modal-dialog/disclaimer-dialog/disclaimer-dialog.component';

@NgModule({
  declarations: [
    SearchInputComponent,
    OuterToolbarButtonsComponent,
    FabButtonsComponent,   
    InnerToolbarButtonsComponent,
    CommentPanelComponent,
    CommentListComponent,
    CommentCardComponent,
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
    // FeedbackDialogComponent,
    // DisclaimerDialogComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    NgxSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSkeletonLoaderModule
  ],
  exports:[
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SearchInputComponent,
    OuterToolbarButtonsComponent,
    FabButtonsComponent,
    InnerToolbarButtonsComponent,
    CommentPanelComponent,
    CommentListComponent,
    DialogBaseComponent,
    ConfirmDialogComponent,
    FileFolderCardComponent,
    NgxSkeletonLoaderModule,
    LoaderComponent,
    NewsPanelComponent,
    NewsCardComponent,
    ChatCardComponent,
    ChatPanelComponent, 
    // FeedbackDialogComponent,
    // DisclaimerDialogComponent,
  ]
})
export class SharedModule { }
