import { HttpDataService } from './service/http-data.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormManageComponent } from './form-manage/form-manage.component';
import { TreeModule } from 'ng2-tree';
import { DataTableComponent } from './data-table/data-table.component';
import { AppRoutingModule } from './app-routing.module';
import { AddFormComponent } from './add-form/add-form.component';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    FormManageComponent,
    DataTableComponent,
    AddFormComponent
  ],
  imports: [
    NgxDatatableModule,
    BrowserModule,
    HttpModule,
    TreeModule,
    AppRoutingModule
  ],
  providers: [
    HttpDataService,
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
