import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserManualComponent } from './user-manual.component';

describe('UserManualComponent', () => {
  let component: UserManualComponent;
  let fixture: ComponentFixture<UserManualComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserManualComponent]
    });
    fixture = TestBed.createComponent(UserManualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});