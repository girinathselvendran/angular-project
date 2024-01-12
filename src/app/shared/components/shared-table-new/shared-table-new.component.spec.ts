import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedTableNewComponent } from './shared-table-new.component';

describe('SharedTableNewComponent', () => {
  let component: SharedTableNewComponent;
  let fixture: ComponentFixture<SharedTableNewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SharedTableNewComponent]
    });
    fixture = TestBed.createComponent(SharedTableNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
