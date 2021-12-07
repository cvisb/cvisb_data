import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FilterElisasComponent } from './filter-elisas.component';

describe('FilterElisasComponent', () => {
  let component: FilterElisasComponent;
  let fixture: ComponentFixture<FilterElisasComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterElisasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterElisasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
