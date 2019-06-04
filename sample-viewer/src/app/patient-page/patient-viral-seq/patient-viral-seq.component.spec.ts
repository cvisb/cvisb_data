import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientViralSeqComponent } from './patient-viral-seq.component';

describe('PatientViralSeqComponent', () => {
  let component: PatientViralSeqComponent;
  let fixture: ComponentFixture<PatientViralSeqComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientViralSeqComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientViralSeqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
