import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { Table } from 'primeng/table';
import { Subscription } from 'rxjs';
import { utility } from 'src/app/utilities/utility';
import { default as commonMasterData } from 'src/assets/data/common-master-data.json';
import { SharedDataService } from '../../services/common/shared-data.service';
import { ColumnConfigModel } from '../models/column-config.model';

@Component({
  selector: 'app-primeng-lazy-grid',
  templateUrl: './primeng-lazy-grid.component.html',
  styleUrls: ['./primeng-lazy-grid.component.scss'],

  styles: [`
    ::-webkit-input-placeholder {
    color: #000;
    }

    :-moz-placeholder {
      color: #000;
    }

    ::-moz-placeholder {
      color: #000;
    }

    :-ms-input-placeholder {
      color: #000;
    }
    .rightalign { justify-content: right; }
  `]
})
export class PrimengLazyGridComponent implements OnInit {
  SearchKeyword = "Search Keyword"
  @Input() columns: ColumnConfigModel[] = [];
  @Input() gridData: any[] = [];
  @Input() page: string;
  @Input() hideCheckBoxSelection = false;
  @Input() hideAction = false;
  @Input() hideEditAction = false;
  @Input() hideDeleteAction = false;
  @Input() hideDetailsAction = false;
  @Input() hideSwitchAction = false;
  @Input() showDownload = false;
  @Input() showOnHireAction = false;
  @Input() showWordDownload = false;
  @Input() showExcelDownload = false;
  @Input() ShowCopy = false;
  @Input() showAddButton = false;
  @Input() showRowLink = false;
  @Input() rowLinkField = '';
  @Input() selectedData: any[] = [];
  @Input() totalRecords: number = 0;
  @Input() loading: boolean = false;
  @Input() hideColumnSelections = false;
  @Input() hideClearButton = false;
  @Input() hideFilter = false;
  @Input() hideSorting = false;
  @Input() showPdfDownload = true;
  @Input() showSOPdfDownload = true;
  @Input() showEditProforma = false;
  @Input() pageRows = 10;
  @Input() disableAllDeleteReport = false;
  @Input() disableAllDeleteInvoice = false;
  @Input() disableAllFinalize = false;
  @Input() disableAllRedraft = false;
  @Input() checkAllDeleteInvoice = false;
  @Input() checkAllDeleteReport = false;
  @Input() checkAllFinalize = false;
  @Input() checkAllRedraft = false;
  @Input() checkAllActualize = false;
  @Input() checkAllRestoreMail = false;
  @Input() checkAllDeleteMail = false;
  @Input() checkAllSendMail = false;
  @Input() hideGlobalFilter = false;
  @Input() disableAllDeleteMail = false;
  @Input() disableAllSendMail = false;
  @Input() disableAllRestoreMail = false;
  @Input() hideCancelAction = true;
  @Input() disableCancelAction = true;
  @Input() disableCancelActionOption = true;
  @Input() showZipDownload = true;
  @Input() disableZipDownload = false;
  @Input() colorCodeBasedOnStatus = true;
  @Input() showRowLevelFilter = false;
  @Input() hideCheckBox = true;
  @Input() checkInvoiceAllFinalFlag = false;
  @Input() showVisibleFilterButton = true;
  @Input() skipSaveSearch = false;

  @Output() onCancelDataEvent = new EventEmitter<any>();
  @Output() deleteDataEvent = new EventEmitter<any>();
  @Output() editDataEvent = new EventEmitter<any>();
  @Output() statusChangeDataEvent = new EventEmitter<any>();
  @Output() detailDataEvent = new EventEmitter<any>();
  @Output() selectedDataEvent = new EventEmitter<any[]>();
  @Output() loadGridData = new EventEmitter<any>();
  @Output() downloadDataEvent = new EventEmitter<any>();
  @Output() excelDownloadDataEvent = new EventEmitter<any>();
  @Output() copyDataEvent = new EventEmitter<any>();
  @Output() hyperlinkClickEvent = new EventEmitter<any>();
  @Output() columnSelectionEvent = new EventEmitter<ColumnConfigModel[]>();
  @Output() pdfDownloadDataEvent = new EventEmitter<any>();
  @Output() sopdfDownloadDataEvent = new EventEmitter<any>();
  @Output() wordDownloadDataEvent = new EventEmitter<any>();
  @Output() EditProformaActionEvent = new EventEmitter<any>();
  @Output() checkboxChangeActionEvent = new EventEmitter<any>();
  @Output() headerCheckboxChangeActionEvent = new EventEmitter<any>();
  @Output() zipDownloadDataEvent = new EventEmitter<any>();
  @Output() lockOrUnlockDataEvent = new EventEmitter<any>();
  @Output() CheckBoxActionEvent = new EventEmitter<any>();
  @Output() ClickHeaderCheckBoxAction = new EventEmitter<any>();
  @Output() downOnHireActionEvent = new EventEmitter<any>();
  @ViewChild('dt') tableRef: Table;

  dateFilterAdvancedOptions: any[] = commonMasterData.dateFilterAdvancedOptions;
  globalSearches: any[] = [];
  totalColumns: number = 0;
  globalFilter: any = '';
  _selectedColumns: any[] = [];

  refreshGridSubscription: Subscription;
  showGrid: boolean = true;
  isCalenderShowing: boolean = false;
  textMatchModeOptions = commonMasterData.textMatchModeOptions;
  lastLazyEvent: any = null;
  refreshTableFilterSubscription: Subscription;
  refreshGoBackActionSubscription: Subscription;
  isGoBackToList: boolean = false;
  numericMatchModeOptions: any[] = commonMasterData.numericMatchModeOptions;
  toggleRowLevelFilter:boolean = true;

  constructor(private sharedDataService: SharedDataService,
    private config: PrimeNGConfig) { }

  ngOnInit(): void {  
    this.refreshGrid();
    this.subscribeTableFilterChanges();
    this.subscribeGobackToList();
    const selectedConfiguredColumns =  this.columns.filter(c=> c.show)
    this._selectedColumns = selectedConfiguredColumns.length ? selectedConfiguredColumns : this.columns;
    this.totalColumns = this.selectedColumns.length +
      (this.hideCheckBoxSelection ? 0 : 1) + (this.hideAction ? 0 : 1);
  }

  ngAfterViewInit(){
    if(this.tableRef && this.lastLazyEvent){
      this.tableRef.filters = Object.assign({}, this.lastLazyEvent.filters);
      this.tableRef.first = this.lastLazyEvent.first;
      this.tableRef.rows = this.lastLazyEvent.rows;
    }
  }

  getCopyTooltipName(){
    let toolTip = 'Copy';
    if(this.page != ''){
      toolTip += ' ' + this.page;
    }
    return toolTip;
  }

  getPDFTooltipName(){ 
    let toolTip = ''; 
    if(this.page != ''){
      if (this.page == 'saleOffer') toolTip = 'Regenerate PDF';
       else if (this.page == 'containerLost' || this.page == 'containerFound') toolTip = 'View Invoice'; 
       else if (this.page == 'batchSale') toolTip = 'Download Pdf';
       else if (this.page == 'repairEstimate') toolTip = 'Download Report As Pdf';  
       else if (this.page == 'miscellaneousInvoice') toolTip = 'View/Download Invoice';  
      } return toolTip  }

  loadData(event: any) {
    if(event.sortField !== 'deleteInvoice' && event.sortField !== 'finalize' && event.sortField !== 'redraft' &&  event.sortField !== 'deleteAllFlag' && event.sortField !== 'sendAllFlag' && event.sortField !== 'reviewAllFlag'){
      let lazyEvent = Object.assign({}, event);
      if(!this.skipSaveSearch && this.isGoBackToList){
        this.lastLazyEvent = this.sharedDataService.getPageFilterData(this.page);
        if(this.lastLazyEvent){
        lazyEvent.filters = Object.assign({}, this.lastLazyEvent.filters);
        event.sortField = this.lastLazyEvent.sortField;
        lazyEvent.rows = this.lastLazyEvent.rows;
        lazyEvent.first = this.lastLazyEvent.first;
        event.rows = this.lastLazyEvent.rows;
        event.first = this.lastLazyEvent.first;
        this.sharedDataService.setGoBackActionObs(false);
      }
    }
    if(!this.skipSaveSearch){
      this.sharedDataService.addUpdatePageFilterData({page: this.page, lazyEvent: event});
    }
    
    if (event.sortField && this.columns.find(c => c.field == event.sortField)?.sortRefKey) {
      lazyEvent.sortField = this.columns.find(c => c.field == lazyEvent.sortField)?.sortRefKey;
    }
    this.loadGridData.emit({ lazyEvent: lazyEvent });
    }
  }

  detailData(rowData: any) {
    this.detailDataEvent.emit(rowData);
  }

  editData(rowData: any) {
    this.editDataEvent.emit(rowData);
  }

  downloadData(rowData: any) {
    this.downloadDataEvent.emit(rowData);
  }
  ondownOnHireAction(rowData: any) {
    this.downOnHireActionEvent.emit(rowData);
  }
  downloadExcelData(rowData: any) {
    this.excelDownloadDataEvent.emit(rowData);
  }

  copyData(rowData: any) {
    this.copyDataEvent.emit(rowData);
  }

  deleteData(rowData: any) {
    this.deleteDataEvent.emit(rowData);
  }

  onRowSelect(event: any) {
    this.selectedDataEvent.emit(this.selectedData);
  }

  onRowUnselect(event: any) {
    this.selectedDataEvent.emit(this.selectedData);
  }

  onSelectAll(event: any) {
    this.selectedDataEvent.emit(this.selectedData);
  }

  onStatusChangeaData(rowData: any) {
    this.statusChangeDataEvent.emit(rowData);
  }

  downloadPdfData(rowData: any) {
    this.pdfDownloadDataEvent.emit(rowData);
  }
  downloadSOPdfData(rowData: any) {
    this.sopdfDownloadDataEvent.emit(rowData);
  }
  downloadWordData(rowData: any){
    this.wordDownloadDataEvent.emit(rowData);
  }

  downloadZipData(rowData: any) {
    this.zipDownloadDataEvent.emit(rowData);
  }

  onEditProformaAction(rowData: any) {
    this.EditProformaActionEvent.emit(rowData);
  }

  onClickCheckBoxAction(rowData) {
    this.CheckBoxActionEvent.emit(rowData);
  }

  onClickHeaderCheckBoxAction( isChecked){
    this.ClickHeaderCheckBoxAction.emit({isChecked: isChecked});
  }

  onCancelData(rowData: any) {
    this.onCancelDataEvent.emit(rowData);
  }
  onRowClick(event: any, rowData: any) {
    if (!(
      event.target.className.toLowerCase() == 'p-inputswitch-slider'
      || event.target.className.toLowerCase() == 'p-checkbox-icon'
      || event.target.className.toLowerCase() == 'p-checkbox-box p-highlight p-focus'
      || event.target.tagName?.toLowerCase() ==  'p-checkbox'
      || event.target.tagName?.toLowerCase() == 'p-button-icon fa-solid fa-circle-xmark'
      || event.target.nodeName.toLowerCase() == 'a'
      || event.target.nodeName.toLowerCase() == 'button')
      && !(event.target.parentElement?.nodeName.toLowerCase() == 'a'
      || event.target.parentElement?.nodeName.toLowerCase() == 'button')) {
      this.editDataEvent.emit(rowData);
    }
  }

  clearFilter() {
    if (this.tableRef) {
      this.sharedDataService.setRefreshClearFilterListGridObs(true);
      this.tableRef.lazy = false;
      this.tableRef.clear();
      this.globalFilter = '';
      this.tableRef.lazy = true;
      let sortField = null;
      if (this.columns.find(c => c.sortRefKey == 'lastUpdated')) {
        sortField = 'lastUpdated';
      }
      this.columns.filter(c=> c.filterType == 'customdate').forEach((column)=> {
        column.fromDate = null;
        column.toDate = null;
      });
      this.loadData({ rows: 10, first: 0, sortField: sortField, sortOrder: -1, filters: null, globalFilter: null });
      this.showGrid = false;
      this.sharedDataService.setRefreshClearFilterListGridObs(false);
      setTimeout(() => {
        this.showGrid = true;
      }, 200);
    }
  }

  changeCustomDateFilterMode(selectedColumn: ColumnConfigModel) {
    if (selectedColumn.showDateRange) {
      selectedColumn.selectedDateOptions = [];
    }
    else {
      selectedColumn.fromDate = null;
      selectedColumn.toDate = null;
    }
  }

  clearCustomDateFilter(col: any) {
    col.fromDate = null;
    col.toDate = null;
  }

  onGlobalFilter(event: Event) {
    if (this.tableRef) {
      this.tableRef.filterGlobal(this.globalFilter.toString().trim(), 'contains');
    }
  }

  fetchByDotOperator(object: any, key: any) {
    return utility.fetchByDotOperator(object, key);
  }

  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    this._selectedColumns = this.columns.filter(col => val.includes(col));
  }

  applyCustomDateFilter() {
    this.loadData({ rows: 10, first: 0, sortField: null, sortOrder: -1, filters: this.tableRef.filters })
  }

  onRowLinkClick(rowData: any, column: string = null) {
    rowData['hyperLinkColumn'] = column;
    this.hyperlinkClickEvent.emit(rowData);
  }

  onColumnSelection($event) {
    this.columnSelectionEvent.emit(this.selectedColumns);
  }

  refreshGrid() {
    this.refreshGridSubscription = this.sharedDataService.getRefreshParentListGridObs().subscribe((data) => {
      if (data) {
        this.clearFilter();
      }
    });
  }

  onCheckboxChange(rowData, field){
    this.checkboxChangeActionEvent.emit({rowData: rowData, field: field});
  }

  onHeaderCheckboxChange(field, isChecked){
    this.headerCheckboxChangeActionEvent.emit({field: field, isChecked: isChecked});
  }

  lockOrUnlockData(rowData: any){
    this.lockOrUnlockDataEvent.emit(rowData);
  }

  ngOnDestroy() {
    this.refreshGridSubscription?.unsubscribe();
    this.refreshTableFilterSubscription?.unsubscribe();
    this.refreshGoBackActionSubscription?.unsubscribe();
  }

  subscribeTableFilterChanges(){
    this.refreshTableFilterSubscription = this.sharedDataService.getTableFilterDataObs().subscribe((data)=> {
      if(this.tableRef && data){
        this.lastLazyEvent = data.lazyEvent;
        this.tableRef.filters = Object.assign({}, this.lastLazyEvent.filters);
        this.sharedDataService.setTableFilterDataObs(null);
      }
    });
  }

  subscribeGobackToList(){
    this.refreshGoBackActionSubscription = this.sharedDataService.getGoBackActionObs().subscribe((data) => {
      if(data){
        this.isGoBackToList = true;
      }
      else{
        this.isGoBackToList = false;
      }
    });
  }

  showHideRowLevelFilter(){
    this.toggleRowLevelFilter = !this.toggleRowLevelFilter;
  }

}
