import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FormatCitationComponent } from './format-citation.component';

describe('FormatCitationComponent', () => {
  let component: FormatCitationComponent;
  let fixture: ComponentFixture<FormatCitationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FormatCitationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormatCitationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
