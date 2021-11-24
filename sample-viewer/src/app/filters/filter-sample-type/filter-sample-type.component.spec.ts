import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FilterSampleTypeComponent } from './filter-sample-type.component';

describe('FilterSampleTypeComponent', () => {
  let component: FilterSampleTypeComponent;
  let fixture: ComponentFixture<FilterSampleTypeComponent>;

  beforeEach(waitForAsync(() => {
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
