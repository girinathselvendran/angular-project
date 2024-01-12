import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StockMaintenanceService {
  apiUrl: string = environment.hostUrl;
  constructor(private http: HttpClient) { }

  emailServiceDate = new Subject<any>();
  setEmailServiceDate(value: any) {
    this.emailServiceDate.next(value);
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.log("API error", error);
    console.log("API error.status", error.status);

    if (error.status === 401) {
      console.log('Unauthorized - Redirect to login or handle accordingly.');
    } else if (error.status === 404) {
      console.log('Not Found - Handle accordingly.');
    } else {
      console.log('Other Error - Handle accordingly.');
    }

    return throwError('An error occurred. Please try again later.');
  }


  getStockMaintenanceOverView(userId: number): Observable<any> {
    return this.http
      .get(this.apiUrl + 'StockMaintenance/GetStockMaintenanceOverView', {
        params: {
          userId: userId.toString(),
        }
      })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  // graphs
  getStoreGraph(queryParams: any, companyId: number, userId: number): Observable<any> {
    return this.http
      .get<any>(this.apiUrl + 'StockMaintenance/GetStockMaintenanceGraph', {
        params: {
          companyId: companyId.toString(),
          userId: userId.toString(),
          queryParams: JSON.stringify(queryParams),
        },
      })
      .pipe(
        map((response: any) => {
          console.log('Response', response);
          return response;
        }),
        catchError(this.handleError)
      );
  }

  getActiveDepot(userId: number): Observable<any> {
    return this.http
      .get(this.apiUrl + 'StockMaintenance/GetActiveDepot', {
        params: {
          userId: userId.toString(),
        },
      })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }
  getActiveStore(depotIds: number[]): Observable<any> {
    let params = new HttpParams();
    depotIds.forEach(id => {
      params = params.append('depotIds', id.toString());
    });
    return this.http
      .get(this.apiUrl + 'StockMaintenance/GetActiveStore', { params })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }
  getZoneByStore(storeIds: number[]): Observable<any> {
    let params = new HttpParams();
    storeIds.forEach(id => {
      params = params.append('storeIds', id.toString());
    });
    return this.http
      .get(this.apiUrl + 'StockMaintenance/GetZoneByStore', { params })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }
  getBinByZone(zoneIds: number[]): Observable<any> {
    let params = new HttpParams();
    zoneIds.forEach(id => {
      params = params.append('zoneIds', id.toString());
    });
    return this.http
      .get(this.apiUrl + 'StockMaintenance/GetBinByZone', { params })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }
  getPartType(): Observable<any> {
    return this.http.get(this.apiUrl + 'Store/GetPartType', {}).pipe(
      map((response) => {
        return response;
      })
    );
  }



  getStockMaintenanceListServerSide(queryParams: any, companyId: number, userId: number) {
    return this.http
      .get(this.apiUrl + 'StockMaintenance/GetStockMaintenanceServerSide', {
        params: {
          companyId: companyId.toString(),
          userId: userId.toString(),
          queryParams: JSON.stringify(queryParams),
        },
      })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  getPartSpecificationList(partId: number) {
    return this.http
      .get(this.apiUrl + 'part/GetPartSpecificationList', {
        params: {
          partId: partId.toString(),
        },
      })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }
}
