import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SpinnerPopupComponent } from './spinner-popup.component';

describe('SpinnerPopupComponent', () => {
  let component: SpinnerPopupComponent;
  let fixture: ComponentFixture<SpinnerPopupComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SpinnerPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpinnerPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
