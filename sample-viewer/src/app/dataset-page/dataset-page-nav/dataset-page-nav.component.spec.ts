import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DatasetPageNavComponent } from './dataset-page-nav.component';

describe('DatasetPageNavComponent', () => {
  let component: DatasetPageNavComponent;
  let fixture: ComponentFixture<DatasetPageNavComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DatasetPageNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasetPageNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
