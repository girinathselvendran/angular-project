import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimengToastComponent } from './primeng-toast.component';

describe('PrimengToastComponent', () => {
  let component: PrimengToastComponent;
  let fixture: ComponentFixture<PrimengToastComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrimengToastComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrimengToastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
