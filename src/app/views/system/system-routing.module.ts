import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        data: {
            breadcrumb: 'Hệ thống'
        },
        children: [
            {
                path: 'nguoi-dung',
                loadChildren: () => import('./users/users.module').then(m => m.UsersModule)
            },
            {
                path: 'vai-tro',
                loadChildren: () => import('./roles/roles.module').then(m => m.RolesModule)
            },
            {
                path: 'nhat-ky',
                loadChildren: () => import('./diaries/diaries.module').then(m => m.DiariesModule)
            },
            {
                path: '',
                redirectTo: 'nguoi-dung',
                pathMatch: 'full'
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SystemRoutingModule { }
