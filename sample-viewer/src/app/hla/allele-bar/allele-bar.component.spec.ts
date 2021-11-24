import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AlleleBarComponent } from './allele-bar.component';

describe('AlleleBarComponent', () => {
  let component: AlleleBarComponent;
  let fixture: ComponentFixture<AlleleBarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AlleleBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlleleBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
