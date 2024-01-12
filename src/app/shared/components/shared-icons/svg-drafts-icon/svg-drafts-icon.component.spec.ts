import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgDraftsIconComponent } from './svg-drafts-icon.component';

describe('SvgDraftsIconComponent', () => {
  let component: SvgDraftsIconComponent;
  let fixture: ComponentFixture<SvgDraftsIconComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SvgDraftsIconComponent]
    });
    fixture = TestBed.createComponent(SvgDraftsIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
