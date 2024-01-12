import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdditionalService {

  constructor(private http: HttpClient) { }
  apiUrl: string = environment.hostUrl;


  //fetches Additional Service data from API
  getTableRecords() {
    return this.http.get(this.apiUrl + "AdditionalService/GetAdditionalService").pipe(
      map((response) => {
        return response;
      })
    );
  }

  //Creates a new Additional Service
  createAdditionalService(body: any) {
    return this.http
      .post(this.apiUrl + "AdditionalService/CreateAdditionalService", body)
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  //Updates the existing Additional Service
  updateAdditionalService(body: any) {
    return this.http
      .put(this.apiUrl + "AdditionalService/UpdateAdditionalService", body)
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  // Duplicate Validation API
  isCodeValid(data: any): Observable<any> {
    return this.http
      .post(
        this.apiUrl + "AdditionalService/IsCodeValid",
        data,
        data.additionalServiceCode
      )
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  //   De-active check
  onChangeActive(data: any): Observable<any> {
    return this.http
      .post(this.apiUrl + "AdditionalService/OnChangeActive", data)
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  deleteAdditionalService(additionalServiceId: any): Observable<any> {
    return this.http
      .get(this.apiUrl + 'AdditionalService/DeleteAdditionalService', {
        params: {
          additionalServiceId: Number(additionalServiceId),
        },
      })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }
}
