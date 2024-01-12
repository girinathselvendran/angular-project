import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { MenuComponent } from './menu/menu.component';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { DropdownModule } from 'primeng/dropdown';

import { MenubarModule } from 'primeng/menubar';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { DialogModule } from 'primeng/dialog';
import { ChangePasswordComponent } from '../auth/change-password/change-password.component';
import { AuthModule } from '../auth/auth.module';
import { LayoutSwitcherComponent } from './layout-switcher/layout-switcher.component';



// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    LayoutComponent,
    HeaderComponent,
    FooterComponent,
    MenuComponent,
    // ChangePasswordComponent
    LayoutSwitcherComponent

  ],
  imports: [
    CommonModule,
    DialogModule,
    RouterModule,
    DropdownModule,
    MenubarModule,
    AuthModule,
    FormsModule,
    HttpClientModule,
    NgSelectModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })

  ],
  exports: [
    LayoutComponent,
    LayoutSwitcherComponent
  ]

})
export class LayoutModule { }
