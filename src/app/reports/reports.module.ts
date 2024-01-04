import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule, Routes } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthGuard } from '../core/auth.guard';
import { ReportsComponent } from './reports.component';
import { ReportCardsComponent } from './report-cards/report-cards.component';
import { ReportFilterComponent } from './report-filter/report-filter.component';
import { ReportUpdateComponent } from './report-update/report-update.component';
import { ReportUpdateCardsComponent } from './report-update-cards/report-update-cards.component';
import { AddSubtopicComponent } from './add-subtopic/add-subtopic.component';

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
  declarations: [ReportsComponent, ReportCardsComponent, ReportFilterComponent, ReportUpdateComponent, ReportUpdateCardsComponent, AddSubtopicComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FlexLayoutModule,
    SharedModule
  ]
})
export class ReportsModule { }




