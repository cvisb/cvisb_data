import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PatientDemographicsComponent } from './patient-demographics.component';

describe('PatientDemographicsComponent', () => {
  let component: PatientDemographicsComponent;
  let fixture: ComponentFixture<PatientDemographicsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientDemographicsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientDemographicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
