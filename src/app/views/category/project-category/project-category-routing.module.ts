import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectCategoryComponent } from './project-category.component';

const routes: Routes = [
    {
        path: '',
        component: ProjectCategoryComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProjectCategoryRoutingModule { }
