import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgCalenderIconComponent } from './svg-calender-icon.component';

describe('SvgCalenderIconComponent', () => {
  let component: SvgCalenderIconComponent;
  let fixture: ComponentFixture<SvgCalenderIconComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SvgCalenderIconComponent]
    });
    fixture = TestBed.createComponent(SvgCalenderIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
