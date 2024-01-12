import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierInformationComponent } from './supplier-information.component';

describe('SupplierInformationComponent', () => {
  let component: SupplierInformationComponent;
  let fixture: ComponentFixture<SupplierInformationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SupplierInformationComponent]
    });
    fixture = TestBed.createComponent(SupplierInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
