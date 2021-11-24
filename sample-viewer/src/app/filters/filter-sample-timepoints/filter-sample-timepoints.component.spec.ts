import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FilterSampleTimepointsComponent } from './filter-sample-timepoints.component';

describe('FilterSampleTimepointsComponent', () => {
  let component: FilterSampleTimepointsComponent;
  let fixture: ComponentFixture<FilterSampleTimepointsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterSampleTimepointsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterSampleTimepointsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
