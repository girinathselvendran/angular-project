import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './../app/layout/layout.component';

import { authenticationGuard } from "../app/core/guards/authentication.guard";
import { AuthguardServiceService } from "../app/core/guards/authguard-service.service";
const routes: Routes = [];

@NgModule({
  imports: [
    RouterModule.forRoot([
      {
        path: '', pathMatch: 'full', redirectTo: 'admin'
      },
      {
        path: 'auth',
        children: [
          { path: '', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
        ]
      },
      {
        path: 'admin', component: LayoutComponent,
        canActivate: [authenticationGuard],
        children: [
          { path: '', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) },
        ]

      },
      {
        path: 'about', component: LayoutComponent,
        canActivate: [authenticationGuard],
        children: [
          { path: '', loadChildren: () => import('./about/about.module').then(m => m.AboutModule) }
        ]
      },
      {
        path: 'master', component: LayoutComponent,
        canActivate: [authenticationGuard],
        children: [
          { path: '', loadChildren: () => import('./master/master.module').then(m => m.MasterModule), data: { pageTitle: 'Master' } }
        ]

      },
      {
        path: 'operations', component: LayoutComponent,
        canActivate: [authenticationGuard],
        children: [
          { path: '', loadChildren: () => import('./operations/operations.module').then(m => m.OperationsModule), data: { pageTitle: 'Operations' } }
        ]

      },
      {
        path: 'homepage', component: LayoutComponent,
        canActivate: [authenticationGuard],
        children: [
          { path: '', loadChildren: () => import('./home/home.module').then(m => m.HomeModule) },
        ]
      }


    ], { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
  constructor(private authService: AuthguardServiceService) {
  }
}
