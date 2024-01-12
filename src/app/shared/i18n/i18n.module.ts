import { NgModule } from "@angular/core";
import { LanguageSelectorComponent } from "./language-selector/language-selector.component";
import { I18nService } from "./i18n.service";
import { CommonModule } from "@angular/common";
// import BsDropdownModule from 'ngx-bootstrap/dropdown';

@NgModule({
  imports: [
    CommonModule,
    // BsDropdownModule,
  ],
  declarations: [
    LanguageSelectorComponent,
  ],
  exports: [LanguageSelectorComponent
  ],
  providers: [I18nService]

})
export class I18nModule { }
