import { Component, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AddRFQSupplierComponent } from '../add-rfqsupplier/add-rfqsupplier.component';
import { TranslateService } from '@ngx-translate/core';
import { RequestForQuoteService } from '../service/request-for-quote.service';
import { NotificationService } from 'src/app/core/services';
import { UserAuthService } from 'src/app/core/services/user-auth.service';

@Component({
  selector: 'app-request-for-quote-supplier',
  templateUrl: './request-for-quote-supplier.component.html',
  styleUrls: ['./request-for-quote-supplier.component.css']
})
export class RequestForQuoteSupplierComponent {
  @ViewChild('partSpecificationModal') partSpecificationModal: any;

  @ViewChild(AddRFQSupplierComponent) rfqSupplier!: AddRFQSupplierComponent;
  @Input() requestForQuoteId: any;
  @Input() screenId: number = 0;
  @Input() editSaveRFQForm!: FormGroup;

  editSaveSupplierForm!: FormGroup;
  editSavePartDetailForm!: FormGroup;
  editSaveQuoteAndOrderAllocationForm!: FormGroup;
  currentDate: Date = new Date();
  submitted = false;
  activeTab = 1;
  supplierCodeDDList = [];
  supplierDetailList = [];
  partDetailList = [];
  partSpecificationData = [];
  quoteAndOrderAllocationData = [];
  receiveTableSupplierData: any;
  receiveOrderAllocationSelectedDetails: any;
  tableTitle = 'Purchase Part Specification';
  excelFileName = 'Purchase Part Specification List';
  supplierDetailListColumnList = [
    {
      field: 'supplierCode',
      header: this.translate.instant(
        'operations.requestForQuote.rfqSupplier.grid.supplierCode'
      ),
      width: '5%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 1,
    },
    {
      field: 'supplierName',
      header: this.translate.instant(
        'operations.requestForQuote.rfqSupplier.grid.supplierName'
      ),
      width: '5%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 2,
    },
    {
      field: 'preferredSupplier',
      header: this.translate.instant(
        'operations.requestForQuote.rfqSupplier.grid.preferredSupplier'
      ),
      width: '5%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 3,
    },
    {
      field: 'partIcon',
      header: this.translate.instant(
        'operations.requestForQuote.rfqSupplier.grid.part'
      ),
      width: '5%',
      isFilter: true,
      isCenterAlign: true,
      isSubHeader: false,
      type: 'string',
      key: 4,
    },
    {
      field: 'quotationRefNo',
      header: this.translate.instant(
        'operations.requestForQuote.rfqSupplier.grid.quotationRefNo'
      ),
      width: '5%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 4,
    },
    {
      field: 'quotationDate',
      header: this.translate.instant(
        'operations.requestForQuote.rfqSupplier.grid.quotationDate'
      ),
      width: '5%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 5,
    },
    {
      field: 'quotationValidTill',
      header: this.translate.instant(
        'operations.requestForQuote.rfqSupplier.grid.quotationValidTill'
      ),
      width: '5%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 6,
    },
    {
      field: 'supplierCurrency',
      header: this.translate.instant(
        'operations.requestForQuote.rfqSupplier.grid.supplierCurrency'
      ),
      width: '5%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 7,
    },
    {
      field: 'supplierQuoteAmount',
      header: this.translate.instant(
        'operations.requestForQuote.rfqSupplier.grid.supplierQuoteAmount'
      ),
      width: '5%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 8,
    },
    {
      field: 'discountPer',
      header: this.translate.instant(
        'operations.requestForQuote.rfqSupplier.grid.discountPer'
      ),
      width: '5%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 9,
    },
    {
      field: 'discountAmount',
      header: this.translate.instant(
        'operations.requestForQuote.rfqSupplier.grid.discountAmount'
      ),
      width: '5%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 10,
    },
    {
      field: 'totalSupplierQuoteAmount',
      header: this.translate.instant(
        'operations.requestForQuote.rfqSupplier.grid.totalSupplierQuoteAmount'
      ),
      width: '5%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 11,
    },
    {
      field: 'deliveryDate',
      header: this.translate.instant(
        'operations.requestForQuote.rfqSupplier.grid.deliveryDate'
      ),
      width: '5%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 12,
    },
    {
      field: 'totalPOValueAllocated',
      header: this.translate.instant(
        'operations.requestForQuote.rfqSupplier.grid.totalPOValueAllocated'
      ),
      width: '5%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 13,
    },
  ]
  partDetailColumnList = [
    {
      field: 'partTypeCode',
      header: this.translate.instant('operations.requestForQuote.partDetails.grid.partType'),
      width: '8%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 1,
    },
    {
      field: 'partCode',
      header: this.translate.instant('operations.requestForQuote.partDetails.grid.partCode'),
      width: '8%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 2,
    },
    {
      field: 'partName',
      header: this.translate.instant('operations.requestForQuote.partDetails.grid.partName'),
      width: '8%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 3,
    },
    {
      field: 'partCategory',
      header: this.translate.instant('operations.requestForQuote.partDetails.grid.partCategory'),
      width: '8%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 4,
    },
    {
      field: 'partSpecificationIcon',
      header: this.translate.instant('operations.requestForQuote.partDetails.grid.partSpecification'),
      width: '8%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 5,
    },
    {
      field: 'stockUOMCode',
      header: this.translate.instant('operations.requestForQuote.partDetails.grid.stockUOM'),
      width: '8%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 6,
    },
    {
      field: 'requisitionQuantity',
      header: this.translate.instant('operations.requestForQuote.partDetails.grid.requisitionQuantity'),
      width: '8%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 7,
    },
    {
      field: 'partRate',
      header: this.translate.instant('operations.requestForQuote.partDetails.grid.partRate'),
      width: '5%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 8,
    },
    {
      field: 'estimatedCost',
      header: this.translate.instant('operations.requestForQuote.partDetails.grid.estimatedCost'),
      width: '6%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 9,
    },
    {
      field: 'requiredDate',
      header: this.translate.instant('operations.requestForQuote.partDetails.grid.requiredDate'),
      width: '9%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 10,
    },
    {
      field: 'remarks',
      header: this.translate.instant('operations.requestForQuote.partDetails.grid.remarks'),
      width: '7%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 11,
    },
  ]

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
  constructor(
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private requestForQuoteService: RequestForQuoteService,
    private notificationService: NotificationService,
    private userAuthService: UserAuthService,
  ) {

  }
  ngOnInit() {
    this.editSaveSupplierForm = this.formBuilder.group({
      supplierCode: [[], [Validators.required]],
      supplierName: ['', []],
      preferredSupplier: [[], []],
      quotationRefNo: ['', [Validators.required]],
      quotationDate: ['', [Validators.required]],
      quotationValidTill: [[], []],
      supplierCurrency: ['', []],
      supplierQuoteAmount: ['', [Validators.required]],
      discountPer: ['', [Validators.min(0.00), Validators.max(100.00)]],
      discountAmount: ['', []],
      totalSupplierQuoteAmount: ['', [Validators.required]],
      deliveryDate: [[], [Validators.required]],
      totalPOValueAllocated: ['', []],

    });
    this.editSavePartDetailForm = this.formBuilder.group({
      estimateAmount: [[], []],
    });
    this.editSaveQuoteAndOrderAllocationForm = this.formBuilder.group({
      partCode: [[], []],
      partName: ['', []],
      rfqQuantity: ['', []],
      stockUom: [[], []],
      purchaseSpecification: ['', []],
      supplierQuantity: ['', [Validators.required, Validators.min(1.00), Validators.max(999999999999.99)]],
      unitPrice: ['', [Validators.required, Validators.min(0.00), Validators.max(10000000.00)]],
      discountPer: ['', [Validators.required, Validators.min(0.00), Validators.max(100.00)]],
      discountAmount: ['', [Validators.required]],
      totalSupplierPrice: ['', [Validators.required]],
      deliveryDate: [[], [Validators.required]],
      poQuantity: ['', [Validators.required, Validators.min(1.00), Validators.max(999999999999.99)]],
      totalDepotPrice: ['', [Validators.required]],
    })
    this.initialFormData();
    this.initialQuoteAndOrderAllocationForm();
    this.getRFQPartDetailsByRFQId(this.requestForQuoteId);
    this.getRFQSupplierDetailsByRFQId(this.requestForQuoteId);


    //For Approval Screen Form Validation
    if (this.screenId == 259) {
      this.editSaveSupplierForm.disable();
      this.editSavePartDetailForm.disable();
    }

    this.editSaveSupplierForm.disable();
  }

  handleCloseSpecification() {
    this.partSpecificationModal.hide();
  }

  get editSaveSupplierFormController() {
    return this.editSaveSupplierForm.controls;
  }
  initialFormData() {
    this.editSaveSupplierForm.controls['quotationDate'].setValue(this.currentDate);
    this.editSaveSupplierForm.controls['quotationValidTill'].setValue(this.currentDate);
    this.editSaveSupplierForm.controls['supplierCode'].disable();
    this.editSaveSupplierForm.controls['supplierName'].disable();
    this.editSaveSupplierForm.controls['preferredSupplier'].disable();
    this.editSaveSupplierForm.controls['supplierCurrency'].disable();
    this.editSaveSupplierForm.controls['supplierQuoteAmount'].disable();
    this.editSaveSupplierForm.controls['discountAmount'].disable();
    this.editSaveSupplierForm.controls['totalSupplierQuoteAmount'].disable();
    this.editSaveSupplierForm.controls['totalPOValueAllocated'].disable();
  }
  onSupplierCodeSelected(event: any) {

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
  saveRFQSupplier() {
    if (this.editSaveSupplierForm.invalid) {
      this.validateAllFormFields(this.editSaveSupplierForm);
      return;
    } else {
      const formData = this.editSaveSupplierForm.controls;

      const data: any = {
        requestForQuoteSupplierDetailId: this.receiveTableSupplierData.requestForQuoteSupplierDetailId,
        supplierId: this.receiveTableSupplierData.supplierId,
        requestForQuotePartDetailId: this.receiveTableSupplierData.requestForQuotePartDetailId,
        quotationRefNo: formData['quotationRefNo'].value,
        quotationDate: formData['quotationDate'].value,
        quotationValidTill: formData['quotationValidTill'].value,
        supplierQuoteAmount: formData['supplierQuoteAmount'].value || this.receiveTableSupplierData.supplierQuoteAmount,
        discountPercentage: formData['discountPer'].value,
        discountAmount: formData['discountAmount'].value,
        totalSupplier: formData['totalSupplierQuoteAmount'].value,
        totalPOAllocation: formData['totalPOValueAllocated'].value,
        preferredSupplier: this.receiveTableSupplierData.preferredSupplier,
        deliveryDate: formData['deliveryDate'].value,
        modifiedBy: this.userAuthService.getCurrentUserName()
      }
      
      this.requestForQuoteService.updateRequestForQuoteSupplier(data)
        .subscribe((data) => {
          if (data['status'] === true) {
            this.getRFQSupplierDetailsByRFQId(this.requestForQuoteId);

            if (this.editSaveRFQForm.controls['rfqStatus']?.value?.statusId == 588) {  // => Enum ID = 588 = REQUESTED

              this.editSaveRFQForm.controls['rfqStatus'].setValue({
                statusCode: 'QUOTE RECEIVED',
                statusId: 589,   // => Enum ID = 589 = QUOTE RECEIVED
              });
            }
            this.editSaveSupplierForm.reset();
            this.initialFormData();
            this.editSaveSupplierForm.disable();

            this.notificationService.smallBox({
              severity: 'success',
              title: this.translate.instant(
                'common.notificationTitle.success'
              ),
              content: data['message'],
              timeout: 5000,
              icon: 'fa fa-check',
            });

          } else {
            this.notificationService.smallBox({
              title: this.translate.instant('common.notificationTitle.error'),
              content: data['message'],
              severity: 'error',
              timeout: 5000,
              icon: 'fa fa-times',
            });

          }
        })
    }
  }
  handlePartRowData(event: any) {
    
    this.getRFQPartDetailsByRequestForQuoteId(this.requestForQuoteId, event.requestForQuoteSupplierDetailId);
    this.activeTab = 2;
  }
  resetForm() {
    this.editSaveSupplierForm.reset();
    this.initialFormData();
  }
  // Quote And Order Allocation Form
  resetOrderAllocationForm() {
    this.editSaveQuoteAndOrderAllocationForm.reset();
    this.initialQuoteAndOrderAllocationForm();
  }
  saveOrderAllocation() {
    if (this.editSaveQuoteAndOrderAllocationForm.invalid) {
      this.validateAllFormFields(this.editSaveQuoteAndOrderAllocationForm);
      return;
    } else {
      const formData = this.editSaveQuoteAndOrderAllocationForm.controls;
      const data = {
        requestForQuotePartDetailId: this.receiveOrderAllocationSelectedDetails.requestForQuotePartDetailId,
        requestForQuoteId: this.receiveOrderAllocationSelectedDetails.requestForQuoteId,
        partTypeId: this.receiveOrderAllocationSelectedDetails.partTypeId,
        partId: this.receiveOrderAllocationSelectedDetails.partId,
        stockUOMId: this.receiveOrderAllocationSelectedDetails.stockUOMId,
        supplierQuantity: formData['supplierQuantity'].value,
        unitPrice: formData['unitPrice'].value,
        discountPercentage: formData['discountPer'].value,
        discountAmount: formData['discountAmount'].value,
        totalSupplierPrice: formData['totalSupplierPrice'].value,
        deliveryDate: formData['deliveryDate'].value,
        purchaseOrderQuantity: formData['poQuantity'].value,
        totalDepotPrice: formData['totalDepotPrice'].value,
        modifiedBy: this.userAuthService.getCurrentUserName()
      }

      this.requestForQuoteService.updateQuoteOrderPartDetails(data)
        .subscribe((data) => {
          if (data['status'] === true) {
            this.notificationService.smallBox({
              severity: 'success',
              title: this.translate.instant(
                'common.notificationTitle.success'
              ),
              content: data['message'],
              timeout: 5000,
              icon: 'fa fa-check',
            });
          } else {
            this.notificationService.smallBox({
              title: this.translate.instant('common.notificationTitle.error'),
              content: data['message'],
              severity: 'error',
              timeout: 5000,
              icon: 'fa fa-times',
            });

          }
        })
    }
  }
  initialQuoteAndOrderAllocationForm() {
    this.editSaveQuoteAndOrderAllocationForm.controls['partCode'].disable();
    this.editSaveQuoteAndOrderAllocationForm.controls['partName'].disable();
    this.editSaveQuoteAndOrderAllocationForm.controls['rfqQuantity'].disable();
    this.editSaveQuoteAndOrderAllocationForm.controls['stockUom'].disable();
    this.editSaveQuoteAndOrderAllocationForm.controls['discountAmount'].disable();
    this.editSaveQuoteAndOrderAllocationForm.controls['totalSupplierPrice'].disable();
  }
  receiveOrderAllocationSelectedData(event: any) {
    this.receiveOrderAllocationSelectedDetails = event;


    if (!event.isSelectedSupplier) {
      this.editSaveQuoteAndOrderAllocationForm.disable();
    } else {
      this.editSaveQuoteAndOrderAllocationForm.enable();
      this.initialQuoteAndOrderAllocationForm()
    }
  }
  getRFQPartDetailsByRequestForQuoteId(requestForQuoteId: number, supplierId: number) {
    this.requestForQuoteService.getRFQPartDetailsByRequestForQuoteId(requestForQuoteId, supplierId).subscribe(
      (data) => {
        this.quoteAndOrderAllocationData = data['response'];



      }
    );
  }

  onChangePreferredSupplierToggle(event: any) {

  }
  // RFQ Supplier Detail List Grid
  receiveTablePartList(event: any) {

  }
  refreshPartList(event: any) {

  }

  receiveTableSupplerList(event: any) {
    this.requestForQuoteService.setSupplierGridData([event])
    this.receiveTableSupplierData = event;
    this.editSaveSupplierForm.enable();
    this.initialFormData();
    this.editSaveSupplierForm.patchValue(event);
    this.handleAmountCalculation("");
  }

  getRFQSupplierDetails(rfqPartDetailId: any) {
    this.requestForQuoteService.getRFQSupplierDetails(rfqPartDetailId).subscribe(
      (data) => {
        this.supplierDetailList = data['response'];
      }
    );
  }
  getRFQSupplierDetailsByRFQId(requestForQuoteId: any) {
    this.requestForQuoteService.getRFQSupplierDetailsByRFQId(requestForQuoteId).subscribe(
      (data) => {
        this.supplierDetailList = data['response'];
      }
    );
  }
  getRFQPartDetailsByRFQId(requestForQuoteId: any) {
    const idsArray = Array.isArray(requestForQuoteId) ? requestForQuoteId : [requestForQuoteId];
    this.requestForQuoteService.getRFQPartDetailsByRequestForQuoteIds(idsArray).subscribe(
      (data) => {
        this.partDetailList = data['response'];
     
        const totalEstimatedCode = this.partDetailList.reduce(
          (accumulator: any, object: any) => {
            return accumulator + object.estimatedCost;
          },
          0
        );
      

        this.editSavePartDetailForm.controls['estimateAmount'].setValue(totalEstimatedCode);
        this.editSavePartDetailForm.disable();
       
      }
    );
  }
  checkFileMode(event: any, activeTab: any) {
    if (activeTab === 1) {
      this.activeTab = activeTab;
    } else {
     
    }
  }
  handleAmountCalculation(controlName: any) {
   

    if (this.editSaveSupplierFormController['supplierQuoteAmount'].value && this.editSaveSupplierFormController['discountPer'].value) {
      const descAmt = this.editSaveSupplierFormController['supplierQuoteAmount'].value *
        (this.editSaveSupplierFormController['discountPer'].value / 100);

      this.editSaveSupplierFormController['discountAmount'].setValue(descAmt.toFixed(2));

      const totSupQuote = this.editSaveSupplierFormController['supplierQuoteAmount'].value - descAmt;
      this.editSaveSupplierFormController['totalSupplierQuoteAmount'].setValue(totSupQuote.toFixed(2));
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
  checkNgSelectValue(event: any, controlName: any) {
    const control = this.editSaveSupplierForm.controls[controlName];
    if (control.errors && !event) {
      control.setErrors({ invalid: false });
      control.errors['required'] = true;
      return;
    } else if (event) {
      control.setErrors({ invalid: true });

      this.editSaveSupplierForm.markAsDirty();
    } else {
      control.setErrors(null);
    }
  }

  supplierHyperlink() {
    this.rfqSupplier.rfqSupplierModal.show();

    this.rfqSupplier.disableSupplierPopup();
  }
  validateQuotationDate(controlName: string, event: any) {
    const rfqDate = this.editSaveRFQForm.controls['rfqDate'].value;
    this.currentDate = new Date();
    const selectedDate = event;
    
    const selectedDateFormatted = new Date(selectedDate);
    const rfqDateFormatted = new Date(rfqDate);
   
    if (selectedDateFormatted < rfqDateFormatted && selectedDate != null) {
      this.editSaveSupplierForm.controls[controlName].setErrors({
        customError: true,
      });
    } else if (isNaN(selectedDate?.getTime()) && selectedDate != null) {
      this.editSaveSupplierForm.controls[controlName].setErrors({
        invalid: true,
      });
    } else {
      this.editSaveSupplierForm.controls[controlName].setErrors(null);
    }

    if (!this.editSaveSupplierForm.controls[controlName].value) {
      this.editSaveSupplierForm.controls[controlName].setErrors({ required: true });
    }
  }


  validateQuotationValidTillDate(controlName: string, event: any) {
    const quotationDate = this.editSaveSupplierForm.controls['quotationDate'].value;
    const selectedDate = event;
    
    const selectedDateFormatted = new Date(selectedDate);
    const quotationDateFormatted = new Date(quotationDate);
   
    if (selectedDateFormatted < quotationDateFormatted && selectedDate != null) {
      this.editSaveSupplierForm.controls[controlName].setErrors({
        customErrorquotationDateValidTill: true,
      });
    } else if (isNaN(selectedDate?.getTime()) && selectedDate != null) {
      this.editSaveSupplierForm.controls[controlName].setErrors({
        invalid: true,
      });
    } else {
      this.editSaveSupplierForm.controls[controlName].setErrors(null);
    }

    if (!this.editSaveSupplierForm.controls[controlName].value) {
      this.editSaveSupplierForm.controls[controlName].setErrors({ required: true });
    }
  }

  validateDate(controlName: string, event: any) {
    if (controlName === "quotationValidTill") {

    }
  }

  handlePartSpecificationRowData(event: any) {
    const partId = event?.partId || 0;
    this.getPartSpecificationList(partId);
  }
  getPartSpecificationList(partId: any) {
    this.requestForQuoteService
      .getPartSpecificationList(partId)
      .subscribe((data: any) => {
        this.partSpecificationData = data.response;
        
        this.partSpecificationModal.show();
      });
  }
}
