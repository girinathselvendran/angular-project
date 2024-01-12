import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ApprovalRequest, ReopenPO } from '../model/purchase-order-model';

@Injectable({
  providedIn: 'root'
})
export class PurchaseOrderService {
  constructor(private http: HttpClient) { }
  apiUrl: string = environment.hostUrl;

  emailServiceDate = new Subject<any>();
  poSupplierData = new Subject<any>();
  poDepotData = new Subject<any>();
  selectedPORowData = new Subject<any>(); // selected data from main grid
  receivePartDetails = new Subject<any>(); poExchangeRate = new Subject<any>();
  totalPoAmount = new Subject<any>();
  totalAmountInSupplierCurrency = new Subject<any>();

  setEmailServiceDate(value: any) {
    this.emailServiceDate.next(value);
  }
  setPoSupplierData(value: any) {
    this.poSupplierData.next(value);
  }
  setPoDepotData(value: any) {
    this.poDepotData.next(value);
  }
  setSelectedPORowData(value: any) {
    this.selectedPORowData.next(value);
  }
  getReceivePartDetails(value: any) {
    this.receivePartDetails.next(value);
  }
  setPoExchangeRate(value: any) {
    this.poExchangeRate.next(value);
  }
  setTotalPoAmount(value: any) {
    this.totalPoAmount.next(value);
  }
  setTotalAmountInSupplierCurrency(value: any) {
    this.totalAmountInSupplierCurrency.next(value);
  }
  uploadFile(formData: FormData) {
    return this.http.post(this.apiUrl + 'Shared/FileUpload', formData).pipe(
      map((response) => {
        return response;
      })
    );
  }
  getPurchaseOrderOverView(): Observable<any> {
    return this.http
      .get(this.apiUrl + 'PurchaseOrder/GetPurchaseOrderOverView')
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  getActiveDepot(userId: number): Observable<any> {
    return this.http
      .get(this.apiUrl + 'PurchaseOrder/GetActiveDepot', {
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
  getPOStatuses(): Observable<any> {
    return this.http
      .get(this.apiUrl + 'PurchaseOrder/GetPOStatuses')
      .pipe(
        map((response) => {
          return response;
        })
      );
  }
  getPOSources(): Observable<any> {
    return this.http
      .get(this.apiUrl + 'PurchaseOrder/GetPOSources')
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  getSupplierCodes(depotId: any) {
    return this.http
      .get(this.apiUrl + 'PurchaseOrder/GetSupplierCodes', {
        params: {
          depotId
        },
      })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  getTermsAndConditionCodes(): Observable<any> {
    return this.http
      .get(this.apiUrl + 'PurchaseOrder/GetTermsAndConditionCodes')
      .pipe(
        map((response) => {
          return response;
        })
      );
  }
  getTermsAndConditionList(poId: any): Observable<any> {
    return this.http
      .get(this.apiUrl + 'PurchaseOrder/GetTermsAndConditionList', {
        params: {
          poId: poId
        },
      })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  getPOExchangeRate(depotCurrencyId: number, supplierCurrencyId: number): Observable<any> {
    return this.http
      .get(this.apiUrl + 'PurchaseOrder/GetPOExchangeRate', {
        params: {
          depotCurrencyId, supplierCurrencyId
        },
      })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  getAdditionalServiceCodes(): Observable<any> {
    return this.http
      .get(this.apiUrl + 'PurchaseOrder/GetAdditionalServiceCodes')
      .pipe(
        map((response) => {
          return response;
        })
      );
  }
  getAdditionalServiceList(poId: any): Observable<any> {
    return this.http
      .get(this.apiUrl + 'PurchaseOrder/GetAdditionalServiceList', {
        params: {
          poId: poId
        },
      })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }
  deletePOPartDetails(poPartId: any): Observable<any> {
    return this.http
      .get(this.apiUrl + 'PurchaseOrder/DeletePOPartDetails', {
        params: {
          poPartId: poPartId,
        },
      })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  deletePOAdditionalCharge(poAdditionalChargeId: any): Observable<any> {
    return this.http
      .get(this.apiUrl + 'PurchaseOrder/DeletePOAdditionalService', {
        params: {
          poAdditionalServiceId: poAdditionalChargeId,
        },
      })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  deletePOTermsAndCondition(poTermsAndConditionId: any): Observable<any> {
    return this.http
      .get(this.apiUrl + 'PurchaseOrder/DeletePOTermsAndConditions', {
        params: {
          poTermsAndConditionId: poTermsAndConditionId,
        },
      })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }
  cancelPR(payload: any): Observable<any> {
    return this.http.put(this.apiUrl + 'PurchaseOrder/CancelPO', payload).pipe(
      map((response) => {
        return response;
      })
    );
  }

  getPurchaseOrderListServerSide(queryParams: any, companyId: number, userId: number) {
    return this.http
      .get(this.apiUrl + 'PurchaseOrder/GetPurchaseOrderListServerSide', {
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
  isTermsAndConditionCodeValid(poId: any, purchaseOrderTermsAndConditionId: number, termsAndConditionCode: any) {
    return this.http
      .get(this.apiUrl + 'PurchaseOrder/IsTermsAndConditionCodeValid', {
        params: {
          poId: poId,
          purchaseOrderTermsAndConditionId: purchaseOrderTermsAndConditionId,
          termsAndConditionCode: termsAndConditionCode.toString(),

        },
      })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }
  isAdditionalServiceValid(poId: any, additionalServiceId: number, additionalServiceCode: any) {
    return this.http
      .get(this.apiUrl + 'PurchaseOrder/isChargesValid', {
        params: {
          poId: poId,
          additionalServiceId: additionalServiceId,
          additionalServiceCode: additionalServiceCode.toString(),

        },
      })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }
  sendEmail(tracking: any): Observable<any> {
    return this.http.post(this.apiUrl + "PurchaseOrder/SendEmail", tracking).pipe(map(response => {
      return response;
    }));
  }

  getPurchaseOrderOutput(POIds: number[]) {

    let params = new HttpParams();
    POIds.forEach(id => {
      params = params.append('purchaseOrderIds', id.toString());
    });

    return this.http
      .get(this.apiUrl + 'PurchaseOrder/GetPurchaseOrderOutput', { params })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }
  // DropDowns
  getCity(userId: number): Observable<any> {
    return this.http
      .get(this.apiUrl + 'PurchaseOrder/GetActiveCity', {
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
  getPartType(): Observable<any> {
    return this.http.get(this.apiUrl + 'Store/GetPartType', {}).pipe(
      map((response) => {
        return response;
      })
    );
  }
  getPartCode(partTypeId: any, supplierId: any): Observable<any> {
    return this.http
      .get(this.apiUrl + 'PurchaseOrder/GetPartCode', {
        params: {
          partTypeId, supplierId
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
  getPOPartSpecificationList(poId: number) {
    return this.http
      .get(this.apiUrl + 'PurchaseOrder/GetPOPartSpecificationList', {
        params: {
          poId: poId.toString(),
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


  getPurchaseOrderPartsList(userId: number, poId: any): Observable<any> {
    return this.http
      .get(this.apiUrl + 'PurchaseOrder/GetPurchaseOrderPartsList', {
        params: {
          userId: userId.toString(),
          poId: poId,
        },
      })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }
  SendForApproval(approvalRequest: ApprovalRequest): Observable<any> {
    return this.http.put(this.apiUrl + 'PurchaseOrder/SendForApproval', approvalRequest).pipe(
      map((response) => {
        return response;
      })
    );
  }
  ReopenPO(reopenPO: ReopenPO): Observable<any> {
    return this.http.put(this.apiUrl + 'PurchaseOrder/ReopenPO', reopenPO).pipe(
      map((response) => {
        return response;
      })
    );
  }
  createPurchaseOrder(purchaseOrder: any): Observable<any> {
    return this.http.post(this.apiUrl + 'PurchaseOrder/CreatePurchaseOrder', purchaseOrder).pipe(
      map((response) => {
        return response;
      })
    );
  }
  updatePurchaseOrder(purchaseOrder: any): Observable<any> {
    return this.http.put(this.apiUrl + 'PurchaseOrder/UpdatePurchaseOrder', purchaseOrder).pipe(
      map((response) => {
        return response;
      })
    );
  }
}
