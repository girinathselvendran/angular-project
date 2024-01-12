import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartRatesComponent } from './part-rates.component';

describe('PartRatesComponent', () => {
  let component: PartRatesComponent;
  let fixture: ComponentFixture<PartRatesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PartRatesComponent]
    });
    fixture = TestBed.createComponent(PartRatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
