import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { PurchaseRequisitionComponent } from './purchase-requisition/purchase-requisition.component';
import { OperationsRoutingModule } from './operations-routing.module';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CalendarModule } from 'primeng/calendar';
import { DirectivesModule } from '../shared/directives/directives.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AccordionModule } from 'primeng/accordion';
import { SmartadminWizardsModule } from '../shared/forms/wizards/smartadmin-wizards.module';
import { HttpClientModule } from '@angular/common/http';
import { DialogModule } from 'primeng/dialog';
import { PanelModule } from 'primeng/panel';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { SharedModule } from '../shared/shared.module';
import { EmailPrComponent } from './purchase-requisition/email-pr/email-pr.component';
import { PurchaseOrderComponent } from './purchase-order/purchase-order.component';
import { PurchaseRequisitionFormComponent } from './purchase-requisition/purchase-requisition-form/purchase-requisition-form.component';
import { PurchaseRequisitionListComponent } from './purchase-requisition/purchase-requisition-list/purchase-requisition-list.component';
import { GeneratePdfComponent } from './purchase-requisition/generate-pdf/generate-pdf.component';
import { PurchaseOrderFormComponent } from './purchase-order/purchase-order-form/purchase-order-form.component';
import { PurchaseOrderListComponent } from './purchase-order/purchase-order-list/purchase-order-list.component';
import { GeneratePoPdfComponent } from './purchase-order/generate-po-pdf/generate-po-pdf.component';
import { AddPartDetailsComponent } from './purchase-order/add-part-details/add-part-details.component';
import { AddTermsAndConditionsComponent } from './purchase-order/add-terms-and-conditions/add-terms-and-conditions.component';
import { PartsDetailsComponent } from './purchase-order/parts-details/parts-details.component';
import { AdditionalChargesComponent } from './purchase-order/additional-charges/additional-charges.component';
import { BillingAndDeliveryAddressComponent } from './purchase-order/billing-and-delivery-address/billing-and-delivery-address.component';
import { RequestForQuoteComponent } from './request-for-quote/request-for-quote.component';
import { RequestForQuoteListComponent } from './request-for-quote/request-for-quote-list/request-for-quote-list.component';
import { RequestForQuoteFormComponent } from './request-for-quote/request-for-quote-form/request-for-quote-form.component';
import { AddRFQSupplierComponent } from './request-for-quote/add-rfqsupplier/add-rfqsupplier.component';
import { ApprovalComponent } from './approval/approval.component';
import { ChartModule } from 'primeng/chart';
import { ApprovalListComponent } from './approval/approval-list/approval-list.component';
import { ApprovalFormComponent } from './approval/approval-form/approval-form.component';
import { ApprovalPopupComponent } from './approval/approval-popup/approval-popup.component'
import { RequestForQuoteSupplierComponent } from './request-for-quote/request-for-quote-supplier/request-for-quote-supplier.component';
import { QuoteAndOrderAllocationComponent } from './request-for-quote/quote-and-order-allocation/quote-and-order-allocation.component';
import { SupplierComparisonComponent } from './request-for-quote/supplier-comparison/supplier-comparison.component';
import { CancelRejectionPopupComponent } from './approval/cancel-rejection-popup/cancel-rejection-popup.component';
import { RejectionPopupComponent } from './approval/rejection-popup/rejection-popup.component';
import { GenerateRfqPdfComponent } from './request-for-quote/generate-rfq-pdf/generate-rfq-pdf.component';
import { StockMaintenanceComponent } from './stock-maintenance/stock-maintenance.component';
import { StockMaintenanceListComponent } from './stock-maintenance/stock-maintenance-list/stock-maintenance-list.component';
import { GoodsReceiptComponent } from './goods-receipt/goods-receipt.component';
import { GoodsReceiptListComponent } from './goods-receipt/goods-receipt-list/goods-receipt-list.component';
import { GoodsReceiptFormComponent } from './goods-receipt/goods-receipt-form/goods-receipt-form.component';
import { StorePartAllocationPopupComponent } from './goods-receipt/store-part-allocation-popup/store-part-allocation-popup.component';
// import { NgxChartsModule } from "@swimlane/ngx-charts";

@NgModule({
  declarations: [PurchaseRequisitionComponent, EmailPrComponent, PurchaseOrderComponent, PurchaseRequisitionFormComponent, PurchaseRequisitionListComponent, GeneratePdfComponent, PurchaseOrderFormComponent, PurchaseOrderListComponent, GeneratePoPdfComponent, AddPartDetailsComponent, AddTermsAndConditionsComponent, PartsDetailsComponent, AdditionalChargesComponent, BillingAndDeliveryAddressComponent, RequestForQuoteComponent, RequestForQuoteListComponent, RequestForQuoteFormComponent, AddRFQSupplierComponent, ApprovalComponent, ApprovalListComponent, RequestForQuoteSupplierComponent,
    ApprovalFormComponent,
    ApprovalPopupComponent, QuoteAndOrderAllocationComponent, SupplierComparisonComponent, CancelRejectionPopupComponent, RejectionPopupComponent, GenerateRfqPdfComponent, StockMaintenanceComponent, StockMaintenanceListComponent, GoodsReceiptComponent, GoodsReceiptListComponent, GoodsReceiptFormComponent, StorePartAllocationPopupComponent],
  imports: [
    CommonModule,
    OperationsRoutingModule,
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
    ChartModule,
    // NgxChartsModule,
  ],
  providers: [
    DatePipe
  ]
})
export class OperationsModule { }
