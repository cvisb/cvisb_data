import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FrontendSampleValidationComponent } from './frontend-sample-validation.component';

describe('FrontendSampleValidationComponent', () => {
  let component: FrontendSampleValidationComponent;
  let fixture: ComponentFixture<FrontendSampleValidationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FrontendSampleValidationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrontendSampleValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
