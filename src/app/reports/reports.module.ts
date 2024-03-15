import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule, Routes } from '@angular/router';
import { environment } from 'src/environments/environment.prod';
import { AuthGuard } from '../core/auth.guard';
import { SharedModule } from '../shared/shared.module';
import { AddSubtopicComponent } from './add-subtopic/add-subtopic.component';
import { ReportCardsComponent } from './report-cards/report-cards.component';
import { ReportFilterComponent } from './report-filter/report-filter.component';
import { ReportUpdateCardsComponent } from './report-update-cards/report-update-cards.component';
import { ReportUpdateComponent } from './report-update/report-update.component';
import { ReportFailedComponent } from './report-failed/report-failed.component';
import { ReportsComponent } from './reports.component';
import { ReportSubtopicsComponent } from './report-subtopics/report-subtopics.component';
import { AddUrlsComponent } from './add-urls/add-urls.component';


const routes: Routes = [
  {
    path: '',
    component: ReportsComponent,
    canActivate: [AuthGuard],
    data: {
      seo: environment.seoData.reports
    }
  },
];
@NgModule({
  declarations: [
    ReportsComponent,
    ReportCardsComponent,
    ReportFilterComponent,
    ReportUpdateComponent,
    ReportUpdateCardsComponent,
    AddSubtopicComponent,
    ReportFailedComponent,
    ReportSubtopicsComponent,
    AddUrlsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FlexLayoutModule,
    SharedModule
  ]
})
export class ReportsModule { }




