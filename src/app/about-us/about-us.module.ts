import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutUsComponent } from './about-us.component';
import { RouterModule, Routes } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from '../shared/shared.module';
import { environment } from 'src/environments/environment.prod';

const routes: Routes = [
  {
    path: '',
    component: AboutUsComponent,
    data: {
      seo: environment.seoData.aboutus
    }
  }
];


@NgModule({
  declarations: [
    AboutUsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FlexLayoutModule,
    SharedModule
  ]
})
export class AboutUsModule { }
