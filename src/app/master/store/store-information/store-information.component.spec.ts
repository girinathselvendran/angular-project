import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreInformationComponent } from './store-information.component';

describe('StoreInformationComponent', () => {
  let component: StoreInformationComponent;
  let fixture: ComponentFixture<StoreInformationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StoreInformationComponent]
    });
    fixture = TestBed.createComponent(StoreInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
