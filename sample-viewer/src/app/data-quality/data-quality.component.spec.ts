import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataQualityComponent } from './data-quality.component';

describe('DataQualityComponent', () => {
  let component: DataQualityComponent;
  let fixture: ComponentFixture<DataQualityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataQualityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataQualityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
