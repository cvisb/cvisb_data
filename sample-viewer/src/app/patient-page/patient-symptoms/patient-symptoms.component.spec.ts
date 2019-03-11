import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientSymptomsComponent } from './patient-symptoms.component';

describe('PatientSymptomsComponent', () => {
  let component: PatientSymptomsComponent;
  let fixture: ComponentFixture<PatientSymptomsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientSymptomsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientSymptomsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
