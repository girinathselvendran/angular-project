import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseRequisitionFormComponent } from './purchase-requisition-form.component';

describe('PurchaseRequisitionFormComponent', () => {
  let component: PurchaseRequisitionFormComponent;
  let fixture: ComponentFixture<PurchaseRequisitionFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PurchaseRequisitionFormComponent]
    });
    fixture = TestBed.createComponent(PurchaseRequisitionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
