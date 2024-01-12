import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestForQuoteSupplierComponent } from './request-for-quote-supplier.component';

describe('RequestForQuoteSupplierComponent', () => {
  let component: RequestForQuoteSupplierComponent;
  let fixture: ComponentFixture<RequestForQuoteSupplierComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RequestForQuoteSupplierComponent]
    });
    fixture = TestBed.createComponent(RequestForQuoteSupplierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
