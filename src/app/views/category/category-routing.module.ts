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
                path: 'san-pham',
                loadChildren: () => import('./product/product.module').then(m => m.ProductModule)
            },
            {
                path: 'loai-du-an',
                loadChildren: () => import('./project-category/project-category.module').then(m => m.ProjectCategoryModule)
            },
            {
                path: 'du-an',
                loadChildren: () => import('./project/project.module').then(m => m.ProjectModule)
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
