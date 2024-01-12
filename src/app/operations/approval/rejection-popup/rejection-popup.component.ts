import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { PurchaseApprovalService } from '../service/purchase-approval.service';
import { ApprovalRequest, RejectionPopup } from '../model/approval-model';
import { NotificationService } from 'src/app/core/services';
import { UserAuthService } from 'src/app/core/services/user-auth.service';
import { ConfirmationService } from 'primeng/api';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-rejection-popup',
  templateUrl: './rejection-popup.component.html',
  styleUrls: ['./rejection-popup.component.css']
})
export class RejectionPopupComponent {
  @ViewChild('rejectionPopup') rejectionPopup: any;
  @Input() selectedForm: any;
  @Input() selectedRowList: any;
  @Input() selectedRowDataNos: any;
  @Input() selectedRowDataIds: any;
  @Input() tab: any;
  @Input() userName!: any;
  @Output() handleRecordListUpdate: any = new EventEmitter();

  rejectionForm!: FormGroup;
  submitted: any;
  approvalType: any;
  approvalRequest !: ApprovalRequest;
  rejectionModel !: RejectionPopup;
  currentDate: any;
  currentDateFormat: any;
  rejectedDateFormat: any;
  requestedDateFormat: any;

  constructor(
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private purchaseApprovalService: PurchaseApprovalService,
    public notificationService: NotificationService,
    private userAuthService: UserAuthService,
    private confirmationService: ConfirmationService,
    private loaderService: NgxUiLoaderService,
  ) { }

  ngOnInit() {

    this.rejectionForm = this.formBuilder.group({
      rejectionRemarks: ['', [Validators.required]],
      rejectedDate: ['', [Validators.required]],
      rejectedBy: [this.userName, [Validators.required]],
    });
    this.rejectionForm.controls['rejectedDate'].setValue(new Date());
    this.rejectionForm.controls['rejectedBy'].setValue(this.userName);

  }
  handleRejectionFormClear() {

    if (this.rejectionForm.dirty) {
      this.confirmationService.confirm({
        message: this.translate.instant(
          'common.Information.unsavedChangesInfo'
        ),
        header: this.translate.instant('common.notificationTitle.confirmation'),
        accept: () => {
          this.rejectionForm.reset();

        },
        reject: () => {
          return false;
        },
      });
    } else {
      this.rejectionForm.reset();
    }
  }

  handleRejectionPopup() {
    if (this.rejectionForm.invalid) {
      this.validateAllFormFields(this.rejectionForm);
      return;
    }

    if (this.selectedRowDataIds?.length == 0) {
      this.notificationService.smallBox({
        title: this.translate.instant('common.notificationTitle.error'),
        content: this.translate.instant(
          'atLeastOneRecordToReject'
        ) + this.selectedForm,
        severity: 'error',
        timeout: 5000,
        icon: 'fa fa-times',
      });

    } else if (this.selectedRowDataIds?.length < 1) {
      this.notificationService.smallBox({
        title: this.translate.instant('common.notificationTitle.error'),
        content: this.translate.instant(
          'atLeastOneRecordToReject'
        ) + this.selectedForm,
        severity: 'error',
        timeout: 5000,
        icon: 'fa fa-times',
      });
    } else {

      if ((this.selectedForm == "PR" && this.selectedRowList?.selectedTabStatus == "PENDING") || this.tab == "PR") {
        this.rejectionModel = {
          rejectionRemarks: this.rejectionForm.controls['rejectionRemarks'].value,
          rejectionDate: this.rejectionForm.controls['rejectedDate'].value,
          rejectionBy: this.rejectionForm.controls['rejectedBy'].value,
          ids: [this.selectedRowList?.value?.purchaseRequisitionId] || this.selectedRowDataIds,
          nos: [this.selectedRowList?.value?.purchaseRequisitionNo] || this.selectedRowDataIds,
          recordType: this.selectedForm,
          CreatedBy: this.userName,
          ModifiedBy: this.userName
        }
      } else if ((this.selectedForm == "RFQ" && this.selectedRowList?.selectedTabStatus == "PENDING") || this.tab == "RFQ") {
        this.rejectionModel = {
          rejectionRemarks: this.rejectionForm.controls['rejectionRemarks'].value,
          rejectionDate: this.rejectionForm.controls['rejectedDate'].value,
          rejectionBy: this.rejectionForm.controls['rejectedBy'].value,
          ids: [this.selectedRowList?.value?.purchaseRequisitionId] || this.selectedRowDataIds,
          nos: [this.selectedRowList?.value?.purchaseRequisitionNo] || this.selectedRowDataIds,
          recordType: this.selectedForm,
          CreatedBy: this.userName,
          ModifiedBy: this.userName
        }
      } else if ((this.selectedForm == "PO" && this.selectedRowList?.selectedTabStatus == "PENDING") || this.tab == "PO") {
        this.rejectionModel = {
          rejectionRemarks: this.rejectionForm.controls['rejectionRemarks'].value,
          rejectionDate: this.rejectionForm.controls['rejectedDate'].value,
          rejectionBy: this.rejectionForm.controls['rejectedBy'].value,
          ids: [this.selectedRowList?.value?.purchaseOrderId] || this.selectedRowDataIds,
          nos: [this.selectedRowList?.value?.poNumber] || this.selectedRowDataIds,
          recordType: this.selectedForm,
          CreatedBy: this.userName,
          ModifiedBy: this.userName

        }
      }
      if (this.tab == "PR" || this.tab == "RFQ" || this.tab == "PO") {
        this.rejectionModel.ids = this.selectedRowDataIds;
        this.rejectionModel.nos = this.selectedRowDataNos;
      }
      this.loaderService.start();

      this.purchaseApprovalService.rejectRecord(this.rejectionModel)
        .subscribe((res: any) => {
          this.loaderService.stop();

          if (res.status === true) {
            this.handleRecordListUpdate.emit(true);
            this.notificationService.smallBox({
              severity: 'success',
              title: this.translate.instant(
                'common.notificationTitle.success'
              ),
              content: res['message'],
              timeout: 5000,
              icon: 'fa fa-check',
            });
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
      this.rejectionForm.controls['rejectedDate'].setValue(new Date());
      this.rejectionForm.controls['rejectedBy'].setValue(this.userName);
    }


  }
  handleReset() {
    this.rejectionForm.reset();
    this.rejectionPopup.hide();
  }
  rejectionPopupClose() {

    if (this.rejectionForm.dirty) {
      this.confirmationService.confirm({
        message: this.translate.instant(
          'common.Information.unsavedChangesInfo'
        ),
        header: this.translate.instant('common.notificationTitle.confirmation'),
        accept: () => {
          this.handleReset();
          this.rejectionForm.controls['rejectedBy'].setValue(this.userName);
          this.rejectionForm.controls['rejectedDate'].setValue(new Date());
        },
        reject: () => {
          return false;
        },
      });
    } else {
      this.handleReset();
      this.rejectionForm.controls['rejectedBy'].setValue(this.userName);
      this.rejectionForm.controls['rejectedDate'].setValue(new Date());
    }
  }

  get rejectionFormController() {
    return this.rejectionForm.controls;
  }

  dropdownSearchFn(term: any, item: any) {
    term = term.toLocaleLowerCase();
    return (
      item['code'].toLocaleLowerCase().indexOf(term) > -1 ||
      item['code'].toLocaleLowerCase() === term ||
      item['description'].toLocaleLowerCase().indexOf(term) > -1 ||
      item['description'].toLocaleLowerCase() === term
    );
  }

  checkNgSelectValue(event: any, controlName: any) {
    const control = this.rejectionForm.controls[controlName];
    if (control.errors && !event) {
      control.setErrors({ invalid: false });
      control.errors['required'] = true;
      return;
    } else if (event) {
      control.setErrors({ invalid: true });

      this.rejectionForm.markAsDirty();
    } else {
      control.setErrors(null);
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

  validateRejectedDate(controlName: string, event: any) {
    this.currentDate = new Date();
    let rejectedDate = this.rejectionForm.controls['rejectedDate'].value;
    if (this.selectedForm == "PR") {
      this.currentDateFormat = new Date(this.currentDate);
      this.rejectedDateFormat = new Date(rejectedDate);
      this.requestedDateFormat = new Date(this.selectedRowList.value?.prDate);
      if (this.rejectedDateFormat > this.currentDateFormat) {
        this.rejectionFormController['rejectedDate'].setErrors({
          currentDateError: true,
          requestedDateError: false
        });
      } else if (this.rejectedDateFormat < this.requestedDateFormat) {
        this.rejectionFormController['rejectedDate'].setErrors({
          currentDateError: false,
          requestedDateError: true
        });
      } else {
        this.rejectionFormController['rejectedDate'].setErrors(null);
      }
    } else
      if (this.selectedForm == "RFQ") {
        this.currentDateFormat = new Date(this.currentDate);
        this.rejectedDateFormat = new Date(rejectedDate);
        this.requestedDateFormat = new Date(this.selectedRowList.value?.rfqDate);
        if (this.rejectedDateFormat > this.currentDateFormat) {
          this.rejectionFormController['rejectedDate'].setErrors({
            currentDateError: true,
            requestedDateError: false
          });
        } else if (this.rejectedDateFormat < this.requestedDateFormat) {
          this.rejectionFormController['rejectedDate'].setErrors({
            currentDateError: false,
            requestedDateError: true
          });
        } else {
          this.rejectionFormController['rejectedDate'].setErrors(null);
        }
      }
      else
        if (this.selectedForm == "PO") {
          this.currentDateFormat = new Date(this.currentDate);
          this.rejectedDateFormat = new Date(rejectedDate);
          this.requestedDateFormat = new Date(this.selectedRowList.value?.poDate);
          if (this.rejectedDateFormat > this.currentDateFormat) {
            this.rejectionFormController['rejectedDate'].setErrors({
              currentDateError: true,
              requestedDateError: false
            });
          } else if (this.rejectedDateFormat < this.requestedDateFormat) {
            this.rejectionFormController['rejectedDate'].setErrors({
              currentDateError: false,
              requestedDateError: true
            });
          } else {
            this.rejectionFormController['rejectedDate'].setErrors(null);
          }
        }
  }
}
