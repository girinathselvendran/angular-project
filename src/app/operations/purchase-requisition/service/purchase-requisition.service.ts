import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ApprovalRequest, PurchaseRequisition } from '../model/purchase-requisition-model';

@Injectable({
  providedIn: 'root'
})
export class PurchaseRequisitionService {
  constructor(private http: HttpClient) { }
  apiUrl: string = environment.hostUrl;

  emailServiceDate = new Subject<any>();

  setEmailServiceDate(value: any) {
    this.emailServiceDate.next(value);
  }
  uploadFile(formData: FormData) {
    return this.http.post(this.apiUrl + 'Shared/FileUpload', formData).pipe(
      map((response) => {
        return response;
      })
    );
  }

  getActiveDepot(userId: number): Observable<any> {
    return this.http
      .get(this.apiUrl + 'PurchaseRequisition/GetActiveDepot', {
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
  getPRStatuses(): Observable<any> {
    return this.http
      .get(this.apiUrl + 'PurchaseRequisition/GetPRStatuses')
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  getPurchaseRequisitionOverView(): Observable<any> {
    return this.http
      .get(this.apiUrl + 'PurchaseRequisition/GetPurchaseRequisitionOverView')
      .pipe(
        map((response) => {
          return response;
        })
      );
  }
  getPRNoByCurrentStatusId(currentStatusId: number): Observable<any> {
    return this.http
      .get(this.apiUrl + 'PurchaseRequisition/GetPRNoByCurrentStatusId', {
        params: {
          currentStatusId: currentStatusId.toString(),
        },
      })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }
  // ?currentStatusId=544

  checkPartCombination(params: any) {
    return this.http
      .get(this.apiUrl + 'PurchaseRequisition/PartCombinationValidCheck', {
        params
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

  getPRPartSpecificationList(prDetailId: number) {
    return this.http
      .get(this.apiUrl + 'PurchaseRequisition/GetPRPartSpecificationList', {
        params: {
          prDetailId: prDetailId.toString(),
        },
      })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }


  getPurchaseRequisitionOutput(PRIds: number[]) {
    
    let params = new HttpParams();
    PRIds.forEach(id => {
      params = params.append('purchaseRequisitionIds', id.toString());
    });

    return this.http
      .get(this.apiUrl + 'PurchaseRequisition/GetPurchaseRequisitionOutput', { params })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }
  getPurchaseRequisitionListServerSide(queryParams: any, companyId: number, userId: number) {
    return this.http
      .get(this.apiUrl + 'PurchaseRequisition/GetPurchaseRequisitionListServerSide', {
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
  getPartType(): Observable<any> {
    return this.http.get(this.apiUrl + 'Store/GetPartType', {}).pipe(
      map((response) => {
        return response;
      })
    );
  }
  getPartCode(partTypeId: any): Observable<any> {
    return this.http
      .get(this.apiUrl + 'Store/GetPartCode', {
        params: {
          PartTypeId: partTypeId,
        },
      })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }
  getPartRateBasedOnPartId(partId: any): Observable<any> {
    return this.http
      .get(this.apiUrl + 'PurchaseRequisition/GetPartRateBasedOnPartId', {
        params: {
          PartId: partId,
        },
      })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  isPartCodeValid(data: any): Observable<any> {
    return this.http.get(this.apiUrl + "PurchaseRequisition/IsPartCodeValId", {
      params: {
        prId: data.prId,
        prDetailId: data.prDetailId,
        partId: data.partId
      },
    })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }
  getPurchaseRequisitionPartsList(userId: number, prId: any): Observable<any> {
    return this.http
      .get(this.apiUrl + 'PurchaseRequisition/GetPurchaseRequisitionPartsList', {
        params: {
          userId: userId.toString(),
          prId: prId,
        },
      })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }



  createPurchaseRequisition(purchaseRequisition: PurchaseRequisition): Observable<any> {
    return this.http.post(this.apiUrl + 'PurchaseRequisition/CreatePurchaseRequisition', purchaseRequisition).pipe(
      map((response) => {
        return response;
      })
    );
  }

  updatePurchaseRequisition(purchaseRequisition: PurchaseRequisition): Observable<any> {
    return this.http.put(this.apiUrl + 'PurchaseRequisition/UpdatePurchaseRequisition', purchaseRequisition).pipe(
      map((response) => {
        return response;
      })
    );
  }
  SendForApproval(approvalRequest: ApprovalRequest): Observable<any> {
    return this.http.put(this.apiUrl + 'PurchaseRequisition/SendForApproval', approvalRequest).pipe(
      map((response) => {
        return response;
      })
    );
  }
  // SendForApproval(purchaseRequisition: PurchaseRequisition): Observable<any> {
  //   return this.http.put(this.apiUrl + 'PurchaseRequisition/SendForApproval', purchaseRequisition).pipe(
  //     map((response) => {
  //       return response;
  //     })
  //   );
  // }
  cancelPR(prNumbers: any, purchaseRequisition: PurchaseRequisition, remarks: any): Observable<any> {
    return this.http.put(this.apiUrl + 'PurchaseRequisition/CancelPR', { prNumbers, purchaseRequisition, remarks }).pipe(
      map((response) => {
        return response;
      })
    );
  }





  ReopenPR(purchaseRequisition: PurchaseRequisition): Observable<any> {
    return this.http.put(this.apiUrl + 'PurchaseRequisition/ReopenPR', purchaseRequisition).pipe(
      map((response) => {
        return response;
      })
    );
  }

  deletePrPart(prDetailId: any): Observable<any> {
    return this.http.get(this.apiUrl + 'PurchaseRequisition/DeletePrPart', {
      params: {
        prDetailId: prDetailId
      }
    }).pipe(
      map((response) => {
        return response;
      })
    );
  }


  sendEmail(tracking: any): Observable<any> {
    return this.http.post(this.apiUrl + "PurchaseRequisition/SendEmail", tracking).pipe(map(response => {
      return response;
    }));
  }
}
