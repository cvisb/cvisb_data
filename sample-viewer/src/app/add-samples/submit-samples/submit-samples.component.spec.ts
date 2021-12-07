import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SubmitSamplesComponent } from './submit-samples.component';

describe('SubmitSamplesComponent', () => {
  let component: SubmitSamplesComponent;
  let fixture: ComponentFixture<SubmitSamplesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmitSamplesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitSamplesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
