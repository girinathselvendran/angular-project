import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SupplierService {
  constructor(private http: HttpClient) {}
  apiUrl: string = environment.hostUrl;

  // -------------- API Functions Start ------------------

  createSupplier(Supplier: any): Observable<any> {
    return this.http
      .post(this.apiUrl + 'Supplier/CreateSupplier', Supplier)
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  updateSupplier(Supplier: any): Observable<any> {
    return this.http
      .put(this.apiUrl + 'Supplier/UpdateSupplier', Supplier)
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  createSupplierContact(contactValues: any): Observable<any> {
    return this.http
      .post(this.apiUrl + 'Supplier/CreateContactInfo', contactValues)
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  createSupplierPartMappings(selectedParts: any): Observable<any> {
    return this.http
      .post(this.apiUrl + 'Supplier/CreateSupplierPartMappings', selectedParts)
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  updateSupplierContact(contactValues: any): Observable<any> {
    return this.http
      .put(this.apiUrl + 'Supplier/UpdateContactInfo', contactValues)
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  getCitiesBasedOnCountryId(countryId: any): Observable<any> {
    return this.http
      .get(this.apiUrl + 'Supplier/GetCitiesBasedOnCountryId', {
        params: {
          countryId: countryId.toString(),
        },
      })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  getCountries(): Observable<any> {
    return this.http.get(this.apiUrl + 'Supplier/GetCountries', {}).pipe(
      map((response) => {
        return response;
      })
    );
  }
  getAddressType(): Observable<any> {
    return this.http.get(this.apiUrl + 'Supplier/GetAddressType', {}).pipe(
      map((response) => {
        return response;
      })
    );
  }

  getSupplierClassification(): Observable<any> {
    return this.http
      .get(this.apiUrl + 'Supplier/GetSupplierClassification', {})
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  getActiveDepot(userId: number): Observable<any> {
    return this.http
      .get(this.apiUrl + 'Supplier/GetActiveDepot', {
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

  getActiveCurrency(): Observable<any> {
    return this.http.get(this.apiUrl + 'Supplier/GetActiveCurrency', {}).pipe(
      map((response) => {
        return response;
      })
    );
  }

  // Duplicate supplier code Validation
  isSupplierCodeValid(supplier: any): Observable<any> {
    return this.http
      .post(
        this.apiUrl + 'Supplier/DuplicateSupplierCodeCheck',
        supplier,
        supplier.supplierCode
      )
      .pipe(
        map((response) => {
          return response;
        })
      );
  }
  
  // Duplicate supplier code Validation
  isTaxRegNoValid(supplier: any): Observable<any> {
    return this.http
      .post(this.apiUrl + 'Supplier/DuplicateTAXNoCheck', {
        SupplierId: supplier.supplierId,
        TaxRegistrationNo: supplier.taxRegNo,
      })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  //Address type valid check
  isAddressTypeValid(data: any): Observable<any> {
    return this.http
      .get(this.apiUrl + 'Supplier/DuplicateAddressTypeCheck', {
        params: {
          supplierId: Number(data.supplierId),
          addressTypeId: Number(data.addressTypeId),
          supplierAddressId: Number(data.supplierAddressId),
        },
      })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  saveAddress(addressDetails: any): Observable<any> {
    return this.http
      .post(this.apiUrl + 'Supplier/CreateAddressInfo', addressDetails)
      .pipe(
        map((response) => {
          return response;
        })
      );
  }
  updateAddress(addressDetails: any): Observable<any> {
    return this.http
      .put(this.apiUrl + 'Supplier/UpdateAddressInfo', addressDetails)
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
      .get(this.apiUrl + 'Supplier/GetSupplierListServerSide', {
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

  getAllAssociatePartsServerSide(
    queryParams: any,
    companyId: number,
    userId: number
  ) {
    return this.http
      .get(this.apiUrl + 'Supplier/GetAllAssociatePartsServerSide', {
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

  getContactInfoList(supplierId: number) {
    return this.http
      .get(this.apiUrl + 'Supplier/GetContactList', {
        params: {
          supplierId: supplierId,
        },
      })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  checkSupplierContactCombination(params: any) {
    return this.http
      .get(this.apiUrl + 'Supplier/CombinationValidCheck', {
        params,
      })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  getAddressInfoList(supplierId: number) {
    return this.http
      .get(this.apiUrl + 'Supplier/GetAddressList', {
        params: {
          supplierId: supplierId,
        },
      })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  getGstnState(): Observable<any> {
    return this.http.get(this.apiUrl + 'Supplier/GetGstnState', {}).pipe(
      map((response) => {
        return response;
      })
    );
  }

  deleteSupplierAddress(address: any): Observable<any> {
    return this.http
      .post(this.apiUrl + 'Supplier/DeleteSupplierAddressById', address)
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  deleteSupplierContact(contact: any): Observable<any> {
    return this.http
      .post(this.apiUrl + 'Supplier/DeleteSupplierContactById', contact)
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  deletePartMappingAddress(address: any): Observable<any> {
    return this.http
      .post(this.apiUrl + 'Supplier/DeleteSupplierPartMapping', address)
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  getPartType(): Observable<any> {
    return this.http.get(this.apiUrl + 'Supplier/GetPartType', {}).pipe(
      map((response) => {
        return response;
      })
    );
  }

  getPartsListServerSide(queryParams: any, companyId: number, userId: number) {
    return this.http
      .get(this.apiUrl + 'Supplier/GetPartListServerSide', {
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
}
