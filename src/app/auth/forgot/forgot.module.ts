import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ForgotRoutingModule } from './forgot-routing.module';
import { ForgotComponent } from './forgot.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { ConfirmDialogModule } from 'primeng/confirmdialog';


@NgModule({
  declarations: [
    // ForgotComponent
  ],
  imports: [
    CommonModule,
    ForgotRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgxUiLoaderModule,
    ConfirmDialogModule,
  ]
})
export class ForgotModule { }
