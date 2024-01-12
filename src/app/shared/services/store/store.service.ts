import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class StoreService {
  createRights = new Subject<boolean>();
  editRights = new Subject<boolean>();
  viewRights = new Subject<boolean>();
  disableForm = new Subject<boolean>();
  resetForm = new Subject<boolean>();
  onChangeActive = new Subject<string>();
  refreshTotalTable = new Subject<boolean>();
  code = new Subject<string>();
  codeId = new Subject<any>();
  patchValue = new Subject<any>();
  patchErrorValue = new Subject<any>();
  rowDetails = new Subject<any>();
  enableLogout = new Subject<any>();

  constructor() { }

  setCreateRights(value: boolean) {
    this.createRights.next(value);
  }
  setEditRights(value: boolean) {
    this.editRights.next(value);
  }
  setViewRights(value: boolean) {
    this.viewRights.next(value);
  }
  setDisableForm(value: boolean) {
    this.disableForm.next(value);
  }
  setResetForm(value: boolean) {
    this.resetForm.next(value);
  }

  setCodeValue(value: string) {
    this.code.next(value)
  }
  setCodeIdValue(value: string) {
    this.codeId.next(value)
  }

  setOnChangeActive(value: any) {
    this.onChangeActive.next(value)
  }

  setRefreshTotalTable(value: any) {
    this.refreshTotalTable.next(value)
  }

  setPatchValue(value: any) {
    this.patchValue.next(value)
  }
  setPatchErrorValue(value: any) {
    this.patchErrorValue.next(value)
  }
  getTableRowDetails(value:any){
    this.rowDetails.next(value)
  }
  getEnableLogout(value:any){
    this.enableLogout.next(value)
  }

}
