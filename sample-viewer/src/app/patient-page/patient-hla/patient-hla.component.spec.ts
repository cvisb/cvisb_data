import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PatientHlaComponent } from './patient-hla.component';

describe('PatientHlaComponent', () => {
  let component: PatientHlaComponent;
  let fixture: ComponentFixture<PatientHlaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientHlaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientHlaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
