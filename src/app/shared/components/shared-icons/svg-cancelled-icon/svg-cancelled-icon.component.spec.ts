import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgCancelledIconComponent } from './svg-cancelled-icon.component';

describe('SvgCancelledIconComponent', () => {
  let component: SvgCancelledIconComponent;
  let fixture: ComponentFixture<SvgCancelledIconComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SvgCancelledIconComponent]
    });
    fixture = TestBed.createComponent(SvgCancelledIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
