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
                path: 'loai-san-phan',
                loadChildren: () => import('./product-category/product-category.module').then(m => m.ProductCategoryModule)
            },
            {
                path: '',
                redirectTo: 'loai-san-phan',
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
