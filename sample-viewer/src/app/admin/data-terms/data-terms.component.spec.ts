import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataTermsComponent } from './data-terms.component';

describe('DataTermsComponent', () => {
  let component: DataTermsComponent;
  let fixture: ComponentFixture<DataTermsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataTermsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataTermsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
