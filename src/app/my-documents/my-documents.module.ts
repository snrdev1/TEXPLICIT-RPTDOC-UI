import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from '../shared/shared.module';
import { MyDocumentsComponent } from './my-documents.component';
import { DocumentHighlightComponent } from './document-highlight/document-highlight.component';
import { DocumentItemizedSummaryComponent } from './document-itemized-summary/document-itemized-summary.component';
import { DocumentViewerComponent } from './document-viewer/document-viewer.component';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { CreateFolderDialogComponent } from './modal-dialog/create-folder-dialog/create-folder-dialog.component';
import { FileUploadDialogComponent } from './modal-dialog/file-upload-dialog/file-upload-dialog.component';
import { RenameFolderDialogComponent } from './modal-dialog/rename-folder-dialog/rename-folder-dialog.component';
import { FileFolderMoveDialogComponent } from './modal-dialog/file-folder-move-dialog/file-folder-move-dialog.component';
import { FileFolderShareDialogComponent } from './modal-dialog/file-folder-share-dialog/file-folder-share-dialog.component';
import { AuthGuard } from '../core/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: MyDocumentsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'itemized-summary',
    component: DocumentItemizedSummaryComponent
  },
  {
    path: 'highlight',
    component: DocumentHighlightComponent
  },
  {
    path: 'viewer',
    component: DocumentViewerComponent
  }
];

@NgModule({
  declarations: [
    MyDocumentsComponent,
    DocumentHighlightComponent,
    DocumentItemizedSummaryComponent,
    DocumentViewerComponent,
    CreateFolderDialogComponent,
    FileUploadDialogComponent,
    RenameFolderDialogComponent,
    FileFolderMoveDialogComponent,
    FileFolderShareDialogComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FlexLayoutModule,
    NgxDocViewerModule,
    SharedModule
  ]
})
export class MyDocumentsModule { }
