import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimengMessageDialogComponent } from './primeng-message-dialog.component';

describe('PrimengMessageDialogComponent', () => {
  let component: PrimengMessageDialogComponent;
  let fixture: ComponentFixture<PrimengMessageDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrimengMessageDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrimengMessageDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
