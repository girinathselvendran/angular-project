import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { CancelRejection } from '../model/approval-model';
import { UserAuthService } from 'src/app/core/services/user-auth.service';
import { PurchaseApprovalService } from '../service/purchase-approval.service';
import { NotificationService } from 'src/app/core/services';
import { ConfirmationService } from 'primeng/api';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-cancel-rejection-popup',
  templateUrl: './cancel-rejection-popup.component.html',
  styleUrls: ['./cancel-rejection-popup.component.css']
})
export class CancelRejectionPopupComponent {
  @ViewChild('cancelpopup') cancelpopup: any;
  @Input() selectedRowList: any;
  @Input() selectedRowDataNos: any;
  @Input() selectedRowDataIds: any;
  @Input() tab: any;
  @Output() handleRecordListUpdate: any = new EventEmitter();

  cancelRejection !: CancelRejection;
  userName!: any;
  cancelRejectionForm!: FormGroup;
  submitted: any;

  constructor(
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private userAuthService: UserAuthService,
    private purchaseApprovalService: PurchaseApprovalService,
    public notificationService: NotificationService,
    private confirmationService: ConfirmationService,
    private loaderService: NgxUiLoaderService,

  ) { }
  ngOnInit() {
    this.userName = this.userAuthService.getCurrentUserName();

    this.cancelRejectionForm = this.formBuilder.group({
      remarks: ['', [Validators.required]],
    });
  }
  handleReset() {
    this.cancelRejectionForm.reset();
    this.cancelpopup.hide();
  }
  cancelPopupClose() {
    if (this.cancelRejectionForm.dirty) {
      this.confirmationService.confirm({
        message: this.translate.instant(
          'common.Information.unsavedChangesInfo'
        ),
        header: this.translate.instant('common.notificationTitle.confirmation'),
        accept: () => {
          this.handleReset();
        },
        reject: () => {
          return false;
        },
      });
    } else {
      this.handleReset();

    }
  }
  handleFormCancelPRAction() {
    if (this.cancelRejectionForm.invalid) {
      this.validateAllFormFields(this.cancelRejectionForm);

      return;
    }

    if ((this.selectedRowList?.selectedTab == "PR" && this.selectedRowList?.selectedTabStatus == "APPROVED") || this.tab == "PR") {
      this.cancelRejection = {
        cancelRejectionRemarks: this.cancelRejectionForm.controls['remarks'].value,
        cancelRejectionDate: new Date(),
        cancelRejectionBy: this.userName,
        ids: [this.selectedRowList?.value?.purchaseRequisitionId] || this.selectedRowDataIds,
        nos: [this.selectedRowList?.value?.purchaseRequisitionNo] || this.selectedRowDataNos,
        recordType: "PR",
        CreatedBy: this.userName,
        ModifiedBy: this.userName
      }

    } else if ((this.selectedRowList?.selectedTab == "RFQ" && this.selectedRowList?.selectedTabStatus == "APPROVED") || this.tab == "RFQ") {
      this.cancelRejection = {
        cancelRejectionRemarks: this.cancelRejectionForm.controls['remarks'].value,
        cancelRejectionDate: new Date(),
        cancelRejectionBy: this.userName,
        ids: [this.selectedRowList?.value?.purchaseRequisitionId] || this.selectedRowDataIds,
        nos: [this.selectedRowList?.value?.purchaseRequisitionNo] || this.selectedRowDataNos,
        recordType: "RFQ",
        CreatedBy: this.userName,
        ModifiedBy: this.userName
      }

    } else if ((this.selectedRowList?.selectedTab == "PO" && this.selectedRowList?.selectedTabStatus == "APPROVED") || this.tab == "PO") {
      this.cancelRejection = {
        cancelRejectionRemarks: this.cancelRejectionForm.controls['remarks'].value,
        cancelRejectionDate: new Date(),
        cancelRejectionBy: this.userName,
        ids: [this.selectedRowList?.value?.purchaseOrderId] || this.selectedRowDataIds,
        nos: [this.selectedRowList?.value?.poNumber] || this.selectedRowDataNos,
        recordType: "PO",
        CreatedBy: this.userName,
        ModifiedBy: this.userName

      }

    }
    if (this.tab == "PR" || this.tab == "RFQ" || this.tab == "PO") {
      this.cancelRejection.ids = this.selectedRowDataIds;
      this.cancelRejection.nos = this.selectedRowDataNos;
    }

    this.loaderService.start();
    this.purchaseApprovalService.cancelRejectRecord(this.cancelRejection)
      .subscribe((res: any) => {
        this.loaderService.stop();
        if (res.status === true) {
          this.notificationService.smallBox({
            severity: 'success',
            title: this.translate.instant(
              'common.notificationTitle.success'
            ),
            content: res['message'],
            timeout: 5000,
            icon: 'fa fa-check',
          });
          this.handleRecordListUpdate.emit(true);

          this.handleReset();

        } else {
          this.notificationService.smallBox({
            title: this.translate.instant(
              'common.notificationTitle.error'
            ),
            content: res['message'],
            severity: 'error',
            timeout: 5000,
            icon: 'fa fa-times',
          });
        }
      });
    this.loaderService.stop();
  }
  handleRemarkFormClear() {
    if (this.cancelRejectionForm.dirty) {
      this.confirmationService.confirm({
        message: this.translate.instant(
          'common.Information.unsavedChangesInfo'
        ),
        header: this.translate.instant('common.notificationTitle.confirmation'),
        accept: () => {
          this.cancelRejectionForm.reset();
        },
        reject: () => {
          return false;
        },
      });
    } else {
      this.cancelRejectionForm.reset();
    }
  }
  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }


}
