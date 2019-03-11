import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientElisasComponent } from './patient-elisas.component';

describe('PatientElisasComponent', () => {
  let component: PatientElisasComponent;
  let fixture: ComponentFixture<PatientElisasComponent>;

  beforeEach(async(() => {
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
