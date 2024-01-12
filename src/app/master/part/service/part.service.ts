import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PartService {
  constructor(private http: HttpClient) { }
  apiUrl: string = environment.hostUrl;

  // ----------- State Management ----------------

  tempTable: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  tempTableCategory: BehaviorSubject<any> = new BehaviorSubject<any>([]);

  getAllTempTables(): any {
    return this.tempTable.getValue();
  }
  getAllCategoryTempTables(): any {
    return this.tempTableCategory.getValue();
  }
  clearTempCategory() {
    this.tempTableCategory.next([]);

  }
  clearTempTable() {
    this.tempTable.next([]);

  }

  addTempRecord(type: string, item: any): void {
    if (type == 'category') {
      const currentItems = this.getAllCategoryTempTables();
      this.tempTableCategory.next(item);
    } else {
      const currentItems = this.getAllTempTables();
      item.id = currentItems.length + 1;
      const updatedItems = [...currentItems, item];
      this.tempTable.next(updatedItems);
    }
  }

  updateTempTable(type: string, updatedItem: any): void {
    if (type == 'category') {
      const currentItems = this.getAllCategoryTempTables();
      const index = currentItems.findIndex((item: any) => item.id === updatedItem.id);
      if (index !== -1) {
        currentItems[index] = updatedItem;
        this.tempTableCategory.next(currentItems);
      }
    } else {
      const currentItems = this.getAllTempTables();
      const index = currentItems.findIndex((item: any) => item.id === updatedItem.id);
      if (index !== -1) {
        currentItems[index] = updatedItem;
        this.tempTable.next(currentItems);
      }
    }
  }

  deleteRecordTempTable(type: string, id: number) {
    if (type == 'category') {
      const currentItems = this.getAllCategoryTempTables();
      const updatedItems = currentItems.filter((item: any) => item.id !== id);
      this.tempTableCategory.next(updatedItems);
    } else {
      const currentItems = this.getAllTempTables();
      const updatedItems = currentItems.filter((item: any) => item.id !== id);
      this.tempTable.next(updatedItems);
    }
  }

  // -------------- API Functions Start ------------------


  getMovementFrequency(): Observable<any> {
    return this.http.get(this.apiUrl + 'Part/GetMovementFrequency', {}).pipe(
      map((response) => {
        return response;
      })
    );
  }
  getPlanningStrategy(): Observable<any> {
    return this.http.get(this.apiUrl + 'Part/GetPlanningStrategy', {}).pipe(
      map((response) => {
        return response;
      })
    );
  }

  getStockUOM(): Observable<any> {
    return this.http.get(this.apiUrl + 'Part/GetStockUOM', {}).pipe(
      map((response) => {
        return response;
      })
    );
  }
  getUOM(): Observable<any> {
    return this.http.get(this.apiUrl + 'Part/GetUOM', {}).pipe(
      map((response) => {
        return response;
      })
    );
  }
  getSupplierCode(): Observable<any> {
    return this.http.get(this.apiUrl + 'Part/GetSupplierCode', {}).pipe(
      map((response) => {
        return response;
      })
    );
  }

  getPartType(): Observable<any> {
    return this.http.get(this.apiUrl + 'Part/GetPartType', {}).pipe(
      map((response) => {
        return response;
      })
    );
  }
  getPartSpecification(): Observable<any> {
    return this.http.get(this.apiUrl + 'Part/GetPartSpecification', {}).pipe(
      map((response) => {
        return response;
      })
    );
  }

  getCurrencyBasedOnDepot(depotId: any): Observable<any> {
    return this.http
      .get(this.apiUrl + 'Part/GetCurrencyBasedOnDepot', {
        params: {
          depotId: depotId.toString(),
        },
      })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }
  getSupplierDetailsBySupplierID(supplierId: any): Observable<any> {
    return this.http
      .get(this.apiUrl + 'Part/GetSupplierDetailsBySupplierId', {
        params: {
          supplierId,
        },
      })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }
  getActiveDepot(userId: number): Observable<any> {
    return this.http
      .get(this.apiUrl + 'Part/GetActiveDepot', {
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

  deletePartSpecification(partSpecificationId: number): Observable<any> {
    return this.http
      .get(this.apiUrl + 'Part/DeletePartSpecificationById', {
        params: {
          partSpecificationId: Number(partSpecificationId),
        },
      })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  deletePartSupplier(partSupplierId: number, supplierCode: string): Observable<any> {
    return this.http
      .get(this.apiUrl + 'Part/DeletePartSupplierById', {
        params: {
          partSupplierId: Number(partSupplierId),
          supplierCode: supplierCode
        },
      })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }
  deletePartRate(partRateId: any): Observable<any> {
    return this.http
      .get(this.apiUrl + 'Part/DeletePartRateById', {
        params: {
          partRateId: Number(partRateId),
        },
      })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }


  createSupplierMapping(partSupplierValues: any): Observable<any> {
    return this.http.post(this.apiUrl + 'Part/CreateSupplierMapping', partSupplierValues).pipe(
      map((response) => {
        return response;
      })
    );
  }

  updateSupplierMapping(partSupplierValues: any): Observable<any> {
    return this.http.put(this.apiUrl + 'Part/UpdateSupplierMapping', partSupplierValues).pipe(
      map((response) => {
        return response;
      })
    );
  }

  updatePartRate(partRateValues: any): Observable<any> {
    return this.http.put(this.apiUrl + 'Part/UpdatePartRate', partRateValues).pipe(
      map((response) => {
        return response;
      })
    );
  }
  createPartRate(partRateValues: any): Observable<any> {
    return this.http.post(this.apiUrl + 'Part/CreatePartRate', partRateValues).pipe(
      map((response) => {
        return response;
      })
    );
  }
  createPart(part: any): Observable<any> {
    return this.http.post(this.apiUrl + 'part/createPart', part).pipe(
      map((response) => {
        return response;
      })
    );
  }

  updatePart(part: any): Observable<any> {
    return this.http.put(this.apiUrl + 'part/UpdatePart', part).pipe(
      map((response) => {
        return response;
      })
    );
  }

  getPartsListServerSide(queryParams: any, companyId: number, userId: number) {
    return this.http
      .get(this.apiUrl + 'part/GetPartListServerSide', {
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
  getSupplierListServerSide(
    queryParams: any,
    companyId: number,
    userId: number
  ) {
    return this.http
      .get(this.apiUrl + 'part/GetSupplierListServerSide', {
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

  getPartRatesListServerSide(
    queryParams: any,
    companyId: number,
    userId: number
  ) {


    return this.http
      .get(this.apiUrl + "part/GetPartRatesServerSide", {
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

  getPartCategoryList(companyId: number, partId: number) {
    return this.http
      .get(this.apiUrl + 'part/GetPartCategoryList', {
        params: {
          companyId: companyId.toString(),
          partId: partId,
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

  // Duplicate Validation
  isCodeValid(part: any): Observable<any> {
    return this.http
      .post(
        this.apiUrl + "part/DuplicatePartCodeCheck",
        part,
        part.partCode
      )
      .pipe(
        map((response) => {
          return response;
        })
      );
  }
  //duplicate part spec
  isPartSpecificationValid(partSpec: any): Observable<any> {


    return this.http
      .post(
        this.apiUrl + "part/DuplicatePartSpecificationCheck",
        partSpec
      )
      .pipe(
        map((response) => {
          return response;
        })
      );
  }
  //duplicate supplier code
  isSupplierCodeValid(supplier: any): Observable<any> {

    return this.http
      .post(
        this.apiUrl + "part/DuplicateSupplierCodeCheck",
        supplier
      )
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  isEffectiveDateCombinationValid(supplier: any): Observable<any> {


    return this.http
      .post(
        this.apiUrl + "part/IsDepotEffectiveDateCombinationValid",
        supplier
      )
      .pipe(
        map((response) => {
          return response;
        })
      );
  }
}

