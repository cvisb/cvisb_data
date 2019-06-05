import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterSampleTimepointsComponent } from './filter-sample-timepoints.component';

describe('FilterSampleTimepointsComponent', () => {
  let component: FilterSampleTimepointsComponent;
  let fixture: ComponentFixture<FilterSampleTimepointsComponent>;

  beforeEach(async(() => {
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
