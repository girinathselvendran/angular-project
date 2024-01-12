import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnlockImsComponent } from './unlock-ims.component';

describe('UnlockImsComponent', () => {
  let component: UnlockImsComponent;
  let fixture: ComponentFixture<UnlockImsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UnlockImsComponent]
    });
    fixture = TestBed.createComponent(UnlockImsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
