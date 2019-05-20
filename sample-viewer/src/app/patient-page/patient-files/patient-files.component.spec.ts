import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientFilesComponent } from './patient-files.component';

describe('PatientFilesComponent', () => {
  let component: PatientFilesComponent;
  let fixture: ComponentFixture<PatientFilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientFilesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
