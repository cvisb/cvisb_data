import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientRelatedComponent } from './patient-related.component';

describe('PatientRelatedComponent', () => {
  let component: PatientRelatedComponent;
  let fixture: ComponentFixture<PatientRelatedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientRelatedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientRelatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
