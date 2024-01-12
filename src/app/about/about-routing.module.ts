import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserManualComponent } from './user-manual/user-manual.component';
const routes: Routes = [
  { path: '',  redirectTo: 'userManual', pathMatch: 'full'},
  { path: 'userManual',  component: UserManualComponent }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class AboutRoutingModule { }
