import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StorePartAllocationPopupComponent } from './store-part-allocation-popup.component';

describe('StorePartAllocationPopupComponent', () => {
  let component: StorePartAllocationPopupComponent;
  let fixture: ComponentFixture<StorePartAllocationPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StorePartAllocationPopupComponent]
    });
    fixture = TestBed.createComponent(StorePartAllocationPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
