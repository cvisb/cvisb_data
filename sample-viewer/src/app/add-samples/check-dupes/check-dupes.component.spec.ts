import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckDupesComponent } from './check-dupes.component';

describe('CheckDupesComponent', () => {
  let component: CheckDupesComponent;
  let fixture: ComponentFixture<CheckDupesComponent>;

  beforeEach(async(() => {
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
