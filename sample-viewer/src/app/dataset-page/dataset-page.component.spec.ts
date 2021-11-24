import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DatasetPageComponent } from './dataset-page.component';

describe('DatasetPageComponent', () => {
  let component: DatasetPageComponent;
  let fixture: ComponentFixture<DatasetPageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DatasetPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasetPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
