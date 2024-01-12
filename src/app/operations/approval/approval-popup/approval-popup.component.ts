import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { PurchaseApprovalService } from '../service/purchase-approval.service';
import { ApprovalRequest } from '../model/approval-model';
import { ConfirmationService } from 'primeng/api';
import { NotificationService } from 'src/app/core/services';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-approval-popup',
  templateUrl: './approval-popup.component.html',
  styleUrls: ['./approval-popup.component.css']
})
export class ApprovalPopupComponent {
  @ViewChild('approvalPopup') approvalPopup: any;
  @Input() selectedForm: any;
  @Input() selectedRowList: any;
  @Input() selectedRowDataNos: any;
  @Input() selectedRowDataIds: any;
  @Input() userName!: any;
  @Input() tab: any;
  @Output() handleChangeTabStatus: any = new EventEmitter();
  @Output() handleRecordListUpdate: any = new EventEmitter();

  approvalForm!: FormGroup;
  submitted: any;
  approvalType: any;
  approvalRequest !: ApprovalRequest;
  currentDate: any;
  defaultValue: any;
  currentDateFormat: any;
  approvedDateFormat: any;
  requestedDateFormat: any;

  constructor(
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private confirmationService: ConfirmationService,
    public notificationService: NotificationService,
    private purchaseApprovalService: PurchaseApprovalService,
    private loaderService: NgxUiLoaderService,

  ) { }
  ngOnInit() {
    this.getApprovalType()
    this.approvalForm = this.formBuilder.group({
      approvalRemarks: ['', []],
      approvalType: [[], [Validators.required]],
      approvedDate: ['', [Validators.required]],
      approvedBy: ['', [Validators.required]],
    });
    if (this.defaultValue) {
      this.approvalForm.controls['approvalType'].setValue(this.defaultValue);
      this.approvalForm.controls['approvedBy'].setValue(this.userName);
      this.approvalForm.controls['approvedDate'].setValue(new Date());
    }
    this.approvalForm.controls['approvedBy'].setValue(this.userName);
    this.approvalForm.controls['approvedDate'].setValue(new Date());
  }
  handleApprovalFormClear() {
    if (this.approvalForm.dirty) {
      this.confirmationService.confirm({
        message: this.translate.instant(
          'common.Information.unsavedChangesInfo'
        ),
        header: this.translate.instant('common.notificationTitle.confirmation'),
        accept: () => {
          this.approvalForm.reset();
        },
        reject: () => {
          return false;
        },
      });
    } else {
      this.approvalForm.reset();
    }
  }
  handleApprovalPopup() {

      if (this.selectedForm != "PR") {
      this.approvalForm.controls["approvalType"].clearValidators();
    } else {
      this.approvalForm.controls["approvalType"].addValidators(Validators.required)

    }
    // throw new Error('Method not implemented.');
    if (this.approvalForm.invalid) {
      this.validateAllFormFields(this.approvalForm);
      return;
    }

    //update approval functionality
    if (this.selectedRowList.selectedTabStatus == "APPROVED") {
      this.approvalRequest = {
        ids: this.selectedRowDataIds,
        nos: this.selectedRowDataNos,
        ApprovalTypeId: this.selectedRowList.selectedTab == "RFQ" ? 597 : this.approvalForm.controls['approvalType'].value?.enumId || 0,  // => enum id 597 => Approve and Create PO
        approvedBy: this.approvalForm.controls['approvedBy'].value,
        approvedDate: this.approvalForm.controls['approvedDate'].value,
        approvedRemarks: this.approvalForm.controls['approvalRemarks'].value,
        recordType: this.selectedForm,
        purchaseApprovalId: this.selectedRowList.value.purchaseApprovalId
      }

      this.purchaseApprovalService?.handleUpdateApproval(this.approvalRequest)
        .subscribe((res: any) => {
          if (res.status === true) {
            this.purchaseApprovalService = res.response;
            // this.updateApprovalIcon = true;
            // this.valueChanged.emit(true);
            this.approvalPopup.hide();
            this.approvalForm.reset();
            if (this.defaultValue) {
              this.approvalForm.controls['approvalType'].setValue(this.defaultValue)
            }
            this.handleChangeTabStatus.emit("APPROVED");
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
      return;
    }

    this.approvalRequest = {
      ids: this.selectedRowDataIds,
      nos: this.selectedRowDataNos,
      ApprovalTypeId: this.selectedRowList.selectedTab == "RFQ" ? 597 : this.approvalForm.controls['approvalType'].value?.enumId || 0,  // => enum id 597 => Approve and Create PO
      approvedBy: this.approvalForm.controls['approvedBy'].value,
      approvedDate: this.approvalForm.controls['approvedDate'].value,
      approvedRemarks: this.approvalForm.controls['approvalRemarks'].value,
      recordType: this.selectedForm
    }
    this.loaderService.start();

    this.purchaseApprovalService?.handleApproval(this.approvalRequest)
      .subscribe((res: any) => {
        this.loaderService.stop();
        if (res.status === true) {
          this.purchaseApprovalService = res.response;
          this.approvalPopup.hide();
          this.approvalForm.reset();
          if (this.defaultValue) {
            this.approvalForm.controls['approvalType'].setValue(this.defaultValue)
            this.approvalForm.controls['approvedBy'].setValue(this.userName);
            this.approvalForm.controls['approvedDate'].setValue(new Date());
          }
          this.handleChangeTabStatus.emit("APPROVED");
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
  approvalPopupClose() {
    if (this.approvalForm.dirty) {
      this.confirmationService.confirm({
        message: this.translate.instant(
          'common.Information.unsavedChangesInfo'
        ),
        header: this.translate.instant('common.notificationTitle.confirmation'),
        accept: () => {
          this.approvalPopup.hide();
          this.approvalForm.reset();
          if (this.defaultValue) {
            this.approvalForm.controls['approvalType'].setValue(this.defaultValue)
            this.approvalForm.controls['approvedBy'].setValue(this.userName);
            this.approvalForm.controls['approvedDate'].setValue(new Date());
          }
        },
        reject: () => {
          return false;
        },
      });
    } else {
      this.approvalPopup.hide();
      this.approvalForm.reset();
      if (this.defaultValue) {
        this.approvalForm.controls['approvalType'].setValue(this.defaultValue)
        this.approvalForm.controls['approvedBy'].setValue(this.userName);
        this.approvalForm.controls['approvedDate'].setValue(new Date());
      }
    }
  }

  get approvalFormController() {
    return this.approvalForm.controls;
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
  getApprovalType() {
    this.purchaseApprovalService.getApprovalType()
      .subscribe((res: any) => {
        if (res.status === true) {
          this.approvalType = res.response;
          this.defaultValue = this.approvalType[0];
          this.approvalForm.controls['approvalType'].setValue(this.defaultValue)
          this.approvalForm.controls['approvedBy'].setValue(this.userName);
          this.approvalForm.controls['approvedDate'].setValue(new Date());

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
  }

  checkNgSelectValue(event: any, controlName: any) {
    const control = this.approvalForm.controls[controlName];
    if (control.errors && !event) {
      control.setErrors({ invalid: false });
      control.errors['required'] = true;
      return;
    } else if (event) {
      control.setErrors({ invalid: true });

      this.approvalForm.markAsDirty();
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


  validateApprovedDate(controlName: string, event: any) {
    this.currentDate = new Date();
    let rejectedDate = this.approvalForm.controls['approvedDate'].value;
    if (this.selectedForm == "PR") {
      this.currentDateFormat = new Date(this.currentDate);
      this.approvedDateFormat = new Date(rejectedDate);
      this.requestedDateFormat = new Date(this.selectedRowList.value?.prDate);
      if (this.approvedDateFormat > this.currentDateFormat) {
        this.approvalForm.controls['approvedDate'].setErrors({
          currentDateError: true,
          requestedDateError: false
        });
      } else if (this.approvedDateFormat < this.requestedDateFormat) {
        this.approvalForm.controls['approvedDate'].setErrors({
          currentDateError: false,
          requestedDateError: true
        });
      } else {
        this.approvalForm.controls['approvedDate'].setErrors(null);
      }
    } else
      if (this.selectedForm == "RFQ") {
        this.currentDateFormat = new Date(this.currentDate);
        this.approvedDateFormat = new Date(rejectedDate);
        this.requestedDateFormat = new Date(this.selectedRowList.value?.rfqDate);
        if (this.approvedDateFormat > this.currentDateFormat) {
          this.approvalForm.controls['approvedDate'].setErrors({
            currentDateError: true,
            requestedDateError: false
          });
        } else if (this.approvedDateFormat < this.requestedDateFormat) {
          this.approvalForm.controls['approvedDate'].setErrors({
            currentDateError: false,
            requestedDateError: true
          });
        } else {
          this.approvalForm.controls['approvedDate'].setErrors(null);
        }
      }
      else
        if (this.selectedForm == "PO") {
          this.currentDateFormat = new Date(this.currentDate);
          this.approvedDateFormat = new Date(rejectedDate);
          this.requestedDateFormat = new Date(this.selectedRowList.value?.poDate);
          if (this.approvedDateFormat > this.currentDateFormat) {
            this.approvalForm.controls['approvedDate'].setErrors({
              currentDateError: true,
              requestedDateError: false
            });
          } else if (this.approvedDateFormat < this.requestedDateFormat) {
            this.approvalForm.controls['approvedDate'].setErrors({
              currentDateError: false,
              requestedDateError: true
            });
          } else {
            this.approvalForm.controls['approvedDate'].setErrors(null);
          }
        }

    // Set error for invalid date
    if (isNaN(rejectedDate.getTime())) {
      this.approvalForm.controls['approvedDate'].setErrors({
        invalid: true,
      });
    }
    this.approvalForm.controls["approvedDate"].addValidators(Validators.required)

  }

}
