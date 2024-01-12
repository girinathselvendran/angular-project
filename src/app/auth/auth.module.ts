import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AuthRoutingModule } from './auth-routing.module';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { ForgotComponent } from './forgot/forgot.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
// import { InputTrimModule } from 'ng2-trim-directive';
import { DialogModule } from 'primeng/dialog';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { LoginModule } from './login/login.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ChangePasswordComponent,
    // LoginComponent,
    ForgotComponent

  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgxUiLoaderModule,
    ConfirmDialogModule,
    DialogModule,
    TranslateModule,
    // SmartadminWizardsModule,
    // InputTrimModule
  ],
  exports: [
    ChangePasswordComponent
  ]
})

export class AuthModule { }
