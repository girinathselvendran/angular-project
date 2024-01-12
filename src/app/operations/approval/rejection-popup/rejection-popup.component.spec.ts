import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectionPopupComponent } from './rejection-popup.component';

describe('RejectionPopupComponent', () => {
  let component: RejectionPopupComponent;
  let fixture: ComponentFixture<RejectionPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RejectionPopupComponent]
    });
    fixture = TestBed.createComponent(RejectionPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
