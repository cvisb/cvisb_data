import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterSampleTypeComponent } from './filter-sample-type.component';

describe('FilterSampleTypeComponent', () => {
  let component: FilterSampleTypeComponent;
  let fixture: ComponentFixture<FilterSampleTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterSampleTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterSampleTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
