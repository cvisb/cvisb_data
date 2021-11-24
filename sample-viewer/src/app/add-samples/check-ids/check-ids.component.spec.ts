import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CheckIdsComponent } from './check-ids.component';

describe('CheckIdsComponent', () => {
  let component: CheckIdsComponent;
  let fixture: ComponentFixture<CheckIdsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckIdsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckIdsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
