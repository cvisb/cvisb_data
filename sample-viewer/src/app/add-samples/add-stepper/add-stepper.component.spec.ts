import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddStepperComponent } from './add-stepper.component';

describe('AddStepperComponent', () => {
  let component: AddStepperComponent;
  let fixture: ComponentFixture<AddStepperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddStepperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
