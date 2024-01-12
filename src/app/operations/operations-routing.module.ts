import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PurchaseRequisitionComponent } from "./purchase-requisition/purchase-requisition.component";
import { CanDeactivateGuard } from '../core/guards/can-deactivate.guard';
import { PurchaseOrderComponent } from "./purchase-order/purchase-order.component";
import { RequestForQuoteComponent } from "./request-for-quote/request-for-quote.component";
import { ApprovalComponent } from "./approval/approval.component";
import { StockMaintenanceComponent } from "./stock-maintenance/stock-maintenance.component";
import { GoodsReceiptComponent } from "./goods-receipt/goods-receipt.component";



const routes: Routes = [
  { path: '', redirectTo: 'purchase-operation', pathMatch: 'full' },
  { path: 'purchase-operation', component: PurchaseRequisitionComponent, canDeactivate: [CanDeactivateGuard] },
  { path: 'purchase-order', component: PurchaseOrderComponent, canDeactivate: [CanDeactivateGuard] },
  { path: 'request-for-quote', component: RequestForQuoteComponent, canDeactivate: [CanDeactivateGuard] },
  { path: 'approval', component: ApprovalComponent, canDeactivate: [CanDeactivateGuard] },
  { path: 'stock-maintenance', component: StockMaintenanceComponent, canDeactivate: [CanDeactivateGuard] },
  { path: 'goods-receipt', component: GoodsReceiptComponent, canDeactivate: [CanDeactivateGuard] }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OperationsRoutingModule { }
