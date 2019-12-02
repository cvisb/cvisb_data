import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TermsPopupComponent } from './terms-popup.component';

describe('TermsPopupComponent', () => {
  let component: TermsPopupComponent;
  let fixture: ComponentFixture<TermsPopupComponent>;

  beforeEach(async(() => {
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
