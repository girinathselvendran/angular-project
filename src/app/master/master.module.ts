import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { PanelModule } from 'primeng/panel';
import { ModalModule } from 'ngx-bootstrap/modal';
import { MasterRoutingModule } from './master-routing.module';
import { SharedModule } from "../shared/shared.module";
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CalendarModule } from 'primeng/calendar';
import { DirectivesModule } from '../shared/directives/directives.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { PartComponent } from './part/part.component';
import { StoreComponent } from './store/store.component';
import { TranslateModule } from '@ngx-translate/core';
import { AccordionModule } from 'primeng/accordion';
import { SmartadminWizardsModule } from '../shared/forms/wizards/smartadmin-wizards.module';
import { SupplierComponent } from './supplier/supplier.component';
import { SupplierFormComponent } from './supplier/supplier-form/supplier-form.component';
import { HttpClientModule } from '@angular/common/http';
import { DialogModule } from 'primeng/dialog';
import { PartFormComponent } from './part/part-form/part-form.component';
import { SupplierInformationComponent } from './part/supplier-information/supplier-information.component';
import { ContactInformationComponent } from './supplier/contact-info/contact-info.component';
import { AddressInformationComponent } from './supplier/address-info/address-info.component';
import { PartRatesComponent } from './part/part-rates/part-rates.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PartMappingComponent } from './supplier/part-mapping/part-mapping.component';
import { StorePartMappingComponent } from './store/part-mapping/part-mapping.component';
import { AdditionalServiceComponent } from './additional-service/additional-service.component';
import { TermsAndConditionComponent } from './terms-and-condition/terms-and-condition.component';
import { StoreInformationComponent } from './store/store-information/store-information.component';

@NgModule({
    declarations: [
        PartComponent,
        PartFormComponent,
        PartRatesComponent,
        PartMappingComponent,
        StorePartMappingComponent,
        StoreComponent,
        SupplierComponent,
        SupplierFormComponent,
        SupplierInformationComponent,
        ContactInformationComponent,
        AddressInformationComponent,
        AdditionalServiceComponent,
        TermsAndConditionComponent,
        StoreInformationComponent,

    ],
    imports: [
        CommonModule,
        MasterRoutingModule,
        SharedModule,
        BsDatepickerModule.forRoot(),
        CalendarModule,
        DirectivesModule,
        NgSelectModule,
        ReactiveFormsModule,
        FormsModule,
        TranslateModule,
        AccordionModule,
        SmartadminWizardsModule,
        HttpClientModule,
        DialogModule,
        PanelModule,
        ModalModule,
        NgxUiLoaderModule,

    ],
    providers: [
        DatePipe
    ]
})
export class MasterModule { }
