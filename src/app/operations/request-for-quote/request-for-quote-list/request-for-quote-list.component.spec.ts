import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestForQuoteListComponent } from './request-for-quote-list.component';

describe('RequestForQuoteListComponent', () => {
  let component: RequestForQuoteListComponent;
  let fixture: ComponentFixture<RequestForQuoteListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RequestForQuoteListComponent]
    });
    fixture = TestBed.createComponent(RequestForQuoteListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
