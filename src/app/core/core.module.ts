import { NgModule, ModuleWithProviders, APP_INITIALIZER , Optional, SkipSelf } from '@angular/core';
import { CommonModule } from "@angular/common";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";

import { environment } from "../../environments/environment";




@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  exports: [],
  providers: [
    // AuthGuard,

    // ...services,
    // ...fromStore.services,

    // {
    //   provide: APP_INITIALIZER,
    //   useFactory: AuthTokenFactory,
    //   deps: [AuthTokenService],
    //   multi: true
    // },

    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: TokenInterceptor,
    //   multi: true
    // }
  ]
})
export class CoreModule {

}
