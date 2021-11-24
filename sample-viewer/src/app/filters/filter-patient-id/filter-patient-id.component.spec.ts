import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FilterPatientIdComponent } from './filter-patient-id.component';

describe('FilterPatientIdComponent', () => {
  let component: FilterPatientIdComponent;
  let fixture: ComponentFixture<FilterPatientIdComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterPatientIdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterPatientIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
