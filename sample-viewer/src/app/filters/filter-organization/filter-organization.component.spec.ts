import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterOrganizationComponent } from './filter-organization.component';

describe('FilterOrganizationComponent', () => {
  let component: FilterOrganizationComponent;
  let fixture: ComponentFixture<FilterOrganizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterOrganizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterOrganizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
