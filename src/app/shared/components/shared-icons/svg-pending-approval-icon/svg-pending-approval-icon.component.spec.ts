import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgPendingApprovalIconComponent } from './svg-pending-approval-icon.component';

describe('SvgPendingApprovalIconComponent', () => {
  let component: SvgPendingApprovalIconComponent;
  let fixture: ComponentFixture<SvgPendingApprovalIconComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SvgPendingApprovalIconComponent]
    });
    fixture = TestBed.createComponent(SvgPendingApprovalIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
