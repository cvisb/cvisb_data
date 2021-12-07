import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddPatientsComponent } from './add-patients.component';

describe('AddPatientsComponent', () => {
  let component: AddPatientsComponent;
  let fixture: ComponentFixture<AddPatientsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPatientsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPatientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
