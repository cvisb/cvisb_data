import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompareCohortsComponent } from './compare-cohorts.component';

describe('CompareCohortsComponent', () => {
  let component: CompareCohortsComponent;
  let fixture: ComponentFixture<CompareCohortsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompareCohortsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompareCohortsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
