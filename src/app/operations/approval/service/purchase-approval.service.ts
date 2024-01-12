import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ApprovalRequest, CancelRejection, RejectionPopup } from '../model/approval-model';

@Injectable({
  providedIn: 'root'
})
export class PurchaseApprovalService {
  constructor(private http: HttpClient) { }
  apiUrl: string = environment.hostUrl;

  storeDate = new Subject<any>();
  emailServiceDate = new Subject<any>();

  setEmailServiceDate(value: any) {
    this.emailServiceDate.next(value);
  }

  setStoreDate(value: any) {
    this.storeDate.next(value);
  }

  uploadFile(formData: FormData) {
    return this.http.post(this.apiUrl + 'Shared/FileUpload', formData).pipe(
      map((response) => {
        return response;
      })
    );
  }

  sendEmail(tracking: any): Observable<any> {
    return this.http.post(this.apiUrl + "PurchaseApproval/SendEmail", tracking).pipe(map(response => {
      return response;
    }));
  }


  getOverviewCount(userId: number, companyId: string, personaId: string): Observable<any> {
    return this.http
      .get(this.apiUrl + 'PurchaseApproval/GetOverviewCount', {
        params: {
          companyId: companyId.toString(),
          userId: userId.toString(),
          personaId: personaId.toString(),
        },
      })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  GetPurchaseApprovalListServerSide(
    queryParams: any,
    companyId: number,
    userId: number
  ) {
    return this.http
      .get(this.apiUrl + 'PurchaseApproval/GetPurchaseApprovalListServerSide', {
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

  getApprovalType(): Observable<any> {
    return this.http
      .get(this.apiUrl + 'PurchaseApproval/GetApprovalTypes')
      .pipe(
        map((response) => {
          return response;
        })
      );
  }


  handleApproval(approvalPR: ApprovalRequest): Observable<any> {
    return this.http.put(this.apiUrl + 'PurchaseApproval/ApproveRecord', approvalPR).pipe(
      map((response) => {
        return response;
      })
    );
  }
  handleUpdateApproval(approvalPR: ApprovalRequest): Observable<any> {
    return this.http.put(this.apiUrl + 'PurchaseApproval/UpdateApproveRecord', approvalPR).pipe(
      map((response) => {
        return response;
      })
    );
  }
  rejectRecord(rejectRecords: RejectionPopup): Observable<any> {
    return this.http.put(this.apiUrl + 'PurchaseApproval/RejectRecord', rejectRecords).pipe(
      map((response) => {
        return response;
      })
    );
  }
  cancelRejectRecord(cancelRejectRecords: CancelRejection): Observable<any> {
    return this.http.put(this.apiUrl + 'PurchaseApproval/CancelRejectRecord', cancelRejectRecords).pipe(
      map((response) => {
        return response;
      })
    );
  }
}
