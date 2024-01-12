import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AdminRoutingModule } from './admin-routing.module';
import { UserConfigurationComponent } from './user-configuration/user-configuration.component';
import { UserComponent } from './user/user.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { SharedModule } from "../shared/shared.module";
import { NgSelectModule } from '@ng-select/ng-select';
import { AccordionModule } from 'primeng/accordion';
import { UnlockImsComponent } from './unlock-ims/unlock-ims.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({

    declarations: [
        UserConfigurationComponent,
        UserComponent,
        UnlockImsComponent
    ],

    imports: [
        NgSelectModule,
        AccordionModule,
        CommonModule,
        AdminRoutingModule,
        FormsModule,
        TranslateModule,
        HttpClientModule,
        AccordionModule,
        SharedModule,
        ReactiveFormsModule
    ]

})
export class AdminModule { }
