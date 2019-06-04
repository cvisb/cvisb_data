import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrontendSampleValidationComponent } from './frontend-sample-validation.component';

describe('FrontendSampleValidationComponent', () => {
  let component: FrontendSampleValidationComponent;
  let fixture: ComponentFixture<FrontendSampleValidationComponent>;

  beforeEach(async(() => {
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
