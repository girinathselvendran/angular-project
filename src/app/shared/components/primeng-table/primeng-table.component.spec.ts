import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimengTableComponent } from './primeng-table.component';

describe('PrimengTableComponent', () => {
  let component: PrimengTableComponent;
  let fixture: ComponentFixture<PrimengTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrimengTableComponent]
    });
    fixture = TestBed.createComponent(PrimengTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
