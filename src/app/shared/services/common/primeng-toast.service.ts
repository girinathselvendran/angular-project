import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ToastModel } from '../../models/toast.model';

@Injectable({
  providedIn: 'root'
})
export class PrimengToastService {
  
  private toastMessageObs$: BehaviorSubject<ToastModel | null> = new BehaviorSubject(null as ToastModel | null);

  constructor() { }

  success(message: any, title: any = null){
    const toast: ToastModel = {
      severity: 'success',
      summary: title ?? 'Success',
      detail: message
    }
    this.setToastMessageObs(toast);
  }

  info(message: any, title: any = null){
    const toast: ToastModel = {
      severity: 'info',
      summary: title ?? 'Info',
      detail: message
    }
    this.setToastMessageObs(toast);
  }

  warn(message: any, title: any = null){
    const toast: ToastModel = {
      severity: 'warn',
      summary: title ?? 'Warning',
      detail: message
    }
    this.setToastMessageObs(toast);
  }

  error(message: any, title: any = null){
    const toast: ToastModel = {
      severity: 'error',
      summary: title ?? 'Error',
      detail: message
    }
    this.setToastMessageObs(toast);
  }

  setToastMessageObs(value: ToastModel){
    this.toastMessageObs$.next(value);
  }

  getToastMessageObs(): Observable<any> {
    return this.toastMessageObs$.asObservable();
  }
}
