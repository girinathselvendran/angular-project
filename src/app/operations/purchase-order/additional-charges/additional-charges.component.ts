import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { PurchaseOrderService } from '../service/purchase-order.service';
import { UserAuthService } from 'src/app/core/services/user-auth.service';
import { NotificationService } from 'src/app/core/services';
import { ConfirmationService } from 'primeng/api';
import { StoreService } from 'src/app/master/store/service/store.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-additional-charges',
  templateUrl: './additional-charges.component.html',
  styleUrls: ['./additional-charges.component.css']
})
export class AdditionalChargesComponent {
  @Output() sendAdditionalChargesData = new EventEmitter();
  @Input() editSaveAdditionalChargesForm!: FormGroup;
  @Input() submitted: boolean = false;
  @Input() poNumber: any;
  @Input() poScreenMode: any;
  @Input() selectedPoId: any;
  @Input() currentStatusId: any;
  @Input() additionalChargesList: any = [];
  @Input() screenId: number = 0;

  @Input() disableSaveButton: boolean = false;
  unSavedChanges: any = false;

  // additionalChargesList: any = [];
  chargesList: any = [];
  additionalChargesId = 1;
  addChargesMode = "new";
  selectedAddChargesData: any;
  additionalChargesColumnList = [
    {
      field: 'slNo',
      header: this.translate.instant('operations.purchaseOrder.grid.sNo'),
      width: '5%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 1,
    },
    {
      field: 'chargesCode',
      header: this.translate.instant('operations.purchaseOrder.grid.charges'),
      width: '5%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 2,
    },
    {
      field: 'value',
      header: this.translate.instant('operations.purchaseOrder.grid.value'),
      width: '5%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 3,
    },
    {
      field: 'delete',
      header: this.translate.instant('operations.purchaseOrder.grid.delete'),
      width: '1%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 4,
    },
  ]

  constructor(
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private userAuthService: UserAuthService,
    private notificationService: NotificationService,
    private purchaseOrderService: PurchaseOrderService,
    private confirmationService: ConfirmationService,
    private storeService: StoreService,
    private loaderService: NgxUiLoaderService,
  ) { }

  ngOnInit() {

    this.getAdditionalServiceCodes();

    if (this.poScreenMode == 'edit') {
      this.getAdditionalServiceList(this.selectedPoId);
    }

    if (this.currentStatusId == 580) {
      this.editSaveAdditionalChargesForm.disable();
    }
    if (this.currentStatusId == 581) {
      this.editSaveAdditionalChargesForm.disable();
    }
    if (this.currentStatusId == 582) {
      this.editSaveAdditionalChargesForm.disable();
    }

    //For Approval Screen Form Validation
    if (this.screenId == 259) {
      this.editSaveAdditionalChargesForm.disable();
    }
  }
  isAdditionalServiceValid() {
    const additionalServiceCode = this.editSaveAdditionalChargesForm.controls["charges"].value.code;
    const poId = this.selectedPoId;
    const additionalServiceId = this.selectedAddChargesData?.purchaseOrderAddittionalServiceId || 0;
    this.purchaseOrderService.isAdditionalServiceValid(poId, additionalServiceId, additionalServiceCode).subscribe((res: any) => {
      if (res.status === true) {
        this.editSaveAdditionalChargesForm?.controls['charges']?.setErrors(null);
      } else {
        this.editSaveAdditionalChargesForm?.controls['charges']?.setErrors({ invalidCode: true });
      }

    });
  }

  get editSaveAdditionalChargesFormController() {
    return this.editSaveAdditionalChargesForm.controls;
  }
  getAdditionalServiceCodes() {
    this.purchaseOrderService.getAdditionalServiceCodes().subscribe((res: any) => {
      if (res.status === true) {
        this.chargesList = res.response;
      }
    });
  }
  getAdditionalServiceList(poId: any) {
    this.purchaseOrderService.getAdditionalServiceList(poId).subscribe((res: any) => {
      if (res.status === true) {
        this.additionalChargesList = res.response;
        this.additionalChargesList.map((data: any) => {
          data.code = data.charges,
            data.values = data.value
        })
      }
    });
  }
  saveAdditionalCharges() {
    if (this.editSaveAdditionalChargesForm.invalid) {
      this.validateAllMethodFormFields(this.editSaveAdditionalChargesForm);
    } else {
      if (this.addChargesMode == 'new') {
        this.additionalChargesList.push({
          slNo: this.additionalChargesList.length + 1,
          chargesId: this.editSaveAdditionalChargesForm.controls['charges'].value.id,
          chargesCode: this.editSaveAdditionalChargesForm.controls['charges'].value.code,
          value: this.editSaveAdditionalChargesForm.controls['value'].getRawValue(),
          CreatedBy: this.userAuthService.getCurrentUserName(),
          ModifiedBy: this.userAuthService.getCurrentUserName(),
          additionalChargesId: 0
        })
        this.additionalChargesId = this.additionalChargesId + 1;
        const successMessage = this.translate.instant(
          'operations.purchaseOrder.messages.additionalChargesCreated'
        ) + this.translate.instant(
          'operations.purchaseOrder.messages.forThePO'
        ) + this.poNumber ? this.poNumber : "";
        this.notificationService.smallBox({
          severity: 'success',
          title: this.translate.instant(
            'common.notificationTitle.success'
          ),
          content: successMessage,
          timeout: 5000,
          icon: 'fa fa-check',
        })
        this.sendAdditionalChargesData.emit(this.additionalChargesList);
      } else if (this.addChargesMode == 'edit') {

        this.additionalChargesList.forEach((addChargesList: any) => {
          if (addChargesList.slNo == this.selectedAddChargesData.slNo && addChargesList.slNo != undefined && this.selectedAddChargesData.slNo != undefined) {
            addChargesList.slNo = addChargesList.slNo;
            addChargesList.chargesId = this.editSaveAdditionalChargesForm.controls['charges'].value != null ? this.editSaveAdditionalChargesForm.controls['charges'].value.id : this.selectedAddChargesData.chargesId;
            addChargesList.chargesCode = this.editSaveAdditionalChargesForm.controls['charges'].getRawValue() != null ? this.editSaveAdditionalChargesForm.controls['charges'].getRawValue().code : this.selectedAddChargesData.chargesCode;
            addChargesList.value = this.editSaveAdditionalChargesForm.controls['value'].value;
            addChargesList.purchaseOrderAddittionalServiceId = addChargesList.purchaseOrderAddittionalServiceId;
          }
        });
        this.notificationService.smallBox({
          severity: 'success',
          title: this.translate.instant(
            'common.notificationTitle.success'
          ),
          content: this.translate.instant(
            'operations.purchaseOrder.messages.updateAdditionalCharges'
          ),
          timeout: 5000,
          icon: 'fa fa-check',
        });
        this.sendAdditionalChargesData.emit(this.additionalChargesList);
      }
      this.addChargesMode = 'new';
      this.editSaveAdditionalChargesForm.reset();
      this.selectedAddChargesData = null;
      this.editSaveAdditionalChargesForm.markAsDirty();
      this.editSaveAdditionalChargesForm.markAllAsTouched();
      this.unSavedChanges = true;

    }
  }
  validateAllMethodFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllMethodFormFields(control);
      }
    });
  }
  checkNgSelectValue(event: any, controlName: any) {

    const control = this.editSaveAdditionalChargesForm.controls[controlName];
    if (control.errors && !event) {
      control.setErrors({ invalid: false });
      control.errors['required'] = true;
      return;
    } else if (event) {
      control.setErrors({ invalid: true });

      this.editSaveAdditionalChargesForm.markAsDirty();
    } else {
      control.setErrors(null);
    }
  }
  handleChargesChange(event: any) {
    this.isAdditionalServiceValid();
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
  resetForm() {
    this.editSaveAdditionalChargesForm.reset();
  }
  refreshAdditionalChargesList(event: any) {
    this.additionalChargesList = [...this.additionalChargesList]
  }
  receiveTableAdditionalCharges(event: any) {
    if (this.editSaveAdditionalChargesForm.dirty) {
      this.confirmationService.confirm({
        message: this.translate.instant(
          'common.Information.unsavedChangesInfo'
        ),
        header: this.translate.instant('common.notificationTitle.confirmation'),
        accept: () => {
          this.editSaveAdditionalChargesForm.patchValue({
            charges: { code: event.chargesCode, chargesId: event.chargesId },
            value: event.value
          });
          this.selectedAddChargesData = event;
          this.addChargesMode = 'edit';

        },
        reject: () => {
          return false;
        },
      });
    } else {
      this.editSaveAdditionalChargesForm.patchValue({
        charges: { code: event.chargesCode, chargesId: event.chargesId },
        value: event.value
      });
      this.selectedAddChargesData = event;
      this.addChargesMode = 'edit';
    }




  }
  deleteAdditionalChargesRowData(event: any) {
    const rowId = event.slNo;
    this.confirmationService.confirm({
      message: this.translate.instant('common.Information.deleteConfirmation'),
      header: this.translate.instant('common.notificationTitle.confirmation'),
      accept: () => {
        this.handleDeleteAddChargesRowData(rowId, event);
      },
      reject: () => {
        return false;
      },
    });
  }
  handleDeleteAddChargesRowData(rowId: any, event: any) {

    if (event.additionalServiceId == 0 || event.additionalServiceId == undefined) {
      this.additionalChargesList = this.additionalChargesList.filter((acDetail: any) => acDetail.slNo !== rowId);

      this.notificationService.smallBox({
        severity: 'success',
        title: this.translate.instant(
          'common.notificationTitle.success'
        ),
        content: this.translate.instant(
          'purchaseOrder.messages.deleteAdditionalCharges'
        ),
        timeout: 5000,
        icon: 'fa fa-check',
      })

    } else {
      this.loaderService.start();
      this.purchaseOrderService
        .deletePOAdditionalCharge(event.purchaseOrderAddittionalServiceId)
        .subscribe(
          (data: any) => {
            if (data["status"] === true) {
              this.additionalChargesList = this.additionalChargesList.filter((acDetail: any) => acDetail.slNo !== event.slNo);
              this.loaderService.stop();
              this.getAdditionalServiceList(this.selectedPoId);
              this.notificationService.smallBox({
                severity: 'success',
                title: this.translate.instant(
                  'common.notificationTitle.success'
                ),
                content: data['message'],
                timeout: 5000,
                icon: 'fa fa-check',
              })

            } else {
              this.loaderService.stop();
              this.notificationService.smallBox({
                title: this.translate.instant("common.notificationTitle.error"),
                content: data["message"],
                severity: 'error',
                timeout: 5000,
                icon: "fa fa-times",
              });
            }
          },
        );
    }
  }
}
