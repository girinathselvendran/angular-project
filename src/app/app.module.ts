import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ConfirmationService } from "primeng/api";
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from '../app/shared/shared.module';
import { ToastModule } from 'primeng/toast';
import { LayoutModule } from './layout/layout.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { DropdownModule } from 'primeng/dropdown';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { NotificationService } from './core/services';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from './shared/ng-select/ng-select.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { InMemoryWebApiModule, InMemoryDataService } from 'angular-in-memory-web-api';
// AoT requires an exported function for factories


export function HttpLoaderFactory(http: HttpClient) {
  // return new TranslateHttpLoader(http);
  // return new TranslateHttpLoader(http,'./assets/i18n/', '.json');
  return new TranslateHttpLoader(http, '../assets/i18n/', '.json');
}

import {
  NgxUiLoaderModule,
  NgxUiLoaderConfig,
  SPINNER,
  POSITION,
  PB_DIRECTION,
  NgxUiLoaderRouterModule,
  NgxUiLoaderHttpModule,
} from "ngx-ui-loader";
import { DirectivesModule } from './shared/directives/directives.module';
import { DialogModule } from 'primeng/dialog';
import { ErrorInterceptor, JwtInterceptor } from './core/helpers';
import { CanDeactivateGuard } from './core/guards/can-deactivate.guard';

export function appInitializerFactory(translate: TranslateService) {
  return () => {
    return translate.use('en').toPromise(); // Use your desired language code

    // translate.setDefaultLang('en');
    // translate.use('en');
    // return Promise.resolve();

  };
}

const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  blur: 0,
  fgsColor: '#cef119',
  fgsPosition: "center-center",
  fgsSize: 70,
  fgsType: "rectangle-bounce",
  gap: 24,

  overlayBorderRadius: "0",
  overlayColor: "rgba(40, 40, 40, 0.8)",
  pbColor: "blue",
  pbDirection: "ltr",
  pbThickness: 3,
  hasProgressBar: false,
  text: "Please Wait...",
  textColor: "white",
  textPosition: "center-center",
};


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ConfirmDialogModule,
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    CommonModule,
    DialogModule,
    ToastModule,
    BrowserAnimationsModule,
    DropdownModule,
    HttpClientModule,
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    NgxUiLoaderRouterModule,
    // TranslateModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    BsDatepickerModule.forRoot(),
    // InMemoryWebApiModule.forRoot(InMemoryDataService, { dataEncapsulation: false, passThruUnknownUrl: true }),

    NgSelectModule,
    DirectivesModule,

    LayoutModule

  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: APP_INITIALIZER, useFactory: appInitializerFactory, deps: [TranslateService], multi: true },
    ConfirmationService, NotificationService, MessageService, CanDeactivateGuard,

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
