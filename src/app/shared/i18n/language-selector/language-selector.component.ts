import { Component, OnInit } from '@angular/core';
import {I18nService} from "../i18n.service";

@Component({
  selector: 'sa-language-selector',
  templateUrl: './language-selector.component.html',
})
export class LanguageSelectorComponent implements OnInit {

  constructor(private i18nService: I18nService) {
  }

  ngOnInit() {
 
  }
  get currentLanguage(): string {
    return this.i18nService.language;
  }

  setLanguage(language: string) {
    this.i18nService.language = language;
  }
  get languages(): string[] {
    return this.i18nService.supportedLanguages;
  }

}
