import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FilterSampleYearComponent } from './filter-sample-year.component';

describe('FilterSampleYearComponent', () => {
  let component: FilterSampleYearComponent;
  let fixture: ComponentFixture<FilterSampleYearComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterSampleYearComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterSampleYearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
