import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FilterExperimentComponent } from './filter-experiment.component';

describe('FilterExperimentComponent', () => {
  let component: FilterExperimentComponent;
  let fixture: ComponentFixture<FilterExperimentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterExperimentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterExperimentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
