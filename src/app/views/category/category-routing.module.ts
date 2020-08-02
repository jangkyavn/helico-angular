import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        data: {
            breadcrumb: 'Danh mục'
        },
        children: [
            {
                path: 'loai-san-pham',
                loadChildren: () => import('./product-category/product-category.module').then(m => m.ProductCategoryModule)
            },
            {
                path: 'loai-du-an',
                loadChildren: () => import('./project-category/project-category.module').then(m => m.ProjectCategoryModule)
            },
            {
                path: '',
                redirectTo: 'loai-san-pham',
                pathMatch: 'full'
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CategoryRoutingModule { }
