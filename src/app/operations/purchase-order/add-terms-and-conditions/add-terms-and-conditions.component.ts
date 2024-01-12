import { Component, EventEmitter, Output, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { PurchaseOrderService } from '../service/purchase-order.service';
import { NotificationService } from 'src/app/core/services';
import { UserAuthService } from 'src/app/core/services/user-auth.service';
import { ConfirmationService } from 'primeng/api';
import { StoreService } from 'src/app/master/store/service/store.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { FormCanDeactivate } from 'src/app/core/guards/form-can-deactivate';
import { Observable, Observer } from 'rxjs';
// import { CanComponentDeactivate } from '../../can-deactivate.guard';


@Component({
  selector: 'app-add-terms-and-conditions',
  templateUrl: './add-terms-and-conditions.component.html',
  styleUrls: ['./add-terms-and-conditions.component.css']
})
export class AddTermsAndConditionsComponent {
  @Output() sendTermsAndConditionsData = new EventEmitter();
  @Input() selectedPoId: any;
  @Input() poScreenMode: any;
  @Input() currentStatusId: any;
  @Input() screenId: number = 0;
  @Input() disableSaveButton: boolean = false;

  editSaveForm!: FormGroup;
  submitted: boolean = false;
  unSavedChanges: any = false;
  tACCodeDDList: any = [];
  tAcList: any = [];
  selectedTACData: any = [];
  termsAndConditionId = 1;
  tACMode = "new";
  tAcListColumnList = [
    {
      field: 'tACCode',
      header: this.translate.instant(
        'operations.purchaseOrder.termsAndCondition.grid.tAcCode'
      ),
      width: '5%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 1,
    },
    {
      field: 'description',
      header: this.translate.instant(
        'operations.purchaseOrder.termsAndCondition.grid.description'
      ),
      width: '5%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 2,
    },
    {
      field: 'delete',
      header: this.translate.instant(
        'operations.purchaseOrder.termsAndCondition.grid.delete'
      ),
      width: '5%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 3,
    }
  ]
  constructor(
    private formBuilder: FormBuilder,
    private userAuthService: UserAuthService,
    private translate: TranslateService,
    private purchaseOrderService: PurchaseOrderService,
    private notificationService: NotificationService,
    private confirmationService: ConfirmationService,
    private storeService: StoreService,
    private loaderService: NgxUiLoaderService,
  ) {
  }
  pageValid: any;
  public canDeactivate() {
    throw new Error('Method not implemented.');
  }
  dirty: any;
  unloadNotification($event: any): void {
    throw new Error('Method not implemented.');
  }

  ngOnInit() {
    this.editSaveForm = this.formBuilder.group({
      tACCode: [[], [Validators.required]],
      description: ['', []],
      purchaseOrderTermsAndConditionId: [0, []],
    });
    this.getTermsAndConditionCodes();
    if (this.poScreenMode != 'new' && this.selectedPoId) {
      this.getTermsAndConditionList();
    }
    this.editSaveForm.controls['description'].disable();

    if (this.currentStatusId == 580) {
      this.editSaveForm.disable();
    }
    if (this.currentStatusId == 581) {
      this.editSaveForm.disable();
    }
    if (this.currentStatusId == 582) {
      this.editSaveForm.disable();
    }

    //For Approval Screen Form Validation
    if (this.screenId == 259) {
      this.editSaveForm.disable();
    }
  }

  get editSaveTACFormController() {
    return this.editSaveForm.controls;
  }

  getTermsAndConditionCodes() {
    this.purchaseOrderService.getTermsAndConditionCodes().subscribe((res: any) => {
      if (res.status === true) {
        this.tACCodeDDList = res.response;
      }
    });
  }
  getTermsAndConditionList() {
    this.purchaseOrderService.getTermsAndConditionList(this.selectedPoId).subscribe((res: any) => {
      if (res.status === true) {
        this.tAcList = res.response;
      }
    });
  }
  handleTACodeChange(event: any) {
    this.isTermsAndConditionCodeValid();
    this.editSaveForm.controls["description"].setValue(event.description)
  }
  isTermsAndConditionCodeValid() {
    const termsAndConditionCode = this.editSaveForm.controls["tACCode"].value.code;
    const description = this.editSaveForm.controls["description"].value;
    const purchaseOrderTermsAndConditionId = this.editSaveForm.controls["purchaseOrderTermsAndConditionId"].value;
    const poId = this.selectedPoId;
    this.purchaseOrderService.isTermsAndConditionCodeValid(poId, purchaseOrderTermsAndConditionId, termsAndConditionCode).subscribe((res: any) => {
      if (res.status === true) {
        this.editSaveForm?.controls['tACCode']?.setErrors(null);
      } else {
        this.editSaveForm?.controls['tACCode']?.setErrors({ invalidCode: true });
      }
      // this.tACCodeDDList = res.response;
    });
  }
  handleAddTACIcon() {

  }
  receiveTableTACList(event: any) {
    if (this.editSaveForm.dirty) {
      this.confirmationService.confirm({
        message: this.translate.instant(
          'common.Information.unsavedChangesInfo'
        ),
        header: this.translate.instant('common.notificationTitle.confirmation'),
        accept: () => {
          this.editSaveForm.controls['purchaseOrderTermsAndConditionId'].setValue(event.purchaseOrderTermsAndConditionId)
          this.editSaveForm.patchValue({ ...event, tACode: { id: event.tACId, code: event.tACCode } });
          this.selectedTACData = event;
          this.tACMode = "edit";

        },
        reject: () => {
          return false;
        },
      });
    } else {
      this.editSaveForm.controls['purchaseOrderTermsAndConditionId'].setValue(event.purchaseOrderTermsAndConditionId)
      this.editSaveForm.patchValue({ ...event, tACode: { id: event.tACId, code: event.tACCode } });
      this.selectedTACData = event;
      this.tACMode = "edit";
    }
  }
  refreshTACListList(event: any) {
    this.getTermsAndConditionList();
  }
  deleteTACRowData(event: any) {
    const rowId = event.id;
    this.confirmationService.confirm({
      message: this.translate.instant('common.Information.deleteConfirmation'),
      header: this.translate.instant('common.notificationTitle.confirmation'),
      accept: () => {
        this.handleDeleteTACRowData(rowId, event);
      },
      reject: () => {
        return false;
      },
    });
  }
  handleDeleteTACRowData(rowId: any, event: any) {

    if (event.purchaseOrderTermsAndConditionId == 0 || event.purchaseOrderTermsAndConditionId == undefined) {
      this.tAcList = this.tAcList.filter((tacDetail: any) => tacDetail.id !== rowId);
      this.notificationService.smallBox({
        severity: 'success',
        title: this.translate.instant(
          'common.notificationTitle.success'
        ),
        content: this.translate.instant(
          'purchaseOrder.messages.deleteTermsAndConditions'
        ),
        timeout: 5000,
        icon: 'fa fa-check',
      })
    } else {
      this.loaderService.start();
      this.purchaseOrderService
        .deletePOTermsAndCondition(event.purchaseOrderTermsAndConditionId)
        .subscribe(
          (data: any) => {
            if (data["status"] === true) {
              // this.tAcList = this.tAcList.filter((tacDetail: any) => tacDetail.id !== event.id);
              this.getTermsAndConditionList();
              // this.loaderService.stop();
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
  saveTAC() {
    if (this.editSaveForm.invalid) {
      this.validateAllMethodFormFields(this.editSaveForm);
    } else {

      if (this.tACMode == "new") {
        this.tAcList.push({
          id: this.termsAndConditionId,
          tACId: this.editSaveForm.controls['tACCode'].value.id,
          tACCode: this.editSaveForm.controls['tACCode'].value.code,
          description: this.editSaveForm.controls['description'].getRawValue(),
          CreatedBy: this.userAuthService.getCurrentUserName(),
          ModifiedBy: this.userAuthService.getCurrentUserName(),
          termsAndConditionId: 0
        })
        this.termsAndConditionId = this.termsAndConditionId + 1;
        // let message = this.poNumber
        this.notificationService.smallBox({
          severity: 'success',
          title: this.translate.instant(
            'common.notificationTitle.success'
          ),
          content: this.translate.instant(
            'operations.purchaseOrder.messages.termsAndConditionsCreated'
          ),
          timeout: 5000,
          icon: 'fa fa-check',
        })
        this.sendTermsAndConditionsData.emit(this.tAcList);
      } else if (this.tACMode == "edit") {
        this.tAcList.forEach((tAcDetail: any) => {


          // if((tAcDetail.id == this.selectedTACData.id && this.selectedTACData.id != undefined && tAcDetail.id != undefined) || tAcDetail.tAcId == this.selectedTACData.tAcId){
          if ((tAcDetail.id == this.selectedTACData.id && this.selectedTACData.id != undefined && tAcDetail.id != undefined) || (tAcDetail.tACId == this.selectedTACData.tACId)) {

            tAcDetail.tACId = this.editSaveForm.controls['tACCode'].value.id;
            tAcDetail.tACCode = this.editSaveForm.controls['tACCode'].value.code;
            tAcDetail.description = this.editSaveForm.controls['description'].getRawValue();
            tAcDetail.purchaseOrderTermsAndConditionId = tAcDetail.purchaseOrderTermsAndConditionId;
          }
        });

        this.notificationService.smallBox({
          severity: 'success',
          title: this.translate.instant(
            'common.notificationTitle.success'
          ),
          content: this.translate.instant(
            'operations.purchaseOrder.messages.updateTermsAndConditions'
          ),
          timeout: 5000,
          icon: 'fa fa-check',
        });
        this.sendTermsAndConditionsData.emit(this.tAcList);
      }
      this.tACMode = 'new';
      this.editSaveForm.reset();
      this.selectedTACData = null;
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
  resetForm() {
    this.editSaveForm.reset();
  }
  checkNgSelectValue(event: any, controlName: any) {
    const control = this.editSaveForm.controls[controlName];
    if (control.errors && !event) {
      control.setErrors({ invalid: false });
      control.errors['required'] = true;
      return;
    } else if (event) {
      control.setErrors({ invalid: true });

      this.editSaveForm.markAsDirty();
    } else {
      control.setErrors(null);
    }
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

}
