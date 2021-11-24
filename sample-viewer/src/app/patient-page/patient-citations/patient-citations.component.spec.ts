import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PatientCitationsComponent } from './patient-citations.component';

describe('PatientCitationsComponent', () => {
  let component: PatientCitationsComponent;
  let fixture: ComponentFixture<PatientCitationsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientCitationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientCitationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
