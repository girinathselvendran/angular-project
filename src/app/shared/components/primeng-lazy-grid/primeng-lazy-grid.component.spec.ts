import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimengLazyGridComponent } from './primeng-lazy-grid.component';

describe('PrimengLazyGridComponent', () => {
  let component: PrimengLazyGridComponent;
  let fixture: ComponentFixture<PrimengLazyGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrimengLazyGridComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrimengLazyGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
