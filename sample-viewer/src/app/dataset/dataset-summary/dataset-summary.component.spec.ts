import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DatasetSummaryComponent } from './dataset-summary.component';

describe('DatasetSummaryComponent', () => {
  let component: DatasetSummaryComponent;
  let fixture: ComponentFixture<DatasetSummaryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DatasetSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasetSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
