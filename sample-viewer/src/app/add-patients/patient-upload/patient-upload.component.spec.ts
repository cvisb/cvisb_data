import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PatientUploadComponent } from './patient-upload.component';

describe('PatientUploadComponent', () => {
  let component: PatientUploadComponent;
  let fixture: ComponentFixture<PatientUploadComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
