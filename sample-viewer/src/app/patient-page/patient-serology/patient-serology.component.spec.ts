import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientSerologyComponent } from './patient-serology.component';

describe('PatientSerologyComponent', () => {
  let component: PatientSerologyComponent;
  let fixture: ComponentFixture<PatientSerologyComponent>;

  beforeEach(async(() => {
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
