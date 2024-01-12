

import {
  Component,
  Input,
  OnInit,
  Output,
  ViewChild,
  EventEmitter,
  OnChanges,
  Injectable,
} from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  NgForm,
  FormControl,
} from "@angular/forms";
import { NgxUiLoaderService } from "ngx-ui-loader";
// import { ConfirmationService, SortEvent } from "primeng/api";
import { TranslateService, TranslatePipe } from "@ngx-translate/core";
import { RouterStateSnapshot, Router } from "@angular/router";
// import { ExcelService } from "../../services/export/excel/excel.service";
import { StoreService } from "../../services/store/store.service";
import { ConfirmationService, SortEvent } from "primeng/api";
import { ExcelService } from "../../services/export/excel/excel.service";
import { NotificationService } from "src/app/core/services";
import { UserAuthService } from "src/app/core/services/user-auth.service";
// import { NotificationService } from "src/app/core/services";


@Component({
  selector: 'app-shared-table-new',
  templateUrl: './shared-table-new.component.html',
  styleUrls: ['./shared-table-new.component.css']
})
@Injectable({
  providedIn: 'root'
})

export class SharedTableNewComponent implements OnInit, OnChanges {
  @Input() headerColumnList: any;
  @Input() filter: boolean = false;
  @Input() excelIcon: boolean = false;
  @Input() printIcon: boolean = false;
  @Input() cancelIcon: boolean = false;
  @Input() reopenIcon: boolean = false;
  @Input() refreshIcon: boolean = false;
  @Input() approvalIcon: boolean = false;
  @Input() createIcon: boolean = false;
  @Input() emailIcon: boolean = false;
  @Input() sendForApprovalIcon: boolean = false;
  @Input() showHide: boolean = false;
  @Input() globalSearch: boolean = false;
  @Input() isPanelHeading: boolean = true;
  @Input() uploadFileIcon: boolean = false;
  @Input() addRecordIcon: boolean = false
  @Input() deleteGnIcon: boolean = false
  @Input() excelFileName: string = "";
  @Output() refreshTableData = new EventEmitter();
  @Input() tableData: any = [];
  @Input() tableInitialData = [];
  @Input() hrefDynamic!: any;
  @Input() uploadDynamic!: any;
  @Input() uploadFileName!: any;
  @Input() uploadHeader!: any;
  @Input() uploadColumns!: any;
  @ViewChild("uploadModal") uploadModal: any;
  @Output() sendTableRowData = new EventEmitter();
  @Output() sendTableRowDataWithIndex = new EventEmitter();
  @Output() handleDeleteRowData = new EventEmitter();
  @Output() handleDeleteRowDataWithIndex = new EventEmitter();
  @Output() handleDeleteGnIconFn = new EventEmitter();
  @Output() getTableDataService = new EventEmitter();
  @Output() addTableDataService = new EventEmitter();
  @Output() handleHyperLinkRowData = new EventEmitter();
  @Input() excelDocument: any;
  @Input() deleteIcon: boolean = false;
  @Input() disableDeleteIcon: boolean = false;
  @Input() tableTitle: string = "List View";
  @Input() tableHeaderData: any;
  @Input() tableHeader: boolean = false;
  @Input() isGridTittle: boolean = true;
  @Input() headerIcons: boolean = true;
  @Input() sharedTableFormGroup!: FormGroup;
  @Input() isMasterComp: boolean = true
  @Input() isCheckBox: boolean = false;
  @Input() checkboxWidth = true;
  @Input() subHeaderColumn: number = 0;
  @Input() defaultSelectedList!: any;
  @Input() IsRecordHighlights: boolean = false;
  @Input() showTableHeader: boolean = true;
  @Input() removeHeaderBorder: boolean = true;
  @Output() sendSelectedData = new EventEmitter();
  @Output() handlePartSpecificationRowData = new EventEmitter();
  @Output() handlePartRowData = new EventEmitter();             // partIcon i.e setting icon in rfq supplier screen
  @Output() handleCompareRowData = new EventEmitter();             // partIcon i.e setting icon in rfq supplier screen
  @Output() sendRemarksIconAction = new EventEmitter();
  @Output() addRecordIconFn = new EventEmitter();

  totalDataGridCount = 0;
  selectedRowsData = [];
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
  recordsLastIndex: number | undefined;
  recordsPerPage = 10;
  filteredvalue: any = null;
  filteredListCount: number = 0;
  showPaginator = false;
  uploadIcon = false;
  hideIcon = false;
  globalFilter: any = new FormControl("");
  // ExcelUpload Variable

  numberAndAlphabetPattern = /^[A-Za-z0-9]*$/;
  username: any;
  companyId: number = 0;
  personaId: string = "";
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
  showWarning = false;
  downloadIcon = false;
  filterIcon = false;
  checkValue = false;
  warningMessage = "";
  uploadDisableIcon = false;
  totalRecords = 0;
  isoTypeLKP = [];
  isoTypeId: any;
  currentDateTime: Date | undefined;
  filteredUploadEquipmentCount: number = 0;
  uploadGlobalFilter = new FormControl("");
  inputValueTax: any = {};
  // @Input() formFilter: FormGroup;

  uploadButton: boolean = true;

  successCount: number = 0;
  failedCount: number = 0;
  totalProcessed = "0.00";
  successPercentage = "0.00";
  failedPercentage = "0.00";

  constructor(
    private authService: UserAuthService,
    private formBuilder: FormBuilder,
    private loaderService: NgxUiLoaderService,
    private translate: TranslateService,
    private excelService: ExcelService,
    public notificationService: NotificationService,
    public confirmationService: ConfirmationService,
    public storeService: StoreService,
    private router: Router,
    private fb: FormBuilder
  ) {
    const snapshot: RouterStateSnapshot = router.routerState.snapshot;
    this.screenId = snapshot.root.queryParams["screenId"];
    // excelService.getDepotLogo();
  }
  ngOnInit() {
    this.mode = "modes.new";
    this.selectedColumns = this.setColumnData();
    this.getUserInfo();
    // if (this.screenId !== undefined) {
    //   this.getPageRights(this.screenId);
    // }
    this.tableData = this.tableData;
    // this.formFilter = this.formFilter;
    if (this.tableInitialData) {
      this.getTableData();
    }
    // this.formFilter = this.fb.group({
    //   formFilters : ['']
    // })
    let tempArray: any[] = []

    this.selectedColumns.map((item: any) => {
      if (item["subHeader"]) {
        let subData = item["subHeader"].map((sub: { field: any; }) => sub.field)
        tempArray = [...tempArray, ...subData]
      } else {
        tempArray = [...tempArray, item["field"]]
      }
    })
    this.selectedColumnsKeys = tempArray;
    this.storeService.refreshTotalTable.subscribe((value: any) => {
      if (value) {
        this.refreshList()
      }
    });

  }
  changeHeaderDynamically() {
    this.selectedColumns = this.headerColumnList
    this.getTableData();
  }
  handlePartSpecificationIcon(event: Event, rowData: any) {
    event.preventDefault();
   

    this.handlePartSpecificationRowData.emit(rowData);
    event.stopPropagation();
  }
  handlePartIcon(event: Event, rowData: any) {
    event.preventDefault();
    this.handlePartRowData.emit(rowData);
    event.stopPropagation();
  }
  handleCompareIcon(event: Event, rowData: any) {
    event.preventDefault();
    this.handleCompareRowData.emit(rowData);
    event.stopPropagation();
  }
  ngOnChanges() {
    if (this.tableInitialData) {
      this.getTableData();
    }
  }
  closeUploadButton(event: any) {
    if (event) {
      this.uploadModal.hide();
      this.getTableDataService.emit(true);
    }
  }
  toggleFilter(): void {
    this.showFilter = !this.showFilter;
  }

  resetTable() {   // deselect for  selected rows marked as gree color.
    this.selectedValue = [];
  }

  customSort(event: SortEvent | any) {

    event.data.sort((data1: any, data2: any) => {

      const value1 = Number(data1[event.field]);
      const value2 = Number(data2[event.field]);

      let result = null;
      if (!isNaN(value1) && !isNaN(value2)) {
        if (value1 === null && value2 !== null) {
          result = -1;
        } else if (value1 !== null && value2 === null) {
          result = 1;
        } else if (value1 === null && value2 === null) {
          result = 0;
        } else {
          result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;
        }
      } else {
        if (typeof data1[event.field] === 'string' && typeof data2[event.field] === 'string') {
          result = data1[event.field].localeCompare(data2[event.field]);
        }
      }
      return (event.order * result);

    });

  }

  getPageRights(screenId: string) {
    this.authService
      .getPageRights(screenId, this.personaId)
      .subscribe((data: { [x: string]: any; }) => {
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
  // setColumnData() {
  //   return (this.columnData = this.headerColumnList);
  // }
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
  // isSortedAscending(field: string): boolean {
  //   // Implement your logic to check if 'field' is sorted in ascending order
  //   // Return true if it is, otherwise return false
  //   return true
  // }

  // isSortedDescending(field: string): boolean {
  //   // Implement your logic to check if 'field' is sorted in descending order
  //   // Return true if it is, otherwise return false
  //   return true
  // }

  // get servics list
  getTableData(): void {
    this.loaderService.start();
    if (this.tableData) {
      this.tableData = this.tableInitialData;
      this.tableListDataSource = this.tableData;
      this.filteredListCount = this.tableData.length;

      // this.showFilter = false;
      if (this.tableData.length > 0) {
        this.showPaginator = true;
        this.uploadIcon = false;
        this.hideIcon = false;
        this.downloadIcon = false;
        this.filterIcon = false;
      } else {
        this.showPaginator = false;
        this.uploadIcon = false;
        this.hideIcon = true;
        this.downloadIcon = true;
        this.filterIcon = true;
      }
      this.recordsFirstIndex = 0;
      if (this.tableData.length > this.recordsPerPage) {
        this.recordsLastIndex = this.recordsPerPage;
      } else {
        this.recordsLastIndex = this.tableData.length;
      }
    } else {
      this.tableData = [];
    }
    this.loaderService.stop();
  }

  onSelected(event: any, index: any): any {


    this.sendTableRowData.emit(event);
    this.sendTableRowDataWithIndex.emit({ rowDetails: event, index: index });
    this.enableRights();
  }

  handleDeleteIcon(rowData: any, index: any) {


    this.handleDeleteRowData.emit(rowData)
    this.handleDeleteRowDataWithIndex.emit({ rowDetails: rowData, index: index });
  }
  handleDeleteGnIcon(selectedRowData:any) {
    this.handleDeleteGnIconFn.emit(selectedRowData)
  }
  // get user details
  getUserInfo() {
    this.companyId = this.authService.getCurrentCompanyId();
    this.username = this.authService.getCurrentUserName();
    this.personaId = this.authService.getCurrentPersonaId();
  }

  // null check common method
  isNullorEmpty(value: string | null | undefined) {
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
  exporttoExcel(dt: any) {
    this.downloadEXCEL(dt);
  }
  print(dt: any) {
    // this.downloadEXCEL(dt);
  }
  cancel(dt: any) {
    // this.downloadEXCEL(dt);
  }
  reopen(dt: any) {
    // this.downloadEXCEL(dt);
  }
  email(dt: any) {
    // this.downloadEXCEL(dt);
  }
  approval(dt: any) {
    // this.downloadEXCEL(dt);
  }
  create(dt: any) {
    // this.downloadEXCEL(dt);
  }
  sendForApproval(dt: any) {
    // this.downloadEXCEL(dt);
  }
  downloadEXCEL(dt: any): any {
    let initialArray: any[] = [];



    if (Array.isArray(this.selectedColumns)) {
      this.selectedColumns.forEach((item: any, index: number) => {
        if (item && item.subHeader && Array.isArray(item.subHeader)) {
          let subData = item.subHeader.map((sub: any) => sub);
          initialArray = [...initialArray, ...subData];
        } else if (item) {
          initialArray = [...initialArray, item];
        }
      });
    }

    dt.columns = initialArray.filter(x => x && x.field !== 'delete');

    let s: boolean;
    if (this.filteredvalue === null) {
      s = this.excelService.exportAsExcelFile(dt, this.excelFileName, false);
    } else {
      s = this.excelService.exportAsExcelFile(dt, this.excelFileName, true);
    }
  }




  // Grid functions
  onFiltering(event: any) {
    this.filteredvalue = event.filteredValue;
    if (this.filteredvalue.length === 0) {
      this.showPaginator = false;
      this.uploadIcon = true;
      this.downloadIcon = true;
      this.hideIcon = true;
    } else {
      this.hideIcon = false;
      if (this.showPaginator === false) {
        this.showPaginator = true;
        this.uploadIcon = false;
        this.downloadIcon = false;
        this.sharedTable.filterGlobal(this.globalFilter.value, "contains");
      }
      if (this.selectedColumns.length === 0) {
        this.showPaginator = false;
        this.hideIcon = true;
      } else {
        this.showPaginator = true;
      }
    }
    this.filteredListCount = event.filteredValue.length;
    this.recordsFirstIndex = 0;
    this.recordsLastIndex = this.recordsPerPage;
    if (this.recordsLastIndex > this.filteredListCount) {
      this.recordsLastIndex = this.filteredListCount;
    }
  }
  onPagination(event: { first: number; rows: number; }) {
    this.recordsFirstIndex = event.first;
    this.recordsPerPage = event.rows;
    if (event.first + event.rows > this.filteredListCount) {
      this.recordsLastIndex = this.filteredListCount;
    } else {
      this.recordsLastIndex = event.first + event.rows;
    }
  }

  onSorting() {
    this.recordsFirstIndex = 0;
    this.recordsLastIndex = this.recordsPerPage;
    if (this.recordsLastIndex > this.filteredListCount) {
      this.recordsLastIndex = this.filteredListCount;
    }
  }

  addList() {
    this.addTableDataService.emit(true);
  }

  refreshList() {
    this.refreshTableData.emit(true);
    // if (this.sharedTableFormGroup.dirty) {
    //   this.confirmationService.confirm({
    //     message: this.translate.instant('Information.unsavedChangesInfo'),
    //     accept: () => {
    //       this.sharedTableFormGroup.reset();
    //       this.getTableDataService.emit(true);
    //       this.globalFilter.setValue(null);
    //       this.storeService.setResetForm(true);
    //       this.getTableData();
    //       if (this.sharedTable) {
    //         this.sharedTable.reset();
    //       }
    //       this.recordsPerPage = this.recordsPerPage;
    //       this.selectedColumns = this.setColumnData();
    //       this.selectedValue = [];
    //       this.showFilter = false;
    //       this.showPaginator = true;
    //       this.checkValue = false;
    //       this.mode = "modes.new";
    //       this.enableRights();
    //       this.tableData.length > 0 ? this.hideIcon = false : this.hideIcon = true;
    //     },
    //     reject: () => {
    //       return false;
    //     }
    //   });
    // }
    // else {
    // this.sharedTableFormGroup?.reset();
    // this.getTableDataService.emit(true);
    this.globalFilter.setValue(null);
    // this.storeService.setResetForm(true);
    this.getTableData();
    if (this.sharedTable) {
      this.sharedTable.reset();
    }
    this.headerColumnList.forEach((e: any) => this.sharedTable.filter("", e.field));
    this.recordsPerPage = this.recordsPerPage;
    this.selectedColumns = this.setColumnData();
    this.selectedValue = [];
    this.showFilter = false;
    this.showPaginator = true;
    this.checkValue = false;
    this.mode = "modes.new";
    this.enableRights();
    this.tableData.length > 0 ? this.hideIcon = false : this.hideIcon = true;
    // }


  }

  clearFilter(dt: any) {

    // this.tableData = this.tableListDataSource;
    this.filteredListCount = this.tableListDataSource.length;
    this.filteredvalue = null;
    this.recordsFirstIndex = 0;
    this.recordsLastIndex = this.recordsPerPage;
    // clear column wise filter and retains global filter value
    for (const i in this.selectedColumnsKeys) {
      if (this.selectedColumnsKeys.hasOwnProperty(i)) {
        dt.filter("", this.selectedColumnsKeys[i], "contains");
      }
    }
    dt._filter();
    this.inputValueTax = "";
  }

  changeHideShowColumns(dt: any) {



    if (this.selectedColumns.length === 0) {

      // this.showFilter = false;
      this.showPaginator = false;
      this.uploadIcon = true;
      this.hideIcon = true;
      this.checkValue = true;
    } else if (dt.filteredValue && dt.filteredValue.length === 0) {
      this.showPaginator = false;
      // this.showFilter = true;
      this.uploadIcon = true;
      this.hideIcon = true;
      this.checkValue = false;

      // this.toggleFilter();
    } else if (dt.value.length === 0) {
      this.showPaginator = false;
      this.showFilter = false;
      this.uploadIcon = true;
      this.hideIcon = true;
      this.checkValue = false;

    } else {
      this.showPaginator = true;
      this.uploadIcon = false;
      this.hideIcon = false;
      this.checkValue = false;

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

  handleHyperLink(rowData: any, event: any) {
    this.handleHyperLinkRowData.emit(rowData);
    event.stopPropagation();
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
  onSelectionChange(value = []) {


    this.sendSelectedData.emit(value);
  }

  handleRemarksIcon(row: any, event: any) {

    if (row && row.remarks) {
      const data = { row, event }
      this.sendRemarksIconAction.emit(data)
    }

  }
  handleAddRecordIcon() {

    this.addRecordIconFn.emit(true);
  }
}

