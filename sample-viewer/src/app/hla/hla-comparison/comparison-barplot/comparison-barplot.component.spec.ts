import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ComparisonBarplotComponent } from './comparison-barplot.component';

describe('ComparisonBarplotComponent', () => {
  let component: ComparisonBarplotComponent;
  let fixture: ComponentFixture<ComparisonBarplotComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ComparisonBarplotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComparisonBarplotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
