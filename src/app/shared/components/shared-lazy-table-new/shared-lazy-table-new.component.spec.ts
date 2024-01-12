import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedLazyTableNewComponent } from './shared-lazy-table-new.component';

describe('SharedLazyTableNewComponent', () => {
  let component: SharedLazyTableNewComponent;
  let fixture: ComponentFixture<SharedLazyTableNewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SharedLazyTableNewComponent]
    });
    fixture = TestBed.createComponent(SharedLazyTableNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
