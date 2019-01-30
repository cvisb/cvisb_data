import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterPatientTypeComponent } from './filter-patient-type.component';

describe('FilterPatientTypeComponent', () => {
  let component: FilterPatientTypeComponent;
  let fixture: ComponentFixture<FilterPatientTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterPatientTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterPatientTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
