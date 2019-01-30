import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterPatientsComponent } from './filter-patients.component';

describe('FilterPatientsComponent', () => {
  let component: FilterPatientsComponent;
  let fixture: ComponentFixture<FilterPatientsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterPatientsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterPatientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
