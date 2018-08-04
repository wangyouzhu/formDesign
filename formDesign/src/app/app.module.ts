import { HttpDataService } from './service/httpData.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ElementRef } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { PageEditorComponent } from './page-editor/page-editor.component';
import { FormManageComponent } from './form-manage/form-manage.component';
import { UEditorModule } from 'ngx-ueditor';
import { RouterModule } from '@angular/router';
import { TreeModule } from 'ng2-tree';
import { InsertDataService } from './service/insertData.service';
@NgModule({
  declarations: [
    AppComponent,
    PageEditorComponent,
    FormManageComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    TreeModule,
    HttpClientModule,
    RouterModule,
    HttpModule,
    UEditorModule.forRoot({
      // 指定ueditor.js路径目录
      path: './assets/ueditor/',
      // 默认全局配置项
      options: {
          themePath: './assets/ueditor/themes/'
      }
  }),
  ],
  providers: [HttpDataService, InsertDataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
