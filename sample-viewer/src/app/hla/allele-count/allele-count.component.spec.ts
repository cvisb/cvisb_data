import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AlleleCountComponent } from './allele-count.component';

describe('AlleleCountComponent', () => {
  let component: AlleleCountComponent;
  let fixture: ComponentFixture<AlleleCountComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AlleleCountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlleleCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
