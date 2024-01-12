import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgAprovedIconComponent } from './svg-aproved-icon.component';

describe('SvgAprovedIconComponent', () => {
  let component: SvgAprovedIconComponent;
  let fixture: ComponentFixture<SvgAprovedIconComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SvgAprovedIconComponent]
    });
    fixture = TestBed.createComponent(SvgAprovedIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
