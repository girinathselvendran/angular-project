import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { PurchaseOrderService } from '../service/purchase-order.service';
import { UserAuthService } from 'src/app/core/services/user-auth.service';
@Component({
  selector: 'app-billing-and-delivery-address',
  templateUrl: './billing-and-delivery-address.component.html',
  styleUrls: ['./billing-and-delivery-address.component.css']
})
export class BillingAndDeliveryAddressComponent {
  @Input() currentStatusId: any;
  @Input() billingAddressForm!: FormGroup;
  @Input() deliveryAddressForm!: FormGroup;
  supplierData: any;
  depotData: any;
  currentUserId: any;


  constructor(
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private purchaseOrderService: PurchaseOrderService,
    private userAuthService: UserAuthService,
  ) { }

  ngOnInit() {
    this.currentUserId = this.userAuthService.getCurrentUserId();


    this.purchaseOrderService.poSupplierData.subscribe((data) => {
      this.supplierData = data;
      this.billingAddressForm.patchValue(data.billingAddress);

    })
    this.purchaseOrderService.poDepotData.subscribe((data) => {
      this.depotData = data;
      this.deliveryAddressForm.patchValue(data);

    })
    this.billingAddressForm.disable();
    this.deliveryAddressForm.disable();

    this.purchaseOrderService.selectedPORowData.subscribe((data: any) => {
      this.purchaseOrderService.getSupplierCodes(data.depotId).subscribe((res: any) => {
        if (res.status === true) {
          const result = res.response.find((item: any) => item.supplierId == data.supplierId)

          this.billingAddressForm.patchValue(result.billingAddress);


        }
      });


    })



  }

}
