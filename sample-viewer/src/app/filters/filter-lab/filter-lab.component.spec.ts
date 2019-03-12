import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterLabComponent } from './filter-lab.component';

describe('FilterLabComponent', () => {
  let component: FilterLabComponent;
  let fixture: ComponentFixture<FilterLabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterLabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterLabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
