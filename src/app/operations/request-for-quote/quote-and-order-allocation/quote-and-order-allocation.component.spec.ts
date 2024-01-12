import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteAndOrderAllocationComponent } from './quote-and-order-allocation.component';

describe('QuoteAndOrderAllocationComponent', () => {
  let component: QuoteAndOrderAllocationComponent;
  let fixture: ComponentFixture<QuoteAndOrderAllocationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuoteAndOrderAllocationComponent]
    });
    fixture = TestBed.createComponent(QuoteAndOrderAllocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
