import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-goods-receipt-list',
  templateUrl: './goods-receipt-list.component.html',
  styleUrls: ['./goods-receipt-list.component.css']
})
export class GoodsReceiptListComponent {
  tableTitle: any;
  @Input() currentCard: any;
  @Output() handleAddRecord = new EventEmitter();
  @Output() getReceivedTableRowData = new EventEmitter<{ data: any, currentCard: number }>();
  @Output() exportToExcel = new EventEmitter<{ data: any, currentCard: number }>();

   @Input() goodsReceiptData: any = [];

  columnHeader: any;
  constructor(
    private translate: TranslateService
  ) { }

  ngOnInIt() {
   
  }


  columnHeaderPending = [
    {
      field: 'purchaseOrderNo',
      header: this.translate.instant(
        'operations.goodReceipt.grid.poNo'
      ),
      width: '10%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 1,
    },
    {
      field: 'poDate',
      header: this.translate.instant(
        'operations.goodReceipt.grid.poDate'
      ),
      width: '10%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 2,
    },
    {
      field: 'supplierName',
      header: this.translate.instant(
        'operations.goodReceipt.grid.supplierName'
      ),
      width: '10%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 3,
    },
    {
      field: 'supplierCode',
      header: this.translate.instant(
        'operations.goodReceipt.grid.supplierCode'
      ),
      width: '10%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 4,
    },
    {
      field: 'goodsReceiptNo',
      header: this.translate.instant(
        'operations.goodReceipt.grid.goodsReceiptNo'
      ),
      width: '10%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 5,
    },
    {
      field: 'goodsReceiptDate',
      header: this.translate.instant(
        'operations.goodReceipt.grid.goodsReceiptDate'
      ),
      width: '10%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 6,
    },
    {
      field: 'prNo',
      header: this.translate.instant(
        'operations.goodReceipt.grid.prNo'
      ),
      width: '10%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 7,
    },
    {
      field: 'rfqNo',
      header: this.translate.instant(
        'operations.goodReceipt.grid.rfqNo'
      ),
      width: '10%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 8,
    },
    {
      field: 'depot',
      header: this.translate.instant(
        'operations.goodReceipt.grid.depot'
      ),
      width: '10%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 9,
    },
    {
      field: 'city',
      header: this.translate.instant(
        'operations.goodReceipt.grid.city'
      ),
      width: '10%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 10,
    },
    {
      field: 'poValue',
      header: this.translate.instant(
        'operations.goodReceipt.grid.poValue'
      ),
      width: '10%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 11,
    },
    {
      field: 'currency',
      header: this.translate.instant(
        'operations.goodReceipt.grid.currency'
      ),
      width: '10%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 12,
    },
    {
      field: 'modifiedBy',
      header: this.translate.instant(
        'operations.goodReceipt.grid.modifiedBy'
      ),
      width: '10%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 13,
    },
    {
      field: 'modifiedDate',
      header: this.translate.instant(
        'operations.goodReceipt.grid.modifiedDate'
      ),
      width: '10%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 14,
    },
  ]
  columnHeaderSubmitted = [
    {
      field: 'goodsReceiptNo',
      header: this.translate.instant(
        'operations.goodReceipt.grid.goodsReceiptNo'
      ),
      width: '10%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 1,
    },
    {
      field: 'goodsReceiptDate',
      header: this.translate.instant(
        'operations.goodReceipt.grid.goodsReceiptDate'
      ),
      width: '10%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 2,
    },
    {
      field: 'goodsReceiptCategory',
      header: this.translate.instant(
        'operations.goodReceipt.grid.goodsReceiptCategory'
      ),
      width: '10%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 3,
    },
    {
      field: 'supplierCode',
      header: this.translate.instant(
        'operations.goodReceipt.grid.supplierCode'
      ),
      width: '10%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 4,
    },
    {
      field: 'supplierName',
      header: this.translate.instant(
        'operations.goodReceipt.grid.supplierName'
      ),
      width: '10%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 5,
    },
    {
      field: 'depot',
      header: this.translate.instant(
        'operations.goodReceipt.grid.depot'
      ),
      width: '10%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 9,
    },
    {
      field: 'city',
      header: this.translate.instant(
        'operations.goodReceipt.grid.city'
      ),
      width: '10%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 10,
    },


    {
      field: 'purchaseOrderNo',
      header: this.translate.instant(
        'operations.goodReceipt.grid.poNumber'
      ),
      width: '10%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 11,
    },
    {
      field: 'totalAmountPoQuantity',
      header: this.translate.instant(
        'operations.goodReceipt.grid.totalAmountPoQuantity'
      ),
      width: '10%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 12,
    },
    {
      field: 'supplierCurrency',
      header: this.translate.instant(
        'operations.goodReceipt.grid.supplierCurrency'
      ),
      width: '10%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 13,
    },
    {
      field: 'totalAmountReceivedQuantity',
      header: this.translate.instant(
        'operations.goodReceipt.grid.totalAmountReceivedQuantity'
      ),
      width: '10%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 14,
    },
    {
      field: 'depotCurrency',
      header: this.translate.instant(
        'operations.goodReceipt.grid.depotCurrency'
      ),
      width: '10%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 15,
    },
    {
      field: 'modifiedBy',
      header: this.translate.instant(
        'operations.goodReceipt.grid.modifiedBy'
      ),
      width: '10%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 13,
    },
    {
      field: 'modifiedDate',
      header: this.translate.instant(
        'operations.goodReceipt.grid.modifiedDate'
      ),
      width: '10%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 14,
    },
  ]
  handleAddRecordIcon(event: any) {
    this.handleAddRecord.emit(event);
  }

  receiveTableRowData(event: any,currentCard:number) {
    const selectedRecord = event;
    // this.sendSelectedRowData.emit(event);

this.getReceivedTableRowData.emit({ data: event, currentCard: currentCard });

    // this.editSavePOForm.controls['poStatus'].setValue({
    //   statusCode: 'DRAFT',
    //   statusId: 578,
    // }); // need to change based on selected records dynamically
    // this.editSavePOForm.controls['poSource'].setValue({
    //   sourceCode: event.poSource,
    //   sourceId: event.poSourceId,
    // });
  }
  exportToExcelData(event: any) {
    this.exportToExcel.emit(event);
  }
}
