import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartSpecificationsComponent } from './part-specifications.component';

describe('PartSpecificationsComponent', () => {
  let component: PartSpecificationsComponent;
  let fixture: ComponentFixture<PartSpecificationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PartSpecificationsComponent]
    });
    fixture = TestBed.createComponent(PartSpecificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
