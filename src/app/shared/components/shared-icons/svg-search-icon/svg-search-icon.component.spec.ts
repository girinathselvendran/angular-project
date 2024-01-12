import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgSearchIconComponent } from './svg-search-icon.component';

describe('SvgSearchIconComponent', () => {
  let component: SvgSearchIconComponent;
  let fixture: ComponentFixture<SvgSearchIconComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SvgSearchIconComponent]
    });
    fixture = TestBed.createComponent(SvgSearchIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
