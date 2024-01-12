import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { PurchaseOrderService } from '../service/purchase-order.service';
import { UserAuthService } from 'src/app/core/services/user-auth.service';
import { NotificationService } from 'src/app/core/services';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-add-part-details',
  templateUrl: './add-part-details.component.html',
  styleUrls: ['./add-part-details.component.css']
})
export class AddPartDetailsComponent {
  @ViewChild('addPartDetailsModel') addPartDetailsModel: any;
  @ViewChild('purchasePartSpecificationModal') purchasePartSpecificationModal: any;
  @Output() sendPartDetailsData = new EventEmitter();
  @Input() selectedPoId: any;
  @Input() poScreenMode: any;
  @Input() selectedColumnData: any;
  @Input() currentStatusId: any;
  @Input() partDetailsMode: string = 'new';
  @Input() partDetails: any = [];
  @Input() screenId: number = 0;
  supplierId: number = 0;
  addPartDetailsEditForm!: FormGroup;
  submittedSearch = false;
  id = 1; //to handle the add part details locally function
  partTypeList = [];
  partCodeList = [];
  partNameList = [];
  partCategoryList = [];
  stockUOMList = [];
  currentDate!: Date;
  purchasePartSpecificationData: any = [];
  selectedPartDetailsData: any;
  tableColumnsPartSpecification = [
    {
      field: 'partSpecification',
      header: this.translate.instant('master.store.grid.partSpecification'),
      width: '8%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 1,
    },
    {
      field: 'uom',
      header: this.translate.instant('master.store.grid.uom1'),
      width: '8%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 2,
    },
    {
      field: 'value',
      header: this.translate.instant('master.store.grid.value'),
      width: '8%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 3,
    },
  ];
  partId = 0;
  selectedPartListRecord: any;
  disableSavePartDetails: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private userAuthService: UserAuthService,
    private purchaseOrderService: PurchaseOrderService,
    private datePipe: DatePipe,
    public notificationService: NotificationService
  ) { }
  ngOnInit() {
    this.addPartDetailsEditForm = this.formBuilder.group({
      partType: [[], [Validators.required]],
      partCode: [[], [Validators.required]],
      partName: [[], []],
      partCategory: [[], []],
      partSpecification: ['', []],
      poQuantity: ['', [Validators.required, Validators.min(1), Validators.max(1000000000000.00)]],
      partRate: ['', []],
      totalCost: ['', []],
      deliveryDate: ['', [Validators.required]],
      prNo: ['', []],
      rfqNo: ['', []],
      quoteNo: ['', []],
      stockUom: [[], []],
      stockUomId: ['', []],
      partTypeId: ['', []]
    });
    this.getPartType();
    this.disablePartCodeFields();
    this.partId = 0;
    this.purchaseOrderService.poSupplierData.subscribe((data) => {
      this.supplierId = data.supplierId;
    })

    if (this.currentStatusId == 580) {
      this.addPartDetailsEditForm.disable();
    }
    if (this.currentStatusId == 581) {
      this.addPartDetailsEditForm.disable();
    }
    if (this.currentStatusId == 582) {
      this.addPartDetailsEditForm.disable();
    }

    //For Approval Screen Form Validation
    if (this.screenId == 259) {  // screen id approval
      this.addPartDetailsEditForm.disable();
      this.disableSavePartDetails = true;
    }
  }
  get addPartDetailsEditSaveFormControls() {
    return this.addPartDetailsEditForm.controls;
  }
  checkNgSearchFormSelectValue(event: any, controlName: any) {
    const control = this.addPartDetailsEditForm.controls[controlName];
    if (control.errors && !event) {
      control.setErrors({ invalid: false });
      control.errors['required'] = true;
      return;
    } else if (event) {
      control.setErrors({ invalid: true });

      this.addPartDetailsEditForm.markAsDirty();
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
  handleCloseAddPartDetails() {
    this.addPartDetailsModel.hide();
  }

  handleAmountCalculation(controlName: string) {
    if (this.addPartDetailsEditForm.controls['poQuantity'].value) {
      const totalCount = this.addPartDetailsEditForm.controls['partRate'].value
        ? this.addPartDetailsEditForm.controls['poQuantity'].value *
        this.addPartDetailsEditForm.controls['partRate'].value
        : this.addPartDetailsEditForm.controls['poQuantity'].value;
      this.addPartDetailsEditForm.controls['totalCost'].setValue(totalCount?.toFixed(2));
    }
  }
  validateDeliveryDate(controlName: string, event: any) {
    this.currentDate = new Date();
    const selectedDate = new Date(event);
    if (selectedDate < this.currentDate) {
      this.addPartDetailsEditForm.controls['deliveryDate'].setErrors({
        customError: true,
      });
    } else if (isNaN(selectedDate.getTime())) {
      this.addPartDetailsEditForm.controls['deliveryDate'].setErrors({
        invalid: true,
      });
    } else {
      this.addPartDetailsEditForm.controls['deliveryDate'].setErrors(null);
    }
  }
  handleClosePurchaseSpecification() {
    this.purchasePartSpecificationModal.hide();
    this.partId = 0;
  }
  savePartDetails() {
    if (this.addPartDetailsEditForm.invalid) {
      this.validateAllMethodFormFields(this.addPartDetailsEditForm);
    } else {

      if (this.partDetailsMode == 'new') {
        this.partDetails.push(
          {
            partTypeId: this.addPartDetailsEditForm.controls['partType'].getRawValue().partTypeId,
            partType: this.addPartDetailsEditForm.controls['partType'].getRawValue()?.code,
            partId: this.addPartDetailsEditForm.controls['partCode'].getRawValue().partId,
            partCode: this.addPartDetailsEditForm.controls['partCode'].getRawValue().partCode,
            partName: this.addPartDetailsEditForm.controls['partName'].getRawValue(),
            partCategory: this.addPartDetailsEditForm.controls['partCategory'].getRawValue(),
            partSpecification: this.addPartDetailsEditForm.controls['partSpecification'].getRawValue(),
            poQuantity: this.addPartDetailsEditForm.controls['poQuantity'].getRawValue(),
            partRate: this.addPartDetailsEditForm.controls['partRate'].getRawValue(),
            totalCost: this.addPartDetailsEditForm.controls['totalCost'].getRawValue(),
            totalDPLC: this.addPartDetailsEditForm.controls['totalCost'].getRawValue(),
            deliveryDate: this.addPartDetailsEditForm.controls['deliveryDate'].getRawValue() ? this.formatDate(this.addPartDetailsEditForm.controls['deliveryDate'].getRawValue()) : "",
            prNo: this.addPartDetailsEditForm.controls['prNo'].getRawValue(),
            rfqNo: this.addPartDetailsEditForm.controls['rfqNo'].getRawValue(),
            quoteNo: this.addPartDetailsEditForm.controls['quoteNo'].getRawValue(),
            stockUom: this.addPartDetailsEditForm.controls['stockUom'].getRawValue(),
            stockUomId: this.addPartDetailsEditForm.controls['stockUomId'].getRawValue(),
            CreatedBy: this.userAuthService.getCurrentUserName(),
            ModifiedBy: this.userAuthService.getCurrentUserName(),
            id: this.id,
            depotCurrency: '',
            totalPoAmount: 0.00,
            supplierCurrency: '',
            totalPoAmountInSupplierCurrency: 0.00,
          }
        );
        this.id = this.id + 1;
        this.notificationService.smallBox({
          severity: 'success',
          title: this.translate.instant(
            'common.notificationTitle.success'
          ),
          content: this.translate.instant(
            'operations.purchaseOrder.addPartDetail.messages.partDetailsCreated'
          ),
          timeout: 5000,
          icon: 'fa fa-check',
        });
        this.sendPartDetailsData.emit(this.partDetails);
        this.purchaseOrderService.getReceivePartDetails(this.partDetails);
      } if (this.partDetailsMode == 'edit' || this.selectedColumnData != null) {

        this.partDetails.forEach((details: any) => {

          // saved data editing
          if (details.purchaseOrderPartDetailId == this.selectedColumnData.purchaseOrderPartDetailId) {
            details.partTypeId = this.addPartDetailsEditForm.controls['partType'].getRawValue().partTypeId || this.selectedColumnData.partTypeId
            details.partType = this.addPartDetailsEditForm.controls['partType'].getRawValue()?.code || this.selectedColumnData.partType
            details.partId = this.addPartDetailsEditForm.controls['partCode'].getRawValue().partId || this.selectedColumnData.partId
            details.partCode = this.addPartDetailsEditForm.controls['partCode'].getRawValue().partCode || this.selectedColumnData.partCode
            details.poQuantity = this.addPartDetailsEditForm.controls['poQuantity'].getRawValue() || this.selectedColumnData
            details.partRate = this.addPartDetailsEditForm.controls['partRate'].getRawValue() || this.selectedColumnData
            details.totalCost = this.addPartDetailsEditForm.controls['totalCost'].getRawValue() || this.selectedColumnData
            details.deliveryDate = this.addPartDetailsEditForm.controls['deliveryDate'].getRawValue() ? this.formatDate(this.addPartDetailsEditForm.controls['deliveryDate'].getRawValue()) : ""
            details.prNo = this.addPartDetailsEditForm.controls['prNo'].getRawValue() || null
            details.rfqNo = this.addPartDetailsEditForm.controls['rfqNo'].getRawValue() || this.selectedColumnData
            details.quoteNo = this.addPartDetailsEditForm.controls['quoteNo'].getRawValue()
            details.stockUom = this.addPartDetailsEditForm.controls['stockUom'].getRawValue() || this.selectedColumnData
            details.stockUomId = this.addPartDetailsEditForm.controls['stockUomId'].getRawValue()
            details.purchaseOrderId = this.selectedColumnData.purchaseOrderId
          }
          // locally saved data editing
          if (details.id == this.selectedColumnData.id && details.id != undefined && this.selectedColumnData.id != undefined) {
            details.partTypeId = this.addPartDetailsEditForm.controls['partType'].getRawValue().partTypeId || this.selectedColumnData.partTypeId
            details.partType = this.addPartDetailsEditForm.controls['partType'].getRawValue()?.code || this.selectedColumnData.partType
            details.partId = this.addPartDetailsEditForm.controls['partCode'].getRawValue().partId || this.selectedColumnData.partId
            details.partCode = this.addPartDetailsEditForm.controls['partCode'].getRawValue().partCode || this.selectedColumnData.partCode
            details.poQuantity = this.addPartDetailsEditForm.controls['poQuantity'].getRawValue() || this.selectedColumnData
            details.partRate = this.addPartDetailsEditForm.controls['partRate'].getRawValue() || this.selectedColumnData
            details.totalCost = this.addPartDetailsEditForm.controls['totalCost'].getRawValue() || this.selectedColumnData
            details.deliveryDate = this.addPartDetailsEditForm.controls['deliveryDate'].getRawValue() ? this.formatDate(this.addPartDetailsEditForm.controls['deliveryDate'].getRawValue()) : ""
            details.prNo = this.addPartDetailsEditForm.controls['prNo'].getRawValue() || null
            details.rfqNo = this.addPartDetailsEditForm.controls['rfqNo'].getRawValue() || this.selectedColumnData
            details.quoteNo = this.addPartDetailsEditForm.controls['quoteNo'].getRawValue() || this.selectedColumnData
            details.stockUom = this.addPartDetailsEditForm.controls['stockUom'].getRawValue() || this.selectedColumnData
            details.stockUomId = this.addPartDetailsEditForm.controls['stockUomId'].getRawValue()
            details.purchaseOrderId = this.selectedColumnData.purchaseOrderId

          }
        });

        this.notificationService.smallBox({
          severity: 'success',
          title: this.translate.instant(
            'common.notificationTitle.success'
          ),
          content: this.translate.instant(
            'operations.purchaseOrder.addPartDetail.messages.partDetailsUpdated'
          ),
          timeout: 5000,
          icon: 'fa fa-check',
        });
        this.sendPartDetailsData.emit(this.partDetails);
        // this.purchaseOrderService.getReceivePartDetails(this.partDetails);
      }
      this.addPartDetailsModel.hide();

      this.addPartDetailsEditForm.reset();
      this.addPartDetailsEditForm.markAsDirty();
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
  formatDate(inputDate: string | null | undefined): string {
    if (inputDate) {
      const formattedDate = this.datePipe
        .transform(inputDate, 'dd-MMM-yyyy')!
        .toUpperCase();
      return formattedDate;
    } else {
      return '';
    }
  }
  resetForm() {
    this.addPartDetailsEditForm.reset();
  }
  getPartType() {

    this.purchaseOrderService.getPartType().subscribe(
      (data) => {
        this.partTypeList = data['response'];
      },
      (err) => { }
    );
  }
  onPartTypeSelected(selectedValue: any) {
    this.addPartDetailsEditForm.controls['partCode'].setValue(null);
    this.purchaseOrderService
      .getPartCode(selectedValue.partTypeId, this.supplierId)
      .subscribe(
        (data) => {
          this.partCodeList = data['response'];
        },
        (err) => { }
      );
    this.resetPartCodeFields();
  }
  onPartCodeSelected(selectedValue: any) {

    this.partId = selectedValue.partId;
    this.selectedPartListRecord = selectedValue;
    this.addPartDetailsEditForm.patchValue({
      // ...selectedValue,
      partName: selectedValue.partName,
      partCategory: selectedValue.partCategory,
      stockUom: selectedValue.stockUom,
      stockUomId: selectedValue.stockUomID,
      partRate: selectedValue.partRate,
      partType: { code: selectedValue.partType, partTypeId: selectedValue.partTypeId },
    });

    this.purchaseOrderService
      .getPartRateBasedOnPartId(selectedValue.partId)
      .subscribe(
        (data) => {
          const result = data['response'];

          this.addPartDetailsEditForm.controls['partRate'].setValue(
            result && result.rate
          );
        },
        (err) => { }
      );
    this.handleAmountCalculation("");
    this.disablePartCodeFields();
  }
  disablePartCodeFields() {
    this.addPartDetailsEditForm.controls['partName'].disable();
    this.addPartDetailsEditForm.controls['partCategory'].disable();
    this.addPartDetailsEditForm.controls['partRate'].disable();
    this.addPartDetailsEditForm.controls['totalCost'].disable();
    this.addPartDetailsEditForm.controls['prNo'].disable();
    this.addPartDetailsEditForm.controls['rfqNo'].disable();
    this.addPartDetailsEditForm.controls['quoteNo'].disable();
    this.addPartDetailsEditForm.controls['stockUom'].disable();
  }
  resetPartCodeFields() {
    this.addPartDetailsEditForm.controls['partName'].setValue("");
    this.addPartDetailsEditForm.controls['partCategory'].setValue("");
    // this.addPartDetailsEditForm.controls['availableStock'].setValue('');
    this.addPartDetailsEditForm.controls['stockUom'].setValue("");
    this.addPartDetailsEditForm.controls['partRate'].setValue('');
    this.addPartDetailsEditForm.controls['totalCost'].setValue('');
  }

  handleOpenPartSpecification() {
    this.getPartSpecificationList(this.partId);
    this.purchasePartSpecificationModal.show();
  }

  getPartSpecificationList(partId: any) {
    if (this.partDetailsMode == "new") {
      this.purchaseOrderService
        .getPartSpecificationList(partId)
        .subscribe((data: any) => {
          this.purchasePartSpecificationData = data.response;
        });

    } else {

      this.purchaseOrderService
        .getPOPartSpecificationList(this.selectedColumnData?.purchaseOrderPartDetailId || 0)
        .subscribe((data: any) => {
          this.purchasePartSpecificationData = data.response;
        });
    }
  }

}
