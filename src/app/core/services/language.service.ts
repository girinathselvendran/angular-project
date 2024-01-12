import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class LanguageService {
  
  defaultCode = 'en';
  constructor() {
    
  }

  setLanguageCode(languageCode:string) {
    localStorage.setItem("languageCode", languageCode);
  }

  getLanguageCode() {
    const item = localStorage.getItem("languageCode");
    return item ? item : this.defaultCode;
  }  

}