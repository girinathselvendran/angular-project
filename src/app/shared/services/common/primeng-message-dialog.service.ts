import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MesssgeDialogModel } from '../../models/confirm-dialog.model';
import { Seviority } from '../../enum/common';

@Injectable({
  providedIn: 'root'
})
export class PrimengMessageDialogService {
  
  private dialogMessageObs$: BehaviorSubject<MesssgeDialogModel | null> = new BehaviorSubject(null as MesssgeDialogModel | null);
  private okConfirmObs$: BehaviorSubject<boolean | null> = new BehaviorSubject(null as boolean | null);

  constructor() { }

  success(message: string, header: string = ''){
    const dialogMessage: MesssgeDialogModel = {
      message: message,
      header: header,
      severity: Seviority.success
    };
    this.setMessageObs(dialogMessage);
  }

  info(message: string, header: string = ''){
    const dialogMessage: MesssgeDialogModel = {
      message: message,
      header: header,
      severity: Seviority.info
    };
    this.setMessageObs(dialogMessage);
  }

   warn(message: string, header: string = ''){
    const dialogMessage: MesssgeDialogModel = {
      message: message,
      header: header,
      severity: Seviority.warn
    };
    this.setMessageObs(dialogMessage);
  }

  error(message: string, header: string = ''){
    const dialogMessage: MesssgeDialogModel = {
      message: message,
      header: header,
      severity: Seviority.error
    };
    this.setMessageObs(dialogMessage);
  }

  setMessageObs(value: MesssgeDialogModel){
    this.dialogMessageObs$.next(value);
  }

  getMessageObs(): Observable<any> {
    return this.dialogMessageObs$.asObservable();
  }

  setOkConfirmObs(value: boolean){
    this.okConfirmObs$.next(value);
  }

  // geOkConfirmObs(): Observable<boolean> {
  //   //return this.okConfirmObs$.asObservable();
  //   return null;
  // }
  
}
