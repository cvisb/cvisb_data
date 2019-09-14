import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HlaSummaryComponent } from './hla-summary.component';

describe('HlaSummaryComponent', () => {
  let component: HlaSummaryComponent;
  let fixture: ComponentFixture<HlaSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HlaSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HlaSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
