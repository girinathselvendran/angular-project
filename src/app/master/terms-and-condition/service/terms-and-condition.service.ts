import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { TermsAndCondition } from '../models/termsAndCondition.model';
@Injectable({
  providedIn: 'root'
})
export class TermsAndConditionService {
  apiUrl: string = environment.hostUrl;
  constructor(private http: HttpClient) { }

  // get  all terms and conditions
  getTermsAndCondition(): Observable<any> {
    return this.http.get(this.apiUrl + 'TermsAndCondition/GetTermsAndCondition', {}).pipe(
      map((response) => {
        return response;
      })
    );
  }
  // Duplicate Validation
  isCodeValid(termsAndCondition: any): Observable<any> {
    return this.http.post(this.apiUrl + "TermsAndCondition/IsCodeValid", termsAndCondition, termsAndCondition.Code).pipe(map(response => {
      return response;
    }));
  }
  // Create terms And Condition
  createTermsAndCondition(termsAndCondition: TermsAndCondition): Observable<any> {
    return this.http.post(this.apiUrl + "TermsAndCondition/CreateTermsAndCondition", termsAndCondition).pipe(map(response => {
      return response;
    }));
  }

  // update terms And Condition
  updateTermsAndCondition(termsAndCondition: TermsAndCondition): Observable<any> {
    return this.http.put(this.apiUrl + "TermsAndCondition/UpdateTermsAndCondition", termsAndCondition).pipe(map(response => {
      return response;
    }));
  }
  //   De-active check
  onChangeActive(data: any): Observable<any> {
    return this.http
      .post(this.apiUrl + "TermsAndCondition/OnChangeActive", data)
      .pipe(
        map((response) => {
          return response;
        })
      );
  }
  deleteTermsAndConditionList(termsAndConditionId: any): Observable<any> {
    return this.http
      .get(this.apiUrl + 'TermsAndCondition/DeleteTermsAndCondition', {
        params: {
          termsAndConditionId: Number(termsAndConditionId),
        },
      })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }
}
