import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSampleTypesComponent } from './add-sample-types.component';

describe('AddSampleTypesComponent', () => {
  let component: AddSampleTypesComponent;
  let fixture: ComponentFixture<AddSampleTypesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSampleTypesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSampleTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
