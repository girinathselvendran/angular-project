import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgQuoteReceivedIconComponent } from './svg-quote-received-icon.component';

describe('SvgQuoteReceivedIconComponent', () => {
  let component: SvgQuoteReceivedIconComponent;
  let fixture: ComponentFixture<SvgQuoteReceivedIconComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SvgQuoteReceivedIconComponent]
    });
    fixture = TestBed.createComponent(SvgQuoteReceivedIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
