



import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedTableV2StoreService {

  gettableGridData = new Subject<any>();
  assignGridData = new Subject<any>();
  exportExcel = new Subject<any>();
  resetTableData = new Subject<any>();
  refreshTableData = new Subject<any>();


  constructor() { }

  setGetTableGridData(value: any) {
    this.gettableGridData.next(value);
  }

  setAssignGridData(value: any) {
    this.assignGridData.next(value);
  }

  setExportExcel(value: any) {
    this.exportExcel.next(value);
  }

  setResetTableData(value: any) {
    this.resetTableData.next(value)
  }

  refreshTable(value: any) {
    this.refreshTableData.next(value)
  }
}
