import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FilterFilesComponent } from './filter-files.component';

describe('FilterFilesComponent', () => {
  let component: FilterFilesComponent;
  let fixture: ComponentFixture<FilterFilesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterFilesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
