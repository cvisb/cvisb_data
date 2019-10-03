import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatasetSourceComponent } from './dataset-source.component';

describe('DatasetSourceComponent', () => {
  let component: DatasetSourceComponent;
  let fixture: ComponentFixture<DatasetSourceComponent>;

  beforeEach(async(() => {
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
