import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FilterSampleComponent } from './filter-sample.component';

describe('FilterSampleComponent', () => {
  let component: FilterSampleComponent;
  let fixture: ComponentFixture<FilterSampleComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterSampleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterSampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
