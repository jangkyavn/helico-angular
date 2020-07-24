import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DiariesComponent } from './diaries.component';

const routes: Routes = [
    {
        path: '',
        component: DiariesComponent,
        data: {
            breadcrumb: 'Nhật ký'
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DiariesRoutingModule {
    static components = [
        DiariesComponent
    ];
}
