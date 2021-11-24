import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FilterSpeciesComponent } from './filter-species.component';

describe('FilterSpeciesComponent', () => {
  let component: FilterSpeciesComponent;
  let fixture: ComponentFixture<FilterSpeciesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterSpeciesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterSpeciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
