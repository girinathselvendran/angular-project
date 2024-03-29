import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodsReceiptListComponent } from './goods-receipt-list.component';

describe('GoodsReceiptListComponent', () => {
  let component: GoodsReceiptListComponent;
  let fixture: ComponentFixture<GoodsReceiptListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GoodsReceiptListComponent]
    });
    fixture = TestBed.createComponent(GoodsReceiptListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
