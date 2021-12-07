import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DatasetSourceComponent } from './dataset-source.component';

describe('DatasetSourceComponent', () => {
  let component: DatasetSourceComponent;
  let fixture: ComponentFixture<DatasetSourceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DatasetSourceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasetSourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
