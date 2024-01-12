import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgRequestedIconComponent } from './svg-requested-icon.component';

describe('SvgRequestedIconComponent', () => {
  let component: SvgRequestedIconComponent;
  let fixture: ComponentFixture<SvgRequestedIconComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SvgRequestedIconComponent]
    });
    fixture = TestBed.createComponent(SvgRequestedIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
