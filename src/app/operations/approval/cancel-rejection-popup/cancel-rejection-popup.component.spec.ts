import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelRejectionPopupComponent } from './cancel-rejection-popup.component';

describe('CancelRejectionPopupComponent', () => {
  let component: CancelRejectionPopupComponent;
  let fixture: ComponentFixture<CancelRejectionPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CancelRejectionPopupComponent]
    });
    fixture = TestBed.createComponent(CancelRejectionPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
