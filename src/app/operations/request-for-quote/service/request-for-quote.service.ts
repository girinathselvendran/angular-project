import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ApprovalRequest, ReopenRFQ, RequestForQuote } from '../model/request-for-quote_model';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class RequestForQuoteService {

  apiUrl: string = environment.hostUrl;
  constructor(private http: HttpClient) { }

  storeDate = new Subject<any>();
  emailServiceDate = new Subject<any>();

  setEmailServiceDate(value: any) {
    this.emailServiceDate.next(value);
  }


  private supplierDataSubject = new BehaviorSubject<any[]>([]);
  supplierData$: Observable<any[]> = this.supplierDataSubject.asObservable();

  setSupplierData(newData: any[]) {
    const existingData = this.supplierDataSubject.value;

    // Merge existing data with new data, avoiding duplicates
    const mergedData = this.mergeData(existingData, newData);

    // Update the BehaviorSubject with the merged data
    this.supplierDataSubject.next(mergedData);
  }

  private mergeData(existingData: any[], newData: any[]): any[] {
    const uniqueCombinationSet = new Set();

    // Add existing data to the set
    existingData.forEach(item => {
      const combinationKey = `${item.supplierId}_${item.tempUniqValue}_${item.partId}`;
      uniqueCombinationSet.add(combinationKey);
    });

    // Add new data to the set if the combination is not already present
    newData.forEach(item => {
      const combinationKey = `${item.supplierId}_${item.tempUniqValue}_${item.partId}`;
      if (!uniqueCombinationSet.has(combinationKey)) {
        existingData.push(item);
        uniqueCombinationSet.add(combinationKey);
      }
    });

    return existingData;
  }


  deleteSupplierDataByUniqueValue(tempUniqValueToDelete: string) {
    const existingData = this.supplierDataSubject.value;
    const updatedData = existingData.filter(item => item.tempUniqValue !== tempUniqValueToDelete);
    this.supplierDataSubject.next(updatedData);
  }
  
  private supplierGridDataSubject = new BehaviorSubject<any[]>([]);
  supplierGridData$: Observable<any[]> = this.supplierGridDataSubject.asObservable();

  setSupplierGridData(data: any[]) {
    this.supplierGridDataSubject.next(data);
  }


  private partDetailsDataSubject = new BehaviorSubject<any[]>([]);
  partDetailData$: Observable<any[]> = this.partDetailsDataSubject.asObservable();

  setPartDetailsData(data: any[]) {
    this.partDetailsDataSubject.next(data);
  }


  private partIdSubject = new BehaviorSubject<number>(0);
  partId$: Observable<number> = this.partIdSubject.asObservable();

  setPartId(partId: number) {
    this.partIdSubject.next(partId);
  }


  private tempUniqValueSubject = new BehaviorSubject<number>(0);
  tempUniqValue$: Observable<number> = this.tempUniqValueSubject.asObservable();

  setTempUniqValue(tempUniqValue: number) {
    this.tempUniqValueSubject.next(tempUniqValue);
  }


  private supplierDropDownDataSubject = new BehaviorSubject<any[]>([]);
  supplierDropDownData$: Observable<any[]> = this.supplierDropDownDataSubject.asObservable();

  setSupplierDropdownData(data: any[]) {
    this.supplierDropDownDataSubject.next(data);
  }

  private uniqueIdCounter = 0;

  generateUniqueId(): string {
    const timestamp = new Date().getTime();
    const uniqueId = `${timestamp}_${uuidv4()}`;
    return uniqueId;
  }

  getRequestForQuoteStatuses(): Observable<any> {
    return this.http
      .get(this.apiUrl + 'RequestForQuote/GetRequestForQuoteStatuses')
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  getRequestForQuoteOverView(): Observable<any> {
    return this.http
      .get(this.apiUrl + 'RequestForQuote/GetRequestForQuoteOverView')
      .pipe(
        map((response) => {
          return response;
        })
      );
  }
  getRequestForQuoteNoByCurrentStatusId(currentStatusId: number): Observable<any> {
    return this.http
      .get(this.apiUrl + 'RequestForQuote/GetRequestForQuoteNoByCurrentStatusId', {
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

  getRFQPartDetailsByRequestForQuoteIds(requestForQuoteIds: number[]): Observable<any> {
    const params = new HttpParams().set('requestForQuoteIds', requestForQuoteIds.join(','));

    return this.http
      .get(this.apiUrl + 'RequestForQuote/GetRFQPartDetailsByRequestForQuoteId', { params })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }


  getActiveDepot(userId: number): Observable<any> {
    return this.http
      .get(this.apiUrl + 'RequestForQuote/GetActiveDepot', {
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

  getRFQSupplierDetailsByRfqPartDetailId(requestForQuotePartDetailId: any) {
    return this.http
      .get(this.apiUrl + 'RequestForQuote/GetRFQSupplierDetails', {
        params: {
          requestForQuotePartDetailId: requestForQuotePartDetailId.toString(),
        },
      })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  getSupplierByPartId(partId: number): Observable<any> {
    return this.http
      .get(this.apiUrl + 'RequestForQuote/GetSupplierByPartId', {
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


  getRequestForQuoteSources(): Observable<any> {
    return this.http
      .get(this.apiUrl + 'RequestForQuote/GetRequestForQuoteSources')
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  getRFQCity(): Observable<any> {
    return this.http
      .get(this.apiUrl + 'RequestForQuote/GetRFQCity')
      .pipe(
        map((response) => {
          return response;
        })
      );
  }
  getRequestForQuoteOutput(PRIds: number[]) {
    // Convert array to comma-separated string using HttpParams

    let params = new HttpParams();
    PRIds.forEach(id => {
      params = params.append('requestForQuoteIds', id.toString());
    });

    return this.http
      .get(this.apiUrl + 'RequestForQuote/GetRequestForQuoteOutput', { params })
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
  getRequestForQuotePartSpecification(rfqDetailId: number) {
    return this.http
      .get(this.apiUrl + 'RequestForQuote/GetRequestForQuotePartSpecificationList', {
        params: {
          rfqDetailId: rfqDetailId.toString(),
        },
      })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  getRequestForQuoteListServerSide(queryParams: any, companyId: number, userId: number) {
    return this.http
      .get(this.apiUrl + 'RequestForQuote/GetRequestForQuoteListServerSide', {
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

  createRequestForQuote(requestForQuote: RequestForQuote): Observable<any> {
    return this.http.post(this.apiUrl + 'RequestForQuote/CreateRequestForQuote', requestForQuote).pipe(
      map((response) => {
        return response;
      })
    );
  }

  updateRequestForQuote(requestForQuote: RequestForQuote): Observable<any> {

    return this.http.put(this.apiUrl + 'RequestForQuote/UpdateRequestForQuote', requestForQuote).pipe(
      map((response) => {
        return response;
      })
    );
  }
  sendEmail(tracking: any): Observable<any> {
    return this.http.post(this.apiUrl + "RequestForQuote/SendEmail", tracking).pipe(map(response => {
      return response;
    }));
  }
  uploadFile(formData: FormData) {
    return this.http.post(this.apiUrl + 'Shared/FileUpload', formData).pipe(
      map((response) => {
        return response;
      })
    );
  }

  getRFQSupplierDetails(requestForQuotePartDetailId: any): Observable<any> {
    return this.http
      .get(this.apiUrl + 'RequestForQuote/GetRFQSupplierDetails', {
        params: {
          requestForQuotePartDetailId: requestForQuotePartDetailId,
        },
      })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }
  getRFQPartDetailsByRFQId(requestForQuoteId: any): Observable<any> {
    return this.http
      .get(this.apiUrl + 'RequestForQuote/GetRFQPartDetailsByRequestForQuoteId', {
        params: {
          requestForQuoteId: requestForQuoteId,
        },
      })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }
  sendForApproval(approvalRequest: ApprovalRequest): Observable<any> {
    return this.http.put(this.apiUrl + 'RequestForQuote/SendForApproval', approvalRequest).pipe(
      map((response) => {
        return response;
      })
    );
  }

  sendForApprovalInForm(requestForQuoteId: number, rfqNo: string): Observable<any> {
    return this.http
      .get(this.apiUrl + 'RequestForQuote/SendForApprovalInForm', {
        params: {
          requestForQuoteId, rfqNo
        },
      })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  reopenRequestForQuote(reopenRFQ: ReopenRFQ): Observable<any> {
    return this.http.put(this.apiUrl + 'RequestForQuote/ReopenRequestForQuote', reopenRFQ).pipe(
      map((response) => {
        return response;
      })
    );
  }
  cancelRequestForQuote(requestForQuoteNo: any, requestForQuote: RequestForQuote, remarks: any): Observable<any> {
    

    return this.http.put(this.apiUrl + 'RequestForQuote/CancelRequestForQuote', { requestForQuoteNo, requestForQuote, remarks }).pipe(
      map((response) => {
        return response;
      })
    );
  }
  sendRequestForQuote(requestForQuotes: any, requestForQuoteNo: any): Observable<any> {
    return this.http.put(this.apiUrl + 'RequestForQuote/SendRequestForQuote', { requestForQuotes, requestForQuoteNo }).pipe(
      map((response) => {
        return response;
      })
    );
  }
  getRFQSupplierDetailsByRFQId(requestForQuoteId: any): Observable<any> {
    return this.http
      .get(this.apiUrl + 'RequestForQuote/GetRFQSupplierDetailsByRFQId', {
        params: {
          requestForQuoteId: requestForQuoteId,
        },
      })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }
  getRFQPartDetailsByRequestForQuoteId(requestForQuoteId: number, supplierId: number): Observable<any> {
    return this.http
      .get(this.apiUrl + 'RequestForQuote/GetRFQPartDetailsByRFQId', {
        params: {
          requestForQuoteId: requestForQuoteId,
          supplierId: supplierId,
        }
      })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }
  updateRequestForQuoteSupplier(requestForQuoteSupplierDetails: any): Observable<any> {

    return this.http.put(this.apiUrl + 'RequestForQuote/UpdateRequestForQuoteSupplier', requestForQuoteSupplierDetails).pipe(
      map((response) => {
        return response;
      })
    );
  }
  updateQuoteOrderPartDetails(quoteOrderPartDetails: any): Observable<any> {

    return this.http.put(this.apiUrl + 'RequestForQuote/UpdateQuoteOrderPartDetails', quoteOrderPartDetails).pipe(
      map((response) => {
        return response;
      })
    );
  }
  deleteSupplierDetails(supplierDetailIds: any): Observable<any> {
    return this.http
      .get(this.apiUrl + 'RequestForQuote/DeleteSupplierDetails', {
        params: {
          supplierDetailIds: supplierDetailIds,
        },
      })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }
  getSupplierComparison(requestForQuotePartDetailId: number): Observable<any> {
    return this.http
      .get(this.apiUrl + 'RequestForQuote/GetSupplierComparison', {
        params: {
          requestForQuotePartDetailId: requestForQuotePartDetailId,
        }
      })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }
}
