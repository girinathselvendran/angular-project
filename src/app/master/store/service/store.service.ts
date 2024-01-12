import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { StorePartMapping } from '../models/part-mapping.model';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  constructor(private http: HttpClient) { }
  apiUrl: string = environment.hostUrl;

  // Create Store Part Mapping
  createStorePartMapping(storePartMapping: StorePartMapping): Observable<any> {
    return this.http
      .post(this.apiUrl + 'Store/CreateStorePartMapping', storePartMapping)
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  // update Store Part Mapping
  updateStorePartMapping(storePartMapping: StorePartMapping): Observable<any> {
    return this.http
      .put(this.apiUrl + 'Store/UpdateStorePartMapping', storePartMapping)
      .pipe(
        map((response) => {
          return response;
        })
      );
  }
  // get Store Part Mapping list
  getPartMappingList(storeId: number) {
    return this.http
      .get(this.apiUrl + 'Store/GetStorePartMappingList', {
        params: {
          storeId: storeId,
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

  getStoreListServerSide(queryParams: any, companyId: number, userId: number) {
    return this.http
      .get(this.apiUrl + 'Store/GetStoreListServerSide', {
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

  checkCombinationMapping(params: any) {
    return this.http
      .get(this.apiUrl + 'Store/StorePartMappingCombinationValidCheck', {
        params
      })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  deleteStorePartMappingById(mapping: any): Observable<any> {
    return this.http
      .post(this.apiUrl + 'Store/DeleteStorePartMappingById', mapping)
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  getActiveDepot(userId: number): Observable<any> {
    return this.http
      .get(this.apiUrl + 'Store/GetActiveDepot', {
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
  getStoreKeeperDetails(userId: number, parentStoreId: any): Observable<any> {
    return this.http
      .get(this.apiUrl + 'Store/GetStoreKeeperDetails', {
        params: {
          userId: userId.toString(),
          StoreId: parentStoreId,
        },
      })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }
  getZoneDetails(userId: number, parentStoreId: any): Observable<any> {
    return this.http
      .get(this.apiUrl + 'Store/GetZoneDetails', {
        params: {
          userId: userId.toString(),
          StoreId: parentStoreId
        },
      })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }
  getBinDetails(userId: number, storeZoneDetailId: any): Observable<any> {
    return this.http
      .get(this.apiUrl + 'Store/GetBinDetails', {
        params: {
          userId: userId.toString(),
          StoreZoneDetailId: storeZoneDetailId
        },
      })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }
  getZoneCode(StoreId: number): Observable<any> {
    return this.http
      .get(this.apiUrl + 'Store/GetZoneCode', {
        params: {
          StoreId: StoreId.toString(),
        },
      })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }
  getBinCode(StoreId: number, storeZoneDetailId: any): Observable<any> {
    return this.http
      .get(this.apiUrl + 'Store/GetBinCode', {
        params: {
          StoreId: StoreId.toString(),
          storeZoneDetailId: storeZoneDetailId,
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

  createStore(store: any): Observable<any> {
    return this.http.post(this.apiUrl + 'Store/CreateStore', store).pipe(
      map((response) => {
        return response;
      })
    );
  }

  updateStore(store: any): Observable<any> {
    return this.http.put(this.apiUrl + 'Store/UpdateStore', store).pipe(
      map((response) => {
        return response;
      })
    );
  }

  createZoneBin(store: any): Observable<any> {
    return this.http
      .post(this.apiUrl + 'Store/CreateZoneBin      ', store)
      .pipe(
        map((response) => {
          return response;
        })
      );
  }
  updateZoneBin(store: any): Observable<any> {
    return this.http.put(this.apiUrl + 'Store/UpdateZoneBin', store).pipe(
      map((response) => {
        return response;
      })
    );
  }

  createStoreKeeper(store: any): Observable<any> {
    return this.http.post(this.apiUrl + 'Store/CreateStoreKeeper', store).pipe(
      map((response) => {
        return response;
      })
    );
  }
  updateStoreKeeper(store: any): Observable<any> {
    return this.http.put(this.apiUrl + 'Store/UpdateStoreKeeper', store).pipe(
      map((response) => {
        return response;
      })
    );
  }
  deleteStoreKeeper(StorekeeperInfoId: any): Observable<any> {
    return this.http
      .get(this.apiUrl + 'Store/DeleteStoreKeeper', {
        params: {
          StorekeeperInfoId: StorekeeperInfoId,
        },
      })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }
  deleteZone(StoreZoneDetailId: any): Observable<any> {
    return this.http.get(this.apiUrl + 'Store/DeleteZone', {
      params: {
        StoreZoneDetailId: StoreZoneDetailId
      }
    }).pipe(
      map((response) => {
        return response;
      })
    );
  }
  deleteBin(StoreBinDetailId: any): Observable<any> {
    return this.http.get(this.apiUrl + 'Store/DeleteBin', {
      params: {
        StoreBinDetailId: StoreBinDetailId
      }
    }).pipe(
      map((response) => {
        return response;
      })
    );
  }

  isStoreKeeperDesignationCombinationValid(storeKeeper: any, designation: any, storekeeperInfoId: any, storeId: any): Observable<any> {
    return this.http
      .get(
        this.apiUrl + "Store/IsStoreKeeperDesignationCombinationValid",
        {
          params: {
            storeKeeper,
            designation,
            storekeeperInfoId,
            storeId
          }
        }
      )
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  // Duplicate Validation
  isCodeValid(store: any): Observable<any> {
    return this.http
      .post(
        this.apiUrl + 'Store/DuplicateStoreCodeCheck',
        store,
        store.storeCode
      )
      .pipe(
        map((response) => {
          return response;
        })
      );
  }
  isBinCodeValid(store: any): Observable<any> {
    return this.http
      .post(
        this.apiUrl + "Store/DuplicateBinCodeCheck",
        {
          StoreZoneDetailId: store.zoneId,
          BinCode: store.binCode,
          StoreBinDetailId: store.binId
        }
      )
      .pipe(
        map((response) => {
          return response;
        })
      );
  }
  deleteAdditionalCharges(AdditionalChargesDetailId: any): Observable<any> {
    return this.http.get(this.apiUrl + 'Store/DeleteAdditionalCharges', {
      params: {
        AdditionalChargesDetailId: AdditionalChargesDetailId
      }
    }).pipe(
      map((response) => {
        return response;
      })
    );
  }
  deleteTermsAndConditions(TACDetailId: any): Observable<any> {
    return this.http.get(this.apiUrl + 'Store/DeleteTermsAndConditions', {
      params: {
        TACDetailId: TACDetailId
      }
    }).pipe(
      map((response) => {
        return response;
      })
    );
  }
  deletePartDetails(TACDetailId: any): Observable<any> {
    return this.http.get(this.apiUrl + 'Store/DeletePartDetails', {
      params: {
        TACDetailId: TACDetailId
      }
    }).pipe(
      map((response) => {
        return response;
      })
    );
  }
}
