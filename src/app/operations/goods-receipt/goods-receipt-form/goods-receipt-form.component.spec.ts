import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodsReceiptFormComponent } from './goods-receipt-form.component';

describe('GoodsReceiptFormComponent', () => {
  let component: GoodsReceiptFormComponent;
  let fixture: ComponentFixture<GoodsReceiptFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GoodsReceiptFormComponent]
    });
    fixture = TestBed.createComponent(GoodsReceiptFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
