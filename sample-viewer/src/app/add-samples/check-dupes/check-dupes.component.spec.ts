import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CheckDupesComponent } from './check-dupes.component';

describe('CheckDupesComponent', () => {
  let component: CheckDupesComponent;
  let fixture: ComponentFixture<CheckDupesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckDupesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckDupesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
