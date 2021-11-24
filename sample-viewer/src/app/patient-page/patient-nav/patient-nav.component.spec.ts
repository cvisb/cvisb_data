import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PatientNavComponent } from './patient-nav.component';

describe('PatientNavComponent', () => {
  let component: PatientNavComponent;
  let fixture: ComponentFixture<PatientNavComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
