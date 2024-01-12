import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class UserAuthService {
  user:any = {
    id: null,
    userName: null,
    token: null,
    personaId: null,
    personaCode: null,
    firstName: null,
    lastName: null,
    email: null,
    profilePic: null,
    companyId: null,
    companyName: null,
    companyAddress: null,
    forgotPasswordBit: null,
    forgotPasswordExpiryDate: null,
    siteName: null,
    os: null,
    osVersion: null,
    homePath: null,
    userTypeId: null,
    partnerId: null,
    partnerTypeId: null,
    loginAuditId: null,
    productNatureId: null,
    isRentalApplicable: null,
    isTransportationApplicable: null
  };
  localIP = "";
  apiUrl: string = environment.hostUrl;
  // store the URL so we can redirect after logging in
  redirectUrl = '';
  constructor(private router: Router, private http: HttpClient) {
    const item = localStorage.getItem("userToken");
    this.user = item ? JSON.parse(item) : [];
  }

  getCurrentPartnerId() {
    return this.user.partnerId;
  }
  getCurrentPartnerTypeId() {
    return this.user.partnerTypeId;
  }
  getCurrentUserName() {
    return this.user.userName;
  }
  getCurrentUserFirstName() {
    return this.user.firstName;
  }
  getCurrentUserLastName() {
    return this.user.lastName;
  }
  getCurrentPersonaId() {
    return this.user.personaId;
    // return "b40a31b7-65b6-4a57-b93b-33f8e0940810";
  }
  getCurrentUserId(): any {
    return this.user.id;
  }
  getCurrentUserTypeId(): any {
    return this.user.userTypeId;
  }
  getCurrentCompanyId(): any {
    return this.user.companyId;
  }
  getFinanceIntergrationApplicable():any{
    return this.user.isFinanceIntegrationApplicable ? true: false;
  }
  getCurrentCompanyName(): any {
    return this.user.companyName;
  }
  getCurrentCompanyAddress(): any {
    return this.user.companyAddress;
  }
  getCurrentUserToken() {
    return this.user.token;
  }
  getCurrentCompanyProductNatureId(): any {
    return this.user.productNatureId;
  }
  isDedicatedTankService(): any {
    return (this.user.productNatureId == 355 || this.user.productNatureId == 356) ? true : false;
  }
  getCurrentcompanyRentalApplicable(): any {
    return this.user.isRentalApplicable ? true : false;
  }
  getCurrentCompanyTransportationApplicable(): any {
    return this.user.isTransportationApplicable ? true : false;
  }

  getAppVersionDetails(): Observable<any> {
    return this.http.get(this.apiUrl + "Auth/GetAppVersion").pipe(map(response => {
      return response;
    }));
  }

  login(userName: string, password: string, currentDateTime: Date, os: string, osVersion: string): Observable<any> {
    const browser = navigator.userAgent;
    const IPAddress = this.localIP;

    return this.http.post(this.apiUrl + "Auth/Login", {
      userName: userName, passwordHash: password,
      browser: browser, IPAddress: IPAddress, LoggedInDate: currentDateTime,
      os: os,
      osVersion: osVersion.toString()
    }).pipe(map(response => {
      return response;
    }));
  }

  forgot(userName: string, email: string): Observable<any> {
    return this.http.post(this.apiUrl + "Auth/ForgotPassword", { userName: userName, email: email }).pipe(map(response => {
      return response;
    }));
  }

  oldPasswordCheck(userName: string, password: string): Observable<any> {
    return this.http.post(this.apiUrl + "Auth/OldPasswordCheck", { userName: userName, passwordHash: password }).pipe(map(response => {
      return response;
    }));
  }

  updatePassword(userName: string, password: string): Observable<any> {
    return this.http.post(this.apiUrl + "Auth/UpdatePassword", { userName: userName, passwordHash: password }).pipe(map(response => {
      return response;
    }));
  }

  downloadUserManual(){
    window.open('../../../assets/UserManual/IDP_UM_General.pdf');
  }
  
  logout() {
    let LoginAuditId = this.user ? this.user.loginAuditId : null;
    //this.user = undefined;
    localStorage.removeItem('userToken');
    const authUrl = "/auth";
    this.router.navigate([authUrl]);
    //document.title = "iDepo";
    // if (LoginAuditId != null) {
    //   return this.http.put(this.apiUrl + "Auth/LogOut", { loginAuditId: LoginAuditId }).pipe(map(response => {
    //     return response;
    //   }));
    // }
  }

  GetIp() {
    // return this.http.get("http://api.ipify.org/?format=json").subscribe((res:any)=>{
    //   this.localIP = res.ip;
    // });
    return '';
  }

  getPageRights(screenId: string, personaId: string): Observable<any> {
    return this.http.get(this.apiUrl + "Auth/GetPageRights", {
      params: {
        screenId: screenId,
        personaId: personaId
      }
    }).pipe(map(response => {
      return response;
    }));
  }

  getMenu(personaId: string, companyId: number) {
    return this.http.get(this.apiUrl + "Auth/GetMenu", {
      params: {
        personaId: personaId,
        companyId: companyId.toString()
      }
    }).pipe(map(response => {
      return response;
    }));
  }

  getTabMenu(personaId: string) {
    return this.http.get(this.apiUrl + "Auth/GetTabMenu", {
      params: {
        personaId: personaId
      }
    }).pipe(map(response => {
      return response;
    }));
  }

  getYardMenu(personaId: string) {
    return this.http.get(this.apiUrl + "Auth/GetYardMenu", {
      params: {
        personaId: personaId
      }
    }).pipe(map(response => {
      return response;
    }));
  }

}