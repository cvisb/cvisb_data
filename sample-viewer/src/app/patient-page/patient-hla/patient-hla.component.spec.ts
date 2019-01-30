import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientHlaComponent } from './patient-hla.component';

describe('PatientHlaComponent', () => {
  let component: PatientHlaComponent;
  let fixture: ComponentFixture<PatientHlaComponent>;

  beforeEach(async(() => {
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
