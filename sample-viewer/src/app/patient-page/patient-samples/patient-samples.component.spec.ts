import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PatientSamplesComponent } from './patient-samples.component';

describe('PatientSamplesComponent', () => {
  let component: PatientSamplesComponent;
  let fixture: ComponentFixture<PatientSamplesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientSamplesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientSamplesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
