import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatasetPageNavComponent } from './dataset-page-nav.component';

describe('DatasetPageNavComponent', () => {
  let component: DatasetPageNavComponent;
  let fixture: ComponentFixture<DatasetPageNavComponent>;

  beforeEach(async(() => {
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
