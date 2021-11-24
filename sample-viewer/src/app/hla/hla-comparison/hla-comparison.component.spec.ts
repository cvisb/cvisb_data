import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HlaComparisonComponent } from './hla-comparison.component';

describe('HlaComparisonComponent', () => {
  let component: HlaComparisonComponent;
  let fixture: ComponentFixture<HlaComparisonComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HlaComparisonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HlaComparisonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
