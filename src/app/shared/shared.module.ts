import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { MainmenuComponent } from './components/mainmenu/mainmenu.component';
//import { PrimengGridComponent } from './components/primeng-grid/primeng-grid.component';
//import { PrimengLazyGridComponent } from './components/primeng-lazy-grid/primeng-lazy-grid.component';
import { PrimengToastComponent } from './components/primeng-toast/primeng-toast.component';
import { PrimengTableComponent } from './components/primeng-table/primeng-table.component';
import { SharedTableComponent } from './components/shared-table/shared-table.component';
import { TranslateModule } from '@ngx-translate/core';
//import { PrimengConfirmDialogComponent } from './components/primeng-confirm-dialog/primeng-confirm-dialog.component';
//import { PrimengMessageDialogComponent } from './components/primeng-message-dialog/primeng-message-dialog.component';
import { UploadComponent } from './components/upload/upload.component';
import { SharedLazyTableComponent } from './components/shared-lazy-table/shared-lazy-table.component';

import { NgSelectModule } from './ng-select/ng-select.module';
import { TitleLastdateComponent } from './components/title-lastdate/title-lastdate.component';
import { RouteBreadcrumbsComponent } from './components/ribbon/route-breadcrumbs.component';
import { RibbonComponent } from './components/ribbon';
import { AttachmentComponent } from './components/attachment/attachment.component';
import { ModalModule } from 'ngx-bootstrap/modal';

import { ProgressBarModule } from 'primeng/progressbar';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { SmartadminWidgetsModule } from './widgets/smartadmin-widgets.module';
import { WidgetComponent } from './widgets';
import { SharedLazyTableV2Component } from './components/shared-lazy-table-v2/shared-lazy-table-v2.component';
import { SvgOverallIconComponent } from './components/shared-icons/svg-overall-icon/svg-overall-icon.component';
import { SvgDraftsIconComponent } from './components/shared-icons/svg-drafts-icon/svg-drafts-icon.component';
import { SvgPendingApprovalIconComponent } from './components/shared-icons/svg-pending-approval-icon/svg-pending-approval-icon.component';
import { SvgAprovedIconComponent } from './components/shared-icons/svg-aproved-icon/svg-aproved-icon.component';
import { SvgCancelledIconComponent } from './components/shared-icons/svg-cancelled-icon/svg-cancelled-icon.component';
import { SvgRejectedIconComponent } from './components/shared-icons/svg-rejected-icon/svg-rejected-icon.component';
import { SvgCalenderIconComponent } from './components/shared-icons/svg-calender-icon/svg-calender-icon.component';
import { SvgSearchIconComponent } from './components/shared-icons/svg-search-icon/svg-search-icon.component';
import { SvgResetIconComponent } from './components/shared-icons/svg-reset-icon/svg-reset-icon.component';
import { SharedTableNewComponent } from './components/shared-table-new/shared-table-new.component';
import { SharedLazyTableNewComponent } from './components/shared-lazy-table-new/shared-lazy-table-new.component';
import { SvgCloseIconComponent } from './components/shared-icons/svg-close-icon/svg-close-icon.component';
import { PdfService } from './services/pdf/pdf.service';
import { PartSpecificationsComponent } from './components/popup/part-specifications/part-specifications.component';
import { CancelPopupComponent } from './components/popup/cancel-popup/cancel-popup.component';
import { SvgRequestedIconComponent } from './components/shared-icons/svg-requested-icon/svg-requested-icon.component';
import { SvgQuoteReceivedIconComponent } from './components/shared-icons/svg-quote-received-icon/svg-quote-received-icon.component';
import { SendEmailComponent } from './components/send-email/send-email.component';
import { DialogModule } from 'primeng/dialog';
import { SvgStockSummaryIconComponent } from './components/shared-icons/svg-stock-summary-icon/svg-stock-summary-icon.component';
import { SvgStockIconComponent } from './components/shared-icons/svg-stock-icon/svg-stock-icon.component';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    MainmenuComponent,
    
    PrimengToastComponent,
    PrimengTableComponent,
   
    SharedTableComponent,
    SharedLazyTableComponent,

    RouteBreadcrumbsComponent,
    UploadComponent,
    TitleLastdateComponent,
    RibbonComponent,
    AttachmentComponent,
    SharedLazyTableV2Component,

    SvgOverallIconComponent,
    SvgDraftsIconComponent,
    SvgPendingApprovalIconComponent,
    SvgAprovedIconComponent,
    SvgCancelledIconComponent,
    SvgRejectedIconComponent,
    SvgCalenderIconComponent,
    SvgCalenderIconComponent,
    SvgSearchIconComponent,
    SvgResetIconComponent,
    SharedTableNewComponent,
    SharedLazyTableNewComponent,

    SvgCloseIconComponent,
    PartSpecificationsComponent,
    CancelPopupComponent,
    SvgRequestedIconComponent,
    SvgQuoteReceivedIconComponent,
    SvgStockSummaryIconComponent,
    SvgStockIconComponent,
    SendEmailComponent
  ],
  imports: [
    CommonModule,
    NgSelectModule,
    FormsModule,
    CalendarModule,
    CheckboxModule,
    DropdownModule,
    InputSwitchModule,
    InputSwitchModule,
    InputSwitchModule,
    InputTextModule,
    MultiSelectModule,
    TableModule,
    ToastModule,
    ButtonModule,
    ConfirmDialogModule,
    ReactiveFormsModule,
    TranslateModule,
    ModalModule,
    ProgressBarModule,
    NgxDropzoneModule,
    NgxUiLoaderModule,
    DialogModule
  ],
  exports: [
    PrimengToastComponent,
    PrimengTableComponent,
    SharedTableComponent,
    SharedLazyTableComponent,
    SharedLazyTableV2Component,
    SvgOverallIconComponent,
    SvgDraftsIconComponent,
    SvgPendingApprovalIconComponent,
    SvgAprovedIconComponent,
    SvgCancelledIconComponent,
    SvgCalenderIconComponent,
    SvgSearchIconComponent,
    SvgRejectedIconComponent,
    SvgCloseIconComponent,
    SvgResetIconComponent,
    UploadComponent,
    RibbonComponent,
    AttachmentComponent,
    SmartadminWidgetsModule,
    SharedTableNewComponent,
    SharedLazyTableNewComponent,
    PartSpecificationsComponent,
    CancelPopupComponent,
    SvgRequestedIconComponent,
    SvgQuoteReceivedIconComponent,
    SendEmailComponent,
    SvgStockSummaryIconComponent,
    SvgStockIconComponent

  ],
  providers: [PdfService],
})
export class SharedModule { }
