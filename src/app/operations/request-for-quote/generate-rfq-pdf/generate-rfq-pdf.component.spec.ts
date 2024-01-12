import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateRfqPdfComponent } from './generate-rfq-pdf.component';

describe('GenerateRfqPdfComponent', () => {
  let component: GenerateRfqPdfComponent;
  let fixture: ComponentFixture<GenerateRfqPdfComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GenerateRfqPdfComponent]
    });
    fixture = TestBed.createComponent(GenerateRfqPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
