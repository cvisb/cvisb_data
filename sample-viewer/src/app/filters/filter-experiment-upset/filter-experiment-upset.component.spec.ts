import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterExperimentUpsetComponent } from './filter-experiment-upset.component';

describe('FilterExperimentUpsetComponent', () => {
  let component: FilterExperimentUpsetComponent;
  let fixture: ComponentFixture<FilterExperimentUpsetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterExperimentUpsetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterExperimentUpsetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
