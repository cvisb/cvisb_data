import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitSamplesComponent } from './submit-samples.component';

describe('SubmitSamplesComponent', () => {
  let component: SubmitSamplesComponent;
  let fixture: ComponentFixture<SubmitSamplesComponent>;

  beforeEach(async(() => {
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
