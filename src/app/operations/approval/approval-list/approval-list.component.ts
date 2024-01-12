import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  FormBuilder,
  FormGroup,
} from '@angular/forms';
import { PurchaseApprovalService } from '../service/purchase-approval.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { UserAuthService } from 'src/app/core/services/user-auth.service';
import { SharedLazyTableNewComponent } from 'src/app/shared/components/shared-lazy-table-new/shared-lazy-table-new.component';
import { SharedTableStoreService } from 'src/app/shared/services/store/shared-table-store.service';
import { ExcelService } from 'src/app/shared/services/export/excel/excel.service';
@Component({
  selector: 'app-approval-list',
  templateUrl: './approval-list.component.html',
  styleUrls: ['./approval-list.component.css']
})
export class ApprovalListComponent {
  @ViewChild("sharedLazyTableNew") sharedLazyTableNew: SharedLazyTableNewComponent | undefined;
  @ViewChild("remarksPopup") remarksPopup: any;
  @Input() tableTitle: any;
  @Input() showGridByType: any;
  @Input() showList!: boolean;
  @Input() showCancelIcon!: boolean;
  @Input() selectedForm!: string;
  @Input() selectedTabStatus!: string;
  // @Output() sendSelectedRowFromList = new EventEmitter();
  @Output() sendEmailGridFunction: any = new EventEmitter();
  @Output() sendApprovalGridFunction: any = new EventEmitter();
  @Output() handleGridPrintIcon: any = new EventEmitter();
  @Output() printFunction: any = new EventEmitter();
  @Output() sendSelectedRowFromList: any = new EventEmitter();
  @Output() sendCancelGridFunction: any = new EventEmitter();
  @Output() rejectGridFunction: any = new EventEmitter();
  @Output() valueEmit = new EventEmitter<boolean>();
  
  remarks: any;
  tableFilterFormGroup!: FormGroup;
  disableEmailPOIcons!: boolean;
  columnHeaderPurchaseRequisition: any[];
  columnHeaderRequestForQuote: any[];
  columnHeaderPurchaseOrder: any[];
  columnHeaderApprovedPurchaseRequisition: any[];
  columnHeaderApprovedRequestForQuote: any[];
  columnHeaderApprovedPurchaseOrder: any[];
  currentForm: string = "PR_FORM";  // initial value
  selectedFormRowData: any;
  serverSideProcessingObject: any;
  companyId!: any;
  userId!: any;
  userName: string = "";
  totalDataGridCountComp!: any;
  selectedDataList: any = [];
  excelDataTable: any = [];
  gridParams!: any;
  tableInitialData: any = []
  tableInitialDataRFQ: any = []
  disableAddNewIcons!: boolean;
  disableSendForApprovalIcons!: boolean;
  disableReopenIcons!: boolean;
  disablePrintPOIcons!: boolean;
  disableCancelPOIcons!: boolean;


  constructor(
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private purchaseApprovalService: PurchaseApprovalService,
    private loaderService: NgxUiLoaderService,
    private userAuthService: UserAuthService,
    private sharedTableStoreService: SharedTableStoreService,
    private excelService: ExcelService,
  ) {
    // pending grid columns list
    this.columnHeaderPurchaseRequisition = this.createColumnHeaders([
      { field: 'purchaseRequisitionNo', header: 'operations.approval.grid.prNo' },
      { field: 'prDate', header: 'operations.approval.grid.prDate' },
      { field: 'city', header: 'operations.approval.grid.city' },
      { field: 'depotCode', header: 'operations.approval.grid.depot' },
      { field: 'totalEstimatedCost', header: 'operations.approval.grid.totalEstimatedCost' },
      { field: 'currency', header: 'operations.approval.grid.currency' },
      { field: 'remarks', header: 'operations.approval.grid.remarks' },
      { field: 'modifiedBy', header: 'operations.approval.grid.modifiedBy' },
      { field: 'modifiedDate', header: 'operations.approval.grid.modifiedDate' },
    ]);

    this.columnHeaderRequestForQuote = this.createColumnHeaders([
      { field: 'depotCode', header: 'operations.approval.grid.depot' },
      { field: 'rfqNo', header: 'operations.approval.grid.rfqNo' },
      { field: 'rfqDate', header: 'operations.approval.grid.rfqDate' },
      { field: 'rfqSource', header: 'operations.approval.grid.rfqSource' },
      { field: 'totalRfqCost', header: 'operations.approval.grid.totalRfqCost' },
      { field: 'currency', header: 'operations.approval.grid.currency' },
      { field: 'modifiedBy', header: 'operations.approval.grid.modifiedBy' },
      { field: 'modifiedDate', header: 'operations.approval.grid.modifiedDate' },
      { field: 'purchaseRequisitionNo', header: 'operations.approval.grid.prNo' },
    ]);

    this.columnHeaderPurchaseOrder = this.createColumnHeaders([
      { field: 'poNumber', header: 'operations.approval.grid.poNo' },
      { field: 'poDate', header: 'operations.approval.grid.poDate' },
      { field: 'poSource', header: 'operations.approval.grid.poSource' },
      { field: 'supplierCode', header: 'operations.approval.grid.supplierCode' },
      { field: 'supplierName', header: 'operations.approval.grid.supplierName' },
      { field: 'supplierCity', header: 'operations.approval.grid.supplierCity' },
      { field: 'requestForQuoteNo', header: 'operations.approval.grid.rfqNo' },
      { field: 'purchaseRequisitionNo', header: 'operations.approval.grid.prNo' },
      { field: 'quoteNo', header: 'operations.approval.grid.quoteNo' },
      { field: 'depotCode', header: 'operations.approval.grid.depot' },
      { field: 'supplierCurrency', header: 'operations.approval.grid.supplierCurrency' },
      { field: 'poValueSC', header: 'operations.approval.grid.poValueSC' },
      { field: 'poValueDplc', header: 'operations.approval.grid.poValueDplc' },
      { field: 'modifiedBy', header: 'operations.approval.grid.modifiedBy' },
      { field: 'modifiedDate', header: 'operations.approval.grid.modifiedDate' },
    ]);

    // approved grid columns list
    this.columnHeaderApprovedPurchaseRequisition = this.createColumnHeaders([
      { field: 'purchaseRequisitionNo', header: 'operations.approval.grid.prNo' },
      { field: 'prDate', header: 'operations.approval.grid.prDate' },
      { field: 'city', header: 'operations.approval.grid.city' },
      { field: 'depotCode', header: 'operations.approval.grid.depot' },
      { field: 'totalEstimatedCost', header: 'operations.approval.grid.totalEstimatedCost' },
      { field: 'currency', header: 'operations.approval.grid.currency' },
      { field: 'remarks', header: 'operations.approval.grid.remarks' },
      { field: 'currentStatus', header: 'operations.approval.grid.status' },
      { field: 'modifiedBy', header: 'operations.approval.grid.modifiedBy' },
      { field: 'modifiedDate', header: 'operations.approval.grid.modifiedDate' },
    ]);

    this.columnHeaderApprovedRequestForQuote = this.createColumnHeaders([
      { field: 'depotCode', header: 'operations.approval.grid.depot' },
      { field: 'rfqNo', header: 'operations.approval.grid.rfqNo' },
      { field: 'rfqDate', header: 'operations.approval.grid.rfqDate' },
      { field: 'rfqSource', header: 'operations.approval.grid.rfqSource' },
      { field: 'totalRfqCost', header: 'operations.approval.grid.totalRfqCost' },
      { field: 'currency', header: 'operations.approval.grid.currency' },
      { field: 'currentStatus', header: 'operations.approval.grid.status' },
      { field: 'modifiedBy', header: 'operations.approval.grid.modifiedBy' },
      { field: 'modifiedDate', header: 'operations.approval.grid.modifiedDate' },
      { field: 'purchaseRequisitionNo', header: 'operations.approval.grid.prNo' },

    ]);

    this.columnHeaderApprovedPurchaseOrder = this.createColumnHeaders([
      { field: 'poNumber', header: 'operations.approval.grid.poNo' },
      { field: 'poDate', header: 'operations.approval.grid.poDate' },
      { field: 'poSource', header: 'operations.approval.grid.poSource' },
      { field: 'supplierCode', header: 'operations.approval.grid.supplierCode' },
      { field: 'supplierName', header: 'operations.approval.grid.supplierName' },
      { field: 'supplierCity', header: 'operations.approval.grid.supplierCity' },
      { field: 'requestForQuoteNo', header: 'operations.approval.grid.rfqNo' },
      { field: 'purchaseRequisitionNo', header: 'operations.approval.grid.prNo' },
      { field: 'quoteNo', header: 'operations.approval.grid.quoteNo' },
      { field: 'depotCode', header: 'operations.approval.grid.depot' },
      { field: 'supplierCurrency', header: 'operations.approval.grid.supplierCurrency' },
      { field: 'poValueSC', header: 'operations.approval.grid.poValueSC' },
      { field: 'poValueDplc', header: 'operations.approval.grid.poValueDplc' },
      { field: 'currentStatus', header: 'operations.approval.grid.status' },
      { field: 'modifiedBy', header: 'operations.approval.grid.modifiedBy' },
      { field: 'modifiedDate', header: 'operations.approval.grid.modifiedDate' },
    ]);
  }

  ngOnInit() {
    this.tableFilterFormGroup = this.formBuilder.group({
      poNumber: ['', []],
      poDate: ['', []],
      poSource: ['', []],
      poStatus: ['', []],
      currentStatus: ['', []],
      supplierCode: ['', []],
      supplierName: ['', []],
      city: ['', []],
      rfqNo: ['', []],
      requestForQuoteNo: ['', []],
      purchaseRequisitionNo: ['', []],
      quoteNo: ['', []],
      depotCode: ['', []],
      supplierCurrency: ['', []],
      poValueInSupplierCurrency: ['', []],
      poValueInDepotCurrency: ['', []],
      modifiedBy: ['', []],
      cancellationRemarks: ['', []],
      rejectionRemarks: ['', []],
      poNo: ['', []],
      supplierCity: ['', []],
      poValueSC: ['', []],
      poValueDplc: ['', []],
      modifiedDate: ['', []],
      prDate: ['', []],
      totalEstimatedCost: ['', []],
      currency: ['', []],
      remarks: ['', []],
      rfqDate: ['', []],
      rfqSource: ['', []],
      totalRfqCost: ['', []],
    });
    this.companyId = this.userAuthService.getCurrentCompanyId()
    this.userId = this.userAuthService.getCurrentUserId()
    this.userName = this.userAuthService.getCurrentUserName();
  }

  createColumnHeaders(headers: any[]): any[] {
    return headers.map((header, index) => ({

      field: header.field,
      header: this.translate.instant(header.header),
      width: '5%',
      isFilter: header.field == "remarks" ? false : true,
      isSubHeader: false,
      type: 'string',
      isIcon: header.field == "remarks" ? true : false,
      key: index + 1,
    }));
  }


  handleEmailIcon(selectedRow: any) {
    this.sendEmailGridFunction.emit(true);
  }

  receiveSelectedData(selectedData: any, tab: any) {
    this.selectedDataList = selectedData;
    this.sendSelectedRowFromList.emit({ selectedData, tab })
  }

  receiveTableRowData(event: any) {
    this.valueEmit.emit(event);
  }

  handleGridRefresh() {
    this.getServerSideTableList(this.gridParams);
  }

  getServerSideTableList(params: any) {
    this.gridParams = params;

    this.serverSideProcessingObject = {
      currentPage: params.first,
      globalFilter: params.globalFilter != undefined ? params.globalFilter : this.sharedLazyTableNew != undefined ? this.sharedLazyTableNew.globalFilter.value : null,
      pageSize: params.rows,
      sortField: params.sortField ? params.sortField : "sortOnly",
      sortOrder: params.sortField ? params.sortOrder ? params.sortOrder : -1 : -1,

      purchaseRequisitionNo: this.tableFilterFormGroup.value.purchaseRequisitionNo || "",
      prDate: this.tableFilterFormGroup.value.prDate || "",
      rfqDate: this.tableFilterFormGroup.value.rfqDate || "",
      depotCode: this.tableFilterFormGroup.value.depotCode || "",
      totalEstimatedCost: this.tableFilterFormGroup.value.totalEstimatedCost || "",
      currency: this.tableFilterFormGroup.value.currency || "",
      remarks: this.tableFilterFormGroup.value.remarks || "",
      modifiedBy: this.tableFilterFormGroup.value.modifiedBy || "",
      modifiedDate: this.tableFilterFormGroup.value.modifiedDate || "",
      currentStatus: this.tableFilterFormGroup.value.currentStatus || "",
      createdBy: this.tableFilterFormGroup.value.createdBy || "",
      poValueDplc: this.tableFilterFormGroup.value.poValueDplc || "",
      poValueSC: this.tableFilterFormGroup.value.poValueSC || "",
      poNumber: this.tableFilterFormGroup.value.poNumber || "",
      rfqNo: this.tableFilterFormGroup.value.rfqNo || this.tableFilterFormGroup.value.requestForQuoteNo || "",
      quoteNo: this.tableFilterFormGroup.value.quoteNo || "",
      poDate: this.tableFilterFormGroup.value.poDate || "",
      poSource: this.tableFilterFormGroup.value.poSource || "",
      rfqSource: this.tableFilterFormGroup.value.rfqSource || "",
      poStatus: this.tableFilterFormGroup.value.poStatus || "",
      supplierCode: this.tableFilterFormGroup.value.supplierCode || "",
      supplierName: this.tableFilterFormGroup.value.supplierName || "",
      supplierCity: this.tableFilterFormGroup.value.supplierCity || "",
      supplierCurrency: this.tableFilterFormGroup.value.supplierCurrency || "",
      city: this.tableFilterFormGroup.value.city || "",
      cancellationRemarks: this.tableFilterFormGroup.value.cancellationRemarks || "",
      rejectionRemarks: this.tableFilterFormGroup.value.rejectionRemarks || "",
      totalRfqCost: this.tableFilterFormGroup.value.totalRfqCost || "",
      searchStatusType: this.selectedTabStatus,  // PENDING or APPROVED
      searchRecordType: this.selectedForm,  // PR or PO or RFQ
    };

    this.loaderService.start();

    this.purchaseApprovalService.GetPurchaseApprovalListServerSide(
      this.serverSideProcessingObject,
      this.companyId,
      this.userId
    )
      .subscribe((data: any) => {
        this.loaderService.stop();
        this.tableInitialData = data["response"].result;
        this.totalDataGridCountComp = data["response"].filterRecordCount;
        this.sharedTableStoreService.setAssignGridData({ data, params });
      });

  }
  exportToExcelData(event: any) {

    let newColumns = event?.columns?.filter(
      (key: any) => key.field != 'checkbox'
    );
    let params: any = { first: 0, rows: this.totalDataGridCountComp };
    newColumns?.map((item: { [x: string]: any; field: string }) => { });
    this.excelDataTable = [];
    this.excelDataTable.columns = newColumns;
    this.excelDataTable.filteredValue = undefined;
    let downloaded: boolean;
    let serverSideProcessingObject = {
      currentPage: params.first,
      globalFilter: params.globalFilter != undefined ? params.globalFilter : this.sharedLazyTableNew != undefined ? this.sharedLazyTableNew.globalFilter.value : null,
      pageSize: params.rows,
      sortField: params.sortField ? params.sortField : "sortOnly",
      sortOrder: params.sortField ? params.sortOrder ? params.sortOrder : -1 : -1,

      purchaseRequisitionNo: this.tableFilterFormGroup.value.purchaseRequisitionNo || "",
      prDate: this.tableFilterFormGroup.value.prDate || "",
      depotCode: this.tableFilterFormGroup.value.depotCode || "",
      totalEstimatedCost: this.tableFilterFormGroup.value.totalEstimatedCost || "",
      currency: this.tableFilterFormGroup.value.currency || "",
      remarks: this.tableFilterFormGroup.value.remarks || "",
      modifiedBy: this.tableFilterFormGroup.value.modifiedBy || "",
      modifiedDate: this.tableFilterFormGroup.value.modifiedDate || "",
      currentStatus: this.tableFilterFormGroup.value.currentStatus || "",
      createdBy: this.tableFilterFormGroup.value.createdBy || "",
      poValueDplc: this.tableFilterFormGroup.value.poValueDplc || "",
      poNumber: this.tableFilterFormGroup.value.poNumber || "",
      rfqNo: this.tableFilterFormGroup.value.rfqNo || this.tableFilterFormGroup.value.requestForQuoteNo || "",
      quoteNo: this.tableFilterFormGroup.value.quoteNo || "",
      poDate: this.tableFilterFormGroup.value.poDate || "",
      poSource: this.tableFilterFormGroup.value.poSource || "",
      poStatus: this.tableFilterFormGroup.value.poStatus || "",
      supplierCode: this.tableFilterFormGroup.value.supplierCode || "",
      supplierName: this.tableFilterFormGroup.value.supplierName || "",
      supplierCity: this.tableFilterFormGroup.value.supplierCity || "",
      supplierCurrency: this.tableFilterFormGroup.value.supplierCurrency || "",
      poValueInSupplierCurrency: this.tableFilterFormGroup.value.poValueInSupplierCurrency || "",
      poValueInDepotCurrency: this.tableFilterFormGroup.value.poValueInDepotCurrency || "",
      city: this.tableFilterFormGroup.value.city || "",
      cancellationRemarks: this.tableFilterFormGroup.value.cancellationRemarks || "",
      rejectionRemarks: this.tableFilterFormGroup.value.rejectionRemarks || "",
      totalRfqCost: this.tableFilterFormGroup.value.totalRfqCost || "",
      searchStatusType: this.selectedTabStatus,  // PENDING or APPROVED
      searchRecordType: this.selectedForm,  // PR or PO or RFQ
    };
    this.loaderService.start();
    this.purchaseApprovalService.GetPurchaseApprovalListServerSide(
      serverSideProcessingObject,
      this.companyId,
      this.userId
    )
      .subscribe((data: any) => {
        if (data.status === true) {
          this.selectedDataList = [];
          this.excelDataTable.value = data['response'].result;
          downloaded = this.excelService.exportAsExcelFile(
            this.excelDataTable,
            this.tableTitle + " List",
            false
          );
        }

        this.loaderService.stop();
      });
  }

  handleCancelIcon(arg0: string) {
    this.sendCancelGridFunction.emit(true);
  }

  handleRejectIcon(arg0: string) {
    this.rejectGridFunction.emit(true);
  }

  handleApprovalIcon(event: any) {
    this.sendApprovalGridFunction.emit(true);
  }

  handlePrintIcon(event: any) {
    this.printFunction.emit(true);

  }

  handleRemarksIcon(data: any) {
    this.remarks = data.row.remarks;
    this.remarksPopup.show();

    data.event.stopPropagation();
  }
  closeRemarksPopUp() {
    this.remarksPopup.hide();
  }

  openRemarksPopup(remarks: string, event: MouseEvent) {
    this.remarks = remarks;
    this.remarksPopup.show();
    event.stopPropagation();
  }


}
