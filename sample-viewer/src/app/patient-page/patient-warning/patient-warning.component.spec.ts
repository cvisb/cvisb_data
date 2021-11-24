import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PatientWarningComponent } from './patient-warning.component';

describe('PatientWarningComponent', () => {
  let component: PatientWarningComponent;
  let fixture: ComponentFixture<PatientWarningComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientWarningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientWarningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
