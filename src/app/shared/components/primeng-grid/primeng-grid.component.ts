
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FilterMatchMode, PrimeNGConfig } from 'primeng/api';
import { Table } from 'primeng/table';
import { Subscription } from 'rxjs';
import { utility } from 'src/app/utilities/utility';
import { default as commonMasterData } from '../../../../assets/data/commonMasterData';
import { SharedDataService } from '../../services/common/shared-data.service';
import { ColumnConfigModel } from '../models/column-config.model';

@Component({
  selector: 'app-primeng-grid',
  templateUrl: './primeng-grid.component.html',
  styleUrls: ['./primeng-grid.component.scss'],
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
export class PrimengGridComponent implements OnInit {

  @Input() columns: ColumnConfigModel[] = [];
  @Input() gridData: any[] = [];
  @Input() page: string;
  @Input() hideCheckBoxSelection = false;
  @Input() hideAction = false;
  @Input() hideEditAction = false;
  @Input() hideDeleteAction = false;
  @Input() hideDetailsAction = false;
  @Input() hideSwitchAction = false;
  @Input() showAddButton = false;
  @Input() showRowLink = false;
  @Input() rowLinkField ='';
  @Input() selectedData: any[] =[];
  @Input() totalRecords: number = 0;
  @Input() loading: boolean = false;
  @Input() showDownload = false;
  @Input() showExcelDownload = false;
  @Input() ShowCopy = false;
  @Input() hideClearButton = false;
  @Input() hideColumnSelections = false; 
  @Input() hideFilter = false; 
  @Input() hideSorting = false; 
  @Input() hideGlobalFilter = false; 
  @Input() enablePagination = true; 
  @Input() colorCodeBasedOnStatus = true;
  @Output() deleteDataEvent = new EventEmitter<any>();
  @Output() editDataEvent = new EventEmitter<any>();
  @Output() statusChangeDataEvent = new EventEmitter<any>();
  @Output() detailDataEvent = new EventEmitter<any>();
  @Output() selectedDataEvent = new EventEmitter<any[]>();
  @Output() downloadDataEvent = new EventEmitter<any>();
  @Output() excelDownloadDataEvent = new EventEmitter<any>();
  @Output() copyDataEvent = new EventEmitter<any>();
  @Output() hyperlinkClickEvent = new EventEmitter<any>();
  @Output() columnSelectionEvent = new EventEmitter<ColumnConfigModel[]>();

  @ViewChild('dt') tableRef: Table;
  dateFilterAdvancedOptions: any[] = commonMasterData.dateFilterAdvancedOptions;
  selectedDateFilterOptions: any[] = [];
  globalSearches: any[] = [];
  totalColumns: number = 0;
  globalFilter: any = '';
  _selectedColumns: ColumnConfigModel[] = [];
  globalFilterFields: any[] = [];
  tableData: any[];

  refreshGridSubscription: Subscription;
  showGrid: boolean = true;
  dangerFlag:boolean = false;
  constructor(private sharedDataService: SharedDataService,
    private config: PrimeNGConfig) { }

  ngOnInit(): void {
    this.config.filterMatchModeOptions = {
      text: [
          FilterMatchMode.CONTAINS,
          FilterMatchMode.NOT_CONTAINS,
          FilterMatchMode.EQUALS,
          //FilterMatchMode.NOT_EQUALS
      ],
      numeric: [
          FilterMatchMode.EQUALS,
          FilterMatchMode.NOT_EQUALS,
          FilterMatchMode.LESS_THAN,
          FilterMatchMode.LESS_THAN_OR_EQUAL_TO,
          FilterMatchMode.GREATER_THAN,
          FilterMatchMode.GREATER_THAN_OR_EQUAL_TO
      ],
      date: [
          FilterMatchMode.DATE_IS,
          FilterMatchMode.DATE_IS_NOT,
          FilterMatchMode.DATE_BEFORE,
          FilterMatchMode.DATE_AFTER,
      ]
    };
    this.refreshGrid();
    this._selectedColumns = this.columns;
    this.setGlobalFilters();
  }

  detailData(rowData: any){
    this.detailDataEvent.emit(rowData);
  }

  editData(rowData: any){
    this.editDataEvent.emit(rowData);
  }

  deleteData(rowData: any){
    this.deleteDataEvent.emit(rowData);
  }
  
  onRowSelect(event: any){
    this.selectedDataEvent.emit(this.selectedData);
  }

  onRowUnselect(event: any){
    this.selectedDataEvent.emit(this.selectedData);
  }

  onSelectAll(event: any){
    this.selectedDataEvent.emit(this.selectedData);
  }

  onStatusChangeaData(rowData: any){
    this.statusChangeDataEvent.emit(rowData);
  }

  onRowClick(event: any, rowData: any){
    if(!(event.target.className.toLowerCase() == 'p-inputswitch-slider'
    || event.target.className.toLowerCase() == 'p-button-icon pi pi-pencil'
    || event.target.className.toLowerCase() == 'p-button-icon pi pi-trash'
    || event.target.className.toLowerCase() == 'p-button-icon pi pi-file-excel'
    || event.target.className.toLowerCase() == 'p-button-icon pi pi-download'
    || event.target.className.toLowerCase() == 'p-button-icon pi pi-copy'
    || event.target.className.toLowerCase() == 'p-button-icon pi pi-file-pdf'
    || event.target.nodeName.toLowerCase() == 'a')){
      this.editDataEvent.emit(rowData);
    }
  }

  clearFilter() {
    if(this.tableRef){
      this.globalFilter ='';
      this.tableRef.clear();
      this.showGrid = false;
      setTimeout(() => {
        this.showGrid = true;
      }, 200);
    } 
  }

  changeCustomDateFilterMode(selectedColumn: ColumnConfigModel){
    if(selectedColumn.showDateRange){
      selectedColumn.selectedDateOptions = [];
    }
    else{
      selectedColumn.fromDate = null;
      selectedColumn.toDate = null;
    }
  }

  clearCustomDateFilter(col: ColumnConfigModel){
    col.dateRange = null;
  }

  onGlobalFilter(event: Event) {
    if(this.tableRef){
      this.tableRef.filterGlobal(this.globalFilter, 'contains');
    }
  }

  fetchByDotOperator(object: any, key: any) {
    return utility.fetchByDotOperator(object, key);
  }

  @Input() get selectedColumns(): ColumnConfigModel[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: ColumnConfigModel[]) {
      this._selectedColumns = this.columns.filter(col => val.includes(col));
      this.setGlobalFilters();
  }

  setGlobalFilters(){
    this.globalFilterFields = this._selectedColumns.map(c=> c.field);
    this.totalColumns = this._selectedColumns.length + 
    (this.hideCheckBoxSelection ? 0 : 1) + (this.hideAction ? 0 : 1);
  }

  applyCustomDateFilter(col: ColumnConfigModel){
    
    if(!this.tableData){
      this.gridData.map((item)=> {
        item.createdDate = item.createdDate ?  new Date(item.createdDate) : item.createdDate;
        item.updatedDate = item.createdDate ?  new Date(item.updatedDate) : item.createdDate;
      });
      this.tableData = Object.assign([], this.gridData);
    } 
    let dataToFilter  = Object.assign([], this.tableData);
    if(col.dateRange){
      let fromDate = col.dateRange[0] as Date;
      if(col.dateRange[1]){
        let toDate = col.dateRange[1] as Date;
        toDate.setHours(23, 59, 59);
        dataToFilter = dataToFilter.filter(c=> c.updatedDate >= fromDate && c.updatedDate <= toDate);
        this.gridData = Object.assign([], dataToFilter);
      }else{
        dataToFilter = dataToFilter.filter(c=> c.updatedDate >= fromDate);
        this.gridData = Object.assign([], dataToFilter);
      }
    }
    else{
      this.gridData = Object.assign([], dataToFilter);
    }
  }

  downloadData(rowData: any){
    this.downloadDataEvent.emit(rowData);
  }

  downloadExcelData(rowData: any){
    this.excelDownloadDataEvent.emit(rowData);
  }

  copyData(rowData: any){
    this.copyDataEvent.emit(rowData);
  }

  onRowLinkClick(rowData: any,column:string = null){
    rowData['hyperLinkColumn'] = column;
    this.hyperlinkClickEvent.emit(rowData);
  }

  onColumnSelection($event){
    this.columnSelectionEvent.emit(this.selectedColumns);
  }

  refreshGrid(){
    this.refreshGridSubscription = this.sharedDataService.getRefreshParentListGridObs().subscribe((data)=> {
      if(data){
        this.clearFilter();
      }
    });
  }

  ngOnDestroy(){
    this.refreshGridSubscription?.unsubscribe();
  }

}
