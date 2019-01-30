import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterFileTypeComponent } from './filter-file-type.component';

describe('FilterFileTypeComponent', () => {
  let component: FilterFileTypeComponent;
  let fixture: ComponentFixture<FilterFileTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterFileTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterFileTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
