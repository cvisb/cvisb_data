import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PatientElisasComponent } from './patient-elisas.component';

describe('PatientElisasComponent', () => {
  let component: PatientElisasComponent;
  let fixture: ComponentFixture<PatientElisasComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientElisasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientElisasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
