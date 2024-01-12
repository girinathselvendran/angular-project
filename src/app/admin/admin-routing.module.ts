import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserConfigurationComponent } from './user-configuration/user-configuration.component';
import { UserComponent } from './user/user.component';
import { UnlockImsComponent } from './unlock-ims/unlock-ims.component';


const routes: Routes = [
  { path: '',  redirectTo: 'userConfiguration', pathMatch: 'full'},
  { path: 'userConfiguration',  component: UserConfigurationComponent },
  { path: 'user', component: UserComponent },
  { path:'unlockIms' ,component:UnlockImsComponent,data: { pageTitle: 'Unlock IMS' }}
  
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
