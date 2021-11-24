import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PatientDatesComponent } from './patient-dates.component';

describe('PatientDatesComponent', () => {
  let component: PatientDatesComponent;
  let fixture: ComponentFixture<PatientDatesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientDatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientDatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
