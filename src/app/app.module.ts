import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from './material/material.module';
import { AppHttpInterceptor } from './core/app-http-interceptor';
import { AdminComponent } from './admin/admin.component';
import { AddEditUserComponent } from './admin/add-edit-user/add-edit-user.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
// import { ReportCreateComponent } from './report-create/report-create.component';
// import { ReportsComponent } from './reports/reports.component';

@NgModule({
  declarations: [
    AppComponent,
    // ReportCreateComponent,
    // ReportsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    NgxSkeletonLoaderModule,
    // NgxSkeletonLoaderModule.forRoot({ animation: 'pulse', loadingText: 'This item is actually loading...' }),

  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AppHttpInterceptor,
      multi: true,
    },
    {
      provide: Storage,
      useClass: AppComponent,
      multi: true,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
