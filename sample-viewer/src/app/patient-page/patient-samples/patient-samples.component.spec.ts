import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientSamplesComponent } from './patient-samples.component';

describe('PatientSamplesComponent', () => {
  let component: PatientSamplesComponent;
  let fixture: ComponentFixture<PatientSamplesComponent>;

  beforeEach(async(() => {
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
