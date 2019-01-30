import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterExperimentComponent } from './filter-experiment.component';

describe('FilterExperimentComponent', () => {
  let component: FilterExperimentComponent;
  let fixture: ComponentFixture<FilterExperimentComponent>;

  beforeEach(async(() => {
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
