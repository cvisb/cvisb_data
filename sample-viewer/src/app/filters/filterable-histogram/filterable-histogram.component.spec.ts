import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FilterableHistogramComponent } from './filterable-histogram.component';

describe('FilterableHistogramComponent', () => {
  let component: FilterableHistogramComponent;
  let fixture: ComponentFixture<FilterableHistogramComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterableHistogramComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterableHistogramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
