import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgRejectedIconComponent } from './svg-rejected-icon.component';

describe('SvgRejectedIconComponent', () => {
  let component: SvgRejectedIconComponent;
  let fixture: ComponentFixture<SvgRejectedIconComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SvgRejectedIconComponent]
    });
    fixture = TestBed.createComponent(SvgRejectedIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
