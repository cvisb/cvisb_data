import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterSpeciesComponent } from './filter-species.component';

describe('FilterSpeciesComponent', () => {
  let component: FilterSpeciesComponent;
  let fixture: ComponentFixture<FilterSpeciesComponent>;

  beforeEach(async(() => {
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
