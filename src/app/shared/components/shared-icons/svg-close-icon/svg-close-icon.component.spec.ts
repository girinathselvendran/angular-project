import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgCloseIconComponent } from './svg-close-icon.component';

describe('SvgCloseIconComponent', () => {
  let component: SvgCloseIconComponent;
  let fixture: ComponentFixture<SvgCloseIconComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SvgCloseIconComponent]
    });
    fixture = TestBed.createComponent(SvgCloseIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
