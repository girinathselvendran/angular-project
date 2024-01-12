import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPartDetailsComponent } from './add-part-details.component';

describe('AddPartDetailsComponent', () => {
  let component: AddPartDetailsComponent;
  let fixture: ComponentFixture<AddPartDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddPartDetailsComponent]
    });
    fixture = TestBed.createComponent(AddPartDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
