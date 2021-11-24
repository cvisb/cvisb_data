import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MissingDataComponent } from './missing-data.component';

describe('MissingDataComponent', () => {
  let component: MissingDataComponent;
  let fixture: ComponentFixture<MissingDataComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MissingDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MissingDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
