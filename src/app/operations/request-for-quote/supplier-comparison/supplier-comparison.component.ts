import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-supplier-comparison',
  templateUrl: './supplier-comparison.component.html',
  styleUrls: ['./supplier-comparison.component.css']
})
export class SupplierComparisonComponent {
  @ViewChild('supplierComparisonModal') supplierComparisonModal:any;
  @Input() partCode:any;
  tableFilterFormGroup!: FormGroup;

  tableColumnsSupplierComparison = [
    {
      field: 'supplierCode',
      header: this.translate.instant('operations.requestForQuote.quoteAndOrderAllocation.grid.supplierCode'),
      width: '5%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 1,
    },
    {
      field: 'rfqQuantity',
      header: this.translate.instant('operations.requestForQuote.quoteAndOrderAllocation.grid.rfqQty'),
      width: '5%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 2,
    },
    {
      field: 'stockUom',
      header: this.translate.instant('operations.requestForQuote.quoteAndOrderAllocation.grid.stockUom'),
      width: '5%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 3,
    },
    {
      field: 'partSpecificationIcon',
      header: this.translate.instant('operations.requestForQuote.quoteAndOrderAllocation.grid.partSpecification'),
      width: '5%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 4,
    },
    {
      field: 'supplierQuantity',
      header: this.translate.instant('operations.requestForQuote.quoteAndOrderAllocation.grid.supplierQuantity'),
      width: '5%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 5,
    },
    {
      field: 'discountPer',
      header: this.translate.instant('operations.requestForQuote.quoteAndOrderAllocation.grid.discountPer'),
      width: '5%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 6,
    },
    {
      field: 'discountAmount',
      header: this.translate.instant('operations.requestForQuote.quoteAndOrderAllocation.grid.discountAmount'),
      width: '5%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 7,
    },
    {
      field: 'totalSupplierCost',
      header: this.translate.instant('operations.requestForQuote.quoteAndOrderAllocation.grid.totalSupplierCost'),
      width: '5%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 8,
    },
    {
      field: 'supplierCurrency',
      header: this.translate.instant('operations.requestForQuote.quoteAndOrderAllocation.grid.supplierCurrency'),
      width: '5%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 9,
    },
    {
      field: 'totalDepotCost',
      header: this.translate.instant('operations.requestForQuote.quoteAndOrderAllocation.grid.totalDepotCost'),
      width: '5%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 10,
    },
    {
      field: 'deliveryDate',
      header: this.translate.instant('operations.requestForQuote.quoteAndOrderAllocation.grid.deliveryDate'),
      width: '5%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 11,
    },
  ]
  @Input() supplierComparisonData = [];
  constructor(
    private formBuilder: FormBuilder,
    private translate: TranslateService,
  ) {}
  ngOnInit() {

    // supplier Comparison table filter group
    this.tableFilterFormGroup = this.formBuilder.group({
      supplierCode: [[], []],
      rfqQuantity: [[], []],
      stockUom: [[], []],
      partSpecificationIcon: [[], []],
      supplierQuantity: [[], []],
      discountPer: [[], []],
      discountAmount: [[], []],
      totalSupplierCost: [[], []],
      supplierCurrency: [[], []],
      totalDepotCost: [[], []],
      deliveryDate: [[], []],
    });
  }
  handleCloseComparison() {

    this.supplierComparisonModal.hide();
  }

}
