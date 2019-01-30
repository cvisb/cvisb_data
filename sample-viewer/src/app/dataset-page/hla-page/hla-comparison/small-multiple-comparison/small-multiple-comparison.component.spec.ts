import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmallMultipleComparisonComponent } from './small-multiple-comparison.component';

describe('SmallMultipleComparisonComponent', () => {
  let component: SmallMultipleComparisonComponent;
  let fixture: ComponentFixture<SmallMultipleComparisonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmallMultipleComparisonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmallMultipleComparisonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
