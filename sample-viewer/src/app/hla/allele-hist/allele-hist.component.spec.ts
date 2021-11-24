import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AlleleHistComponent } from './allele-hist.component';

describe('AlleleHistComponent', () => {
  let component: AlleleHistComponent;
  let fixture: ComponentFixture<AlleleHistComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AlleleHistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlleleHistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
