import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactUsComponent } from './contact-us.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from '../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { environment } from 'src/environments/environment.prod';

const routes: Routes = [
  {
    path: '',
    component: ContactUsComponent,
    data: {
      seo: environment.seoData.contactus
    }
  }
];

@NgModule({
  declarations: [
    ContactUsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FlexLayoutModule,
    SharedModule
  ]
  
})
export class ContactUsModule { }
