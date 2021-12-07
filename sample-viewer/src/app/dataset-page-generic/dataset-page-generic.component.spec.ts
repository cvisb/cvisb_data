import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DatasetPageGenericComponent } from './dataset-page-generic.component';

describe('DatasetPageGenericComponent', () => {
  let component: DatasetPageGenericComponent;
  let fixture: ComponentFixture<DatasetPageGenericComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DatasetPageGenericComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasetPageGenericComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
