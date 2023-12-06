import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { RouterModule, Routes } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SubtopicComponent } from '../shared/components/subtopic/subtopic.component';
import { SharedModule } from '../shared/shared.module';
import { KnowledgeitemItemizedSummaryComponent } from './knowledgeitem-itemized-summary/knowledgeitem-itemized-summary.component';
import { KnowledgeitemConsolidatedSummaryComponent } from './knowledgeitem-consolidated-summary/knowledgeitem-consolidated-summary.component';
import { KnowledgeitemHighlightComponent } from './knowledgeitem-highlight/knowledgeitem-highlight.component';
import { environment } from 'src/environments/environment.development';
// import { KiDetailComponent } from '../shared/components/knowledgeitem/ki-detail/ki-detail.component';
import { AnonymousComponent } from './anonymous/anonymous.component';
import { HomeFilterDialogComponent } from './modal-dialog/home-filter-dialog/home-filter-dialog.component';
import { AuthGuard } from '../core/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuard],
    data: {
      seo: environment.seoData.home
    }
  },
  {
    path: 'anonymous',
    component: AnonymousComponent,
    data: {
      seo: environment.seoData.home
    }
  },
  // {
  //   path: 'knowledgeitem/:id',
  //   component: KiDetailComponent,
  //   canActivate: [AuthGuard],
  //   data: {
  //     seo: environment.seoData.kiDetail
  //   }
  // },
  {
    path: 'itemized-summary',
    component: KnowledgeitemItemizedSummaryComponent,
    canActivate: [AuthGuard],
    data: {
      seo: environment.seoData.kiItemizedSummary
    }
  },
  {
    path: 'consolidated-summary',
    component: KnowledgeitemConsolidatedSummaryComponent,
    canActivate: [AuthGuard],
    data: {
      seo: environment.seoData.kiConsolidatedSummary
    }
  },
  {
    path: 'highlight',
    component: KnowledgeitemHighlightComponent,
    canActivate: [AuthGuard],
    data: {
      seo: environment.seoData.kiHighlight
    }
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FlexLayoutModule,
    SharedModule
  ],
  declarations: [
    HomeComponent,
    SubtopicComponent,
    KnowledgeitemItemizedSummaryComponent,
    KnowledgeitemConsolidatedSummaryComponent,
    KnowledgeitemHighlightComponent,
    AnonymousComponent,
    HomeFilterDialogComponent,
  ]
})
export class HomeModule { }
