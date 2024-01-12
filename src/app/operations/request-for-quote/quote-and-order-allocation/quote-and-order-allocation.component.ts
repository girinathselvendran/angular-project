import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { SupplierComparisonComponent } from '../supplier-comparison/supplier-comparison.component';
import { RequestForQuoteService } from '../service/request-for-quote.service';

@Component({
  selector: 'app-quote-and-order-allocation',
  templateUrl: './quote-and-order-allocation.component.html',
  styleUrls: ['./quote-and-order-allocation.component.css'],
})
export class QuoteAndOrderAllocationComponent {
  @ViewChild('partSpecificationModal') partSpecificationModal: any;
  @ViewChild('supplierComparison')
  supplierComparison!: SupplierComparisonComponent;
  @Output() openPartSpecificationFn = new EventEmitter();
  @Output() sendSelectedData = new EventEmitter();
  @Input() editSaveQuoteAndOrderAllocationForm!: FormGroup;
  @Input() screenId!: number;
  @Input() quoteAndOrderAllocationData = [];
  tableTitle = 'Purchase Part Specification';
  excelFileName = 'Purchase Part Specification List';
  partSpecificationData = [];
  submitted = false;
  currentDate = new Date();
  // dropDowns
  partCodeDDList = [];
  partNameDDList = [];
  rfqCategoryDDList = [];
  isPoQuantityLesserThanSupplierQuantity = false;

  stockUomDDList = [];
  supplierComparisonData = [];
  partCode: any;
  partDetailColumnList = [
    {
      field: 'compareIcon',
      header: this.translate.instant(
        'operations.requestForQuote.quoteAndOrderAllocation.grid.compare'
      ),
      width: '8%',
      isFilter: true,
      isCenterAlign: true,
      isSubHeader: false,
      type: 'string',
      key: 1,
    },
    {
      field: 'partType',
      header: this.translate.instant(
        'operations.requestForQuote.quoteAndOrderAllocation.grid.partType'
      ),
      width: '7%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 2,
    },
    {
      field: 'partCode',
      header: this.translate.instant(
        'operations.requestForQuote.quoteAndOrderAllocation.grid.partCode'
      ),
      width: '8%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 3,
    },
    {
      field: 'partName',
      header: this.translate.instant(
        'operations.requestForQuote.quoteAndOrderAllocation.grid.partName'
      ),
      width: '8%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 4,
    },
    {
      field: 'requisitionQuantity',
      header: this.translate.instant(
        'operations.requestForQuote.quoteAndOrderAllocation.grid.rfqQuantity'
      ),
      width: '8%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 5,
    },
    {
      field: 'supplierQuantity',
      header: this.translate.instant(
        'operations.requestForQuote.quoteAndOrderAllocation.grid.supplierQuantity'
      ),
      width: '8%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 6,
    },
    {
      field: 'stockUOMCode',
      header: this.translate.instant(
        'operations.requestForQuote.quoteAndOrderAllocation.grid.stockUom'
      ),
      width: '8%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 7,
    },
    {
      field: 'unitPrice',
      header: this.translate.instant(
        'operations.requestForQuote.quoteAndOrderAllocation.grid.unitPrice'
      ),
      width: '8%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 8,
    },
    {
      field: 'discountPerCentage',
      header: this.translate.instant(
        'operations.requestForQuote.quoteAndOrderAllocation.grid.discountPer'
      ),
      width: '8%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 9,
    },
    {
      field: 'discountAmount',
      header: this.translate.instant(
        'operations.requestForQuote.quoteAndOrderAllocation.grid.discountAmount'
      ),
      width: '8%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 10,
    },
    {
      field: 'totalSupplierPrice',
      header: this.translate.instant(
        'operations.requestForQuote.quoteAndOrderAllocation.grid.totalSupplierPrice'
      ),
      width: '8%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 11,
    },
    {
      field: 'deliveryDate',
      header: this.translate.instant(
        'operations.requestForQuote.quoteAndOrderAllocation.grid.deliveryDate'
      ),
      width: '6%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 12,
    },
    {
      field: 'purchaseOrderQuantity',
      header: this.translate.instant(
        'operations.requestForQuote.quoteAndOrderAllocation.grid.poQuantity'
      ),
      width: '6%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 13,
    },
    {
      field: 'totalDepotPrice',
      header: this.translate.instant(
        'operations.requestForQuote.quoteAndOrderAllocation.grid.totalDepotPrice'
      ),
      width: '7%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 14,
    },
  ];

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
    private requestForQuoteService: RequestForQuoteService
  ) {}
  ngOnInit() {
    //For Approval Screen Form Validation
    if (this.screenId == 259) {
      this.editSaveQuoteAndOrderAllocationForm.disable();
    }
  }
  get quoteAndOrderAllocationFormController() {
    return this.editSaveQuoteAndOrderAllocationForm.controls;
  }
  
  onPartCodeSelected(event: any) {}
  // table data
  receiveSelectedData(event: any) {}
  receiveTableRowData(event: any) {
   
    this.getPartSpecificationList(event.partId);
    this.editSaveQuoteAndOrderAllocationForm.patchValue(event);
    this.editSaveQuoteAndOrderAllocationForm.patchValue({
      stockUom: event.stockUOMCode,
      poQuantity: event.purchaseOrderQuantity,
      rfqQuantity: event.requisitionQuantity,
    });
    this.sendSelectedData.emit(event);
    
  }
  getPartSpecificationList(partId: any) {
    this.requestForQuoteService
      .getPartSpecificationList(partId)
      .subscribe((data: any) => {
        this.partSpecificationData = data.response;
      
      });
  }

  getSupplierComparison(rfqDetailId: number) {
    this.requestForQuoteService
      .getSupplierComparison(rfqDetailId)
      .subscribe((data) => {
        this.supplierComparisonData = data.response;
      });
  }
  handleCompareRowData(event: any) {
    this.partCode = event.partCode;
    this.getSupplierComparison(event.requestForQuotePartDetailId);
    this.supplierComparison.supplierComparisonModal.show();
  }
  handleDeleteRowData(event: any) {}

  onChangePoOrSupplierQuantity(event: any) {
    const poQuantity =
      this.quoteAndOrderAllocationFormController['poQuantity'].value;
    const supplierQuantity =
      this.quoteAndOrderAllocationFormController['supplierQuantity'].value;
   
   
    if (
      poQuantity !== null  &&
      supplierQuantity !== null &&
      poQuantity > supplierQuantity
    ) {
      this.isPoQuantityLesserThanSupplierQuantity = true;
    } else {
      this.isPoQuantityLesserThanSupplierQuantity = false;
    }
  }

  handleAmountCalculation(controlName: any) {
    if (controlName == 'discountPer') {
      if (
        this.quoteAndOrderAllocationFormController['supplierQuantity'].value &&
        this.quoteAndOrderAllocationFormController['discountPer'].value &&
        this.quoteAndOrderAllocationFormController['unitPrice'].value
      ) {
        const descAmt =
          this.quoteAndOrderAllocationFormController['supplierQuantity'].value *
          this.quoteAndOrderAllocationFormController['unitPrice'].value *
          (this.quoteAndOrderAllocationFormController['discountPer'].value /
            100);

        this.quoteAndOrderAllocationFormController['discountAmount'].setValue(
          descAmt.toFixed(2)
        );

        const totSupAmt =
          this.quoteAndOrderAllocationFormController['supplierQuantity'].value *
            this.quoteAndOrderAllocationFormController['unitPrice'].value -
          descAmt;
        this.quoteAndOrderAllocationFormController[
          'totalSupplierPrice'
        ].setValue(totSupAmt);
      }
    } else if (controlName == 'totalDepotPrice') {
      if (
        this.editSaveQuoteAndOrderAllocationForm.controls['unitPrice'].value &&
        this.editSaveQuoteAndOrderAllocationForm.controls['unitPrice'].value
      ) {
        let totalDepotPrice =
          this.editSaveQuoteAndOrderAllocationForm.controls['unitPrice'].value *
          this.editSaveQuoteAndOrderAllocationForm.controls['poQuantity'].value;

        this.editSaveQuoteAndOrderAllocationForm.controls[
          'totalDepotPrice'
        ].setValue(totalDepotPrice);
        this.editSaveQuoteAndOrderAllocationForm.controls[
          'totalDepotPrice'
        ].disable();
      }
    }
  }

  validateQuotationDate(controlName: any, event: any) {}
  handleOpenPartSpecification() {
    this.partSpecificationModal.show();
  }

  handleCloseSpecification() {
    this.partSpecificationModal.hide();
  }
  checkNgSelectValue(event: any, controlName: any) {
    const control =
      this.editSaveQuoteAndOrderAllocationForm.controls[controlName];
    if (control.errors && !event) {
      control.setErrors({ invalid: false });
      control.errors['required'] = true;
      return;
    } else if (event) {
      control.setErrors({ invalid: true });

      this.editSaveQuoteAndOrderAllocationForm.markAsDirty();
    } else {
      control.setErrors(null);
    }
  }
  dropdownPartCodeSearchFn(term: any, item: any) {
    term = term.toLocaleLowerCase();
    return (
      item['partCode'].toLocaleLowerCase().indexOf(term) > -1 ||
      item['partCode'].toLocaleLowerCase() === term ||
      item['partName'].toLocaleLowerCase().indexOf(term) > -1 ||
      item['partName'].toLocaleLowerCase() === term
    );
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
  dropdownDepotSearchFn(term: any, item: any) {
    term = term.toLocaleLowerCase();
    return (
      item['depotCode'].toLocaleLowerCase().indexOf(term) > -1 ||
      item['depotCode'].toLocaleLowerCase() === term ||
      item['depotName'].toLocaleLowerCase().indexOf(term) > -1 ||
      item['depotName'].toLocaleLowerCase() === term
    );
  }
}
