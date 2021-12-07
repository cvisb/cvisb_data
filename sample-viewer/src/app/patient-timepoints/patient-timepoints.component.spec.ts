import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PatientTimepointsComponent } from './patient-timepoints.component';

describe('PatientTimepointsComponent', () => {
  let component: PatientTimepointsComponent;
  let fixture: ComponentFixture<PatientTimepointsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientTimepointsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientTimepointsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
