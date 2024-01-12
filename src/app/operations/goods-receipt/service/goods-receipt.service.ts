import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GoodsReceipt, StorePartAllocationDetails } from '../model/goods-receipt-model';
@Injectable({
  providedIn: 'root',
})
export class GoodsReceiptService {
  constructor(private http: HttpClient) { }
  apiUrl: string = environment.hostUrl;




  private partDetailsDataSubject = new BehaviorSubject<any[]>([]);
  partDetailData$: Observable<any[]> = this.partDetailsDataSubject.asObservable();

  setPartDetailsData(data: any[]) {
    this.partDetailsDataSubject.next(data);
  }



  getGoodsReceiptOverView(): Observable<any> {
    return this.http
      .get(this.apiUrl + 'GoodsReceipt/GetGoodsReceiptOverView')
      .pipe(
        map((response) => {
          return response;
        })
      );
  }
  getPONoByPending() {
    return this.http.get(this.apiUrl + 'GoodsReceipt/GetPONoByPending')
      .pipe(
        map((response) => {
          return response;
        })
      );
  }
  getPONoBySubmitted() {
    return this.http.get(this.apiUrl + 'GoodsReceipt/GetPONoBySubmitted')
      .pipe(
        map((response) => {
          return response;
        })
      );
  }
  getSupplier() {
    return this.http.get(this.apiUrl + 'GoodsReceipt/GetSupplier')
      .pipe(
        map((response) => {
          return response;
        })
      )
  }
  getStoreNameDropDown(partId: number): Observable<any> {
    return this.http.get(this.apiUrl + 'GoodsReceipt/GetStoreName', {
      params: {
        partId: partId.toString(),
      },
    })
      .pipe(
        map((response) => {
          return response;
        })
      )
  }
  getAllActiveStoreNameDropDown(): Observable<any> {
    return this.http.get(this.apiUrl + 'GoodsReceipt/GetAllActiveStoreNameDropDown')
      .pipe(
        map((response) => {
          return response;
        })
      )
  }
  getStoreZoneDropDown(storeId: number): Observable<any> {
    return this.http.get(this.apiUrl + 'GoodsReceipt/GetZoneName', {
      params: {
        storeId: storeId.toString(),
      },
    })
      .pipe(
        map((response) => {
          return response;
        })
      )
  }

  getStoreBinDropDown(storeZoneDetailId: number): Observable<any> {
    return this.http.get(this.apiUrl + 'GoodsReceipt/GetBinName', {
      params: {
        storeZoneDetailId: storeZoneDetailId.toString(),
      },
    })
      .pipe(
        map((response) => {
          return response;
        })
      )
  }
  getStorePartAllocationList(partId: number, depotId: any): Observable<any> {
    return this.http.get(this.apiUrl + 'GoodsReceipt/GetStorePartAllocationList', {
      params: {
        partId: partId.toString(),
        depotId: depotId.toString(),
      },
    })
      .pipe(
        map((response) => {
          return response;
        })
      )
  }
  getActiveDepot(userId: number): Observable<any> {
    return this.http
      .get(this.apiUrl + 'GoodsReceipt/GetActiveDepot', {
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

  getPartDetailsFromPurchaseOrder(purchaseOrderId: number): Observable<any> {
    return this.http
      .get(this.apiUrl + 'GoodsReceipt/getPartDetailsFromPurchaseOrder', {
        params: {
          purchaseOrderId,
        },
      })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  goodsReceiptNo() {
    return this.http.get(this.apiUrl + 'GoodsReceipt/GoodsReceiptNo')
      .pipe(
        map((response) => {
          return response;
        })
      )
  }
  goodsReceiptType() {
    // alert('ok')
    return this.http.get(this.apiUrl + 'GoodsReceipt/GoodsReceiptType')
      .pipe(
        map((response) => {
          return response;
        })
      )
  }
  goodsReceiptCategory() {
    return this.http.get(this.apiUrl + 'GoodsReceipt/GoodsReceiptCategory')
      .pipe(
        map((response) => {
          return response;
        })
      )
  }

  getGoodsReceiptListServerSide(currentCard: number) {

    return this.http.get(this.apiUrl + 'GoodsReceipt/GetGoodsReceiptListServerSide', {
      params: {
        statusId: currentCard,
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
      .get(this.apiUrl + 'Part/GetPartSpecificationList', {
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

  updateStorePartAllocation(storePartAllocationDetails: StorePartAllocationDetails): Observable<any> {
    console.log('fgfgfg ', storePartAllocationDetails);

    return this.http.put(this.apiUrl + 'GoodsReceipt/UpdateStorePartAllocation', storePartAllocationDetails).pipe(
      map((response) => {
        return response;
      })
    );
  }

  CreateGoodsReceipt(goodsReceipt: GoodsReceipt): Observable<any> {
    return this.http.post(this.apiUrl + 'GoodsReceipt/CreateGoodsReceipt', goodsReceipt).pipe(
      map((response) => {
        return response;
      })
    );
  }
  
  createStorePartAllocation(storePartAllocationDetails: StorePartAllocationDetails): Observable<any> {
    console.log('fgfgfg createStorePartAllocation', storePartAllocationDetails);

    return this.http.put(this.apiUrl + 'GoodsReceipt/CreateStorePartAllocation', storePartAllocationDetails).pipe(
      map((response) => {
        return response;
      })
    );
  }
}
