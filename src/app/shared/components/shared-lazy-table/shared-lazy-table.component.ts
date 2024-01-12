import {
  Component,
  Input,
  OnInit,
  Output,
  ViewChild,
  EventEmitter,
} from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  FormControl,
} from "@angular/forms";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { RouterStateSnapshot, Router } from "@angular/router";
// import { ConfirmationService, SortEvent } from "primeng/api";
import { TranslateService } from "@ngx-translate/core";
import { Table } from "primeng/table";
import { StoreService } from "../../services/store/store.service";
import { SharedTableStoreService } from "../../services/store/shared-table-store.service";
import { UserAuthService } from "src/app/core/services/user-auth.service";
import { ConfirmationService } from "primeng/api";
import { NotificationService } from "src/app/core/services";
import { ExcelService } from "../../services/export/excel/excel.service";

@Component({
  selector: "sa-shared-lazy-table",
  templateUrl: "./shared-lazy-table.component.html",
  styleUrls: ["./shared-lazy-table.component.css"],
})
export class SharedLazyTableComponent implements OnInit {
  @Input() headerColumnList: any;
  @Input() filter: boolean = false;
  @Input() excelIcon: boolean = false;
  @Input() refreshIcon: boolean = false;
  @Input() holdIcon: boolean = false;
  @Input() printIcon: boolean = false;
  @Input() showHide: boolean = false;
  @Input() globalSearch: boolean = false;
  @Input() isPanelHeading: boolean = true;
  @Input() uploadFileIcon: boolean = false;
  @Input() addRecordIcon: boolean = false;
  @Input() deleteRecordIcon: boolean = false;
  @Input() isCheckBox: boolean = false;
  @Input() excelFileName: any;
  @Input() unClickableRow: boolean = false;
  @Output() refreshTableData = new EventEmitter();
  @Output() sendPrintListAction = new EventEmitter();
  @Output() sendRemarksIconAction = new EventEmitter();

  @Input() showPartSpecificationIcon: boolean = false;

  @Input() tableData = [];
  @Input() tableInitialData = [];
  @Input() hrefDynamic: any;
  @Input() uploadDynamic: any;
  @Input() uploadHeader: any;
  @Input() selectionMode = "multiple";
  @Input() uploadColumns: any;
  @Input() checkboxWidth = true;
  @ViewChild("uploadModal") uploadModal: any;
  @Output() sendTableRowData = new EventEmitter();
  @Output() handleDeleteRowData = new EventEmitter();
  @Output() handleAttachmentLinkRowData = new EventEmitter();
  @Output() handlePartSpecificationRowData = new EventEmitter();
  @Output() openRevisionHistory = new EventEmitter();
  @Output() getTableDataService = new EventEmitter();
  @Output() lazyLoadGetData = new EventEmitter();
  @Output() addTableDataService = new EventEmitter();
  @Output() deleteTableDataService = new EventEmitter();
  @Output() sendSelectedData = new EventEmitter();
  @Output() exportExcel = new EventEmitter();
  @Input() excelDocument: any;
  @Input() disableAddButton: boolean | undefined;
  @Input() uploadFileName: any;
  @Input() subHeaderColumn: number = 0;
  @Output() dtTableData = new EventEmitter();


  @ViewChild("sharedTable") tableGridData: any;
  @ViewChild('sharedTable') set sharedTableFn(el: Table) {
    this.tableGridData = el;
    this.dtTableData.emit(this.tableGridData);
  }
  submitted = false;
  selectedValue = [];
  mode = "new";
  selectedColumns: any = [];
  showFilter = false;
  @ViewChild("sharedTable") sharedTable: any;
  columnData = [];
  selectedColumnsKeys: any = [];
  tableListDataSource = [];
  recordsFirstIndex = 0;
  recordsLastIndex: number = 0;
  recordsPerPage = 10;
  filteredvalue = null;
  filteredListCount = 0;
  coutwithoutFilter: number = 0;
  uploadIcon = false;
  hideIcon = false;
  globalFilter = new FormControl("");
  // ExcelUpload Variable

  numberAndAlphabetPattern = /^[A-Za-z0-9]*$/;
  username: any;
  companyId!: number;
  personaId: any = "";
  currentIsoCode = "";
  previousIsoCode = "";
  // Role_Rights
  screenId = 0;
  createBit = true;
  editBit = true;
  viewBit = true;
  roleId = 0;
  roleRights: any = [];
  addButton = true;
  saveButton = true;
  totalRecords = 0;
  showWarning = false;
  downloadIcon = false;
  filterIcon = false;
  checkValue = false;
  warningMessage = "";
  uploadDisableIcon = false;
  isoTypeLKP = [];
  isoTypeId: any;
  currentDateTime!: Date;
  filteredUploadEquipmentCount: number = 0;
  uploadGlobalFilter = new FormControl("");
  inputValueTax: any = {};


  uploadButton: boolean = true;

  successCount: number = 0;
  failedCount: number = 0;
  totalProcessed = "0.00";
  successPercentage = "0.00";
  failedPercentage = "0.00";
  selectedRowsData = [];

  @Input() tableFilterFormGroup!: FormGroup;
  //clear
  recordFirstIndex = 0;
  recordLastIndex: number = 0;
  filteredTariffGroupCount = 0;
  filteredValue: any = null;
  paginationEvent!: boolean;
  totalDataGridCount = 0;
  paginatorHide = true;
  showHideFilter = true;

  constructor(
    private authService: UserAuthService,
    private translate: TranslateService,
    private excelService: ExcelService,
    public notificationService: NotificationService,
    public confirmationService: ConfirmationService,
    public storeService: StoreService,
    private sharedTableStoreService: SharedTableStoreService,
    private router: Router,
  ) {
    const snapshot: RouterStateSnapshot = router.routerState.snapshot;
    this.screenId = snapshot.root.queryParams["screenId"];
    // excelService.getDepotLogo();
  }
  ngOnInit() {
    this.mode = "modes.new";
    this.selectedColumns = this.setColumnData();
    this.getUserInfo();
    if (this.screenId !== undefined) {
      this.getPageRights(this.screenId);
    }
    this.tableData = this.tableData;

    if (this.tableInitialData) {
      this.getTableData();
    }

    let tempArray: any = [];

    this.selectedColumns.map((item: any) => {
      if (item.subHeader) {
        let subData = item.subHeader.map((sub: any) => sub.field);
        tempArray = [...tempArray, ...subData];
      } else {
        tempArray = [...tempArray, item.field];
      }
    });
    this.selectedColumnsKeys = tempArray;


    this.sharedTableStoreService.assignGridData.subscribe((data) => {
      this.assignGridData(data.data, data.params);
    });

    this.sharedTableStoreService.resetTableData.subscribe((data) => {
      if (data) {
        this.selectedRowsData = []
      }
    })
    this.sharedTableStoreService.refreshTableData.subscribe((data) => {
      if (data) {
        this.globalFilter.setValue(null);
        this.showHideFilter = true;
        this.paginatorHide = true;
        this.hideIcon = false;
        this.selectedColumns = this.setColumnData();
        this.tableFilterFormGroup.reset();
        this.checkValue = false;
        this.selectedRowsData = [];
        this.tableGridData.reset();
      }
    })

  }


  onSelectionChange(value = []) {
    this.sendSelectedData.emit(value);
  }


  getTableDataList(params: any) {
    this.lazyLoadGetData.emit(params);
  }
  ngOnChanges() {
    if (this.tableInitialData) {
      this.getTableData();
    }
  }
  deleteList(event: any) {
    this.deleteTableDataService.emit(event);
  }
  closeUploadButton(event: any) {
    if (event) {
      this.uploadModal.hide();
      this.getTableDataService.emit(true);
    }
  }
  toggleFilter(): void {
    this.showHideFilter = !this.showHideFilter;
  }



  getPageRights(screenId: any) {
    // this.createBit = true;
    // this.editBit = false;
    // this.viewBit = true;
    // this.enableRights();

    this.authService
      .getPageRights(screenId, this.personaId)
      .subscribe((data) => {
        if (data["status"] === true) {
          if (data["response"].length > 0) {
            this.roleRights = data["response"];
            this.createBit = this.roleRights[0].createBit;
            this.editBit = this.roleRights[0].editBit;
            this.viewBit = this.roleRights[0].viewBit;
            this.enableRights();
          } else {
            this.roleRights = [];
          }
        } else {
          this.roleRights = [];
          this.notificationService.smallBox({
            title: this.translate.instant("common.notificationTitle.information"),
            content: data["message"],
            // color: "#3276b1",
            severity: "info",
            timeout: 2000,
            icon: "fa fa-check",
          });
        }
      });
  }
  setColumnData() {
    let tempColumn: any = []
    this.headerColumnList.map((filteredList: any) => {
      if (filteredList.field != "checkbox")
        tempColumn.push(filteredList)
    })
    return (this.columnData = tempColumn);
  }

  enableRights() {

    this.showWarning = false;
    if (
      !this.editBit &&
      !this.createBit &&
      this.viewBit &&
      this.mode === "modes.new"
    ) {
      this.addButton = false;
      this.saveButton = false;
      this.uploadDisableIcon = this.createBit ? false : true;
      this.showWarning = true;
      this.mode = "modes.view";
      this.storeService.setResetForm(true);
      this.warningMessage = "common.roleRightsMessages.viewNew";
    } else if (
      !this.editBit &&
      !this.createBit &&
      this.viewBit &&
      this.mode === "modes.edit"
    ) {
      this.addButton = false;
      this.saveButton = false;
      this.uploadDisableIcon = this.createBit ? false : true;
      this.showWarning = true;
      this.mode = "modes.view";
      this.storeService.setResetForm(true);
      this.warningMessage = "common.roleRightsMessages.viewEdit";
    } else if (!this.createBit && this.mode === "modes.new") {
      this.uploadDisableIcon = this.createBit ? false : true;
      this.addButton = false;
      this.saveButton = false;
      this.showWarning = true;
      this.mode = "modes.view";
      this.storeService.setResetForm(true);
      this.warningMessage = "common.roleRightsMessages.create";
    } else if (this.createBit && this.mode === "modes.new") {
      this.uploadDisableIcon = this.createBit ? false : true;
      this.addButton = true;
      this.saveButton = true;
    } else if (!this.editBit && this.mode === "modes.edit") {
      this.saveButton = false;
      this.showWarning = true;
      this.mode = "modes.view";
      this.warningMessage = "common.roleRightsMessages.edit";
    } else if (this.editBit && this.mode === "modes.edit") {
      this.saveButton = true;
    } else {
    }
  }

  getTableData(): void {
    if (this.tableData && this.selectedColumns.length > 0) {
      this.tableData = this.tableInitialData;
      this.tableListDataSource = this.tableData;
      if (this.tableData.length > 0) {
        this.paginatorHide = true;
        this.uploadIcon = false;
        this.hideIcon = false;
        this.downloadIcon = false;
        this.filterIcon = false;
      } else {
        this.paginatorHide = false;
        this.uploadIcon = false;
        this.hideIcon = true;
        this.downloadIcon = true;
        this.filterIcon = true;
      }
    }
    else if (this.tableData && this.selectedColumns.length == 0) {
      this.tableData = this.tableInitialData;
      this.tableListDataSource = this.tableData;
    }
    else {
      this.tableData = [];
    }
  }

  onSelected(col: any, event: any): void {
    if (col != "checkbox") {
      if (col === "revisionNo") {
        this.openRevisionHistory.emit(event)
      } else {
        this.sendTableRowData.emit(event);
        this.enableRights();

      }
    }
  }

  handleDeleteIcon(rowData: any) {
    this.handleDeleteRowData.emit(rowData);
  }
  handleAttachmentLink(rowData: any) {
    this.handleAttachmentLinkRowData.emit(rowData);
  }
  handlePartSpecificationIcon(rowData: any) {
    this.handlePartSpecificationRowData.emit(rowData);
  }

  getUserInfo() {
    this.companyId = this.authService.getCurrentCompanyId();
    this.username = this.authService.getCurrentUserName();
    this.personaId = this.authService.getCurrentPersonaId();
  }

  isNullorEmpty(value: any) {
    if (
      value === "" ||
      value === null ||
      value === undefined ||
      value === "NaN"
    ) {
      return true;
    } else {
      return false;
    }
  }
  exportToExcel(dt: any) {
    this.sharedTableStoreService.setExportExcel(dt);
    this.exportExcel.emit(dt);
  }

  onFiltering(event: any) {
    this.filteredValue = event.filteredValue;
    this.dtTableData.emit(this.tableGridData);
    if (this.filteredValue.length === 0) {
      this.hideIcon = true;
      this.paginatorHide = false;
    } else {
      if (this.paginatorHide === false) {
        this.hideIcon = false;
        this.paginatorHide = true;
      }
      // this.paginatorHide = true;
      if (this.selectedColumns.length === 0) {
        this.hideIcon = true;
        this.paginatorHide = false;
      }
    }
    this.filteredListCount = event.filteredValue.length;
    this.recordFirstIndex = 0;
    this.recordLastIndex = this.recordsPerPage;
    if (this.recordLastIndex > this.filteredListCount) {
      this.recordLastIndex = this.filteredListCount;
    }
    this.selectedRowsData = []

  }

  onPagination(event: any) {
    this.paginationEvent = true;
    this.recordFirstIndex = event.first;
    this.recordsPerPage = event.rows;
    this.selectedRowsData = []
    if (event.first + event.rows > this.filteredListCount) {
      this.recordLastIndex = this.filteredListCount;
    } else {
      this.recordLastIndex = event.first + event.rows;
    }
  }

  assignGridData(data: any, params: any) {
    this.tableData = data.response.result;
    this.totalDataGridCount = data.response.totalCount;
    if (this.tableData.length === 0) {
      this.totalRecords = 0;
      this.paginatorHide = false;
      this.filteredListCount = 0;
      this.showFilter = false;
      this.hideIcon = true;
    } else {
      this.totalRecords = data.response.filterRecordCount;
      this.filteredListCount = data.response.filterRecordCount;
      if (this.selectedColumns.length === 0) {
        this.paginatorHide = false;
        this.showFilter = false;
        this.hideIcon = true;
      } else {
        this.paginatorHide = true;
        this.showFilter = true;
        this.hideIcon = false;
      }
    }
    if (this.paginationEvent) {
      this.recordFirstIndex = params.first;
      this.paginationEvent = false;
    } else {
      this.recordFirstIndex = 0;
    }
    if (data.response.filterRecordCount > params.rows) {
      if (params.rows + params.first > data.response.filterRecordCount) {
        this.recordLastIndex = data.response.filterRecordCount;
      } else {
        this.recordLastIndex = params.rows + params.first;
      }
    } else {
      this.recordLastIndex = data.response.filterRecordCount;
    }
  }

  addList() {
    this.addTableDataService.emit(true);
  }

  refreshList(dt: any) {
    this.globalFilter.setValue(null);
    if (dt) {
      dt.reset();
    }
    this.showHideFilter = true;
    this.paginatorHide = true;
    this.hideIcon = false;
    this.selectedColumns = this.setColumnData();
    this.tableFilterFormGroup?.reset();
    this.checkValue = false;
    this.clearFilter(dt);
    this.selectedRowsData = []
  }

  clearFilter(dt: any) {
    // this.globalFilter.setValue(null);
    this.filteredListCount = this.tableData.length;
    this.filteredValue = null;
    this.recordFirstIndex = 0;
    this.recordLastIndex = this.recordsPerPage;
    for (const i in this.selectedColumns) {
      if (this.selectedColumns.hasOwnProperty(i)) {
        dt.filter("", this.selectedColumns[i].field, "contains");
      }
    }
    dt._filter();
    this.tableFilterFormGroup?.reset();
    this.sharedTableStoreService.setGetTableGridData({
      first: 0,
      rows: dt.rows,
    });
  }

  changeHideShowColumns(dt: any) {
    if (this.selectedColumns.length === 0) {
      this.paginatorHide = false;
      this.uploadIcon = true;
      this.hideIcon = true;
      this.checkValue = true;
    } else if (dt.filteredValue && dt.filteredValue.length === 0) {
      this.paginatorHide = false;
      this.uploadIcon = true;
      this.hideIcon = true;
      this.checkValue = false;
    } else if (dt.value.length === 0) {
      this.paginatorHide = false;
      this.showFilter = false;
      this.uploadIcon = true;
      this.hideIcon = true;
      this.checkValue = false;
    } else {
      this.paginatorHide = true;
      this.uploadIcon = false;
      this.hideIcon = false;
      this.checkValue = false;
    }
  }
  printList() {
    this.sendPrintListAction.emit()

  }

  handleRemarksIcon(row: any, event: any) {

    if (row && row.remarks) {
      const data = { row, event }
      this.sendRemarksIconAction.emit(data)
    }

  }


  // check for JSON format value in return statement when upload
  isJsonString(str: string) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }
  uploadEquipmentType() {
    this.uploadModal.show();
  }

  applyFilterGlobal($event: any, stringVal: any) {
    
    this.sharedTable.filterGlobal($event.target.value, stringVal);
  }
  applyFilterFields($event: any, field: string, stringVal: any) {
    this.sharedTable.filter($event.target.value, field, stringVal);
  }
  onchangeMultiSelect() {
    this.selectedColumns = this.selectedColumns.sort((a: any, b: any) => a.key - b.key)
  }
}
