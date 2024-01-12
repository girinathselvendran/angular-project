import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {

  private filteredData: any = null;
  private refreshParentListGrid$: BehaviorSubject<boolean | null> = new BehaviorSubject(null as boolean | null);
  private refreshClearFilterListGrid$: BehaviorSubject<boolean | null> = new BehaviorSubject(null as boolean | null);
  private refreshTableFilterData$: BehaviorSubject<any | null> = new BehaviorSubject(null as any | null);
  private refreshTableLastLazyEvent$: BehaviorSubject<any | null> = new BehaviorSubject(null as any | null);
  private refreshGoBackAction$: BehaviorSubject<boolean | null> = new BehaviorSubject(null as boolean | null);

  constructor() { }

  setRefreshParentListGridObs(value: boolean){
    this.refreshParentListGrid$.next(value);
  }

  getRefreshParentListGridObs(): Observable<boolean> {
    return this.refreshParentListGrid$.asObservable();
  }

  addUpdatePageFilterData(value: any){
    this.filteredData = value;
  }

  getPageFilterData(page: any) {
    return this.filteredData ? this.filteredData.page == page ? this.filteredData.lazyEvent : null : null;
  }

  setRefreshClearFilterListGridObs(value: boolean){
    this.refreshClearFilterListGrid$.next(value);
  }

  getRefreshClearFilterListGridObs(): Observable<boolean> {
    return this.refreshClearFilterListGrid$.asObservable();
  }

  setTableFilterDataObs(value: any){
    this.refreshTableFilterData$.next(value);
  }

  getTableFilterDataObs(): Observable<any> {
    return this.refreshTableFilterData$.asObservable();
  }

  setTableLastLazyEventObs(value: any){
    this.refreshTableLastLazyEvent$.next(value);
  }

  getTableLastLazyEventObs(): Observable<any> {
    return this.refreshTableLastLazyEvent$.asObservable();
  }

  setGoBackActionObs(value: boolean){
    this.refreshGoBackAction$.next(value);
  }

  getGoBackActionObs(): Observable<boolean> {
    return this.refreshGoBackAction$.asObservable();
  }
}
