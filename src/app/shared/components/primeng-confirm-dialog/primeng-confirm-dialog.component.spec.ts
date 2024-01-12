import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimengConfirmDialogComponent } from './primeng-confirm-dialog.component';

describe('PrimengConfirmDialogComponent', () => {
  let component: PrimengConfirmDialogComponent;
  let fixture: ComponentFixture<PrimengConfirmDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrimengConfirmDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrimengConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
