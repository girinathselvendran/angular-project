import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NotificationService } from 'src/app/core/services';
import { SharedLazyTableNewComponent } from 'src/app/shared/components/shared-lazy-table-new/shared-lazy-table-new.component';
import { RequestForQuoteService } from '../service/request-for-quote.service';
import { RequestForQuoteOutputPrintData } from '../model/request-for-quote_model';
import { GenerateRfqPdfComponent } from '../generate-rfq-pdf/generate-rfq-pdf.component';
import { SharedTableStoreService } from 'src/app/shared/services/store/shared-table-store.service';

@Component({
  selector: 'app-request-for-quote-list',
  templateUrl: './request-for-quote-list.component.html',
  styleUrls: ['./request-for-quote-list.component.css']
})
export class RequestForQuoteListComponent {
  @ViewChild(SharedLazyTableNewComponent)
  sharedTableNewInstance!: SharedLazyTableNewComponent;
  @ViewChild(GenerateRfqPdfComponent)
  generateRfqPdfComponent!: GenerateRfqPdfComponent;
  @ViewChild("sharedLazyTableNew") sharedLazyTableNew: SharedLazyTableNewComponent | undefined;
  @Output() sendEmailGridFunction: any = new EventEmitter();

  @Output() handleAddRecord = new EventEmitter();
  @Output() handleReopen = new EventEmitter();
  @Output() handlePrint = new EventEmitter();
  @Output() handleCancel = new EventEmitter();
  @Output() handleEmail = new EventEmitter();
  @Output() handleSendForApproval = new EventEmitter();
  @Output() receiveTableRow = new EventEmitter();
  @Output() receiveSelected = new EventEmitter();
  @Output() exportToExcel = new EventEmitter();
  @Output() handleRemarks = new EventEmitter();
  @Output() getServerSideTable = new EventEmitter();
  @Output() handleSendRFQ = new EventEmitter();
  @Input() disableAddNewIcons: boolean = false;
  @Input() disableSendForApprovalIcons!: boolean;
  @Input() disableCancelRFQIcons: boolean = false;
  @Input() disableReopenIcons: boolean = false;
  @Input() disablePrintRFQIcons: boolean = false;
  @Input() disableEmailRFQIcons: boolean = false;
  @Input() showFormSendRFQIcons: boolean = true;
  @Input() showFormSendForApprovalIcons: boolean = true;
  @Input() showEmailRFQIcons: boolean = true;
  @Input() showReopenIcons: boolean = true;
  @Input() showCancelIcons: boolean = true;
  @Input() tableFilterFormGroup!: FormGroup;
  @Input() tableTitle: string = "List View";
  @Input() showTableByColumn: number = 0;
  @Input() requestForQuoteData: any = [];


  sendIconTitle = "Send RFQ"

  selectedDataList: any = [];
  totalDataGridCountComp: any;
  currentStatusId: number = 547; // 547 is Default enumId for getting initial overall records
  columnHeaderListWithStatus = [
    {
      field: 'requestForQuoteNo',
      header: this.translate.instant(
        'operations.requestForQuote.grid.rfqNo'
      ),
      width: '8%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 1,
    },
    {
      field: 'depotCode',
      header: this.translate.instant(
        'operations.requestForQuote.grid.depot'
      ),
      width: '8%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 1,
    },

    {
      field: 'requestForQuoteDate',
      header: this.translate.instant(
        'operations.requestForQuote.grid.rfqDate'
      ),
      width: '8%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 2,
    },

    {
      field: 'requestForQuoteSource',
      header: this.translate.instant(
        'operations.requestForQuote.grid.rfqSource'
      ),
      width: '8%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 3,
    },

    {
      field: 'depotCurrencyCode',
      header: this.translate.instant(
        'operations.requestForQuote.grid.currency'
      ),
      width: '8%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 5
    },
    {
      field: 'totalRequestForQuoteCost',
      header: this.translate.instant(
        'operations.requestForQuote.grid.totalRFQCost'
      ),
      width: '12%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 6,
    },
    {
      field: 'modifiedBy',
      header: this.translate.instant(
        'operations.requestForQuote.grid.modifiedBy'
      ),
      width: '10%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 7,
    },
    {
      field: 'currentStatusCode',
      header: this.translate.instant(
        'operations.requestForQuote.grid.status'
      ),
      width: '8%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 8,
    },
    {
      field: 'modifiedDate',
      header: this.translate.instant(
        'operations.requestForQuote.grid.modifiedDate'
      ),
      width: '11%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 9,
    },
    {
      field: 'purchaseRequisitionNo',
      header: this.translate.instant(
        'operations.requestForQuote.grid.prNo'
      ),
      width: '8%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 10,
    },
    {
      field: 'purchaseOrderNo',
      header: this.translate.instant(
        'operations.requestForQuote.grid.poNo'
      ),
      width: '8%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 11,
    },
  ]
  columnHeaderListWithOutStatus = [
    {
      field: 'requestForQuoteNo',
      header: this.translate.instant(
        'operations.requestForQuote.grid.rfqNo'
      ),
      width: '10%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 1,
    },
    {
      field: 'depotCode',
      header: this.translate.instant(
        'operations.requestForQuote.grid.depot'
      ),
      width: '8%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 1,
    },
    {
      field: 'requestForQuoteDate',
      header: this.translate.instant(
        'operations.requestForQuote.grid.rfqDate'
      ),
      width: '10%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 2,
    },

    {
      field: 'requestForQuoteSource',
      header: this.translate.instant(
        'operations.requestForQuote.grid.rfqSource'
      ),
      width: '10%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 3,
    },
    {
      field: 'totalRequestForQuoteCost',
      header: this.translate.instant(
        'operations.requestForQuote.grid.totalRFQCost'
      ),
      width: '12%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 4,
    },
    {
      field: 'modifiedBy',
      header: this.translate.instant(
        'operations.requestForQuote.grid.modifiedBy'
      ),
      width: '10%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 5,
    },
    {
      field: 'modifiedDate',
      header: this.translate.instant(
        'operations.requestForQuote.grid.modifiedDate'
      ),
      width: '12%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 6,
    },
    {
      field: 'purchaseRequisitionNo',
      header: this.translate.instant(
        'operations.requestForQuote.grid.prNo'
      ),
      width: '10%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 7,
    },
    {
      field: 'purchaseOrderNo',
      header: this.translate.instant(
        'operations.requestForQuote.grid.poNo'
      ),
      width: '8%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 11,
    },
  ]
  columnHeaderListWithOutStatusWithRemarks = [
    {
      field: 'purchaseRequisitionNo',
      header: this.translate.instant(
        'operations.requestForQuote.grid.rfqNo'
      ),
      width: '10%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 1,
    },

    {
      field: 'requestForQuoteDate',
      header: this.translate.instant(
        'operations.requestForQuote.grid.rfqDate'
      ),
      width: '10%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 3,
    },

    {
      field: 'requestForQuoteSource',
      header: this.translate.instant(
        'operations.requestForQuote.grid.rfqSource'
      ),
      width: '10%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 4,
    },
    {
      field: 'totalRequestForQuoteCost',
      header: this.translate.instant(
        'operations.requestForQuote.grid.totalRFQCost'
      ),
      width: '12%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 5,
    },
    {
      field: 'depotCurrencyCode',
      header: this.translate.instant(
        'operations.requestForQuote.grid.currency'
      ),
      width: '10%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 6,
    },

    {
      field: 'modifiedBy',
      header: this.translate.instant(
        'operations.requestForQuote.grid.modifiedBy'
      ),
      width: '12%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 7,
    },
    {
      field: 'modifiedDate',
      header: this.translate.instant(
        'operations.requestForQuote.grid.modifiedDate'
      ),
      width: '12%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 8,
    },
    {
      field: 'requestForQuoteNo',
      header: this.translate.instant(
        'operations.requestForQuote.grid.rfqNo'
      ),
      width: '10%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 9,
    },
    {
      field: 'depotCode',
      header: this.translate.instant(
        'operations.requestForQuote.grid.depot'
      ),
      width: '8%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 1,
    },
    {
      rowspan: '2',
      field: 'remarks',
      header: this.translate.instant('operations.requestForQuote.grid.remarks'),
      isFilter: false,
      isSubHeader: false,
      isIcon: true,
      type: 'string',
      key: 10,
    },
  ];
  constructor(
    private translate: TranslateService,
    public notificationService: NotificationService,
    private loaderService: NgxUiLoaderService,
    private requestForQuoteService: RequestForQuoteService,
    private sharedTableStoreService: SharedTableStoreService,
  ) { }
  ngOnInIt() {

  }
  getServerSideTableList(event: any) {
    this.getServerSideTable.emit(event);
  }
  handleAddRecordIcon(event: any) {
    this.handleAddRecord.emit(event);
  }
  handleReopenIcon(event: any) {
    this.handleReopen.emit(event);
  }
  handleSendIcon(event: any) {
    this.handleSendRFQ.emit(event);
  }

  handlePrintIcon(event: any) {
    // this.handlePrint.emit(event);
    let requestForQuoteIds = [];
    requestForQuoteIds = this.selectedDataList.map(
      (item: { requestForQuoteId: any }) => item.requestForQuoteId
    );
    if (requestForQuoteIds?.length === 0) {
      this.notificationService.smallBox({
        title: this.translate.instant('common.notificationTitle.error'),
        content: this.translate.instant(
          'operations.requestForQuote.errors.minOneSelectedForPrint'
        ),
        severity: 'error',
        timeout: 5000,
        icon: 'fa fa-times',
      });
    } else {
      this.loaderService.start();
      this.requestForQuoteService
        .getRequestForQuoteOutput(requestForQuoteIds)
        .subscribe(async (data: any) => {
          if (data.status === true) {
            for (const printData of data.response) {
              await this.generatePdfForData(printData);
            }

            this.sharedTableStoreService.setResetTableData(true)
            this.sharedTableStoreService.refreshTable(true)
            this.selectedDataList = []
          }
        });
    }
  }

  async generatePdfForData(printData: RequestForQuoteOutputPrintData): Promise<void> {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        this.generateRfqPdfComponent.getData(printData);
        this.generateRfqPdfComponent.downloadPdf().then(() => {
          resolve();
        });
      }, 1000);
    });
  }

  handleCancelIcon(event: any) {
    this.handleCancel.emit(event);
  }
  handleEmailIcon(event: any) {
    // this.handleEmail.emit(event);
    this.sendEmailGridFunction.emit(true);

  }
  handleSendForApprovalIcon(event: any) {
    this.handleSendForApproval.emit(event);
  }
  receiveTableRowData(event: any) {
    this.receiveTableRow.emit(event);
  }
  receiveSelectedData(selectedData: any) {
    this.selectedDataList = selectedData;
    this.receiveSelected.emit(selectedData);
  }
  exportToExcelData(event: any) {
    this.exportToExcel.emit(event);
  }
  handleRemarksIcon(event: any) {
    this.handleRemarks.emit(event);
  }
  handleResetSelectedData() {
    this.sharedTableNewInstance.onSelectionChange([]);
    this.sharedTableNewInstance.selectedRowsData = [];
  }

}
