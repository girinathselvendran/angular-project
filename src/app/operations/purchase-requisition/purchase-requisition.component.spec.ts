import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseRequisitionComponent } from './purchase-requisition.component';

describe('PurchaseRequisitionComponent', () => {
  let component: PurchaseRequisitionComponent;
  let fixture: ComponentFixture<PurchaseRequisitionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PurchaseRequisitionComponent]
    });
    fixture = TestBed.createComponent(PurchaseRequisitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
