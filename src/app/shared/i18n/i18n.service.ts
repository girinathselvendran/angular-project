import { Injectable, ApplicationRef } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import * as enUS from '../../../assets/i18n/en.json';
import * as frFR from '../../../assets/i18n/fr.json';
import * as arAR from '../../../assets/i18n/ar.json';
const languageKey = 'language';
// import {config} from '@app/core/smartadmin.config';
// import {languages} from './languages.model';
// import {JsonApiService} from "@app/core/services/json-api.service";
// import { Subject } from 'rxjs';



@Injectable()
export class I18nService {

  defaultLanguage: string | undefined;
  supportedLanguages: any[] | any;
  data: any = {};

  // public state;
  // // public data:{};
  // public currentLanguage:any;


  // constructor(private jsonApiService:JsonApiService, private ref:ApplicationRef) {
  //   this.state = new Subject();

  //   this.initLanguage(config.defaultLocale || 'us');
  //   this.fetch(this.currentLanguage.key)
  // }

  // private fetch(locale: any) {
  //   this.jsonApiService.fetch( `/langs/${locale}.json` )
  //     .subscribe((data:any)=> {
  //       this.data = data;
  //       this.state.next(data);
  //       this.ref.tick()
  //     })
  // }

  // private initLanguage(locale:string) {
  //   let language = languages.find((it)=> {
  //     return it.key == locale
  //   });
  //   if (language) {
  //     this.currentLanguage = language
  //   } else {
  //     throw new Error(`Incorrect locale used for I18nService: ${locale}`);

  //   }
  // }

  // setLanguage(language){
  //   this.currentLanguage = language;
  //   this.fetch(language.key)
  // }


  // subscribe(sub:any, err:any) {
  //   return this.state.subscribe(sub, err)
  // }

  // public getTranslation(phrase:string):string {
  //   return this.data && this.data[phrase] ? this.data[phrase] : phrase
  // }
  // constructor(private translateService: TranslateService) {
  //   // Embed languages to avoid extra HTTP requests
  //   translateService.setTranslation('en-US', enUS['default']);
  //   translateService.setTranslation('fr-FR', frFR['default']);
  //   translateService.setTranslation('ar-AR', arAR['default']);
  // }
  constructor(private translateService: TranslateService) {
    // Embed languages to avoid extra HTTP requests
    translateService.setTranslation('en-US', enUS as any);
    translateService.setTranslation('fr-FR', frFR as any);
    translateService.setTranslation('ar-AR', arAR as any);
  }

  setDefault(lang: any) {
    this.translateService.setDefaultLang(lang || 'en')
    //console.log(this.translate)
  }
  init(defaultLanguage: string, supportedLanguages: any[]) {
    this.defaultLanguage = defaultLanguage;
    this.supportedLanguages = supportedLanguages;
    this.language = defaultLanguage;

    this.translateService.onLangChange
      .subscribe((event: LangChangeEvent) => { localStorage.setItem(languageKey, event.lang); });
  }
  getLang() {
    return this.translateService.currentLang;
  }
  use(lang: string): Promise<{}> {
    return new Promise<{}>((resolve, reject) => {
      //this.translateService.setTranslation(lang, {})
      this.translateService.use(lang);
      localStorage.setItem("lang", lang)
      // console.log(this.translate)

    });
  }

  set language(language: any) {
    language = language || localStorage.getItem(languageKey);
    let isSupportedLanguage = true;

    // If no exact match is found, search without the region
    if (language && !isSupportedLanguage) {
      language = language.split('-')[0];
      language = this.supportedLanguages.find((supportedLanguage: string) => supportedLanguage.startsWith(language)) || '';
      isSupportedLanguage = Boolean(language);
    }

    // Fallback if language is not supported
    if (!isSupportedLanguage) {
      language = this.defaultLanguage;
    }

    console.log(`Language set to ${language}`);
    this.translateService.use(language);
  }

  get language(): string {
    return this.translateService.currentLang;
  }
}
