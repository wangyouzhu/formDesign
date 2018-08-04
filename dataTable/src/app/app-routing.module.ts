import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AddFormComponent } from './add-form/add-form.component';
import { DataTableComponent } from './data-table/data-table.component';
import { FormManageComponent } from './form-manage/form-manage.component';

const routes: Routes = [
    { path: 'home', component: FormManageComponent, children: [
        // { path: '', component: DataTableComponent },
        { path: 'add/:target', component: AddFormComponent},
    ] },
    { path: '**', redirectTo: '/home', pathMatch: 'full' },
    { path: '**', component: FormManageComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
