import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup } from '@angular/forms';
import { SharedLazyTableNewComponent } from 'src/app/shared/components/shared-lazy-table-new/shared-lazy-table-new.component';
import { NotificationService } from 'src/app/core/services';
import { PurchaseRequisitionOutPutData } from '../model/purchase-requisition-model';

@Component({
  selector: 'app-purchase-requisition-list',
  templateUrl: './purchase-requisition-list.component.html',
  styleUrls: ['./purchase-requisition-list.component.css'],
})
export class PurchaseRequisitionListComponent {
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
  @Input() tableTitle: string = "List View";
  @Input() disableAddNewIcons: boolean = false;
  @Input() disableSendForApprovalIcons: boolean = false;
  @Input() disableCancelPRIcons: boolean = false;
  @Input() disableReopenIcons: boolean = false;
  @Input() disablePrintPRIcons: boolean = false;
  @Input() disableEmailPRIcons: boolean = false;
  @Input() showTableByColumn: number = 0;
  @Input() purchaseRequisitionData: any = [];
  @ViewChild('sharedLazyTableNew')
  sharedLazyTableNew!: SharedLazyTableNewComponent;
  @ViewChild(SharedLazyTableNewComponent)
  sharedTableNewInstance!: SharedLazyTableNewComponent;
  @Input() purchaseRequisitionOutputData: PurchaseRequisitionOutPutData[] = [];
  @Input() tableFilterFormGroup!: FormGroup;
  selectedDataList: any = [];
  totalDataGridCountComp: any;

  @Input() currentStatusId: number = 547; // 547 is Default enumId for getting initial overall records

  constructor(
    private translate: TranslateService,
    public notificationService: NotificationService,
  ) { }

  columnHeaderListWithOutStatus = [
    {
      field: 'purchaseRequisitionNo',
      header: this.translate.instant(
        'operations.purchaseRequisition.grid.purchaseRequisitionNo'
      ),
      width: '10%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 1,
    },

    {
      field: 'prDateString',
      header: this.translate.instant(
        'operations.purchaseRequisition.grid.purchaseRequisitionDate'
      ),
      width: '15%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 2,
    },

    {
      field: 'depotCode',
      header: this.translate.instant(
        'operations.purchaseRequisition.grid.depot'
      ),
      width: '15%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 4,
    },
    {
      field: 'totalEstimatedCost',
      header: this.translate.instant(
        'operations.purchaseRequisition.grid.totalEstimatedCost'
      ),
      width: '15%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 5,
    },
    {
      field: 'lastModifiedBy',
      header: this.translate.instant(
        'operations.purchaseRequisition.grid.lastModifiedBy'
      ),
      width: '15%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 7,
    },
    {
      field: 'lastModifiedDate',
      header: this.translate.instant(
        'operations.purchaseRequisition.grid.lastModifiedDate'
      ),
      width: '15%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 8,
    },
  ];
  columnHeaderListWithOutStatusWithRemarks = [
    {
      field: 'purchaseRequisitionNo',
      header: this.translate.instant(
        'operations.purchaseRequisition.grid.purchaseRequisitionNo'
      ),
      width: '10%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 1,
    },

    {
      field: 'prDateString',
      header: this.translate.instant(
        'operations.purchaseRequisition.grid.purchaseRequisitionDate'
      ),
      width: '15%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 3,
    },

    {
      field: 'depotCode',
      header: this.translate.instant(
        'operations.purchaseRequisition.grid.depot'
      ),
      width: '15%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 4,
    },
    {
      field: 'totalEstimatedCost',
      header: this.translate.instant(
        'operations.purchaseRequisition.grid.totalEstimatedCost'
      ),
      width: '15%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 5,
    },
    {
      rowspan: '2',
      field: 'remarks',
      header: this.translate.instant('operations.purchaseRequisition.grid.remarks'),
      isFilter: true,
      isSubHeader: false,
      isIcon: true,
      type: 'string',
      key: 6,
    },
    {
      field: 'lastModifiedBy',
      header: this.translate.instant(
        'operations.purchaseRequisition.grid.lastModifiedBy'
      ),
      width: '15%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 7,
    },
    {
      field: 'lastModifiedDate',
      header: this.translate.instant(
        'operations.purchaseRequisition.grid.lastModifiedDate'
      ),
      width: '15%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 8,
    },
  ];

  columnHeaderListWithStatus = [
    {
      field: 'purchaseRequisitionNo',
      header: this.translate.instant(
        'operations.purchaseRequisition.grid.purchaseRequisitionNo'
      ),
      width: '8%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 1,
    },
    {
      field: 'prDateString',
      header: this.translate.instant(
        'operations.purchaseRequisition.grid.purchaseRequisitionDate'
      ),
      width: '8%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 2,
    },
    {
      field: 'depotCode',
      header: this.translate.instant(
        'operations.purchaseRequisition.grid.depot'
      ),
      width: '8%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 3,
    },
    {
      field: 'totalEstimatedCost',
      header: this.translate.instant(
        'operations.purchaseRequisition.grid.totalEstimatedCost'
      ),
      width: '12%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 4,
    },
    {
      field: 'currentStatus',
      header: this.translate.instant(
        'operations.purchaseRequisition.grid.status'
      ),
      width: '10%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 5,
    },
    {
      field: 'createdBy',
      header: this.translate.instant(
        'operations.purchaseRequisition.grid.createdBy'
      ),
      width: '10%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 6,
    },
    {
      field: 'lastModifiedBy',
      header: this.translate.instant(
        'operations.purchaseRequisition.grid.lastModifiedBy'
      ),
      width: '10%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 7,
    },
    {
      field: 'lastModifiedDate',
      header: this.translate.instant(
        'operations.purchaseRequisition.grid.lastModifiedDate'
      ),
      width: '10%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 8,
    },
  ];


  getServerSideTableList(event: any) {
    this.getServerSideTable.emit(event);
  }
  handleAddRecordIcon(event: any) {
    this.handleAddRecord.emit(event);
  }
  handleReopenIcon(event: any) {
    this.handleReopen.emit(event);
  }

  handlePrintIcon(event: any) {
    this.handlePrint.emit(event);
  }
  handleCancelIcon(event: any) {
    this.handleCancel.emit(event);
  }
  handleEmailIcon(event: any) {
    this.handleEmail.emit(event);
  }
  handleSendForApprovalIcon(event: any) {
    this.handleSendForApproval.emit(event);
  }
  receiveTableRowData(event: any) {
    this.receiveTableRow.emit(event);
  }
  receiveSelectedData(event: any) {
    this.receiveSelected.emit(event);
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
