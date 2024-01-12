import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneratePoPdfComponent } from './generate-po-pdf.component';

describe('GeneratePoPdfComponent', () => {
  let component: GeneratePoPdfComponent;
  let fixture: ComponentFixture<GeneratePoPdfComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GeneratePoPdfComponent]
    });
    fixture = TestBed.createComponent(GeneratePoPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
