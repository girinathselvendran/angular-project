import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingAndDeliveryAddressComponent } from './billing-and-delivery-address.component';

describe('BillingAndDeliveryAddressComponent', () => {
  let component: BillingAndDeliveryAddressComponent;
  let fixture: ComponentFixture<BillingAndDeliveryAddressComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BillingAndDeliveryAddressComponent]
    });
    fixture = TestBed.createComponent(BillingAndDeliveryAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
