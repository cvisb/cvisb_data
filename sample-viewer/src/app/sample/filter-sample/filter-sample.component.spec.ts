import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterSampleComponent } from './filter-sample.component';

describe('FilterSampleComponent', () => {
  let component: FilterSampleComponent;
  let fixture: ComponentFixture<FilterSampleComponent>;

  beforeEach(async(() => {
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
