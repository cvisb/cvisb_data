import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatasetCitationComponent } from './dataset-citation.component';

describe('DatasetCitationComponent', () => {
  let component: DatasetCitationComponent;
  let fixture: ComponentFixture<DatasetCitationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatasetCitationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasetCitationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
