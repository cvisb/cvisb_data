import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TermsPopupComponent } from './terms-popup.component';

describe('TermsPopupComponent', () => {
  let component: TermsPopupComponent;
  let fixture: ComponentFixture<TermsPopupComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TermsPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TermsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
