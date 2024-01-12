import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailPrComponent } from './email-pr.component';

describe('EmailPrComponent', () => {
  let component: EmailPrComponent;
  let fixture: ComponentFixture<EmailPrComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmailPrComponent]
    });
    fixture = TestBed.createComponent(EmailPrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
