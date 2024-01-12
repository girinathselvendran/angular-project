import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterStateSnapshot } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ConfirmationService } from 'primeng/api';
import { NotificationService } from 'src/app/core/services';
import { UserAuthService } from 'src/app/core/services/user-auth.service';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { ExcelService } from 'src/app/shared/services/export/excel/excel.service';
import { SharedTableStoreService } from 'src/app/shared/services/store/shared-table-store.service';
import { FormCanDeactivate } from 'src/app/core/guards/form-can-deactivate';
import { StockMaintenanceService } from '../service/stock-maintenance.service';
import { PartSpecificationsComponent } from 'src/app/shared/components/popup/part-specifications/part-specifications.component';
import { SharedLazyTableNewComponent } from 'src/app/shared/components/shared-lazy-table-new/shared-lazy-table-new.component';

@Component({
  selector: 'app-stock-maintenance-list',
  templateUrl: './stock-maintenance-list.components.html',
})
export class StockMaintenanceListComponent {
  @ViewChild("remarksPopup") remarksPopup: any;
  @ViewChild(SharedLazyTableNewComponent) sharedLazyTableNew!: SharedLazyTableNewComponent;
  @ViewChild('partSpecification') partSpecificationModal!: PartSpecificationsComponent;
  @Output() getServerSideTable = new EventEmitter();
  @Output() exportToExcel = new EventEmitter();
  @Input() stockMaintenanceData: any = [];
  @Input() currentUserName: string = "";
  @Input() currentCompanyId: number = 0;
  @Input() currentUserId: number = 0;
  formGroupListGroup!: FormGroup;
  @Input() tableFilterFormGroup!: FormGroup;
  tableInitialData = [];
  tableTitle = 'Stock';
  remarks: string = '';
  partSpecificationData = [];
  @Input() isStockMaintenance : boolean = true;
  columnHeaderStockMaintenance = [
    // {
    //   field: 'sNo',
    //   header: this.translate.instant(
    //     'operations.stockMaintenance.grid.sNo'
    //   ),
    //   width: '4%',
    //   isFilter: true,
    //   isSubHeader: false,
    //   type: 'string',
    //   key: 1,
    // },
    {
      field: 'depot',
      header: this.translate.instant(
        'operations.stockMaintenance.grid.depot'
      ),
      width: '5%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 2,
    },
    {
      field: 'store',
      header: this.translate.instant(
        'operations.stockMaintenance.grid.store'
      ),
      width: '4%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 3,
    },
    {
      field: 'zoneName',
      header: this.translate.instant(
        'operations.stockMaintenance.grid.zoneName'
      ),
      width: '5%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 4,
    },
    {
      field: 'bin',
      header: this.translate.instant(
        'operations.stockMaintenance.grid.bin'
      ),
      width: '3%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 5,
    },
    {
      field: 'partType',
      header: this.translate.instant(
        'operations.stockMaintenance.grid.partType'
      ),
      width: '3%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 6,
    },
    {
      field: 'partName',
      header: this.translate.instant(
        'operations.stockMaintenance.grid.partName'
      ),
      width: '5%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 7,
    },
    {
      field: 'availableStock',
      header: this.translate.instant(
        'operations.stockMaintenance.grid.availableStock'
      ),
      width: '6%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 8,
    },
    {
      field: 'stockUOM',
      header: this.translate.instant(
        'operations.stockMaintenance.grid.stockUom'
      ),
      width: '6%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 9,
    },
    {
      field: 'partSpecificationIcon',
      header: this.translate.instant(
        'operations.stockMaintenance.grid.partSpecification'
      ),
      width: '9%',
      isFilter: false,
      isSubHeader: false,
      type: 'string',
      key: 10,
    },
    {
      field: 'remarks',
      header: this.translate.instant(
        'operations.stockMaintenance.grid.remarks'
      ),
      width: '5%',
      isFilter: true,
      isIcon: true,
      isSubHeader: false,
      type: 'string',
      key: 11,
    },
  ]
  columnHeaderStockSummary = [
    // {
    //   field: 'sNo',
    //   header: this.translate.instant(
    //     'operations.stockMaintenance.grid.sNo'
    //   ),
    //   width: '3%',
    //   isFilter: true,
    //   isSubHeader: false,
    //   type: 'string',
    //   key: 1,
    // },
    {
      field: 'depot',
      header: this.translate.instant(
        'operations.stockMaintenance.grid.depot'
      ),
      width: '5%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 2,
    },
    {
      field: 'partCode',
      header: this.translate.instant(
        'operations.stockMaintenance.grid.partCode'
      ),
      width: '3%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 3,
    },
    {
      field: 'partName',
      header: this.translate.instant(
        'operations.stockMaintenance.grid.partName'
      ),
      width: '5%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 4,
    },
    {
      field: 'partType',
      header: this.translate.instant(
        'operations.stockMaintenance.grid.partType'
      ),
      width: '3%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 5,
    },
    {
      field: 'partCategory',
      header: this.translate.instant(
        'operations.stockMaintenance.grid.partCategory'
      ),
      width: '5%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 6,
    },
    {
      field: 'partSpecificationIcon',
      header: this.translate.instant(
        'operations.stockMaintenance.grid.partSpecification'
      ),
      width: '5%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 7,
    },
    {
      field: 'stockUOM',
      header: this.translate.instant(
        'operations.stockMaintenance.grid.stockUom'
      ),
      width: '5%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 8,
    },
    {
      field: 'totalAvailableStock',
      header: this.translate.instant(
        'operations.stockMaintenance.grid.totalAvailableStock'
      ),
      width: '5%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 9,
    },
    {
      field: 'partRate',
      header: this.translate.instant(
        'operations.stockMaintenance.grid.partRate'
      ),
      width: '5%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 10,
    },
    {
      field: 'currency',
      header: this.translate.instant(
        'operations.stockMaintenance.grid.currency'
      ),
      width: '5%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 11,
    },
    {
      field: 'totalStockValue',
      header: this.translate.instant(
        'operations.stockMaintenance.grid.totalStockValue'
      ),
      width: '5%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 12,
    },
  ]

  constructor(
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private userAuthService: UserAuthService,
    private datePipe: DatePipe,
    private loaderService: NgxUiLoaderService,
    private localeService: BsLocaleService,
    private router: Router,
    private stockMaintenanceService: StockMaintenanceService,
    private commonService: CommonService,
    private sharedTableStoreService: SharedTableStoreService,
    private notificationService: NotificationService,
    private excelService: ExcelService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit() {
    this.formGroupListGroup = this.formBuilder.group({
      store: [[], []],
      depot: [[], []],
      zoneName: [[], []],
      bin: [[], []],
      partType: [[], []],
      partName: [[], []],
      partCode: [[], []],
      partCategory: [[], []],
      availableStock: [[], []],
      stockUom: [[], []],
      partSpecification: [[], []],
      totalAvailableStock: [[], []],
      partRate: [[], []],
      currency: [[], []],
      totalStockValue: [[], []],
      remarks: [[], []],
    });
  }

  // ------------------Common Functions Start------------------
  receiveTableRowData(event:any) {

  }
  closeRemarksPopUp() {
    this.remarksPopup.hide();
  }
  handleRemarksIcon(event: any) {
    this.remarks = event.row.remarks;
    this.remarksPopup.show();
  }
  getServerSideTableList(event: any) {
    this.getServerSideTable.emit(event);
  }
  handlePartSpecificationRowData(event: any) {
    const partId = event?.partId || 0;
    this.getPartSpecificationList(partId);
  }
  exportToExcelData(event: any) {
    this.exportToExcel.emit(event);
  }
  // -----------------------Common Functions End--------------------

  getPartSpecificationList(partId: any) {
    this.stockMaintenanceService
      .getPartSpecificationList(partId)
      .subscribe((data: any) => {
        this.partSpecificationData = data.response;
        this.partSpecificationModal.handleOpenSpecification();
      });
  }


}
