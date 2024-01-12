import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgOverallIconComponent } from './svg-overall-icon.component';

describe('SvgOverallIconComponent', () => {
  let component: SvgOverallIconComponent;
  let fixture: ComponentFixture<SvgOverallIconComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SvgOverallIconComponent]
    });
    fixture = TestBed.createComponent(SvgOverallIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
