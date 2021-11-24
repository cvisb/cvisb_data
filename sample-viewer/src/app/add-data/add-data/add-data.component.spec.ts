import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddDataComponent } from './add-data.component';

describe('AddDataComponent', () => {
  let component: AddDataComponent;
  let fixture: ComponentFixture<AddDataComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
