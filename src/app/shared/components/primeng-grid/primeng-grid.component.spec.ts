import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimengGridComponent } from './primeng-grid.component';

describe('PrimengGridComponent', () => {
  let component: PrimengGridComponent;
  let fixture: ComponentFixture<PrimengGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrimengGridComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrimengGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
