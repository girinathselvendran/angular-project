import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ConfirmDialogActionModel, ConfirmDialogModel } from '../../models/confirm-dialog.model';

@Injectable({
  providedIn: 'root'
})
export class PrimengConfirmDialogService {

  private confirmDialogObs$: BehaviorSubject<ConfirmDialogModel | null> = new BehaviorSubject(null as ConfirmDialogModel | null);
  private confirmDialogActionObs$: BehaviorSubject<ConfirmDialogActionModel | null> = new BehaviorSubject(null as ConfirmDialogActionModel | null);

  private pendingChangesConfirmDialogObs$: BehaviorSubject<boolean | null> = new BehaviorSubject(null as boolean | null);
  private pendingChangesConfirmDialogActionObs$: BehaviorSubject<ConfirmDialogActionModel | null> = new BehaviorSubject(null as ConfirmDialogActionModel | null);

  constructor() { }

  confirm(value: ConfirmDialogModel){
    value.header = value.header ? value.header : 'Confirmation';
    this.setConfirmDialogObs(value);
  }

  pendingChangesconfirm(){
    this.setPendingChangesConfirmDialogObs();
  }

  setConfirmDialogObs(value: ConfirmDialogModel){
    this.confirmDialogObs$.next(value);
  }

  getConfirmDialogObs(): Observable<any> {
    return this.confirmDialogObs$.asObservable();
  }

  setConfirmDialogActionObs(value: ConfirmDialogActionModel) {
    this.confirmDialogActionObs$.next(value);
  }
  
  getConfirmDialogActionObs(): Observable<any> {
    return this.confirmDialogActionObs$.asObservable();
  }


  setPendingChangesConfirmDialogObs(){
    this.pendingChangesConfirmDialogObs$.next(true);
  }

  getPendingChangesConfirmDialogObs(): Observable<any> {
    return this.pendingChangesConfirmDialogObs$.asObservable();
  }

  setPendingChangesConfirmDialogActionObs(value: ConfirmDialogActionModel) {
    this.pendingChangesConfirmDialogActionObs$.next(value);
  }
  
  getPendingChangesConfirmDialogActionObs(): Observable<any> {
    return this.pendingChangesConfirmDialogActionObs$.asObservable();
  }

}
