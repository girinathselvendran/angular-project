import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttachmentComponent } from './attachment.component';
// import { BootstrapModule } from '../bootstrap.module';
// import { DropzoneModule } from '../forms/dropzone/dropzone.module';

import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
// import { FileUploadModule } from 'primeng/components/fileupload/fileupload';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    // AttachmentComponent
],
  imports: [
    CommonModule,
    FormsModule,
    // BootstrapModule,
    // DropzoneModule,
    // FileUploadModule,
    NgxUiLoaderModule,
    TranslateModule,
    // SharedModule
    
  ],
  exports: [
    CommonModule,
    FormsModule,
    // BootstrapModule,
    // AttachmentComponent
  ]
})
export class AttachmentModule { }
