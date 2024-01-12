import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgResetIconComponent } from './svg-reset-icon.component';

describe('SvgResetIconComponent', () => {
  let component: SvgResetIconComponent;
  let fixture: ComponentFixture<SvgResetIconComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SvgResetIconComponent]
    });
    fixture = TestBed.createComponent(SvgResetIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
