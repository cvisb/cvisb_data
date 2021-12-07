import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CorrectionsComponent } from './corrections.component';

describe('CorrectionsComponent', () => {
  let component: CorrectionsComponent;
  let fixture: ComponentFixture<CorrectionsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CorrectionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CorrectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
