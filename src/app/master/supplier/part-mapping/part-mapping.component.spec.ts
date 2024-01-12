import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartMappingComponent } from './part-mapping.component';

describe('PartMappingComponent', () => {
  let component: PartMappingComponent;
  let fixture: ComponentFixture<PartMappingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PartMappingComponent]
    });
    fixture = TestBed.createComponent(PartMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
