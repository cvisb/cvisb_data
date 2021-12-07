import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PatientSerologyComponent } from './patient-serology.component';

describe('PatientSerologyComponent', () => {
  let component: PatientSerologyComponent;
  let fixture: ComponentFixture<PatientSerologyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientSerologyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientSerologyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
