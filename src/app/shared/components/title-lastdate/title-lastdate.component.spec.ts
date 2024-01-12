import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TitleLastdateComponent } from './title-lastdate.component';

describe('TitleLastdateComponent', () => {
  let component: TitleLastdateComponent;
  let fixture: ComponentFixture<TitleLastdateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TitleLastdateComponent]
    });
    fixture = TestBed.createComponent(TitleLastdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
