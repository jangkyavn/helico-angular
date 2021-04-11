import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DefaultLayoutComponent } from './containers/default-layout/default-layout.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { P404Component } from './views/errors/404/404.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'bang-dieu-khien',
    pathMatch: 'full'
  },
  {
    path: '404',
    component: P404Component,
    data: {
      breadcrumb: 'Lỗi 404'
    },
  },
  {
    path: 'dang-nhap',
    loadChildren: () => import('./views/login/login.module').then(m => m.LoginModule)
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Trang chủ'
    },
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'bang-dieu-khien',
        loadChildren: () => import('./views/dashboard/dashboard.module').then(m => m.DashboardModule)
        // data: { roles: ['Admin'] }
      },
      {
        path: 'he-thong',
        loadChildren: () => import('./views/system/system.module').then(m => m.SystemModule)
      },
      {
        path: 'danh-muc',
        loadChildren: () => import('./views/category/category.module').then(m => m.CategoryModule)
      },
      {
        path: 'tai-khoan',
        loadChildren: () => import('./views/account/account.module').then(m => m.AccountModule)
      }
    ]
  },
  { path: '**', component: P404Component }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule {
  static components = [
    DefaultLayoutComponent,
    P404Component
  ];
}
