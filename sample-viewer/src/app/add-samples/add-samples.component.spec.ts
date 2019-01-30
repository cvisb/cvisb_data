import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSamplesComponent } from './add-samples.component';

describe('AddSamplesComponent', () => {
  let component: AddSamplesComponent;
  let fixture: ComponentFixture<AddSamplesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSamplesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSamplesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
