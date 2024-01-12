import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StoreComponent } from './store/store.component';
import { PartComponent } from './part/part.component';
import { SupplierComponent } from './supplier/supplier.component';
import { AdditionalServiceComponent } from './additional-service/additional-service.component';
import { TermsAndConditionComponent } from './terms-and-condition/terms-and-condition.component';
import { CanDeactivateGuard } from '../core/guards/can-deactivate.guard';
// import { CanDeactivateGuard } from '../can-deactivate.guard';

const routes: Routes = [
  { path: '', redirectTo: 'part', pathMatch: 'full' },
  { path: 'store', component: StoreComponent, data: { pageTitle: 'Store' }, canDeactivate: [CanDeactivateGuard] },
  { path: 'part', component: PartComponent, data: { pageTitle: 'Part' }, canDeactivate: [CanDeactivateGuard] },
  { path: 'supplier', component: SupplierComponent, data: { pageTitle: 'Supplier' }, canDeactivate: [CanDeactivateGuard] },
  { path: 'additional-service', component: AdditionalServiceComponent, data: { pageTitle: 'Additional Service' }, canDeactivate: [CanDeactivateGuard] },
  { path: 'terms-and-condition', component: TermsAndConditionComponent, data: { pageTitle: 'Terms And Condition' }, canDeactivate: [CanDeactivateGuard] },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MasterRoutingModule { }
