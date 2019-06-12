import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterSampleGroupComponent } from './filter-sample-group.component';

describe('FilterSampleGroupComponent', () => {
  let component: FilterSampleGroupComponent;
  let fixture: ComponentFixture<FilterSampleGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterSampleGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterSampleGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
