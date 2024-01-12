import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierComparisonComponent } from './supplier-comparison.component';

describe('SupplierComparisonComponent', () => {
  let component: SupplierComparisonComponent;
  let fixture: ComponentFixture<SupplierComparisonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SupplierComparisonComponent]
    });
    fixture = TestBed.createComponent(SupplierComparisonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
