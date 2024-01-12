import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpParams, HttpEvent } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
// import { Attachment } from '../../models/attachment.model';

@Injectable({
  providedIn: 'root'
})
export class AttachmentService {


  constructor(
    private http: HttpClient
  ) { }

  apiUrl: string = environment.hostUrl;

  getAttachment(dbScreenTableName: string, referenceId: number): Observable<any> {
    return this.http.get(this.apiUrl + "Attachment/GetAttachment", {
      params: {
        dbScreenTableName: dbScreenTableName,
        referenceId: referenceId.toString(),
      }
    })
      .pipe(map(response => {
        return response;
      }));
  }
  removeAttachement(removeAttachement: any, dbScreenTableName: string, referenceId: any, userName: string): Observable<any> {
    const paramsString = dbScreenTableName + "-" + referenceId.toString() + "-" + userName;
    const addParams = new HttpParams()
      .set(paramsString, paramsString);
    const uploadReq = new HttpRequest('PUT', this.apiUrl + "Attachment/RemoveAttachment", removeAttachement, {
      params: addParams
    });
    return this.http.request(uploadReq).pipe(map(response => {
      return response;
    }));
  }
  // Estimate Attachment
  upload(file: File, params:any): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append(file.name, file);
    const addParams = new HttpParams()
      .set(params, params);
    const req = new HttpRequest('POST', environment.hostUrl + `Attachment/Upload`, formData, {
      reportProgress: true,
      responseType: 'json',
      params: addParams
    });

    return this.http.request(req);
  }
  // Estimate Attachment
  uploadGateOperationsFile(file: File, params:any): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append(file.name, file);
    const addParams = new HttpParams()
      .set(params, params);
    const req = new HttpRequest('POST', environment.hostUrl + `Attachment/UploadGateOut`, formData, {
      reportProgress: true,
      responseType: 'json',
      params: addParams
    });

    return this.http.request(req);
  }

  uploadGateInOperationsFile(file: File, params:any): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append(file.name, file);
    const addParams = new HttpParams()
      .set(params, params);
    const req = new HttpRequest('POST', environment.hostUrl + `Attachment/UploadGateIn`, formData, {
      reportProgress: true,
      responseType: 'json',
      params: addParams
    });

    return this.http.request(req);
  }
  // Attachment
  uploadAttachment(file: File, params:any): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append(file.name, file);
    const addParams = new HttpParams()
      .set(params, params);
    const req = new HttpRequest('POST', environment.hostUrl + `Attachment/UploadFile`, formData, {
      reportProgress: true,
      responseType: 'json',
      params: addParams
    });

    return this.http.request(req);
  }

  getEstimateAttachment(referenceId: number, screenName:any): Observable<any> {
    return this.http.get(this.apiUrl + "Attachment/GetEstimateAttachment", {
      params: {
        referenceId: referenceId.toString(),
        screenName: screenName.toString()
      }
    })
      .pipe(map(response => {
        return response;
      }));
  }
  getGateOutAttachment(referenceId: number, screenName:any): Observable<any> {
    return this.http.get(this.apiUrl + "Attachment/GetGateOutAttachment", {
      params: {
        referenceId: referenceId.toString(),
        screenName: screenName.toString()
      }
    })
      .pipe(map(response => {
        return response;
      }));
  }
  getInspectionAttachment(referenceId: number, screenName:any): Observable<any> {
    return this.http.get(this.apiUrl + "Attachment/GetInspectionAttachment", {
      params: {
        referenceId: referenceId.toString(),
        screenName: screenName.toString()
      }
    })
      .pipe(map(response => {
        return response;
      }));
  }
  getInspectionPhotoviewerDetails(detailId: number): Observable<any> {
    return this.http.get(this.apiUrl + "Estimate/GetInspectionPhotoviewerDetails", {
      params: {
        detailId: detailId.toString()

      }
    })
      .pipe(map(response => {
        return response;
      }));
  }
  getGateInAttachment(referenceId: number, screenName:any): Observable<any> {
    return this.http.get(this.apiUrl + "Attachment/GetGateInAttachment", {
      params: {
        referenceId: referenceId.toString(),
        screenName: screenName.toString()
      }
    })
      .pipe(map(response => {
        return response;
      }));
  }
  getPhotoviewerDetails(estimateId: number): Observable<any> {
    return this.http.get(this.apiUrl + "Estimate/GetPhotoviewerDetails", {
      params: {
        estimateId: estimateId.toString()

      }
    })
      .pipe(map(response => {
        return response;
      }));
  }
  getGateOutPhotoviewerDetails(detailId: number): Observable<any> {
    return this.http.get(this.apiUrl + "Estimate/GetGateOutPhotoviewerDetails", {
      params: {
        detailId: detailId.toString()

      }
    })
      .pipe(map(response => {
        return response;
      }));
  }
  getGateInPhotoviewerDetails(detailId: number): Observable<any> {
    return this.http.get(this.apiUrl + "Estimate/GetGateInPhotoviewerDetails", {
      params: {
        detailId: detailId.toString()

      }
    })
      .pipe(map(response => {
        return response;
      }));
  }
}
