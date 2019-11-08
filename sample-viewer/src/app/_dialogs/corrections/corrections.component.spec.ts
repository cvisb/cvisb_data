import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CorrectionsComponent } from './corrections.component';

describe('CorrectionsComponent', () => {
  let component: CorrectionsComponent;
  let fixture: ComponentFixture<CorrectionsComponent>;

  beforeEach(async(() => {
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
